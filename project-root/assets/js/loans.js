// ===== LOANS PAGE FUNCTIONALITY =====

let currentEditingLoan = null;
let filteredLoans = [];

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('loans.html')) {
        initializeLoans();
    }
});

function initializeLoans() {
    // Wait for the app to be initialized
    const checkApp = setInterval(() => {
        if (window.saccoApp && window.saccoApp.initialized) {
            clearInterval(checkApp);
            loadLoansData();
            setupLoansEventListeners();
            populateMemberSelects();
        }
    }, 100);
}

function loadLoansData() {
    try {
        const loans = window.saccoApp.getLoans();
        displayLoans(loans);
        updateLoansSummary();
    } catch (error) {
        console.error('Error loading loans data:', error);
        window.saccoApp.showError('Failed to load loans data');
    }
}

function displayLoans(loans) {
    const tableBody = document.getElementById('loansTableBody');
    tableBody.innerHTML = '';

    if (loans.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="10" class="text-center">No loans found</td></tr>';
        return;
    }

    filteredLoans = loans;

    loans.forEach(loan => {
        // Determine loan status
        let displayStatus = loan.status;
        let statusClass = 'status-active';
        
        if (loan.status === 'Completed') {
            statusClass = 'status-completed';
        } else if (loan.status === 'Active' && new Date(loan.dueDate) < new Date()) {
            displayStatus = 'Overdue';
            statusClass = 'status-overdue';
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${loan.id}</td>
            <td>${loan.memberName}</td>
            <td>${window.saccoApp.formatCurrency(loan.amount)}</td>
            <td>${loan.interestRate}%</td>
            <td>${window.saccoApp.formatDate(loan.issueDate)}</td>
            <td>${loan.repaymentPeriod} months</td>
            <td>${window.saccoApp.formatCurrency(loan.totalRepayable)}</td>
            <td>${window.saccoApp.formatCurrency(loan.pendingBalance)}</td>
            <td><span class="status-badge ${statusClass}">${displayStatus}</span></td>
            <td class="actions">
                <button class="btn btn-info btn-sm" onclick="viewLoan('${loan.id}')" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-warning btn-sm" onclick="editLoan('${loan.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-success btn-sm" onclick="recordPaymentForLoan('${loan.id}')" title="Payment">
                    <i class="fas fa-credit-card"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteLoan('${loan.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updateLoansSummary() {
    const loans = window.saccoApp.getLoans();
    const activeLoans = loans.filter(loan => loan.status === 'Active');
    const totalDisbursed = loans.reduce((sum, loan) => sum + loan.amount, 0);
    const totalRepaid = loans.reduce((sum, loan) => sum + (loan.totalRepayable - loan.pendingBalance), 0);
    const overdueLoans = activeLoans.filter(loan => new Date(loan.dueDate) < new Date());
    const totalOverdue = overdueLoans.reduce((sum, loan) => sum + loan.pendingBalance, 0);

    document.getElementById('totalActiveLoans').textContent = activeLoans.length;
    document.getElementById('totalDisbursedAmount').textContent = window.saccoApp.formatCurrency(totalDisbursed);
    document.getElementById('totalRepaidAmount').textContent = window.saccoApp.formatCurrency(totalRepaid);
    document.getElementById('totalOverdueAmount').textContent = window.saccoApp.formatCurrency(totalOverdue);
}

function populateMemberSelects() {
    const members = window.saccoApp.getMembers().filter(member => member.status === 'Active');
    
    // Populate loan member select
    const loanMemberSelect = document.getElementById('loanMember');
    if (loanMemberSelect) {
        loanMemberSelect.innerHTML = '<option value="">Select Member</option>';
        members.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = `${member.fullName} (${member.id})`;
            loanMemberSelect.appendChild(option);
        });
    }

    // Populate payment loan select with active loans
    const paymentLoanSelect = document.getElementById('paymentLoan');
    if (paymentLoanSelect) {
        paymentLoanSelect.innerHTML = '<option value="">Select Active Loan</option>';
        const activeLoans = window.saccoApp.getLoans().filter(loan => loan.status === 'Active');
        activeLoans.forEach(loan => {
            const option = document.createElement('option');
            option.value = loan.id;
            option.textContent = `${loan.id} - ${loan.memberName} (${window.saccoApp.formatCurrency(loan.pendingBalance)} remaining)`;
            paymentLoanSelect.appendChild(option);
        });
    }

    // Populate member filter
    const memberFilter = document.getElementById('memberFilter');
    if (memberFilter) {
        memberFilter.innerHTML = '<option value="">All Members</option>';
        members.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = member.fullName;
            memberFilter.appendChild(option);
        });
    }
}

function setupLoansEventListeners() {
    // Loan form submission
    const loanForm = document.getElementById('loanForm');
    if (loanForm) {
        loanForm.addEventListener('submit', handleLoanSubmit);
    }

    // Payment form submission
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentSubmit);
    }

    // Set today as default date
    const issueDateInput = document.getElementById('issueDate');
    if (issueDateInput && !issueDateInput.value) {
        issueDateInput.value = new Date().toISOString().split('T')[0];
    }

    const paymentDateInput = document.getElementById('paymentDate');
    if (paymentDateInput && !paymentDateInput.value) {
        paymentDateInput.value = new Date().toISOString().split('T')[0];
    }
}

// ===== LOAN MANAGEMENT =====

function openAddLoanModal() {
    currentEditingLoan = null;
    document.getElementById('loanModalTitle').textContent = 'Add New Loan';
    document.getElementById('loanForm').reset();
    
    // Set defaults
    document.getElementById('interestRate').value = window.saccoApp.settings.defaultInterestRate || 10;
    document.getElementById('issueDate').value = new Date().toISOString().split('T')[0];
    
    document.getElementById('loanModal').style.display = 'block';
}

function editLoan(loanId) {
    const loan = window.saccoApp.getLoanById(loanId);
    if (!loan) {
        window.saccoApp.showError('Loan not found');
        return;
    }

    currentEditingLoan = loan;
    document.getElementById('loanModalTitle').textContent = 'Edit Loan';
    
    // Populate form
    document.getElementById('loanMember').value = loan.memberId;
    document.getElementById('loanAmount').value = loan.amount;
    document.getElementById('interestRate').value = loan.interestRate;
    document.getElementById('issueDate').value = loan.issueDate;
    document.getElementById('repaymentPeriod').value = loan.repaymentPeriod;
    document.getElementById('loanPurpose').value = loan.purpose;
    document.getElementById('loanNotes').value = loan.notes;
    
    // Calculate and display computed values
    calculateRepayable();
    calculateDueDate();
    
    document.getElementById('loanModal').style.display = 'block';
}

function viewLoan(loanId) {
    const loan = window.saccoApp.getLoanById(loanId);
    if (!loan) {
        window.saccoApp.showError('Loan not found');
        return;
    }

    const payments = window.saccoApp.getPaymentsForLoan(loanId);
    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

    let loanInfo = `
        Loan Details for ${loan.id}
        
        Member: ${loan.memberName}
        Amount Disbursed: ${window.saccoApp.formatCurrency(loan.amount)}
        Interest Rate: ${loan.interestRate}%
        Issue Date: ${window.saccoApp.formatDate(loan.issueDate)}
        Due Date: ${window.saccoApp.formatDate(loan.dueDate)}
        Repayment Period: ${loan.repaymentPeriod} months
        Total Repayable: ${window.saccoApp.formatCurrency(loan.totalRepayable)}
        Total Paid: ${window.saccoApp.formatCurrency(totalPaid)}
        Pending Balance: ${window.saccoApp.formatCurrency(loan.pendingBalance)}
        Status: ${loan.status}
        Purpose: ${loan.purpose}
        Notes: ${loan.notes || 'None'}
    `;

    if (payments.length > 0) {
        loanInfo += '\n\nPayment History:\n';
        payments.forEach(payment => {
            loanInfo += `- ${window.saccoApp.formatDate(payment.paymentDate)}: ${window.saccoApp.formatCurrency(payment.amount)} (${payment.method})\n`;
        });
    }

    alert(loanInfo);
}

function deleteLoan(loanId) {
    const loan = window.saccoApp.getLoanById(loanId);
    if (!loan) {
        window.saccoApp.showError('Loan not found');
        return;
    }

    if (confirm(`Are you sure you want to delete loan ${loan.id} for ${loan.memberName}? This will also delete all associated payments.`)) {
        try {
            window.saccoApp.deleteLoan(loanId);
            window.saccoApp.showSuccess('Loan deleted successfully');
            loadLoansData(); // Refresh the table
            populateMemberSelects(); // Update selects
        } catch (error) {
            window.saccoApp.showError(error.message);
        }
    }
}

function closeLoanModal() {
    document.getElementById('loanModal').style.display = 'none';
    currentEditingLoan = null;
    document.getElementById('loanForm').reset();
}

function handleLoanSubmit(e) {
    e.preventDefault();
    
    const formData = {
        memberId: document.getElementById('loanMember').value,
        amount: parseFloat(document.getElementById('loanAmount').value),
        interestRate: parseFloat(document.getElementById('interestRate').value),
        issueDate: document.getElementById('issueDate').value,
        repaymentPeriod: parseInt(document.getElementById('repaymentPeriod').value),
        dueDate: document.getElementById('dueDate').value,
        purpose: document.getElementById('loanPurpose').value,
        notes: document.getElementById('loanNotes').value.trim()
    };

    // Validate required fields
    if (!formData.memberId || !formData.amount || !formData.interestRate || 
        !formData.issueDate || !formData.repaymentPeriod) {
        window.saccoApp.showError('Please fill in all required fields');
        return;
    }

    try {
        if (currentEditingLoan) {
            // Update existing loan
            window.saccoApp.updateLoan(currentEditingLoan.id, formData);
            window.saccoApp.showSuccess('Loan updated successfully');
        } else {
            // Add new loan
            window.saccoApp.addLoan(formData);
            window.saccoApp.showSuccess('Loan added successfully');
        }

        closeLoanModal();
        loadLoansData(); // Refresh the table
        populateMemberSelects(); // Update selects
    } catch (error) {
        console.error('Error saving loan:', error);
        window.saccoApp.showError(error.message);
    }
}

// ===== LOAN CALCULATIONS =====

function calculateRepayable() {
    const amount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    
    if (amount && interestRate >= 0) {
        const totalRepayable = window.saccoApp.calculateTotalRepayable(amount, interestRate);
        document.getElementById('totalRepayable').value = totalRepayable.toFixed(2);
    }
}

function calculateDueDate() {
    const issueDate = document.getElementById('issueDate').value;
    const period = parseInt(document.getElementById('repaymentPeriod').value);
    
    if (issueDate && period) {
        const dueDate = window.saccoApp.calculateDueDate(issueDate, period);
        document.getElementById('dueDate').value = dueDate;
    }
}

// ===== PAYMENT MANAGEMENT =====

function openPaymentModal() {
    document.getElementById('paymentForm').reset();
    document.getElementById('paymentDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('loanDetails').style.display = 'none';
    document.getElementById('paymentModal').style.display = 'block';
}

function recordPaymentForLoan(loanId) {
    document.getElementById('paymentLoan').value = loanId;
    loadLoanDetails();
    openPaymentModal();
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
    document.getElementById('paymentForm').reset();
    document.getElementById('loanDetails').style.display = 'none';
}

function loadLoanDetails() {
    const loanId = document.getElementById('paymentLoan').value;
    const loanDetailsDiv = document.getElementById('loanDetails');
    
    if (!loanId) {
        loanDetailsDiv.style.display = 'none';
        return;
    }

    const loan = window.saccoApp.getLoanById(loanId);
    if (!loan) {
        loanDetailsDiv.style.display = 'none';
        return;
    }

    document.getElementById('paymentMemberName').textContent = loan.memberName;
    document.getElementById('paymentLoanAmount').textContent = window.saccoApp.formatCurrency(loan.amount);
    document.getElementById('paymentOutstanding').textContent = window.saccoApp.formatCurrency(loan.pendingBalance);
    
    // Set max payment amount
    document.getElementById('paymentAmount').max = loan.pendingBalance;
    
    loanDetailsDiv.style.display = 'block';
}

function handlePaymentSubmit(e) {
    e.preventDefault();
    
    const formData = {
        loanId: document.getElementById('paymentLoan').value,
        amount: parseFloat(document.getElementById('paymentAmount').value),
        paymentDate: document.getElementById('paymentDate').value,
        method: document.getElementById('paymentMethod').value,
        notes: document.getElementById('paymentNotes').value.trim()
    };

    // Validate required fields
    if (!formData.loanId || !formData.amount || !formData.paymentDate) {
        window.saccoApp.showError('Please fill in all required fields');
        return;
    }

    // Validate payment amount
    const loan = window.saccoApp.getLoanById(formData.loanId);
    if (formData.amount > loan.pendingBalance) {
        window.saccoApp.showError('Payment amount cannot exceed outstanding balance');
        return;
    }

    try {
        window.saccoApp.recordPayment(formData);
        window.saccoApp.showSuccess('Payment recorded successfully');
        
        closePaymentModal();
        loadLoansData(); // Refresh the table
        populateMemberSelects(); // Update selects
    } catch (error) {
        console.error('Error recording payment:', error);
        window.saccoApp.showError(error.message);
    }
}

// ===== SEARCH AND FILTER =====

function filterLoans() {
    const searchTerm = document.getElementById('loanSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const memberFilter = document.getElementById('memberFilter').value;

    const loans = window.saccoApp.getLoans();
    const filtered = loans.filter(loan => {
        // Determine actual status (including overdue)
        let actualStatus = loan.status;
        if (loan.status === 'Active' && new Date(loan.dueDate) < new Date()) {
            actualStatus = 'Overdue';
        }

        const matchesSearch = loan.id.toLowerCase().includes(searchTerm) ||
                            loan.memberName.toLowerCase().includes(searchTerm) ||
                            loan.purpose.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || actualStatus === statusFilter;
        const matchesMember = !memberFilter || loan.memberId === memberFilter;
        
        return matchesSearch && matchesStatus && matchesMember;
    });

    displayLoans(filtered);
}

// ===== EXPORT FUNCTIONALITY =====

function exportLoans() {
    try {
        const loans = window.saccoApp.getLoans();
        
        if (loans.length === 0) {
            window.saccoApp.showError('No loans to export');
            return;
        }

        // Prepare data for export
        const exportData = loans.map(loan => {
            const payments = window.saccoApp.getPaymentsForLoan(loan.id);
            const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
            
            // Determine actual status
            let actualStatus = loan.status;
            if (loan.status === 'Active' && new Date(loan.dueDate) < new Date()) {
                actualStatus = 'Overdue';
            }

            return {
                'Loan ID': loan.id,
                'Member Name': loan.memberName,
                'Member ID': loan.memberId,
                'Amount Disbursed': loan.amount,
                'Interest Rate (%)': loan.interestRate,
                'Issue Date': loan.issueDate,
                'Due Date': loan.dueDate,
                'Repayment Period (months)': loan.repaymentPeriod,
                'Total Repayable': loan.totalRepayable,
                'Total Paid': totalPaid,
                'Pending Balance': loan.pendingBalance,
                'Status': actualStatus,
                'Purpose': loan.purpose,
                'Notes': loan.notes
            };
        });

        // Create workbook and worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Loans');

        // Save file
        XLSX.writeFile(wb, `loans_export_${new Date().toISOString().split('T')[0]}.xlsx`);
        
        window.saccoApp.logActivity('Loan', 'Loans Export', `Exported ${loans.length} loans to Excel`, 'Success');
        window.saccoApp.showSuccess('Loans exported successfully');
        
    } catch (error) {
        console.error('Error exporting loans:', error);
        window.saccoApp.showError('Failed to export loans: ' + error.message);
    }
}

// ===== EVENT HANDLERS =====

// Handle URL parameters for direct actions
function handleURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'add') {
        openAddLoanModal();
    }
}

// Call this after page loads
setTimeout(handleURLParams, 1000);

// Refresh loans data
function refreshLoans() {
    loadLoansData();
    populateMemberSelects();
    window.saccoApp.showSuccess('Loans list refreshed');
}
