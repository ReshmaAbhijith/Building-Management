import '../../models/tenant.dart';

abstract class IAuthService {
  Future<Tenant?> login(String email, String password);
  Future<void> logout();
  Future<String?> getToken();
  Future<Tenant?> getCurrentTenant();
  Future<bool> isLoggedIn();
  
  // Additional methods from existing service
  Future<bool> refreshToken();
  Future<Tenant?> updateProfile(Map<String, dynamic> updates);
  Future<bool> changePassword(String currentPassword, String newPassword);
}
