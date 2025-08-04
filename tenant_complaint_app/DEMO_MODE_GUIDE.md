# 🎭 Demo Mode Guide - Tenant Complaint App

## Overview
This app now supports **two modes** of operation:
- **🎭 Demo Mode**: Uses dummy data for demonstrations (no server required)
- **🌐 Production Mode**: Uses real server APIs

## Quick Start - Demo Mode

### 1. Enable Demo Mode
Open `lib/config/app_config.dart` and ensure:
```dart
static const bool useDummyData = true;
```

### 2. Demo Credentials
When in demo mode, use these credentials to login:
- **Email**: `abhijith.nair@gmail.com`
- **Password**: `demo123`

### 3. Hot Restart
After changing the mode, perform a **hot restart** (not just hot reload) for changes to take effect.

## Switching Between Modes

### To Enable Demo Mode (Dummy Data)
1. Open `lib/config/app_config.dart`
2. Set `useDummyData = true`
3. Hot restart the app
4. Use demo credentials to login

### To Enable Production Mode (Server APIs)
1. Open `lib/config/app_config.dart`
2. Set `useDummyData = false`
3. Ensure your server is running at the configured URL
4. Hot restart the app
5. Use real server credentials

## Demo Data Features

### Sample Tenant
- **Name**: Abhijith Nair
- **Email**: abhijith.nair@gmail.com
- **Building**: Wasayf Residence
- **Apartment**: 204 (Floor 2)

### Sample Complaints (5 total)
1. **Air Conditioning Not Working** (High Priority, In Progress)
2. **Kitchen Sink Leaking** (Medium Priority, Open)
3. **Elevator Making Noise** (Low Priority, Resolved)
4. **Parking Space Issue** (Medium Priority, Closed)
5. **Internet Connection Issues** (High Priority, Open)

### Demo Features
- ✅ Login/Logout functionality
- ✅ View complaints with filtering
- ✅ Create new complaints
- ✅ Add notes to complaints
- ✅ Image upload simulation
- ✅ Realistic network delays
- ✅ Status and priority filtering
- ✅ Pagination support

## Configuration Options

### Network Delays
Adjust simulation delays in `app_config.dart`:
```dart
static const int demoNetworkDelayMs = 600; // Base delay
```

### Demo Data Count
```dart
static const int demoComplaintsCount = 5; // Number of sample complaints
```

## Architecture

### Service Abstraction
```
┌─────────────────┐    ┌──────────────────┐
│   Providers     │    │  Service Factory │
│                 │────│                  │
│ AuthProvider    │    │ Creates services │
│ ComplaintProvider│   │ based on config  │
└─────────────────┘    └──────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
            ┌───────▼────────┐    ┌────────▼────────┐
            │  Dummy Services │    │  Real Services  │
            │                │    │                 │
            │ DummyAuthService│    │   AuthService   │
            │DummyComplaintSvc│    │ ComplaintService│
            └────────────────┘    └─────────────────┘
```

### Key Files
- `lib/config/app_config.dart` - Main configuration
- `lib/services/service_factory.dart` - Service creation logic
- `lib/services/interfaces/` - Service interfaces
- `lib/services/dummy/` - Dummy implementations
- `lib/data/dummy_data.dart` - Sample data
- `lib/widgets/demo_helper.dart` - Demo UI helpers

## Demo Helper Widgets

### DemoHelper Widget
Shows demo mode status and credentials with copy-to-clipboard functionality.

### DemoModeIndicator Widget
Small indicator showing "DEMO" badge when in demo mode.

## Usage in Screens

Add demo helper to login screen:
```dart
import '../widgets/demo_helper.dart';

// In your login screen build method:
Column(
  children: [
    // Your existing login UI
    const DemoHelper(), // Add this
  ],
)
```

Add demo indicator to app bar:
```dart
AppBar(
  title: Row(
    children: [
      Text('Complaints'),
      const SizedBox(width: 8),
      const DemoModeIndicator(), // Add this
    ],
  ),
)
```

## Testing Checklist

### Demo Mode Testing
- [ ] Login with demo credentials works
- [ ] Complaints list loads with sample data
- [ ] Can create new complaints
- [ ] Can add notes to complaints
- [ ] Can filter by status and priority
- [ ] Network delays are simulated
- [ ] Demo helper shows correct information

### Production Mode Testing
- [ ] Server connection works
- [ ] Real authentication works
- [ ] Real API calls function properly
- [ ] No demo helpers are visible

## Troubleshooting

### Common Issues

1. **Changes not taking effect**
   - Solution: Perform hot restart, not hot reload

2. **Demo credentials not working**
   - Check `app_config.dart` has correct credentials
   - Ensure `useDummyData = true`

3. **Server mode not connecting**
   - Verify server is running
   - Check `baseUrl` in `app_config.dart`
   - Ensure `useDummyData = false`

4. **Demo helper not showing**
   - Verify `useDummyData = true`
   - Check widget is added to screen

## Development Notes

### Adding New Demo Data
Edit `lib/data/dummy_data.dart` to add more sample complaints or modify tenant data.

### Extending Services
1. Add method to interface in `lib/services/interfaces/`
2. Implement in both real and dummy services
3. Update providers as needed

### Customizing Network Delays
Adjust delays in `app_config.dart` or individual dummy services for different simulation speeds.

---

**Happy Demoing! 🎭**
