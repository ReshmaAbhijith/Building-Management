import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../models/complaint.dart';
import 'auth_service.dart';
import 'interfaces/i_complaint_service.dart';
import '../config/app_config.dart';

class ComplaintService implements IComplaintService {
  static const String baseUrl = AppConfig.baseUrl;

  final AuthService _authService = AuthService();

  Future<Map<String, String>> _getHeaders() async {
    final token = await _authService.getToken();
    print('🔑 [Auth] Fetched token: $token'); // 💬
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  Future<List<Complaint>> getTenantComplaints({
    int page = 0,
    int size = 10,
    String? status,
    String? priority,
  }) async {
    try {
      final tenant = await _authService.getCurrentTenant();
      print('👤 [Tenant] Loaded tenant: ${tenant?.id}'); // 💬
      if (tenant == null) throw Exception('Not authenticated');

      final queryParams = {
        'page': page.toString(),
        'size': size.toString(),
        'tenantId': tenant.id.toString(),
        if (status != null) 'status': status,
        if (priority != null) 'priority': priority,
      };

      final uri = Uri.parse('$baseUrl/api/issues').replace(
        queryParameters: queryParams,
      );
      print('🌐 [GET] $uri'); // 💬

      final response = await http.get(uri, headers: await _getHeaders());

      print('📥 [Response ${response.statusCode}] ${response.body}'); // 💬

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final complaints = (data['content'] as List)
            .map((json) => Complaint.fromJson(json))
            .toList();
        print('✅ [Parsed] ${complaints.length} complaints loaded'); // 💬
        return complaints;
      } else {
        throw Exception('Failed to load complaints: ${response.body}');
      }
    } catch (e) {
      print('❌ [Error] getTenantComplaints: $e'); // 💬
      throw Exception('Error loading complaints: $e');
    }
  }

  Future<Complaint?> getComplaintById(String id) async {
    try {
      final uri = Uri.parse('$baseUrl/issues/$id');
      print('🌐 [GET] $uri'); // 💬

      final response = await http.get(
        uri,
        headers: await _getHeaders(),
      );

      print('📥 [Response ${response.statusCode}] ${response.body}'); // 💬

      if (response.statusCode == 200) {
        return Complaint.fromJson(jsonDecode(response.body));
      } else if (response.statusCode == 404) {
        return null;
      } else {
        throw Exception('Failed to load complaint: ${response.body}');
      }
    } catch (e) {
      print('❌ [Error] getComplaintById: $e'); // 💬
      throw Exception('Error loading complaint: $e');
    }
  }

  Future<Complaint> createComplaint(CreateComplaintRequest request) async {
    try {
      final tenant = await _authService.getCurrentTenant();
      print('👤 [Tenant] Loaded for creation: ${tenant?.id}'); // 💬
      if (tenant == null) throw Exception('Not authenticated');

      final complaintData = {
        ...request.toJson(),
        'tenantId': tenant.id,
        'buildingId': tenant.buildingId,
        'apartmentNo': tenant.apartmentNo,
      };

      print('📝 [POST] Complaint data: $complaintData'); // 💬

      final response = await http.post(
        Uri.parse('$baseUrl/complaints'),
        headers: await _getHeaders(),
        body: jsonEncode(complaintData),
      );

      print('📥 [Response ${response.statusCode}] ${response.body}'); // 💬

      if (response.statusCode == 201) {
        return Complaint.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to create complaint: ${response.body}');
      }
    } catch (e) {
      print('❌ [Error] createComplaint: $e'); // 💬
      throw Exception('Error creating complaint: $e');
    }
  }

  Future<String> uploadImage(File imageFile) async {
    try {
      final token = await _authService.getToken();
      if (token == null) throw Exception('Not authenticated');

      print('🖼️ [Upload] File path: ${imageFile.path}'); // 💬

      final request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/complaints/upload-image'),
      );

      request.headers['Authorization'] = 'Bearer $token';
      request.files.add(
        await http.MultipartFile.fromPath('image', imageFile.path),
      );

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      print('📥 [Upload Response ${response.statusCode}] ${response.body}'); // 💬

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['imageUrl'];
      } else {
        throw Exception('Failed to upload image: ${response.body}');
      }
    } catch (e) {
      print('❌ [Error] uploadImage: $e'); // 💬
      throw Exception('Error uploading image: $e');
    }
  }

  Future<ComplaintNote> addNote(String complaintId, String content) async {
    try {
      print('📝 [Note] Adding note to complaint $complaintId'); // 💬

      final response = await http.post(
        Uri.parse('$baseUrl/complaints/$complaintId/notes'),
        headers: await _getHeaders(),
        body: jsonEncode({
          'content': content,
          'isInternal': false,
        }),
      );

      print('📥 [Response ${response.statusCode}] ${response.body}'); // 💬

      if (response.statusCode == 201) {
        return ComplaintNote.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to add note: ${response.body}');
      }
    } catch (e) {
      print('❌ [Error] addNote: $e'); // 💬
      throw Exception('Error adding note: $e');
    }
  }

  Future<List<String>> getComplaintCategories() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/complaints/categories'),
        headers: await _getHeaders(),
      );

      print('📥 [Category Response ${response.statusCode}] ${response.body}'); // 💬

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<String>.from(data['categories']);
      } else {
        print('⚠️ [Category Fallback] Using defaults'); // 💬
        return _defaultCategories();
      }
    } catch (e) {
      print('❌ [Error] getComplaintCategories: $e'); // 💬
      return _defaultCategories();
    }
  }

  List<String> _defaultCategories() => [
    'Plumbing',
    'Electrical',
    'HVAC',
    'Appliances',
    'Pest Control',
    'Maintenance',
    'Security',
    'Noise',
    'Other',
  ];

  Future<Map<String, int>> getComplaintStats() async {
    try {
      final tenant = await _authService.getCurrentTenant();
      if (tenant == null) throw Exception('Not authenticated');

      final uri =
      Uri.parse('$baseUrl/complaints/stats/tenant/${tenant.id}');
      print('📊 [Stats] Fetching stats for tenant: ${tenant.id}'); // 💬

      final response = await http.get(uri, headers: await _getHeaders());

      print('📥 [Stats Response ${response.statusCode}] ${response.body}'); // 💬

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'total': data['totalComplaints'] ?? 0,
          'open': data['openComplaints'] ?? 0,
          'inProgress': data['inProgressComplaints'] ?? 0,
          'resolved': data['resolvedComplaints'] ?? 0,
          'closed': data['closedComplaints'] ?? 0,
        };
      } else {
        return {
          'total': 0,
          'open': 0,
          'inProgress': 0,
          'resolved': 0,
          'closed': 0,
        };
      }
    } catch (e) {
      print('❌ [Error] getComplaintStats: $e'); // 💬
      return {
        'total': 0,
        'open': 0,
        'inProgress': 0,
        'resolved': 0,
        'closed': 0,
      };
    }
  }

  Future<List<Complaint>> searchComplaints(String query) async {
    try {
      final tenant = await _authService.getCurrentTenant();
      if (tenant == null) throw Exception('Not authenticated');

      final uri = Uri.parse('$baseUrl/complaints/search').replace(
        queryParameters: {
          'q': query,
          'tenantId': tenant.id,
        },
      );

      print('🔎 [Search] URI: $uri'); // 💬

      final response = await http.get(uri, headers: await _getHeaders());

      print('📥 [Search Response ${response.statusCode}] ${response.body}'); // 💬

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return (data['complaints'] as List)
            .map((json) => Complaint.fromJson(json))
            .toList();
      } else {
        throw Exception('Failed to search complaints: ${response.body}');
      }
    } catch (e) {
      print('❌ [Error] searchComplaints: $e'); // 💬
      throw Exception('Error searching complaints: $e');
    }
  }
}
