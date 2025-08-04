import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/tenant.dart';

class AuthService {
  static const String baseUrl = 'http://192.168.1.37:8080/building-maintenance'; // Java backend URL
  static const String tokenKey = 'auth_token';
  static const String tenantKey = 'tenant_data';

  // Login tenant
  Future<Tenant?> login(String email, String password) async {
    try {
      final url = Uri.parse('$baseUrl/auth/login');
      print('Making POST request to: $url');
      print('Request headers: {"Content-Type": "application/json"}');
      print('Request body: ${jsonEncode({
        'username': email,
        'password': password,
      })}');

      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': email,
          'password': password,
        }),
      );
print(response);
print(response.statusCode);
print(response.body);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final token = data['token'];
        final tenant = Tenant.fromJson(data['tenant']);

        // Store token and tenant data
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(tokenKey, token);
        await prefs.setString(tenantKey, jsonEncode(tenant.toJson()));

        return tenant;
      } else {
        print('Login error:'); // Add this
        throw Exception('Login failed: ${response.body}');
      }
    } catch (e) {
      print('Login error: $e'); // Add this
      throw Exception('Login error: $e');
    }
  }

  // Get stored token
  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(tokenKey);
  }

  // Get stored tenant
  Future<Tenant?> getCurrentTenant() async {
    final prefs = await SharedPreferences.getInstance();
    final tenantJson = prefs.getString(tenantKey);
    if (tenantJson != null) {
      return Tenant.fromJson(jsonDecode(tenantJson));
    }
    return null;
  }

  // Check if user is logged in
  Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null;
  }

  // Logout
  Future<void> logout() async {
    try {
      final token = await getToken();
      if (token != null) {
        await http.post(
          Uri.parse('$baseUrl/auth/logout'),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $token',
          },
        );
      }
    } catch (e) {
      // Continue with logout even if API call fails
    } finally {
      // Clear local storage
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(tokenKey);
      await prefs.remove(tenantKey);
    }
  }

  // Refresh token
  Future<bool> refreshToken() async {
    try {
      final token = await getToken();
      if (token == null) return false;

      final response = await http.post(
        Uri.parse('$baseUrl/auth/refresh'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final newToken = data['token'];
        
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(tokenKey, newToken);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  // Update tenant profile
  Future<Tenant?> updateProfile(Map<String, dynamic> updates) async {
    try {
      final token = await getToken();
      final tenant = await getCurrentTenant();
      
      if (token == null || tenant == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.put(
        Uri.parse('$baseUrl/tenants/${tenant.id}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(updates),
      );

      if (response.statusCode == 200) {
        final updatedTenant = Tenant.fromJson(jsonDecode(response.body));
        
        // Update stored tenant data
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(tenantKey, jsonEncode(updatedTenant.toJson()));
        
        return updatedTenant;
      } else {
        throw Exception('Profile update failed: ${response.body}');
      }
    } catch (e) {
      throw Exception('Profile update error: $e');
    }
  }

  // Change password
  Future<bool> changePassword(String currentPassword, String newPassword) async {
    try {
      final token = await getToken();
      if (token == null) throw Exception('Not authenticated');

      final response = await http.post(
        Uri.parse('$baseUrl/auth/change-password'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'currentPassword': currentPassword,
          'newPassword': newPassword,
        }),
      );

      return response.statusCode == 200;
    } catch (e) {
      throw Exception('Password change error: $e');
    }
  }
}
