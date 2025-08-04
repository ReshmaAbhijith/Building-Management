class ApartmentRefDTO {
  final int? buildingId;
  final int? apartmentNumber;
  final DateTime? leaseStartDate;
  final DateTime? leaseEndDate;

  ApartmentRefDTO({
    this.buildingId,
    this.apartmentNumber,
    this.leaseStartDate,
    this.leaseEndDate,
  });

  factory ApartmentRefDTO.fromJson(Map<String, dynamic> json) {
    return ApartmentRefDTO(
      buildingId: json['buildingId'],
      apartmentNumber: json['apartmentNumber'],
      leaseStartDate: json['leaseStartDate'] != null 
          ? DateTime.parse(json['leaseStartDate'])
          : null,
      leaseEndDate: json['leaseEndDate'] != null 
          ? DateTime.parse(json['leaseEndDate'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'buildingId': buildingId,
      'apartmentNumber': apartmentNumber,
      'leaseStartDate': leaseStartDate?.toIso8601String(),
      'leaseEndDate': leaseEndDate?.toIso8601String(),
    };
  }

  @override
  String toString() {
    return 'ApartmentRefDTO(buildingId: $buildingId, apartmentNumber: $apartmentNumber, leaseStartDate: $leaseStartDate, leaseEndDate: $leaseEndDate)';
  }
}
