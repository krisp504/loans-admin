# SACCO Loan Management System

A comprehensive web-based loan management system designed for small SACCOs (Savings and Credit Cooperative Organizations) with manual data management using JSON files and localStorage.

## 🌟 Features

### 📊 Dashboard
- **Analytics Overview**: Total loans disbursed, interest earned, overdue amounts, and active members
- **Recent Loans**: Quick view of the latest loan transactions
- **Member Statistics**: Active loans, completed loans, and member counts
- **Quick Actions**: Fast access to add loans, members, and generate reports

### 👥 Members Management
- **Complete Member Database**: All 13 members pre-loaded with IDs (MEM001-MEM013)
- **Member Details**: Full name, contact information, join date, status, and notes
- **Search & Filter**: Find members quickly by name or status
- **Excel Import/Export**: Bulk import members from Excel files
- **Member Actions**: Add, edit, delete, and manage member status

### 💰 Loans Management
- **Comprehensive Loan Tracking**: Amount, interest rate (default 10%), issue date, repayment period
- **Automatic Calculations**: Total repayable amount, pending balance, due dates
- **Loan Status Management**: Active, Completed, Overdue tracking
- **Payment Recording**: Manual payment entry with multiple payment methods
- **Loan Purposes**: Business, Personal, Emergency, Education, Agriculture, Other
- **Export Capabilities**: Export loan data to Excel for external analysis

### 📈 Reports & Analytics
- **Financial Summary**: Portfolio overview, interest earned, outstanding amounts
- **Individual Member Reports**: Detailed loan history and payment records
- **Loan Analysis**: Distribution by purpose, payment performance metrics
- **Overdue Management**: Track and manage overdue loans with days calculation
- **Export Options**: Generate and download comprehensive reports

### ⚙️ System Settings
- **General Configuration**: SACCO name, default interest rate, currency, loan limits
- **Data Management**: Backup, restore, and clear system data
- **Selective Operations**: Delete completed loans, inactive members, old logs
- **System Information**: Version details, data statistics, last backup date

### 📋 Activity Logs
- **Complete Audit Trail**: Track all system activities and changes
- **Categorized Logging**: Member, Loan, Payment, and System actions
- **Advanced Filtering**: Filter by action type, date range, and search terms
- **Export Logs**: Download activity history for compliance and analysis

## 🏗️ System Architecture

### Data Storage
- **LocalStorage Primary**: All data stored in browser's localStorage for persistence
- **JSON File Backup**: Initial data loaded from JSON files in `/assets/data/`
- **No Database Required**: Fully functional without server-side database
- **Import/Export**: Full data backup and restore capabilities

### File Structure
```
loans-admin/
├── index.html              # Dashboard page
├── members.html            # Members management
├── loans.html              # Loans management
├── reports.html            # Reports and analytics
├── settings.html           # System settings
├── activity-logs.html      # Activity logs
├── assets/
│   ├── css/
│   │   └── style.css       # Complete styling
│   ├── js/
│   │   ├── app.js          # Core application logic
│   │   ├── dashboard.js    # Dashboard functionality
│   │   ├── members.js      # Member management
│   │   ├── loans.js        # Loan management
│   │   ├── reports.js      # Reports generation
│   │   ├── settings.js     # Settings management
│   │   └── activity-logs.js # Activity logging
│   └── data/
│       ├── members.json    # Pre-loaded member data
│       ├── loans.json      # Initial loans data
│       ├── payments.json   # Payment records
│       ├── settings.json   # System configuration
│       └── activity-logs.json # System activity logs
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server installation required
- No database setup needed

### Installation
1. Download all files to your desired directory
2. Open `index.html` in your web browser
3. The system will automatically load your 13 members
4. Start managing loans immediately

### First Time Setup
1. **Review Member Data**: All 13 members are pre-loaded and ready
2. **Check Settings**: Verify default interest rate (10%) and currency (KES)
3. **Create First Loan**: Use the dashboard quick action or loans page
4. **Explore Features**: Navigate through all sections to familiarize yourself

## 👥 Pre-loaded Members

Your SACCO has 13 members ready to use:

1. **Joseph Ngamau** (MEM001) - Founding member
2. **Gerald Gitau** (MEM002) - Founding member  
3. **Samuel Ndumia** (MEM003) - Founding member
4. **Anthony Maina** (MEM004)
5. **Morgan Gitau** (MEM005)
6. **James Waweru** (MEM006)
7. **Samson Mbuu** (MEM007)
8. **Elijah Kibicho** (MEM008)
9. **John Njenga** (MEM009)
10. **James Gitau** (MEM010)
11. **Michael Gichiri** (MEM011)
12. **Joseph Mugo** (MEM012)
13. **James Kamau** (MEM013)

## 💡 Key Features Explained

### Interest Calculation
- **Default Rate**: 10% (adjustable per loan)
- **Simple Interest**: Total Repayable = Principal × (1 + Interest Rate %)
- **Flexible Rates**: Each loan can have custom interest rates

### Payment Tracking
- **Manual Entry**: Record payments as they're received
- **Multiple Methods**: Cash, M-Pesa, Bank Transfer, Check
- **Automatic Updates**: Loan status updates automatically when fully paid
- **Balance Calculation**: Remaining balance calculated in real-time

### Data Security
- **Local Storage**: All data stays on your device
- **Backup System**: Export data for safekeeping
- **Import Capability**: Restore from backups when needed
- **No Cloud Dependency**: Works completely offline

### Excel Integration
- **Member Import**: Bulk add members from Excel files
- **Data Export**: Export loans, members, and reports to Excel
- **Flexible Format**: Standard Excel formats supported

## 🛠️ Usage Tips

### Daily Operations
1. **Record Payments**: Use the "Record Payment" button on loans page
2. **Track Overdue**: Check reports page for overdue loans
3. **Monitor Dashboard**: Quick overview of system status
4. **Add New Loans**: Simple form with automatic calculations

### Weekly Tasks
1. **Review Reports**: Generate member and financial reports
2. **Check Activity Logs**: Monitor all system activities
3. **Backup Data**: Export system data for safety
4. **Update Member Status**: Maintain accurate member records

### Monthly Maintenance
1. **Clear Old Logs**: Remove logs older than 6 months
2. **Verify Calculations**: Cross-check loan calculations
3. **Member Review**: Update contact information and status
4. **System Backup**: Create comprehensive data backup

## 🔧 Troubleshooting

### Common Issues

**Data Not Loading**
- Refresh the browser page
- Check if localStorage is enabled
- Ensure all files are in correct directories

**Calculation Errors**
- Verify interest rate format (use decimals, not percentages)
- Check date formats (YYYY-MM-DD)
- Ensure numeric fields contain only numbers

**Export Not Working**
- Enable file downloads in browser
- Check popup blockers
- Ensure sufficient disk space

### Data Recovery
1. **Lost Data**: Import from backup JSON file
2. **Corrupted Storage**: Clear localStorage and reload initial data
3. **Missing Members**: Re-import from members.json file

## 🎯 Best Practices

### Data Management
- **Regular Backups**: Export data weekly
- **Verify Entries**: Double-check all loan and payment entries
- **Consistent Formats**: Use standard date and number formats
- **Activity Monitoring**: Review activity logs regularly

### Security
- **Physical Security**: Secure the device running the system
- **Access Control**: Limit who can access the browser
- **Backup Storage**: Store backups in secure location
- **Regular Updates**: Keep browser updated for security

## 📞 Support & Maintenance

### Self-Service
- All data is stored locally - no external dependencies
- System works completely offline
- Full control over data and calculations
- Customizable settings and configurations

### Expansion Options
- Add new members anytime through the interface
- Modify interest rates and loan terms as needed
- Export data for integration with other systems
- Scale up by implementing database backend if needed

## 📈 Future Enhancements

Potential improvements you might consider:
- SMS notifications for overdue loans
- Mobile app version
- Advanced reporting features
- Multi-user access with permissions
- Integration with mobile money platforms

---

## 🎉 System Ready!

Your SACCO Loan Management System is now ready to use. All 13 members are loaded, and you can start creating loans immediately. The system is designed to be simple, reliable, and completely under your control.

**Quick Start**: Open `index.html` in your browser and explore the dashboard to begin managing your SACCO's loans effectively!
