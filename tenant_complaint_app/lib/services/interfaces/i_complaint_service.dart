import '../../models/complaint.dart';

abstract class IComplaintService {
  Future<List<Complaint>> getTenantComplaints({
    int page = 0,
    int size = 10,
    String? status,
    String? priority,
  });
  
  Future<Complaint> createComplaint(CreateComplaintRequest request);
  Future<Complaint> getComplaintById(String id);
  Future<void> addComplaintNote(String complaintId, String note);
  Future<List<String>> uploadImages(List<String> imagePaths);
}
