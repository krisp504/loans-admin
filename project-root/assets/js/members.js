// ===== MEMBERS PAGE FUNCTIONALITY =====

let currentEditingMember = null;
let filteredMembers = [];

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('members.html')) {
        initializeMembers();
    }
});

function initializeMembers() {
    console.log('Initializing members page...');
    // Wait for the app to be initialized
    const checkApp = setInterval(() => {
        if (window.saccoApp && window.saccoApp.initialized) {
            console.log('SACCO app found and initialized, loading members...');
            clearInterval(checkApp);
            loadMembersData();
            setupMembersEventListeners();
        } else {
            console.log('Waiting for SACCO app to initialize...');
        }
    }, 100);

    // Failsafe: if app doesn't load in 10 seconds, show error
    setTimeout(() => {
        if (!window.saccoApp || !window.saccoApp.initialized) {
            console.error('SACCO app failed to initialize within 10 seconds');
            const tableBody = document.getElementById('membersTableBody');
            if (tableBody) {
                tableBody.innerHTML = '<tr><td colspan="7" class="text-center" style="color: red;">Error: Application failed to load. Please refresh the page.</td></tr>';
            }
        }
    }, 10000);
}

function loadMembersData() {
    console.log('loadMembersData() called');
    try {
        if (!window.saccoApp) {
            throw new Error('SACCO app not available');
        }
        
        const members = window.saccoApp.getMembers();
        console.log(`Retrieved ${members.length} members:`, members);
        
        displayMembers(members);
        updateMemberCount(members.length);
        
        console.log('Members data loaded successfully');
    } catch (error) {
        console.error('Error loading members data:', error);
        const tableBody = document.getElementById('membersTableBody');
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="7" class="text-center" style="color: red;">Error: ${error.message}</td></tr>`;
        }
        if (window.saccoApp && window.saccoApp.showError) {
            window.saccoApp.showError('Failed to load members data: ' + error.message);
        }
    }
}

function displayMembers(members) {
    const tableBody = document.getElementById('membersTableBody');
    tableBody.innerHTML = '';

    if (members.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">No members found</td></tr>';
        return;
    }

    filteredMembers = members;

    members.forEach(member => {
        const memberLoans = window.saccoApp.getLoansByMemberId(member.id);
        const totalLoans = memberLoans.length;
        const outstandingBalance = memberLoans
            .filter(loan => loan.status === 'Active')
            .reduce((sum, loan) => sum + loan.pendingBalance, 0);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.id}</td>
            <td>${member.fullName}</td>
            <td>${window.saccoApp.formatDate(member.dateJoined)}</td>
            <td><span class="status-badge status-${member.status.toLowerCase()}">${member.status}</span></td>
            <td>${totalLoans}</td>
            <td>${window.saccoApp.formatCurrency(outstandingBalance)}</td>
            <td class="actions">
                <button class="btn btn-info btn-sm" onclick="viewMember('${member.id}')" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-warning btn-sm" onclick="editMember('${member.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteMember('${member.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updateMemberCount(count) {
    // Update any member count displays if they exist
    const countElements = document.querySelectorAll('.member-count');
    countElements.forEach(el => el.textContent = count);
}

function setupMembersEventListeners() {
    // Member form submission
    const memberForm = document.getElementById('memberForm');
    if (memberForm) {
        memberForm.addEventListener('submit', handleMemberSubmit);
    }

    // Set today as default date for new members
    const dateJoinedInput = document.getElementById('dateJoined');
    if (dateJoinedInput && !dateJoinedInput.value) {
        dateJoinedInput.value = new Date().toISOString().split('T')[0];
    }
}

function handleMemberSubmit(e) {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        phone: document.getElementById('memberPhone').value.trim(),
        email: document.getElementById('memberEmail').value.trim(),
        dateJoined: document.getElementById('dateJoined').value,
        status: document.getElementById('memberStatus').value,
        notes: document.getElementById('memberNotes').value.trim()
    };

    // Validate required fields
    if (!formData.fullName || !formData.dateJoined) {
        window.saccoApp.showError('Please fill in all required fields');
        return;
    }

    try {
        if (currentEditingMember) {
            // Update existing member
            window.saccoApp.updateMember(currentEditingMember.id, formData);
            window.saccoApp.showSuccess('Member updated successfully');
        } else {
            // Add new member
            window.saccoApp.addMember(formData);
            window.saccoApp.showSuccess('Member added successfully');
        }

        closeMemberModal();
        loadMembersData(); // Refresh the table
    } catch (error) {
        console.error('Error saving member:', error);
        window.saccoApp.showError(error.message);
    }
}

// ===== MODAL FUNCTIONS =====

function openAddMemberModal() {
    currentEditingMember = null;
    document.getElementById('modalTitle').textContent = 'Add New Member';
    document.getElementById('memberForm').reset();
    
    // Set today as default date
    document.getElementById('dateJoined').value = new Date().toISOString().split('T')[0];
    
    document.getElementById('memberModal').style.display = 'block';
}

function editMember(memberId) {
    const member = window.saccoApp.getMemberById(memberId);
    if (!member) {
        window.saccoApp.showError('Member not found');
        return;
    }

    currentEditingMember = member;
    document.getElementById('modalTitle').textContent = 'Edit Member';
    
    // Populate form
    document.getElementById('fullName').value = member.fullName;
    document.getElementById('memberPhone').value = member.phone || '';
    document.getElementById('memberEmail').value = member.email || '';
    document.getElementById('dateJoined').value = member.dateJoined;
    document.getElementById('memberStatus').value = member.status;
    document.getElementById('memberNotes').value = member.notes || '';
    
    document.getElementById('memberModal').style.display = 'block';
}

function viewMember(memberId) {
    const member = window.saccoApp.getMemberById(memberId);
    if (!member) {
        window.saccoApp.showError('Member not found');
        return;
    }

    const memberLoans = window.saccoApp.getLoansByMemberId(memberId);
    const totalBorrowed = memberLoans.reduce((sum, loan) => sum + loan.amount, 0);
    const totalRepaid = memberLoans.reduce((sum, loan) => sum + (loan.amount - loan.pendingBalance), 0);
    const outstandingBalance = memberLoans.reduce((sum, loan) => sum + loan.pendingBalance, 0);

    const memberInfo = `
        <h3>${member.fullName}</h3>
        <p><strong>Member ID:</strong> ${member.id}</p>
        <p><strong>Date Joined:</strong> ${window.saccoApp.formatDate(member.dateJoined)}</p>
        <p><strong>Status:</strong> <span class="status-badge status-${member.status.toLowerCase()}">${member.status}</span></p>
        <p><strong>Phone:</strong> ${member.phone || 'N/A'}</p>
        <p><strong>Email:</strong> ${member.email || 'N/A'}</p>
        <p><strong>Notes:</strong> ${member.notes || 'N/A'}</p>
        <hr>
        <h4>Loan Summary</h4>
        <p><strong>Total Loans:</strong> ${memberLoans.length}</p>
        <p><strong>Total Borrowed:</strong> ${window.saccoApp.formatCurrency(totalBorrowed)}</p>
        <p><strong>Total Repaid:</strong> ${window.saccoApp.formatCurrency(totalRepaid)}</p>
        <p><strong>Outstanding Balance:</strong> ${window.saccoApp.formatCurrency(outstandingBalance)}</p>
    `;

    alert(memberInfo); // Simple alert for now - you can enhance this with a proper modal
}

function deleteMember(memberId) {
    const member = window.saccoApp.getMemberById(memberId);
    if (!member) {
        window.saccoApp.showError('Member not found');
        return;
    }

    // Check for active loans
    const activeLoans = window.saccoApp.getLoansByMemberId(memberId)
        .filter(loan => loan.status === 'Active');
    
    if (activeLoans.length > 0) {
        window.saccoApp.showError(`Cannot delete ${member.fullName}. They have ${activeLoans.length} active loan(s).`);
        return;
    }

    if (confirm(`Are you sure you want to delete ${member.fullName}? This action cannot be undone.`)) {
        try {
            window.saccoApp.deleteMember(memberId);
            window.saccoApp.showSuccess('Member deleted successfully');
            loadMembersData(); // Refresh the table
        } catch (error) {
            window.saccoApp.showError(error.message);
        }
    }
}

function closeMemberModal() {
    document.getElementById('memberModal').style.display = 'none';
    currentEditingMember = null;
    document.getElementById('memberForm').reset();
}

// ===== SEARCH AND FILTER =====

function filterMembers() {
    const searchTerm = document.getElementById('memberSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;

    const members = window.saccoApp.getMembers();
    const filtered = members.filter(member => {
        const matchesSearch = member.fullName.toLowerCase().includes(searchTerm) ||
                            member.id.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || member.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    displayMembers(filtered);
}

// ===== EXCEL IMPORT/EXPORT =====

function importMembers() {
    document.getElementById('importModal').style.display = 'block';
}

function closeImportModal() {
    document.getElementById('importModal').style.display = 'none';
    document.getElementById('excelFile').value = '';
    document.getElementById('importBtn').disabled = true;
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    const importBtn = document.getElementById('importBtn');
    
    if (file) {
        importBtn.disabled = false;
        importBtn.textContent = `Import ${file.name}`;
    } else {
        importBtn.disabled = true;
        importBtn.textContent = 'Import Data';
    }
}

function processImport() {
    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];
    
    if (!file) {
        window.saccoApp.showError('Please select a file to import');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            if (jsonData.length === 0) {
                window.saccoApp.showError('No data found in the Excel file');
                return;
            }

            // Process and validate the imported data
            let importedCount = 0;
            let errorCount = 0;

            jsonData.forEach((row, index) => {
                try {
                    const memberData = {
                        fullName: row['Full Name'] || row.fullName || row.name,
                        phone: row['Phone Number'] || row.phone || '',
                        email: row['Email'] || row.email || '',
                        dateJoined: row['Date Joined'] || row.dateJoined || new Date().toISOString().split('T')[0],
                        status: row['Status'] || row.status || 'Active',
                        notes: row['Notes'] || row.notes || ''
                    };

                    if (!memberData.fullName) {
                        throw new Error(`Row ${index + 1}: Full Name is required`);
                    }

                    window.saccoApp.addMember(memberData);
                    importedCount++;
                } catch (error) {
                    console.error(`Error importing row ${index + 1}:`, error);
                    errorCount++;
                }
            });

            closeImportModal();
            
            if (importedCount > 0) {
                window.saccoApp.showSuccess(`Successfully imported ${importedCount} members`);
                loadMembersData(); // Refresh the table
            }
            
            if (errorCount > 0) {
                window.saccoApp.showError(`${errorCount} rows had errors and were skipped`);
            }

        } catch (error) {
            console.error('Error processing Excel file:', error);
            window.saccoApp.showError('Failed to process Excel file: ' + error.message);
        }
    };

    reader.readAsArrayBuffer(file);
}

// Export members to Excel
function exportMembers() {
    try {
        const members = window.saccoApp.getMembers();
        
        if (members.length === 0) {
            window.saccoApp.showError('No members to export');
            return;
        }

        // Prepare data for export
        const exportData = members.map(member => {
            const memberLoans = window.saccoApp.getLoansByMemberId(member.id);
            const totalLoans = memberLoans.length;
            const outstandingBalance = memberLoans
                .filter(loan => loan.status === 'Active')
                .reduce((sum, loan) => sum + loan.pendingBalance, 0);

            return {
                'Member ID': member.id,
                'Full Name': member.fullName,
                'Phone Number': member.phone,
                'Email': member.email,
                'Date Joined': member.dateJoined,
                'Status': member.status,
                'Total Loans': totalLoans,
                'Outstanding Balance': outstandingBalance,
                'Notes': member.notes
            };
        });

        // Create workbook and worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Members');

        // Save file
        XLSX.writeFile(wb, `members_export_${new Date().toISOString().split('T')[0]}.xlsx`);
        
        window.saccoApp.logActivity('Member', 'Members Export', `Exported ${members.length} members to Excel`, 'Success');
        window.saccoApp.showSuccess('Members exported successfully');
        
    } catch (error) {
        console.error('Error exporting members:', error);
        window.saccoApp.showError('Failed to export members: ' + error.message);
    }
}

// ===== EVENT HANDLERS =====

// Handle URL parameters for direct actions
function handleURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'add') {
        openAddMemberModal();
    }
}

// Call this after page loads
setTimeout(handleURLParams, 1000);

// Refresh members data
function refreshMembers() {
    loadMembersData();
    window.saccoApp.showSuccess('Members list refreshed');
}

// Search members by various criteria
function searchMembers(query) {
    const members = window.saccoApp.getMembers();
    const results = members.filter(member => 
        member.fullName.toLowerCase().includes(query.toLowerCase()) ||
        member.id.toLowerCase().includes(query.toLowerCase()) ||
        member.phone.includes(query) ||
        member.email.toLowerCase().includes(query.toLowerCase())
    );
    
    displayMembers(results);
    return results;
}
