import '../config/app_config.dart';
import 'interfaces/i_auth_service.dart';
import 'interfaces/i_complaint_service.dart';
import 'auth_service.dart';
import 'complaint_service.dart';
import 'dummy/dummy_auth_service.dart';
import 'dummy/dummy_complaint_service.dart';

class ServiceFactory {
  static IAuthService createAuthService() {
    if (AppConfig.useDummyData) {
      print('🎭 [FACTORY] Creating DummyAuthService');
      return DummyAuthService();
    } else {
      print('🌐 [FACTORY] Creating AuthService (Real API)');
      return AuthService();
    }
  }

  static IComplaintService createComplaintService() {
    if (AppConfig.useDummyData) {
      print('🎭 [FACTORY] Creating DummyComplaintService');
      return DummyComplaintService();
    } else {
      print('🌐 [FACTORY] Creating ComplaintService (Real API)');
      return ComplaintService();
    }
  }

  // Convenience method to get current mode
  static String getCurrentMode() {
    return AppConfig.useDummyData ? 'Demo Mode (Dummy Data)' : 'Production Mode (Server API)';
  }

  // Method to check if we're in demo mode
  static bool isDemoMode() {
    return AppConfig.useDummyData;
  }
}
