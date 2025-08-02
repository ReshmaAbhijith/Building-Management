# Building Maintenance Tenant Mobile App

A Flutter mobile application that allows tenants to submit and track maintenance complaints for their building. This app is designed to work seamlessly with the Building Maintenance Staff Portal (Angular) and Java backend REST APIs.

## Features

### 🔐 Authentication
- Secure tenant login with JWT token management
- Automatic session management and token refresh
- Demo credentials for testing

### 📱 Dashboard
- Overview of complaint statistics
- Recent complaints display
- Quick access to create new complaints
- Tenant profile summary

### 🛠️ Complaint Management
- Submit new complaints with detailed information
- Upload photos (up to 5 images per complaint)
- Select complaint category and priority level
- Track complaint status in real-time
- View complaint history with filtering

### 👤 Profile Management
- View tenant information and lease details
- Building and apartment information
- Emergency contact details
- Account management options

### 📊 Real-time Updates
- Live complaint status updates
- Push notifications (planned)
- Automatic data synchronization

## Tech Stack

- **Framework**: Flutter 3.x
- **State Management**: Provider pattern
- **HTTP Client**: Dio for API communication
- **Local Storage**: SharedPreferences
- **Image Handling**: Image Picker
- **UI Components**: Material Design 3
- **Typography**: Google Fonts (Inter)

## Project Structure

```
lib/
├── main.dart                 # App entry point
├── models/                   # Data models
│   ├── tenant.dart          # Tenant model with JSON serialization
│   └── complaint.dart       # Complaint model with enums and serialization
├── services/                 # API services
│   ├── auth_service.dart    # Authentication service
│   └── complaint_service.dart # Complaint CRUD operations
├── providers/               # State management
│   ├── auth_provider.dart   # Authentication state
│   └── complaint_provider.dart # Complaint state
├── screens/                 # UI screens
│   ├── splash_screen.dart   # App splash screen
│   ├── auth/
│   │   └── login_screen.dart # Login screen
│   ├── home/
│   │   └── home_screen.dart # Main dashboard
│   ├── complaints/
│   │   ├── complaint_list_screen.dart # Complaint list with tabs
│   │   └── create_complaint_screen.dart # New complaint form
│   └── profile/
│       └── profile_screen.dart # Tenant profile
├── widgets/                 # Reusable UI components
│   ├── custom_text_field.dart # Custom form field
│   ├── loading_button.dart  # Button with loading state
│   ├── stats_card.dart      # Dashboard statistics card
│   └── complaint_card.dart  # Complaint list item
└── utils/
    └── app_colors.dart      # App color scheme and utilities
```

## Installation & Setup

### Prerequisites
- Flutter SDK 3.0 or higher
- Dart SDK 3.0 or higher
- Android Studio / VS Code with Flutter extensions
- Android/iOS device or emulator

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tenant_complaint_app
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Configure API endpoints**
   Update the base URL in `lib/services/auth_service.dart` and `lib/services/complaint_service.dart`:
   ```dart
   static const String baseUrl = 'http://your-backend-url:8080/api';
   ```

4. **Run the app**
   ```bash
   flutter run
   ```

## Demo Credentials

For testing purposes, use these demo credentials:

- **Email**: tenant1@example.com
- **Password**: password123

## API Integration

The app is designed to integrate with the Java backend REST APIs. Key endpoints include:

### Authentication
- `POST /api/auth/login` - Tenant login
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/profile` - Get tenant profile

### Complaints
- `GET /api/tenant/complaints` - Get tenant complaints
- `POST /api/tenant/complaints` - Create new complaint
- `PUT /api/tenant/complaints/{id}` - Update complaint
- `POST /api/tenant/complaints/{id}/images` - Upload images

### Categories & Statistics
- `GET /api/complaints/categories` - Get complaint categories
- `GET /api/tenant/complaints/stats` - Get complaint statistics

## Key Features Implementation

### State Management
The app uses the Provider pattern for state management:
- `AuthProvider`: Manages authentication state and user session
- `ComplaintProvider`: Handles complaint data and operations

### Image Upload
Complaints support photo attachments:
- Camera capture or gallery selection
- Image compression and optimization
- Multiple image support (up to 5 per complaint)

### Offline Support
- Local storage of authentication tokens
- Cached user profile data
- Offline-first complaint creation (sync when online)

### Security
- JWT token-based authentication
- Secure token storage using SharedPreferences
- Automatic token refresh
- Session timeout handling

## Customization

### Colors & Theming
Modify `lib/utils/app_colors.dart` to customize the app's color scheme:
```dart
class AppColors {
  static const Color primary = Color(0xFF2196F3);
  static const Color secondary = Color(0xFF03DAC6);
  // ... other colors
}
```

### API Configuration
Update service base URLs in:
- `lib/services/auth_service.dart`
- `lib/services/complaint_service.dart`

## Testing

### Demo Mode
The app includes mock data for testing without a backend:
- Demo tenant profiles
- Sample complaints with various statuses
- Simulated API responses with delays

### Unit Tests
Run unit tests:
```bash
flutter test
```

### Integration Tests
Run integration tests:
```bash
flutter test integration_test/
```

## Building for Production

### Android
```bash
flutter build apk --release
# or for app bundle
flutter build appbundle --release
```

### iOS
```bash
flutter build ios --release
```

## Deployment

### Android Play Store
1. Build signed APK/AAB
2. Upload to Google Play Console
3. Configure app listing and screenshots

### iOS App Store
1. Build for iOS release
2. Upload to App Store Connect
3. Submit for review

## Troubleshooting

### Common Issues

1. **Build errors**: Run `flutter clean && flutter pub get`
2. **API connection**: Verify backend URL and network connectivity
3. **Authentication issues**: Check JWT token format and expiration
4. **Image upload**: Ensure proper permissions for camera/gallery access

### Debug Mode
Enable debug logging by setting:
```dart
const bool kDebugMode = true;
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

## Roadmap

### Upcoming Features
- [ ] Push notifications for complaint updates
- [ ] Offline complaint creation and sync
- [ ] Document attachment support
- [ ] Complaint rating and feedback
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Biometric authentication

### Version History
- **v1.0.0**: Initial release with core complaint management features
- **v1.1.0**: Enhanced UI and performance improvements (planned)
- **v1.2.0**: Push notifications and offline support (planned)
