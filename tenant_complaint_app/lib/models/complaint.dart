enum ComplaintStatus {
  open,
  inProgress,
  resolved,
  closed,
}

enum ComplaintPriority {
  low,
  medium,
  high,
  critical,
}

class Complaint {
  final String id;
  final String title;
  final String description;
  final String category;
  final ComplaintPriority priority;
  final ComplaintStatus status;
  final String tenantId;
  final String tenantName;
  final String buildingId;
  final String buildingName;
  final String apartmentNo;
  final int floor;
  final String? assignedTo;
  final String? assignedToName;
  final List<String> images;
  final List<ComplaintNote> notes;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? resolvedAt;

  Complaint({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.priority,
    required this.status,
    required this.tenantId,
    required this.tenantName,
    required this.buildingId,
    required this.buildingName,
    required this.apartmentNo,
    required this.floor,
    this.assignedTo,
    this.assignedToName,
    required this.images,
    required this.notes,
    required this.createdAt,
    required this.updatedAt,
    this.resolvedAt,
  });

  factory Complaint.fromJson(Map<String, dynamic> json) {
    return Complaint(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      category: json['category'],
      priority: ComplaintPriority.values.firstWhere(
        (e) => e.name.toLowerCase() == json['priority'].toLowerCase(),
        orElse: () => ComplaintPriority.medium,
      ),
      status: ComplaintStatus.values.firstWhere(
        (e) => e.name.toLowerCase() == json['status'].toLowerCase().replaceAll(' ', ''),
        orElse: () => ComplaintStatus.open,
      ),
      tenantId: json['tenantId'],
      tenantName: json['tenantName'],
      buildingId: json['buildingId'],
      buildingName: json['buildingName'],
      apartmentNo: json['apartmentNo'],
      floor: json['floor'],
      assignedTo: json['assignedTo'],
      assignedToName: json['assignedToName'],
      images: List<String>.from(json['images'] ?? []),
      notes: (json['notes'] as List<dynamic>?)
          ?.map((note) => ComplaintNote.fromJson(note))
          .toList() ?? [],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      resolvedAt: json['resolvedAt'] != null 
          ? DateTime.parse(json['resolvedAt']) 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'category': category,
      'priority': priority.name,
      'status': status.name,
      'tenantId': tenantId,
      'tenantName': tenantName,
      'buildingId': buildingId,
      'buildingName': buildingName,
      'apartmentNo': apartmentNo,
      'floor': floor,
      'assignedTo': assignedTo,
      'assignedToName': assignedToName,
      'images': images,
      'notes': notes.map((note) => note.toJson()).toList(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'resolvedAt': resolvedAt?.toIso8601String(),
    };
  }

  String get statusDisplayName {
    switch (status) {
      case ComplaintStatus.open:
        return 'Open';
      case ComplaintStatus.inProgress:
        return 'In Progress';
      case ComplaintStatus.resolved:
        return 'Resolved';
      case ComplaintStatus.closed:
        return 'Closed';
    }
  }

  String get priorityDisplayName {
    switch (priority) {
      case ComplaintPriority.low:
        return 'Low';
      case ComplaintPriority.medium:
        return 'Medium';
      case ComplaintPriority.high:
        return 'High';
      case ComplaintPriority.critical:
        return 'Critical';
    }
  }
}

class ComplaintNote {
  final String id;
  final String content;
  final String createdBy;
  final String createdByName;
  final DateTime createdAt;
  final bool isInternal;

  ComplaintNote({
    required this.id,
    required this.content,
    required this.createdBy,
    required this.createdByName,
    required this.createdAt,
    required this.isInternal,
  });

  factory ComplaintNote.fromJson(Map<String, dynamic> json) {
    return ComplaintNote(
      id: json['id'],
      content: json['content'],
      createdBy: json['createdBy'],
      createdByName: json['createdByName'],
      createdAt: DateTime.parse(json['createdAt']),
      isInternal: json['isInternal'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'content': content,
      'createdBy': createdBy,
      'createdByName': createdByName,
      'createdAt': createdAt.toIso8601String(),
      'isInternal': isInternal,
    };
  }
}

class CreateComplaintRequest {
  final String title;
  final String description;
  final String category;
  final ComplaintPriority priority;
  final List<String> images;

  CreateComplaintRequest({
    required this.title,
    required this.description,
    required this.category,
    required this.priority,
    required this.images,
  });

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'description': description,
      'category': category,
      'priority': priority.name,
      'images': images,
    };
  }
}
