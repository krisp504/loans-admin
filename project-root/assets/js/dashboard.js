// ===== DASHBOARD FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        initializeDashboard();
    }
});

function initializeDashboard() {
    // Wait for the app to be initialized
    const checkApp = setInterval(() => {
        if (window.saccoApp && window.saccoApp.initialized) {
            clearInterval(checkApp);
            loadDashboardData();
            setupDashboardEventListeners();
        }
    }, 100);
}

function loadDashboardData() {
    try {
        const analytics = window.saccoApp.getDashboardAnalytics();
        updateAnalyticsCards(analytics);
        loadRecentLoans();
        updateMemberStats(analytics);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        window.saccoApp.showError('Failed to load dashboard data');
    }
}

function updateAnalyticsCards(analytics) {
    // Update analytics cards
    document.getElementById('totalDisbursed').textContent = window.saccoApp.formatCurrency(analytics.totalDisbursed);
    document.getElementById('totalInterestEarned').textContent = window.saccoApp.formatCurrency(analytics.totalInterestEarned);
    document.getElementById('totalOverdue').textContent = window.saccoApp.formatCurrency(analytics.totalOverdue);
    document.getElementById('activeMembers').textContent = analytics.activeMembers;
}

function loadRecentLoans() {
    const recentLoansTable = document.getElementById('recentLoansTable');
    const loans = window.saccoApp.getLoans()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5); // Get latest 5 loans

    recentLoansTable.innerHTML = '';

    if (loans.length === 0) {
        recentLoansTable.innerHTML = '<tr><td colspan="5" class="text-center">No loans found</td></tr>';
        return;
    }

    loans.forEach(loan => {
        const row = document.createElement('tr');
        
        // Determine status badge class
        let statusClass = 'status-active';
        if (loan.status === 'Completed') {
            statusClass = 'status-completed';
        } else if (loan.status === 'Active' && new Date(loan.dueDate) < new Date()) {
            statusClass = 'status-overdue';
        }

        row.innerHTML = `
            <td>${loan.id}</td>
            <td>${loan.memberName}</td>
            <td>${window.saccoApp.formatCurrency(loan.amount)}</td>
            <td><span class="status-badge ${statusClass}">${loan.status}</span></td>
            <td>${window.saccoApp.formatDate(loan.dueDate)}</td>
        `;
        
        recentLoansTable.appendChild(row);
    });
}

function updateMemberStats(analytics) {
    document.getElementById('totalMembers').textContent = analytics.totalMembers;
    document.getElementById('activeLoans').textContent = analytics.activeLoans;
    document.getElementById('completedLoans').textContent = analytics.completedLoans;
}

function setupDashboardEventListeners() {
    // Add any dashboard-specific event listeners here
    console.log('Dashboard event listeners setup complete');
}

// Refresh dashboard data
function refreshDashboard() {
    if (window.saccoApp && window.saccoApp.initialized) {
        loadDashboardData();
        window.saccoApp.showSuccess('Dashboard refreshed');
    }
}

// Export dashboard summary
function exportDashboardSummary() {
    try {
        const analytics = window.saccoApp.getDashboardAnalytics();
        const overdueLoans = window.saccoApp.getOverdueLoans();
        
        const summary = {
            generatedDate: new Date().toISOString(),
            analytics: analytics,
            overdueLoans: overdueLoans.length,
            totalOverdueAmount: overdueLoans.reduce((sum, loan) => sum + loan.pendingBalance, 0),
            recentLoans: window.saccoApp.getLoans()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 10)
        };

        const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard_summary_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        window.saccoApp.logActivity('System', 'Dashboard Export', 'Dashboard summary exported', 'Success');
        window.saccoApp.showSuccess('Dashboard summary exported successfully');
    } catch (error) {
        console.error('Error exporting dashboard summary:', error);
        window.saccoApp.showError('Failed to export dashboard summary');
    }
}
