class AddressDTO {
  final String? street;
  final String? city;
  final String? state;
  final String? zipCode;
  final String? country;

  AddressDTO({
    this.street,
    this.city,
    this.state,
    this.zipCode,
    this.country,
  });

  factory AddressDTO.fromJson(Map<String, dynamic> json) {
    return AddressDTO(
      street: json['street'],
      city: json['city'],
      state: json['state'],
      zipCode: json['zipCode'],
      country: json['country'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'street': street,
      'city': city,
      'state': state,
      'zipCode': zipCode,
      'country': country,
    };
  }

  @override
  String toString() {
    return 'AddressDTO(street: $street, city: $city, state: $state, zipCode: $zipCode, country: $country)';
  }
}
