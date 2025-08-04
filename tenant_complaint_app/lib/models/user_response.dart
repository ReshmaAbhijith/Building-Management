import 'address.dart';
import 'contact.dart';
import 'apartment_ref.dart';

class UserResponseDTO {
  final String? id;
  final List<ApartmentRefDTO>? apartments;
  final String? fullName;
  final String? userName;
  final String? password;
  final String? role;
  final AddressDTO? address;
  final ContactDTO? contact;
  final String? createdBy;
  final String? updatedBy;

  UserResponseDTO({
    this.id,
    this.apartments,
    this.fullName,
    this.userName,
    this.password,
    this.role,
    this.address,
    this.contact,
    this.createdBy,
    this.updatedBy,
  });

  factory UserResponseDTO.fromJson(Map<String, dynamic> json) {
    return UserResponseDTO(
      id: json['id'],
      apartments: json['apartments'] != null
          ? (json['apartments'] as List)
              .map((apartment) => ApartmentRefDTO.fromJson(apartment))
              .toList()
          : null,
      fullName: json['fullName'],
      userName: json['userName'],
      password: json['password'],
      role: json['role'],
      address: json['address'] != null 
          ? AddressDTO.fromJson(json['address'])
          : null,
      contact: json['contact'] != null 
          ? ContactDTO.fromJson(json['contact'])
          : null,
      createdBy: json['createdBy'],
      updatedBy: json['updatedBy'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'apartments': apartments?.map((apartment) => apartment.toJson()).toList(),
      'fullName': fullName,
      'userName': userName,
      'password': password,
      'role': role,
      'address': address?.toJson(),
      'contact': contact?.toJson(),
      'createdBy': createdBy,
      'updatedBy': updatedBy,
    };
  }

  @override
  String toString() {
    return 'UserResponseDTO(id: $id, fullName: $fullName, userName: $userName, role: $role, apartments: ${apartments?.length ?? 0} apartments)';
  }
}
