import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../models/complaint.dart';
import 'auth_service.dart';

class ComplaintService {
  static const String baseUrl = 'http://localhost:8080/api';
  final AuthService _authService = AuthService();

  // Get headers with authentication
  Future<Map<String, String>> _getHeaders() async {
    final token = await _authService.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  // Get tenant's complaints
  Future<List<Complaint>> getTenantComplaints({
    int page = 0,
    int size = 10,
    String? status,
    String? priority,
  }) async {
    try {
      final tenant = await _authService.getCurrentTenant();
      if (tenant == null) throw Exception('Not authenticated');

      final queryParams = {
        'page': page.toString(),
        'size': size.toString(),
        'tenantId': tenant.id,
        if (status != null) 'status': status,
        if (priority != null) 'priority': priority,
      };

      final uri = Uri.parse('$baseUrl/complaints').replace(
        queryParameters: queryParams,
      );

      final response = await http.get(uri, headers: await _getHeaders());

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final complaints = (data['content'] as List)
            .map((json) => Complaint.fromJson(json))
            .toList();
        return complaints;
      } else {
        throw Exception('Failed to load complaints: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error loading complaints: $e');
    }
  }

  // Get complaint by ID
  Future<Complaint?> getComplaintById(String id) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/complaints/$id'),
        headers: await _getHeaders(),
      );

      if (response.statusCode == 200) {
        return Complaint.fromJson(jsonDecode(response.body));
      } else if (response.statusCode == 404) {
        return null;
      } else {
        throw Exception('Failed to load complaint: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error loading complaint: $e');
    }
  }

  // Create new complaint
  Future<Complaint> createComplaint(CreateComplaintRequest request) async {
    try {
      final tenant = await _authService.getCurrentTenant();
      if (tenant == null) throw Exception('Not authenticated');

      final complaintData = {
        ...request.toJson(),
        'tenantId': tenant.id,
        'buildingId': tenant.buildingId,
        'apartmentNo': tenant.apartmentNo,
      };

      final response = await http.post(
        Uri.parse('$baseUrl/complaints'),
        headers: await _getHeaders(),
        body: jsonEncode(complaintData),
      );

      if (response.statusCode == 201) {
        return Complaint.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to create complaint: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error creating complaint: $e');
    }
  }

  // Upload image for complaint
  Future<String> uploadImage(File imageFile) async {
    try {
      final token = await _authService.getToken();
      if (token == null) throw Exception('Not authenticated');

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

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['imageUrl'];
      } else {
        throw Exception('Failed to upload image: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error uploading image: $e');
    }
  }

  // Add note to complaint
  Future<ComplaintNote> addNote(String complaintId, String content) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/complaints/$complaintId/notes'),
        headers: await _getHeaders(),
        body: jsonEncode({
          'content': content,
          'isInternal': false, // Tenant notes are not internal
        }),
      );

      if (response.statusCode == 201) {
        return ComplaintNote.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to add note: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error adding note: $e');
    }
  }

  // Get complaint categories
  Future<List<String>> getComplaintCategories() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/complaints/categories'),
        headers: await _getHeaders(),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<String>.from(data['categories']);
      } else {
        // Return default categories if API fails
        return [
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
      }
    } catch (e) {
      // Return default categories if error occurs
      return [
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
    }
  }

  // Get complaint statistics for tenant
  Future<Map<String, int>> getComplaintStats() async {
    try {
      final tenant = await _authService.getCurrentTenant();
      if (tenant == null) throw Exception('Not authenticated');

      final response = await http.get(
        Uri.parse('$baseUrl/complaints/stats/tenant/${tenant.id}'),
        headers: await _getHeaders(),
      );

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
      return {
        'total': 0,
        'open': 0,
        'inProgress': 0,
        'resolved': 0,
        'closed': 0,
      };
    }
  }

  // Search complaints
  Future<List<Complaint>> searchComplaints(String query) async {
    try {
      final tenant = await _authService.getCurrentTenant();
      if (tenant == null) throw Exception('Not authenticated');

      final response = await http.get(
        Uri.parse('$baseUrl/complaints/search')
            .replace(queryParameters: {
          'q': query,
          'tenantId': tenant.id,
        }),
        headers: await _getHeaders(),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return (data['complaints'] as List)
            .map((json) => Complaint.fromJson(json))
            .toList();
      } else {
        throw Exception('Failed to search complaints: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error searching complaints: $e');
    }
  }
}
