import '../../models/tenant.dart';

abstract class IAuthService {
  Future<Tenant?> login(String email, String password);
  Future<void> logout();
  Future<String?> getToken();
  Future<Tenant?> getCurrentTenant();
  Future<bool> isLoggedIn();
}
