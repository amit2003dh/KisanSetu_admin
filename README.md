# KisanSetu Admin Dashboard

A separate React application for KisanSetu administration, providing complete control over platform management, user verification, and system oversight.

## 🚀 Features

### 🔐 Authentication System
- **Admin Login**: Secure authentication with JWT tokens
- **Admin Signup**: New admin creation with secret key protection
- **Session Management**: Automatic token refresh and logout
- **Role-Based Access**: Different permission levels for admins

### 📊 Dashboard Overview
- **Platform Statistics**: Real-time metrics for users, orders, revenue
- **Quick Actions**: Direct access to common admin tasks
- **Visual Analytics**: Charts and graphs for data visualization
- **Performance Monitoring**: System health indicators

### 🌾 Production Verification
- **Farmer Production Requests**: Review and approve crop production
- **Quality Assessment**: Verify production quality and quantity
- **Document Verification**: Check uploaded images and documents
- **Status Management**: Approve, reject, or request more information

### 🚚 Delivery Partner Management
- **Partner Applications**: Review delivery partner applications
- **Document Verification**: Verify driving license, vehicle RC, Aadhar
- **Service Area Management**: Set delivery zones and capacity
- **Performance Tracking**: Monitor delivery partner performance

### 👥 User Management
- **Complete User Control**: Manage all platform users
- **Account Status**: Activate, suspend, deactivate users
- **Role Management**: Assign and modify user roles
- **Advanced Search**: Filter users by role, status, location
- **Bulk Operations**: Perform actions on multiple users

### 📦 Order Management
- **Order Monitoring**: Track all platform orders
- **Status Updates**: Update order statuses and tracking
- **Dispute Resolution**: Handle order disputes and issues
- **Revenue Tracking**: Monitor platform revenue

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend API running

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   cd admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Create .env file
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start Development Server**
   ```bash
   npm start
   ```
   The admin dashboard will be available at `http://localhost:3000`

5. **Build for Production**
   ```bash
   npm build
   ```

## 🌐 Deployment Options

### Option 1: Same Server, Different Port
```bash
# Main Frontend: http://localhost:3000
# Admin Frontend: http://localhost:3001
# Backend: http://localhost:5000
```

### Option 2: Different Domains
```bash
# Main Frontend: https://kisansetu.com
# Admin Frontend: https://admin.kisansetu.com
# Backend: https://api.kisansetu.com
```

### Option 3: Subdirectory
```bash
# Main Frontend: https://kisansetu.com
# Admin Frontend: https://kisansetu.com/admin
# Backend: https://api.kisansetu.com
```

## 🔐 Admin Access

### Creating Admin Accounts

1. **Get Secret Key**: Contact system administrator for the admin secret key
2. **Navigate to Signup**: Go to `/admin/signup`
3. **Fill Details**: Enter name, email, password, and secret key
4. **Login**: Use credentials to access admin dashboard

### Default Secret Key
```
KISANSETU_ADMIN_2024_SECRET
```
⚠️ **Change this in production for security**

## 📱 Navigation

### Main Routes
- `/admin/login` - Admin login page
- `/admin/signup` - Create new admin account
- `/admin/dashboard` - Main admin dashboard
- `/admin/production-verification` - Production verification
- `/admin/delivery-verification` - Delivery partner verification
- `/admin/user-management` - User management
- `/admin/order-management` - Order management
- `/admin/analytics` - Platform analytics

### Quick Access
- **Dashboard**: Overview of all platform metrics
- **Production**: Farmer production verification
- **Delivery**: Partner application review
- **Users**: Complete user management
- **Orders**: Order monitoring and management

## 🔧 API Integration

### Authentication Endpoints
- `POST /auth/admin/login` - Admin login
- `POST /auth/admin/signup` - Admin signup
- `GET /auth/admin/profile` - Get admin profile
- `PUT /auth/admin/change-password` - Change password

### Management Endpoints
- `GET /admin/dashboard-stats` - Dashboard statistics
- `GET /admin/users` - Get all users
- `PUT /admin/users/:id/action` - User actions
- `GET /admin/productions` - Production requests
- `PUT /admin/productions/:id/verify` - Verify production
- `GET /admin/delivery-partners` - Partner applications
- `PUT /admin/delivery-partners/:id/verify` - Verify partner

## 🎨 UI Components

### Design System
- **Color Scheme**: Professional blue and green palette
- **Typography**: Clean, readable fonts
- **Responsive Design**: Works on all devices
- **Dark Mode**: Optional dark theme support

### Components
- **AdminNavbar**: Navigation with user dropdown
- **ProtectedRoute**: Authentication wrapper
- **LoadingSpinner**: Loading indicators
- **Modal**: Reusable modal component
- **DataTable**: Sortable data tables
- **StatusBadge**: Status indicators

## 🔒 Security Features

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Session Management**: Automatic token refresh
- **Auto-Logout**: Logout on token expiry

### Authorization
- **Role-Based Access**: Different admin roles
- **Permission System**: Granular permissions
- **Route Protection**: Protected admin routes
- **API Security**: Secure API endpoints

### Data Protection
- **Input Validation**: Client and server validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Cross-site request forgery prevention
- **Secure Headers**: Security headers implementation

## 📊 Analytics & Reporting

### Platform Metrics
- **User Statistics**: Total users by role
- **Order Analytics**: Order volume and revenue
- **Performance Metrics**: Delivery performance
- **Financial Reports**: Revenue and profit analysis

### Real-time Data
- **Live Updates**: Real-time data synchronization
- **WebSocket Integration**: Live notifications
- **Dashboard Refresh**: Automatic data updates
- **Alert System**: Important notifications

## 🚀 Performance Optimization

### Frontend Optimization
- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Minimized bundle sizes
- **Caching Strategy**: Browser and server caching
- **Image Optimization**: Compressed images

### API Optimization
- **Request Batching**: Multiple requests in single call
- **Data Pagination**: Large dataset pagination
- **Caching Layer**: Redis caching for frequent data
- **Compression**: Gzip compression

## 🐛 Troubleshooting

### Common Issues

1. **Login Issues**
   - Check backend API connection
   - Verify admin credentials
   - Check JWT token configuration

2. **Data Loading Issues**
   - Verify API endpoints
   - Check network connectivity
   - Review browser console errors

3. **Permission Issues**
   - Verify admin role assignment
   - Check permission configuration
   - Review route protection

### Debug Mode
```bash
# Enable debug logging
REACT_APP_DEBUG=true npm start
```

## 📞 Support

For technical support or issues:
- **Email**: admin@kisansetu.com
- **Documentation**: Check this README
- **Issues**: Report bugs via GitHub issues

## 🔄 Updates & Maintenance

### Version Updates
- **Regular Updates**: Monthly security updates
- **Feature Updates**: Quarterly feature releases
- **Bug Fixes**: As needed patches
- **Performance**: Continuous optimization

### Backup & Recovery
- **Data Backup**: Daily automated backups
- **Recovery Plan**: Disaster recovery procedures
- **Monitoring**: 24/7 system monitoring
- **Alerts**: Critical issue notifications

---

## 📄 License

This project is proprietary software of KisanSetu. All rights reserved.

© 2024 KisanSetu Admin Dashboard
