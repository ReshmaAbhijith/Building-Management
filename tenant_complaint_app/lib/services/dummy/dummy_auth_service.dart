import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../interfaces/i_auth_service.dart';
import '../../models/tenant.dart';
import '../../data/dummy_data.dart';
import '../../config/app_config.dart';

class DummyAuthService implements IAuthService {
  static const String tokenKey = 'auth_token';
  static const String tenantKey = 'tenant_data';

  @override
  Future<Tenant?> login(String email, String password) async {
    // Simulate network delay
    await Future.delayed(Duration(milliseconds: AppConfig.demoNetworkDelayMs));
    
    // Simple validation for demo
    if (email == AppConfig.demoTenantEmail && password == AppConfig.demoPassword) {
      // Generate a dummy token
      final token = 'dummy_token_${DateTime.now().millisecondsSinceEpoch}';
      final tenant = DummyData.sampleTenant;

      // Store token and tenant data
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(tokenKey, token);
      await prefs.setString(tenantKey, jsonEncode(tenant.toJson()));

      print('🎭 [DUMMY] Login successful for: ${tenant.fullName}');
      return tenant;
    } else {
      print('🎭 [DUMMY] Login failed - Invalid credentials');
      throw Exception('Invalid email or password');
    }
  }

  @override
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(tokenKey);
    await prefs.remove(tenantKey);
    print('🎭 [DUMMY] User logged out');
  }

  @override
  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(tokenKey);
    print('🎭 [DUMMY] Retrieved token: ${token != null ? 'exists' : 'null'}');
    return token;
  }

  @override
  Future<Tenant?> getCurrentTenant() async {
    final prefs = await SharedPreferences.getInstance();
    final tenantJson = prefs.getString(tenantKey);
    
    if (tenantJson != null) {
      final tenant = Tenant.fromJson(jsonDecode(tenantJson));
      print('🎭 [DUMMY] Retrieved tenant: ${tenant.fullName}');
      return tenant;
    }
    
    print('🎭 [DUMMY] No tenant found in storage');
    return null;
  }

  @override
  Future<bool> isLoggedIn() async {
    final token = await getToken();
    final tenant = await getCurrentTenant();
    final isLoggedIn = token != null && tenant != null;
    print('🎭 [DUMMY] Is logged in: $isLoggedIn');
    return isLoggedIn;
  }
}
