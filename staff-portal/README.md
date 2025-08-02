# Building Maintenance Staff Portal

A comprehensive Angular 17+ application for managing building maintenance operations, tenant complaints, and staff coordination.

## Features

### 🔐 Authentication & Authorization
- **Role-based access control** with three user roles:
  - **Admin**: Full system access including staff management and settings
  - **Supervisor**: Complaint management and staff oversight
  - **Technician**: View and update assigned complaints
- **Secure login** with form validation and error handling
- **Session persistence** with localStorage
- **Route protection** using Angular Guards

### 📊 Dashboard
- **Summary cards** showing complaint statistics
- **Trend visualization** with mock chart data
- **AI insights** placeholder for future analytics
- **Recent complaints** quick view with navigation

### 🎫 Complaints Management
- **Comprehensive complaint list** with filtering, sorting, and pagination
- **Detailed complaint view** with full CRUD operations
- **Status management**: Open → In Progress → Resolved → Closed
- **Staff assignment** for technicians
- **Internal notes** system for staff communication
- **Priority and category** classification

### 👥 Tenant Management
- **Tenant directory** with contact information
- **Lease management** with start/end dates
- **Add/Edit tenant** dialog forms
- **Search and filter** functionality
- **Active/Inactive status** management

### 👨‍💼 Staff Management
- **Staff directory** with role-based filtering
- **Add/Edit staff** with role assignment
- **Active/Inactive status** management
- **Search functionality** across name, email, and role

### ⚙️ Settings
- **Building configuration** with metadata
- **Logo upload** functionality
- **Contact information** management
- **System information** display

## Technology Stack

- **Angular 17+** with Standalone Components
- **Angular Material** for UI components
- **Angular Signals** for reactive state management
- **TypeScript** with strict mode
- **SCSS** for styling
- **RxJS** for reactive programming
- **Angular CDK** for layout and utilities

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── auth/
│   │   │   └── login/
│   │   ├── complaints/
│   │   │   ├── complaint-list/
│   │   │   └── complaint-detail/
│   │   ├── dashboard/
│   │   ├── settings/
│   │   ├── staff/
│   │   │   └── staff-list/
│   │   └── tenants/
│   │       └── tenant-list/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── models/
│   │   ├── complaint.model.ts
│   │   ├── settings.model.ts
│   │   ├── tenant.model.ts
│   │   └── user.model.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── complaint.service.ts
│   │   ├── notification.service.ts
│   │   ├── settings.service.ts
│   │   ├── staff.service.ts
│   │   └── tenant.service.ts
│   ├── app.component.ts
│   └── app.routes.ts
├── assets/
├── styles.scss
├── index.html
└── main.ts
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd staff-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Demo Credentials

The application includes mock authentication with the following demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@building.com | password123 |
| Supervisor | supervisor@building.com | password123 |
| Technician | tech@building.com | password123 |

## Key Features Implementation

### Angular Signals State Management
The application uses Angular Signals for reactive state management:
- **AuthService**: User authentication state
- **ComplaintService**: Complaint data with computed statistics
- **Component state**: Loading states, form validation

### Responsive Design
- **Mobile-first approach** with breakpoint-aware layouts
- **Collapsible sidebar** navigation on smaller screens
- **Responsive tables** with horizontal scrolling
- **Touch-friendly** button sizes and interactions

### Material Design
- **Consistent UI** with Angular Material components
- **Custom theming** with primary, accent, and warn colors
- **Accessibility** features built-in
- **Material icons** throughout the interface

### Mock Data Services
All services include comprehensive mock data for development:
- **5 sample complaints** with different statuses and priorities
- **5 sample tenants** with lease information
- **5 sample staff members** across all roles
- **Building settings** with contact information

## Development Commands

```bash
# Development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Build and watch for changes
npm run watch
```

## Architecture Highlights

### Standalone Components
- **Modern Angular 17+** architecture
- **Lazy loading** for optimal performance
- **Tree-shakable** imports

### Type Safety
- **Strict TypeScript** configuration
- **Comprehensive interfaces** for all data models
- **Type-safe** service methods

### Error Handling
- **Global error handling** with user-friendly messages
- **Form validation** with Material error states
- **Loading states** for better UX

## Future Enhancements

- **Real API integration** replacing mock services
- **Advanced reporting** and analytics
- **File upload** for complaint attachments
- **Email notifications** for status changes
- **Mobile app** companion
- **Real-time updates** with WebSockets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
