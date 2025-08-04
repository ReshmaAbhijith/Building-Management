class AppConfig {
  // ========================================
  // 🎭 DEMO MODE CONFIGURATION
  // ========================================
  // Toggle this to switch between dummy data and server communication
  // 
  // ✅ true  = DEMO MODE (use dummy data - no server required)
  // ❌ false = PRODUCTION MODE (use real server APIs)
  // 
  // To switch modes:
  // 1. Change this value
  // 2. Hot restart the app (not just hot reload)
  static const bool useDummyData = true;
  
  // ========================================
  // 🌐 SERVER CONFIGURATION
  // ========================================
  // Used when useDummyData = false
  static const String baseUrl = 'http://192.168.1.37:8080/building-maintenance';
  
  // ========================================
  // 🎭 DEMO CREDENTIALS
  // ========================================
  // Use these credentials when in demo mode
  static const String demoTenantId = 'tenant_001';
  static const String demoTenantEmail = 'abhijith.nair@gmail.com';
  static const String demoPassword = 'demo123';
  
  // ========================================
  // 📊 DEMO DATA CONFIGURATION
  // ========================================
  static const int demoComplaintsCount = 5;
  static const int demoNetworkDelayMs = 600; // Simulate network delay
}
