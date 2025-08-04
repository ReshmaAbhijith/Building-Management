class Tenant {

  final String id;
  final String fullName;
  final String email;
  final String phone;
  final String buildingId;
  final String buildingName;
  final String apartmentNo;
  final int floor;
  final double rentAmount;
  final double? securityDeposit;
  final DateTime leaseStartDate;
  final DateTime? leaseEndDate;
  final bool isActive;
  final EmergencyContact? emergencyContact;
  final DateTime createdAt;
  final DateTime updatedAt;

  Tenant({
    required this.id,
    required this.fullName,
    required this.email,
    required this.phone,
    required this.buildingId,
    required this.buildingName,
    required this.apartmentNo,
    required this.floor,
    required this.rentAmount,
    this.securityDeposit,
    required this.leaseStartDate,
    this.leaseEndDate,
    required this.isActive,
    this.emergencyContact,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Tenant.fromJson(Map<String, dynamic> json) {
    return Tenant(
      id: json['id'] ?? '',
      fullName: json['fullName'] ?? 'Abhijith Nair',
      email: json['userName'] ?? 'abhijith.nair@gmail.com',
      phone: json['phone'] ?? '0554383855',
      buildingId: json['buildingId'] ?? '',
      buildingName: json['buildingName'] ?? 'Wasayf',
      apartmentNo: json['apartmentNo'] ?? '204',
      floor: json['floor'] ?? 2,
      rentAmount: json['rentAmount']?? 0,
      securityDeposit: json['securityDeposit'] ?? 0,
      leaseStartDate: DateTime.now(),
      leaseEndDate: DateTime.now(),
      isActive: true,
      emergencyContact: json['emergencyContact'] != null
          ? EmergencyContact.fromJson(json['emergencyContact'])
          : null,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': fullName,
      'email': email,
      'phone': phone,
      'buildingId': buildingId,
      'buildingName': buildingName,
      'apartmentNo': apartmentNo,
      'floor': floor,
      'rentAmount': rentAmount,
      'securityDeposit': securityDeposit,
      'leaseStartDate': leaseStartDate.toIso8601String(),
      'leaseEndDate': leaseEndDate?.toIso8601String(),
      'isActive': isActive,
      'emergencyContact': emergencyContact?.toJson(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

class EmergencyContact {
  final String name;
  final String phone;
  final String relationship;

  EmergencyContact({
    required this.name,
    required this.phone,
    required this.relationship,
  });

  factory EmergencyContact.fromJson(Map<String, dynamic> json) {
    return EmergencyContact(
      name: json['name'],
      phone: json['phone'],
      relationship: json['relationship'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'phone': phone,
      'relationship': relationship,
    };
  }
}
