import 'package:flutter/foundation.dart';
import '../models/complaint.dart';
import '../services/interfaces/i_complaint_service.dart';
import '../services/service_factory.dart';

class ComplaintProvider with ChangeNotifier {
  final IComplaintService _complaintService = ServiceFactory.createComplaintService();
  
  List<Complaint> _complaints = [];
  List<String> _categories = [];
  Map<String, int> _stats = {};
  bool _isLoading = false;
  String? _error;

  // Getters
  List<Complaint> get complaints => _complaints;
  List<String> get categories => _categories;
  Map<String, int> get stats => _stats;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Load tenant's complaints
  Future<void> loadComplaints({
    int page = 0,
    int size = 20,
    String? status,
    String? priority,
  }) async {
    _setLoading(true);
    _clearError();
    
    try {
      final complaints = await _complaintService.getTenantComplaints(
        page: page,
        size: size,
        status: status,
        priority: priority,
      );
      
      if (page == 0) {
        _complaints = complaints;
      } else {
        _complaints.addAll(complaints);
      }
      
      _setLoading(false);
      notifyListeners();
    } catch (e) {
      _setError('Failed to load complaints: $e');
    }
  }

  // Load complaint categories
  Future<void> loadCategories() async {
    try {
      _categories = await _complaintService.getComplaintCategories();
      notifyListeners();
    } catch (e) {
      _setError('Failed to load categories: $e');
    }
  }

  // Load complaint statistics
  Future<void> loadStats() async {
    try {
      _stats = await _complaintService.getComplaintStats();
      notifyListeners();
    } catch (e) {
      _setError('Failed to load stats: $e');
    }
  }

  // Create new complaint
  Future<bool> createComplaint(CreateComplaintRequest request) async {
    _setLoading(true);
    _clearError();
    
    try {
      final complaint = await _complaintService.createComplaint(request);
      _complaints.insert(0, complaint);
      
      // Update stats
      await loadStats();
      
      _setLoading(false);
      notifyListeners();
      return true;
    } catch (e) {
      _setError('Failed to create complaint: $e');
      return false;
    }
  }

  // Get complaint by ID
  Future<Complaint?> getComplaintById(String id) async {
    try {
      // First check if we already have it in memory
      final existingComplaint = _complaints.firstWhere(
        (c) => c.id == id,
        orElse: () => throw StateError('Not found'),
      );
      return existingComplaint;
    } catch (e) {
      // If not in memory, fetch from API
      try {
        return await _complaintService.getComplaintById(id);
      } catch (e) {
        _setError('Failed to load complaint: $e');
        return null;
      }
    }
  }

  // Add note to complaint
  Future<bool> addNote(String complaintId, String content) async {
    _setLoading(true);
    _clearError();
    
    try {
      final note = await _complaintService.addNote(complaintId, content);
      
      // Update the complaint in memory
      final complaintIndex = _complaints.indexWhere((c) => c.id == complaintId);
      if (complaintIndex != -1) {
        final updatedComplaint = Complaint(
          id: _complaints[complaintIndex].id,
          title: _complaints[complaintIndex].title,
          description: _complaints[complaintIndex].description,
          category: _complaints[complaintIndex].category,
          priority: _complaints[complaintIndex].priority,
          status: _complaints[complaintIndex].status,
          tenantId: _complaints[complaintIndex].tenantId,
          tenantName: _complaints[complaintIndex].tenantName,
          buildingId: _complaints[complaintIndex].buildingId,
          buildingName: _complaints[complaintIndex].buildingName,
          apartmentNo: _complaints[complaintIndex].apartmentNo,
          floor: _complaints[complaintIndex].floor,
          assignedTo: _complaints[complaintIndex].assignedTo,
          assignedToName: _complaints[complaintIndex].assignedToName,
          images: _complaints[complaintIndex].images,
          notes: [..._complaints[complaintIndex].notes, note],
          createdAt: _complaints[complaintIndex].createdAt,
          updatedAt: DateTime.now(),
          resolvedAt: _complaints[complaintIndex].resolvedAt,
        );
        _complaints[complaintIndex] = updatedComplaint;
      }
      
      _setLoading(false);
      notifyListeners();
      return true;
    } catch (e) {
      _setError('Failed to add note: $e');
      return false;
    }
  }

  // Search complaints
  Future<void> searchComplaints(String query) async {
    if (query.isEmpty) {
      await loadComplaints();
      return;
    }
    
    _setLoading(true);
    _clearError();
    
    try {
      final searchResults = await _complaintService.searchComplaints(query);
      _complaints = searchResults;
      _setLoading(false);
      notifyListeners();
    } catch (e) {
      _setError('Failed to search complaints: $e');
    }
  }

  // Filter complaints by status
  List<Complaint> getComplaintsByStatus(ComplaintStatus status) {
    return _complaints.where((c) => c.status == status).toList();
  }

  // Filter complaints by priority
  List<Complaint> getComplaintsByPriority(ComplaintPriority priority) {
    return _complaints.where((c) => c.priority == priority).toList();
  }

  // Get recent complaints (last 7 days)
  List<Complaint> getRecentComplaints() {
    final sevenDaysAgo = DateTime.now().subtract(const Duration(days: 7));
    return _complaints
        .where((c) => c.createdAt.isAfter(sevenDaysAgo))
        .toList()
      ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
  }

  // Refresh all data
  Future<void> refresh() async {
    await Future.wait([
      loadComplaints(),
      loadCategories(),
      loadStats(),
    ]);
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

  // Clear all data
  void clear() {
    _complaints.clear();
    _categories.clear();
    _stats.clear();
    _isLoading = false;
    _error = null;
    notifyListeners();
  }
}
