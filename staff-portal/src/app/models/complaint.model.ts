export type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type ComplaintCategory = 'AC' | 'Plumbing' | 'Electrical' | 'Maintenance' | 'Security' | 'Other';

export interface Complaint {
  id: string;
  tenantId: string;
  tenantName: string;
  apartmentNo: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  images?: string[];
  internalNotes?: ComplaintNote[];
}

export interface ComplaintNote {
  id: string;
  complaintId: string;
  authorId: string;
  authorName: string;
  note: string;
  createdAt: Date;
}

export interface ComplaintFilter {
  status?: ComplaintStatus;
  priority?: ComplaintPriority;
  category?: ComplaintCategory;
  assignedStaffId?: string;
}
