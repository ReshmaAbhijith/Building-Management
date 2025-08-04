import '../interfaces/i_complaint_service.dart';
import '../../models/complaint.dart';
import '../../data/dummy_data.dart';
import '../../config/app_config.dart';

class DummyComplaintService implements IComplaintService {
  // In-memory storage for demo purposes
  static List<Complaint> _complaints = List.from(DummyData.sampleComplaints);
  static int _nextComplaintId = 6;

  @override
  Future<List<Complaint>> getTenantComplaints({
    int page = 0,
    int size = 10,
    String? status,
    String? priority,
  }) async {
    // Simulate network delay
    await Future.delayed(Duration(milliseconds: AppConfig.demoNetworkDelayMs));
    
    print('🎭 [DUMMY] Fetching complaints - Page: $page, Size: $size, Status: $status, Priority: $priority');
    
    // Filter complaints by tenant
    var filteredComplaints = _complaints
        .where((complaint) => complaint.tenantId == AppConfig.demoTenantId)
        .toList();
    
    // Apply status filter if provided
    if (status != null && status.isNotEmpty) {
      final statusEnum = ComplaintStatus.values.firstWhere(
        (s) => s.toString().split('.').last.toLowerCase() == status.toLowerCase(),
        orElse: () => ComplaintStatus.open,
      );
      filteredComplaints = filteredComplaints
          .where((complaint) => complaint.status == statusEnum)
          .toList();
    }
    
    // Apply priority filter if provided
    if (priority != null && priority.isNotEmpty) {
      final priorityEnum = ComplaintPriority.values.firstWhere(
        (p) => p.toString().split('.').last.toLowerCase() == priority.toLowerCase(),
        orElse: () => ComplaintPriority.medium,
      );
      filteredComplaints = filteredComplaints
          .where((complaint) => complaint.priority == priorityEnum)
          .toList();
    }
    
    // Sort by creation date (newest first)
    filteredComplaints.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    
    // Apply pagination
    final startIndex = page * size;
    final endIndex = (startIndex + size).clamp(0, filteredComplaints.length);
    
    if (startIndex >= filteredComplaints.length) {
      print('🎭 [DUMMY] No complaints found for page $page');
      return [];
    }
    
    final paginatedComplaints = filteredComplaints.sublist(startIndex, endIndex);
    print('🎭 [DUMMY] Returning ${paginatedComplaints.length} complaints');
    
    return paginatedComplaints;
  }

  @override
  Future<Complaint> createComplaint(CreateComplaintRequest request) async {
    // Simulate network delay
    await Future.delayed(Duration(milliseconds: AppConfig.demoNetworkDelayMs + 400));
    
    print('🎭 [DUMMY] Creating new complaint: ${request.title}');
    
    final newComplaint = Complaint(
      id: 'complaint_${_nextComplaintId.toString().padLeft(3, '0')}',
      title: request.title,
      description: request.description,
      category: request.category,
      priority: request.priority,
      status: ComplaintStatus.open,
      tenantId: AppConfig.demoTenantId,
      tenantName: DummyData.sampleTenant.fullName,
      buildingId: DummyData.sampleTenant.buildingId,
      buildingName: DummyData.sampleTenant.buildingName,
      apartmentNo: DummyData.sampleTenant.apartmentNo,
      floor: DummyData.sampleTenant.floor,
      images: request.images ?? [],
      notes: [],
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );
    
    _complaints.add(newComplaint);
    _nextComplaintId++;
    
    print('🎭 [DUMMY] Created complaint with ID: ${newComplaint.id}');
    return newComplaint;
  }

  @override
  Future<Complaint> getComplaintById(String id) async {
    // Simulate network delay
    await Future.delayed(Duration(milliseconds: AppConfig.demoNetworkDelayMs - 200));
    
    print('🎭 [DUMMY] Fetching complaint by ID: $id');
    
    final complaint = _complaints.firstWhere(
      (c) => c.id == id,
      orElse: () => throw Exception('Complaint not found'),
    );
    
    print('🎭 [DUMMY] Found complaint: ${complaint.title}');
    return complaint;
  }

  @override
  Future<void> addComplaintNote(String complaintId, String note) async {
    // Simulate network delay
    await Future.delayed(Duration(milliseconds: AppConfig.demoNetworkDelayMs - 100));
    
    print('🎭 [DUMMY] Adding note to complaint: $complaintId');
    
    final complaintIndex = _complaints.indexWhere((c) => c.id == complaintId);
    if (complaintIndex == -1) {
      throw Exception('Complaint not found');
    }
    
    final complaint = _complaints[complaintIndex];
    final newNote = ComplaintNote(
      id: 'note_${DateTime.now().millisecondsSinceEpoch}',
      complaintId: complaintId,
      authorId: AppConfig.demoTenantId,
      authorName: DummyData.sampleTenant.fullName,
      authorType: 'TENANT',
      content: note,
      createdAt: DateTime.now(),
    );
    
    final updatedNotes = List<ComplaintNote>.from(complaint.notes)..add(newNote);
    
    final updatedComplaint = Complaint(
      id: complaint.id,
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      priority: complaint.priority,
      status: complaint.status,
      tenantId: complaint.tenantId,
      tenantName: complaint.tenantName,
      buildingId: complaint.buildingId,
      buildingName: complaint.buildingName,
      apartmentNo: complaint.apartmentNo,
      floor: complaint.floor,
      assignedTo: complaint.assignedTo,
      assignedToName: complaint.assignedToName,
      images: complaint.images,
      notes: updatedNotes,
      createdAt: complaint.createdAt,
      updatedAt: DateTime.now(),
      resolvedAt: complaint.resolvedAt,
    );
    
    _complaints[complaintIndex] = updatedComplaint;
    print('🎭 [DUMMY] Added note to complaint successfully');
  }

  @override
  Future<List<String>> uploadImages(List<String> imagePaths) async {
    // Simulate network delay for image upload
    await Future.delayed(Duration(milliseconds: AppConfig.demoNetworkDelayMs + 900));
    
    print('🎭 [DUMMY] Uploading ${imagePaths.length} images');
    
    // Simulate uploaded image URLs
    final uploadedUrls = imagePaths.map((path) {
      final fileName = path.split('/').last;
      return 'https://dummy-storage.example.com/uploads/$fileName';
    }).toList();
    
    print('🎭 [DUMMY] Images uploaded successfully');
    return uploadedUrls;
  }
}
