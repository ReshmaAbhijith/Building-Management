class ContactDTO {
  final String? email;
  final String? phone;
  final String? mobile;
  final String? alternatePhone;

  ContactDTO({
    this.email,
    this.phone,
    this.mobile,
    this.alternatePhone,
  });

  factory ContactDTO.fromJson(Map<String, dynamic> json) {
    return ContactDTO(
      email: json['email'],
      phone: json['phone'],
      mobile: json['mobile'],
      alternatePhone: json['alternatePhone'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'phone': phone,
      'mobile': mobile,
      'alternatePhone': alternatePhone,
    };
  }

  @override
  String toString() {
    return 'ContactDTO(email: $email, phone: $phone, mobile: $mobile, alternatePhone: $alternatePhone)';
  }
}
