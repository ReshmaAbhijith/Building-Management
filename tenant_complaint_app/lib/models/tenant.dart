class Tenant {

  final String id;
  final String name;
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
    required this.name,
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
      id: json['id'],
      name: json['name'],
      email: json['email'],
      phone: json['phone'],
      buildingId: json['buildingId'],
      buildingName: json['buildingName'],
      apartmentNo: json['apartmentNo'],
      floor: json['floor'],
      rentAmount: json['rentAmount'].toDouble(),
      securityDeposit: json['securityDeposit']?.toDouble(),
      leaseStartDate: DateTime.parse(json['leaseStartDate']),
      leaseEndDate: json['leaseEndDate'] != null 
          ? DateTime.parse(json['leaseEndDate']) 
          : null,
      isActive: json['isActive'],
      emergencyContact: json['emergencyContact'] != null
          ? EmergencyContact.fromJson(json['emergencyContact'])
          : null,
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
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
