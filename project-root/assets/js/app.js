// ===== SACCO LOAN MANAGEMENT SYSTEM - MAIN APPLICATION =====

class SaccoApp {
    constructor() {
        this.members = [];
        this.loans = [];
        this.payments = [];
        this.settings = {};
        this.activityLogs = [];
        this.initialized = false;
        
        this.init();
    }

    // Initialize the application
    async init() {
        try {
            await this.loadAllData();
            this.setupEventListeners();
            this.initialized = true;
            console.log('SACCO App initialized successfully');
            this.logActivity('System', 'Application Started', 'SACCO Loan Management System initialized', 'Success');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to initialize application: ' + error.message);
        }
    }

    // ===== DATA MANAGEMENT =====

    // Load all data from localStorage (fallback to JSON files)
    async loadAllData() {
        try {
            // Try to load from localStorage first
            this.members = JSON.parse(localStorage.getItem('sacco_members') || '[]');
            this.loans = JSON.parse(localStorage.getItem('sacco_loans') || '[]');
            this.payments = JSON.parse(localStorage.getItem('sacco_payments') || '[]');
            this.settings = JSON.parse(localStorage.getItem('sacco_settings') || '{}');
            this.activityLogs = JSON.parse(localStorage.getItem('sacco_activity_logs') || '[]');

            // If no data in localStorage, initialize with default data
            if (this.members.length === 0) {
                console.log('No data found in localStorage, initializing with default data');
                this.initializeEmptyData();
                return;
            }
        } catch (error) {
            console.error('Error loading data:', error);
            await this.loadFromJSONFiles();
        }
    }

    // Load initial data from JSON files
    async loadFromJSONFiles() {
        try {
            // Load members
            const membersResponse = await fetch('assets/data/members.json');
            this.members = await membersResponse.json();
            
            // Load other data files
            const loansResponse = await fetch('assets/data/loans.json');
            this.loans = await loansResponse.json();
            
            const paymentsResponse = await fetch('assets/data/payments.json');
            this.payments = await paymentsResponse.json();
            
            const settingsResponse = await fetch('assets/data/settings.json');
            this.settings = await settingsResponse.json();
            
            const logsResponse = await fetch('assets/data/activity-logs.json');
            this.activityLogs = await logsResponse.json();
            
            // Save to localStorage
            this.saveAllData();
            
        } catch (error) {
            console.error('Error loading JSON files:', error);
            // Initialize with empty data if files can't be loaded
            this.initializeEmptyData();
        }
    }

    // Initialize with empty data structures
    initializeEmptyData() {
        this.members = [
            {
                "id": "MEM001",
                "fullName": "Joseph Ngamau",
                "phone": "",
                "email": "",
                "dateJoined": "2024-01-15",
                "status": "Active",
                "notes": "Founding member"
            },
            {
                "id": "MEM002",
                "fullName": "Gerald Gitau",
                "phone": "",
                "email": "",
                "dateJoined": "2024-01-15",
                "status": "Active",
                "notes": "Founding member"
            },
            {
                "id": "MEM003",
                "fullName": "Samuel Ndumia",
                "phone": "",
                "email": "",
                "dateJoined": "2024-01-15",
                "status": "Active",
                "notes": "Founding member"
            },
            {
                "id": "MEM004",
                "fullName": "Anthony Maina",
                "phone": "",
                "email": "",
                "dateJoined": "2024-01-20",
                "status": "Active",
                "notes": ""
            },
            {
                "id": "MEM005",
                "fullName": "Morgan Gitau",
                "phone": "",
                "email": "",
                "dateJoined": "2024-01-20",
                "status": "Active",
                "notes": ""
            },
            {
                "id": "MEM006",
                "fullName": "James Waweru",
                "phone": "",
                "email": "",
                "dateJoined": "2024-01-25",
                "status": "Active",
                "notes": ""
            },
            {
                "id": "MEM007",
                "fullName": "Samson Mbuu",
                "phone": "",
                "email": "",
                "dateJoined": "2024-01-25",
                "status": "Active",
                "notes": ""
            },
            {
                "id": "MEM008",
                "fullName": "Elijah Kibicho",
                "phone": "",
                "email": "",
                "dateJoined": "2024-02-01",
                "status": "Active",
                "notes": ""
            },
            {
                "id": "MEM009",
                "fullName": "John Njenga",
                "phone": "",
                "email": "",
                "dateJoined": "2024-02-01",
                "status": "Active",
                "notes": ""
            },
            {
                "id": "MEM010",
                "fullName": "James Gitau",
                "phone": "",
                "email": "",
                "dateJoined": "2024-02-05",
                "status": "Active",
                "notes": ""
            },
            {
                "id": "MEM011",
                "fullName": "Michael Gichiri",
                "phone": "",
                "email": "",
                "dateJoined": "2024-02-10",
                "status": "Active",
                "notes": ""
            },
            {
                "id": "MEM012",
                "fullName": "Joseph Mugo",
                "phone": "",
                "email": "",
                "dateJoined": "2024-02-10",
                "status": "Active",
                "notes": ""
            },
            {
                "id": "MEM013",
                "fullName": "James Kamau",
                "phone": "",
                "email": "",
                "dateJoined": "2024-02-15",
                "status": "Active",
                "notes": ""
            }
        ];
        this.loans = [];
        this.payments = [];
        this.settings = {
            saccoName: "My SACCO",
            defaultInterestRate: 10,
            currency: "KES",
            maxLoanAmount: 1000000,
            maxRepaymentPeriod: 60,
            lastBackup: null,
            systemVersion: "1.0.0"
        };
        this.activityLogs = [];
        this.saveAllData();
    }

    // Save all data to localStorage
    saveAllData() {
        try {
            localStorage.setItem('sacco_members', JSON.stringify(this.members));
            localStorage.setItem('sacco_loans', JSON.stringify(this.loans));
            localStorage.setItem('sacco_payments', JSON.stringify(this.payments));
            localStorage.setItem('sacco_settings', JSON.stringify(this.settings));
            localStorage.setItem('sacco_activity_logs', JSON.stringify(this.activityLogs));
        } catch (error) {
            console.error('Error saving data:', error);
            this.showError('Failed to save data: ' + error.message);
        }
    }

    // ===== MEMBERS MANAGEMENT =====

    // Get all members
    getMembers() {
        return this.members;
    }

    // Get member by ID
    getMemberById(id) {
        return this.members.find(member => member.id === id);
    }

    // Add new member
    addMember(memberData) {
        try {
            const newMember = {
                id: this.generateMemberId(),
                fullName: memberData.fullName,
                phone: memberData.phone || '',
                email: memberData.email || '',
                dateJoined: memberData.dateJoined,
                status: memberData.status || 'Active',
                notes: memberData.notes || '',
                createdAt: new Date().toISOString()
            };

            this.members.push(newMember);
            this.saveAllData();
            this.logActivity('Member', 'Member Added', `Added new member: ${newMember.fullName}`, 'Success');
            
            return newMember;
        } catch (error) {
            console.error('Error adding member:', error);
            this.showError('Failed to add member: ' + error.message);
            throw error;
        }
    }

    // Update member
    updateMember(id, memberData) {
        try {
            const memberIndex = this.members.findIndex(member => member.id === id);
            if (memberIndex === -1) {
                throw new Error('Member not found');
            }

            const updatedMember = { ...this.members[memberIndex], ...memberData };
            this.members[memberIndex] = updatedMember;
            this.saveAllData();
            this.logActivity('Member', 'Member Updated', `Updated member: ${updatedMember.fullName}`, 'Success');
            
            return updatedMember;
        } catch (error) {
            console.error('Error updating member:', error);
            this.showError('Failed to update member: ' + error.message);
            throw error;
        }
    }

    // Delete member
    deleteMember(id) {
        try {
            const memberIndex = this.members.findIndex(member => member.id === id);
            if (memberIndex === -1) {
                throw new Error('Member not found');
            }

            // Check if member has active loans
            const activeLoans = this.loans.filter(loan => loan.memberId === id && loan.status === 'Active');
            if (activeLoans.length > 0) {
                throw new Error('Cannot delete member with active loans');
            }

            const deletedMember = this.members[memberIndex];
            this.members.splice(memberIndex, 1);
            this.saveAllData();
            this.logActivity('Member', 'Member Deleted', `Deleted member: ${deletedMember.fullName}`, 'Success');
            
            return true;
        } catch (error) {
            console.error('Error deleting member:', error);
            this.showError('Failed to delete member: ' + error.message);
            throw error;
        }
    }

    // Generate unique member ID
    generateMemberId() {
        const maxId = this.members.reduce((max, member) => {
            const num = parseInt(member.id.replace('MEM', ''));
            return num > max ? num : max;
        }, 0);
        return `MEM${String(maxId + 1).padStart(3, '0')}`;
    }

    // ===== LOANS MANAGEMENT =====

    // Get all loans
    getLoans() {
        return this.loans;
    }

    // Get loan by ID
    getLoanById(id) {
        return this.loans.find(loan => loan.id === id);
    }

    // Get loans by member ID
    getLoansByMemberId(memberId) {
        return this.loans.filter(loan => loan.memberId === memberId);
    }

    // Add new loan
    addLoan(loanData) {
        try {
            const member = this.getMemberById(loanData.memberId);
            if (!member) {
                throw new Error('Member not found');
            }

            const newLoan = {
                id: this.generateLoanId(),
                memberId: loanData.memberId,
                memberName: member.fullName,
                amount: parseFloat(loanData.amount),
                interestRate: parseFloat(loanData.interestRate),
                issueDate: loanData.issueDate,
                repaymentPeriod: parseInt(loanData.repaymentPeriod),
                dueDate: loanData.dueDate,
                totalRepayable: this.calculateTotalRepayable(loanData.amount, loanData.interestRate),
                pendingBalance: this.calculateTotalRepayable(loanData.amount, loanData.interestRate),
                status: 'Active',
                purpose: loanData.purpose || 'Personal',
                notes: loanData.notes || '',
                createdAt: new Date().toISOString()
            };

            this.loans.push(newLoan);
            this.saveAllData();
            this.logActivity('Loan', 'Loan Created', `Created loan ${newLoan.id} for ${member.fullName} - Amount: ${this.formatCurrency(newLoan.amount)}`, 'Success');
            
            return newLoan;
        } catch (error) {
            console.error('Error adding loan:', error);
            this.showError('Failed to add loan: ' + error.message);
            throw error;
        }
    }

    // Update loan
    updateLoan(id, loanData) {
        try {
            const loanIndex = this.loans.findIndex(loan => loan.id === id);
            if (loanIndex === -1) {
                throw new Error('Loan not found');
            }

            const updatedLoan = { ...this.loans[loanIndex], ...loanData };
            
            // Recalculate totals if amount or interest rate changed
            if (loanData.amount || loanData.interestRate) {
                updatedLoan.totalRepayable = this.calculateTotalRepayable(updatedLoan.amount, updatedLoan.interestRate);
                // Update pending balance maintaining payment history
                const totalPaid = this.getTotalPaidForLoan(id);
                updatedLoan.pendingBalance = updatedLoan.totalRepayable - totalPaid;
            }

            this.loans[loanIndex] = updatedLoan;
            this.saveAllData();
            this.logActivity('Loan', 'Loan Updated', `Updated loan ${updatedLoan.id}`, 'Success');
            
            return updatedLoan;
        } catch (error) {
            console.error('Error updating loan:', error);
            this.showError('Failed to update loan: ' + error.message);
            throw error;
        }
    }

    // Delete loan
    deleteLoan(id) {
        try {
            const loanIndex = this.loans.findIndex(loan => loan.id === id);
            if (loanIndex === -1) {
                throw new Error('Loan not found');
            }

            const deletedLoan = this.loans[loanIndex];
            
            // Delete associated payments
            this.payments = this.payments.filter(payment => payment.loanId !== id);
            
            this.loans.splice(loanIndex, 1);
            this.saveAllData();
            this.logActivity('Loan', 'Loan Deleted', `Deleted loan ${deletedLoan.id}`, 'Success');
            
            return true;
        } catch (error) {
            console.error('Error deleting loan:', error);
            this.showError('Failed to delete loan: ' + error.message);
            throw error;
        }
    }

    // Generate unique loan ID
    generateLoanId() {
        const maxId = this.loans.reduce((max, loan) => {
            const num = parseInt(loan.id.replace('LN', ''));
            return num > max ? num : max;
        }, 0);
        return `LN${String(maxId + 1).padStart(4, '0')}`;
    }

    // Calculate total repayable amount
    calculateTotalRepayable(principal, interestRate) {
        return principal * (1 + interestRate / 100);
    }

    // Calculate due date
    calculateDueDate(issueDate, periodMonths) {
        const date = new Date(issueDate);
        date.setMonth(date.getMonth() + periodMonths);
        return date.toISOString().split('T')[0];
    }

    // ===== PAYMENTS MANAGEMENT =====

    // Get all payments
    getPayments() {
        return this.payments;
    }

    // Get payments for a specific loan
    getPaymentsForLoan(loanId) {
        return this.payments.filter(payment => payment.loanId === loanId);
    }

    // Get total paid for a loan
    getTotalPaidForLoan(loanId) {
        return this.payments
            .filter(payment => payment.loanId === loanId)
            .reduce((total, payment) => total + payment.amount, 0);
    }

    // Record payment
    recordPayment(paymentData) {
        try {
            const loan = this.getLoanById(paymentData.loanId);
            if (!loan) {
                throw new Error('Loan not found');
            }

            const newPayment = {
                id: this.generatePaymentId(),
                loanId: paymentData.loanId,
                memberId: loan.memberId,
                memberName: loan.memberName,
                amount: parseFloat(paymentData.amount),
                paymentDate: paymentData.paymentDate,
                method: paymentData.method || 'Cash',
                notes: paymentData.notes || '',
                createdAt: new Date().toISOString()
            };

            this.payments.push(newPayment);

            // Update loan pending balance
            const totalPaid = this.getTotalPaidForLoan(paymentData.loanId);
            loan.pendingBalance = loan.totalRepayable - totalPaid;

            // Update loan status if fully paid
            if (loan.pendingBalance <= 0) {
                loan.status = 'Completed';
                loan.completedDate = paymentData.paymentDate;
            }

            this.saveAllData();
            this.logActivity('Payment', 'Payment Recorded', `Payment of ${this.formatCurrency(newPayment.amount)} recorded for loan ${loan.id}`, 'Success');
            
            return newPayment;
        } catch (error) {
            console.error('Error recording payment:', error);
            this.showError('Failed to record payment: ' + error.message);
            throw error;
        }
    }

    // Generate unique payment ID
    generatePaymentId() {
        const maxId = this.payments.reduce((max, payment) => {
            const num = parseInt(payment.id.replace('PAY', ''));
            return num > max ? num : max;
        }, 0);
        return `PAY${String(maxId + 1).padStart(4, '0')}`;
    }

    // ===== ANALYTICS & CALCULATIONS =====

    // Get dashboard analytics
    getDashboardAnalytics() {
        const totalDisbursed = this.loans.reduce((sum, loan) => sum + loan.amount, 0);
        const totalRepayable = this.loans.reduce((sum, loan) => sum + loan.totalRepayable, 0);
        const totalPaid = this.payments.reduce((sum, payment) => sum + payment.amount, 0);
        const totalInterestEarned = totalPaid - this.loans
            .filter(loan => loan.status === 'Completed')
            .reduce((sum, loan) => sum + loan.amount, 0);
        
        const activeLoans = this.loans.filter(loan => loan.status === 'Active');
        const totalOverdue = activeLoans
            .filter(loan => new Date(loan.dueDate) < new Date())
            .reduce((sum, loan) => sum + loan.pendingBalance, 0);
        
        const activeMembers = this.members.filter(member => member.status === 'Active').length;

        return {
            totalDisbursed,
            totalInterestEarned,
            totalOverdue,
            activeMembers,
            activeLoans: activeLoans.length,
            completedLoans: this.loans.filter(loan => loan.status === 'Completed').length,
            totalMembers: this.members.length
        };
    }

    // Get overdue loans
    getOverdueLoans() {
        const currentDate = new Date();
        return this.loans.filter(loan => {
            return loan.status === 'Active' && new Date(loan.dueDate) < currentDate;
        }).map(loan => {
            const daysOverdue = Math.floor((currentDate - new Date(loan.dueDate)) / (1000 * 60 * 60 * 24));
            return { ...loan, daysOverdue };
        });
    }

    // ===== ACTIVITY LOGGING =====

    // Log activity
    logActivity(actionType, action, details, status = 'Success') {
        const logEntry = {
            id: this.generateLogId(),
            timestamp: new Date().toISOString(),
            actionType,
            action,
            details,
            user: 'Admin',
            status
        };

        this.activityLogs.unshift(logEntry); // Add to beginning of array
        
        // Keep only last 1000 logs
        if (this.activityLogs.length > 1000) {
            this.activityLogs = this.activityLogs.slice(0, 1000);
        }

        this.saveAllData();
        return logEntry;
    }

    // Generate unique log ID
    generateLogId() {
        return 'LOG' + Date.now() + Math.random().toString(36).substr(2, 9);
    }

    // ===== UTILITY FUNCTIONS =====

    // Format currency
    formatCurrency(amount, currency = null) {
        const curr = currency || this.settings.currency || 'KES';
        return `${curr} ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }

    // Format date
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Show success message
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    // Show error message
    showError(message) {
        this.showNotification(message, 'error');
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
            `;
            document.body.appendChild(notification);
        }

        // Set notification style based on type
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };

        notification.style.backgroundColor = colors[type];
        notification.textContent = message;
        notification.style.transform = 'translateX(0)';

        // Hide after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
        }, 5000);
    }

    // Setup global event listeners
    setupEventListeners() {
        // Handle modal close on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Handle ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal');
                modals.forEach(modal => {
                    modal.style.display = 'none';
                });
            }
        });
    }

    // ===== DATA IMPORT/EXPORT =====

    // Export all data as JSON
    exportData() {
        const data = {
            members: this.members,
            loans: this.loans,
            payments: this.payments,
            settings: this.settings,
            activityLogs: this.activityLogs,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sacco_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.logActivity('System', 'Data Export', 'System data exported as JSON backup', 'Success');
        return true;
    }

    // Import data from JSON
    importData(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

            if (data.members) this.members = data.members;
            if (data.loans) this.loans = data.loans;
            if (data.payments) this.payments = data.payments;
            if (data.settings) this.settings = data.settings;
            if (data.activityLogs) this.activityLogs = data.activityLogs;

            this.saveAllData();
            this.logActivity('System', 'Data Import', 'System data imported from JSON backup', 'Success');
            this.showSuccess('Data imported successfully!');
            
            // Reload page to reflect changes
            setTimeout(() => {
                window.location.reload();
            }, 1500);

            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            this.showError('Failed to import data: ' + error.message);
            throw error;
        }
    }

    // Clear all data
    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            this.initializeEmptyData();
            this.logActivity('System', 'Data Cleared', 'All system data cleared', 'Success');
            this.showSuccess('All data cleared successfully!');
            
            // Reload page
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            
            return true;
        }
        return false;
    }
}

// Initialize the app when DOM is loaded
let saccoApp;

document.addEventListener('DOMContentLoaded', () => {
    saccoApp = new SaccoApp();
    // Make saccoApp globally available after initialization
    window.saccoApp = saccoApp;
});
