import 'package:flutter/foundation.dart';
import '../models/tenant.dart';
import '../services/interfaces/i_auth_service.dart';
import '../services/service_factory.dart';

class AuthProvider with ChangeNotifier {
  final IAuthService _authService = ServiceFactory.createAuthService();
  
  Tenant? _currentTenant;
  bool _isLoading = false;
  String? _error;

  // Getters
  Tenant? get currentTenant => _currentTenant;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _currentTenant != null;

  // Initialize - check if user is already logged in
  Future<void> initialize() async {
    _setLoading(true);
    try {
      final isLoggedIn = await _authService.isLoggedIn();
      if (isLoggedIn) {
        _currentTenant = await _authService.getCurrentTenant();
      }
      _clearError();
    } catch (e) {
      _setError('Failed to initialize: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Login
  Future<bool> login(String email, String password) async {
    _setLoading(true);
    _clearError();
    
    try {
      final tenant = await _authService.login(email, password);
      if (tenant != null) {
        _currentTenant = tenant;
        _setLoading(false);
        notifyListeners();
        return true;
      } else {
        _setError('Login failed');
        return false;
      }
    } catch (e) {
      _setError('Login failed: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Logout
  Future<void> logout() async {
    _setLoading(true);
    try {
      await _authService.logout();
      _currentTenant = null;
      _clearError();
    } catch (e) {
      _setError('Logout failed: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Update profile
  Future<bool> updateProfile(Map<String, dynamic> updates) async {
    _setLoading(true);
    _clearError();
    
    try {
      final updatedTenant = await _authService.updateProfile(updates);
      if (updatedTenant != null) {
        _currentTenant = updatedTenant;
        _setLoading(false);
        notifyListeners();
        return true;
      } else {
        _setError('Profile update failed');
        return false;
      }
    } catch (e) {
      _setError('Profile update failed: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Change password
  Future<bool> changePassword(String currentPassword, String newPassword) async {
    _setLoading(true);
    _clearError();
    
    try {
      final success = await _authService.changePassword(currentPassword, newPassword);
      if (success) {
        _clearError();
      } else {
        _setError('Password change failed');
      }
      return success;
    } catch (e) {
      _setError('Password change failed: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Refresh token
  Future<bool> refreshToken() async {
    try {
      return await _authService.refreshToken();
    } catch (e) {
      _setError('Token refresh failed: $e');
      return false;
    }
  }

  // Private helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _error = error;
    _isLoading = false;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
    notifyListeners();
  }

  // Clear all data (for testing or reset)
  void clear() {
    _currentTenant = null;
    _isLoading = false;
    _error = null;
    notifyListeners();
  }
}
