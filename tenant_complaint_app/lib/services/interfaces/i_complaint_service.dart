import '../../models/complaint.dart';
import 'dart:io';

abstract class IComplaintService {
  Future<List<Complaint>> getTenantComplaints({
    int page = 0,
    int size = 10,
    String? status,
    String? priority,
  });
  
  Future<Complaint> createComplaint(CreateComplaintRequest request);
  Future<Complaint?> getComplaintById(String id);
  Future<void> addComplaintNote(String complaintId, String note);
  Future<List<String>> uploadImages(List<String> imagePaths);
  
  // Additional methods from existing service
  Future<String> uploadImage(File imageFile);
  Future<ComplaintNote> addNote(String complaintId, String content);
  Future<List<String>> getComplaintCategories();
  Future<Map<String, int>> getComplaintStats();
  Future<List<Complaint>> searchComplaints(String query);
}
