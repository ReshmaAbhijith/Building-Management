import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Complaint, ComplaintNote, ComplaintFilter, ComplaintStatus, ComplaintPriority } from '../models/complaint.model';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private _complaints = signal<Complaint[]>([
    {
      id: '1',
      tenantId: 'tenant1',
      tenantName: 'Alice Johnson',
      apartmentNo: '101',
      category: 'AC',
      title: 'Air conditioning not working',
      description: 'The AC unit in the living room stopped working yesterday. It\'s getting very hot in the apartment.',
      priority: 'High',
      status: 'Open',
      assignedStaffId: undefined,
      assignedStaffName: undefined,
      createdAt: new Date('2024-07-28'),
      updatedAt: new Date('2024-07-28'),
      images: [],
      internalNotes: []
    },
    {
      id: '2',
      tenantId: 'tenant2',
      tenantName: 'Bob Smith',
      apartmentNo: '205',
      category: 'Plumbing',
      title: 'Kitchen sink leak',
      description: 'Water is leaking from under the kitchen sink. The cabinet is getting damaged.',
      priority: 'Medium',
      status: 'In Progress',
      assignedStaffId: '3',
      assignedStaffName: 'Mike Technician',
      createdAt: new Date('2024-07-27'),
      updatedAt: new Date('2024-07-28'),
      images: [],
      internalNotes: [
        {
          id: 'note1',
          complaintId: '2',
          authorId: '3',
          authorName: 'Mike Technician',
          note: 'Inspected the sink. Need to replace the pipe fitting. Parts ordered.',
          createdAt: new Date('2024-07-28')
        }
      ]
    },
    {
      id: '3',
      tenantId: 'tenant3',
      tenantName: 'Carol Davis',
      apartmentNo: '312',
      category: 'Electrical',
      title: 'Bathroom light flickering',
      description: 'The bathroom light keeps flickering and sometimes goes out completely.',
      priority: 'Low',
      status: 'Resolved',
      assignedStaffId: '3',
      assignedStaffName: 'Mike Technician',
      createdAt: new Date('2024-07-25'),
      updatedAt: new Date('2024-07-26'),
      resolvedAt: new Date('2024-07-26'),
      images: [],
      internalNotes: [
        {
          id: 'note2',
          complaintId: '3',
          authorId: '3',
          authorName: 'Mike Technician',
          note: 'Replaced the light switch. Issue resolved.',
          createdAt: new Date('2024-07-26')
        }
      ]
    },
    {
      id: '4',
      tenantId: 'tenant4',
      tenantName: 'David Wilson',
      apartmentNo: '408',
      category: 'Maintenance',
      title: 'Broken window lock',
      description: 'The lock on the bedroom window is broken and won\'t close properly.',
      priority: 'Medium',
      status: 'Open',
      assignedStaffId: undefined,
      assignedStaffName: undefined,
      createdAt: new Date('2024-07-29'),
      updatedAt: new Date('2024-07-29'),
      images: [],
      internalNotes: []
    },
    {
      id: '5',
      tenantId: 'tenant5',
      tenantName: 'Eva Brown',
      apartmentNo: '501',
      category: 'AC',
      title: 'AC making loud noise',
      description: 'The air conditioning unit is making a very loud grinding noise.',
      priority: 'High',
      status: 'Open',
      assignedStaffId: undefined,
      assignedStaffName: undefined,
      createdAt: new Date('2024-07-30'),
      updatedAt: new Date('2024-07-30'),
      images: [],
      internalNotes: []
    }
  ]);

  // Public computed signals
  public complaints = this._complaints.asReadonly();
  public totalComplaints = computed(() => this._complaints().length);
  public openComplaints = computed(() => 
    this._complaints().filter(c => c.status === 'Open').length
  );
  public resolvedComplaints = computed(() => 
    this._complaints().filter(c => c.status === 'Resolved').length
  );
  public pendingAssignment = computed(() => 
    this._complaints().filter(c => !c.assignedStaffId).length
  );
  public recentComplaints = computed(() => 
    this._complaints()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
  );

  getAllComplaints(): Observable<Complaint[]> {
    return of(this._complaints()).pipe(delay(300));
  }

  getComplaintById(id: string): Observable<Complaint | undefined> {
    const complaint = this._complaints().find(c => c.id === id);
    return of(complaint).pipe(delay(200));
  }

  getFilteredComplaints(filter: ComplaintFilter): Observable<Complaint[]> {
    let filtered = this._complaints();

    if (filter.status) {
      filtered = filtered.filter(c => c.status === filter.status);
    }
    if (filter.priority) {
      filtered = filtered.filter(c => c.priority === filter.priority);
    }
    if (filter.category) {
      filtered = filtered.filter(c => c.category === filter.category);
    }
    if (filter.assignedStaffId) {
      filtered = filtered.filter(c => c.assignedStaffId === filter.assignedStaffId);
    }

    return of(filtered).pipe(delay(300));
  }

  updateComplaint(id: string, updates: Partial<Complaint>): Observable<Complaint> {
    const complaints = this._complaints();
    const index = complaints.findIndex(c => c.id === id);
    
    if (index === -1) {
      return throwError(() => new Error('Complaint not found'));
    }

    const updatedComplaint = {
      ...complaints[index],
      ...updates,
      updatedAt: new Date(),
      ...(updates.status === 'Resolved' && { resolvedAt: new Date() })
    };

    const newComplaints = [...complaints];
    newComplaints[index] = updatedComplaint;
    this._complaints.set(newComplaints);

    return of(updatedComplaint).pipe(delay(500));
  }

  addNote(complaintId: string, note: Omit<ComplaintNote, 'id' | 'createdAt'>): Observable<ComplaintNote> {
    const newNote: ComplaintNote = {
      ...note,
      id: `note_${Date.now()}`,
      createdAt: new Date()
    };

    const complaints = this._complaints();
    const index = complaints.findIndex(c => c.id === complaintId);
    
    if (index === -1) {
      return throwError(() => new Error('Complaint not found'));
    }

    const updatedComplaint = {
      ...complaints[index],
      internalNotes: [...(complaints[index].internalNotes || []), newNote],
      updatedAt: new Date()
    };

    const newComplaints = [...complaints];
    newComplaints[index] = updatedComplaint;
    this._complaints.set(newComplaints);

    return of(newNote).pipe(delay(300));
  }

  assignStaff(complaintId: string, staffId: string, staffName: string): Observable<Complaint> {
    return this.updateComplaint(complaintId, {
      assignedStaffId: staffId,
      assignedStaffName: staffName,
      status: 'In Progress'
    });
  }

  updateStatus(complaintId: string, status: ComplaintStatus): Observable<Complaint> {
    return this.updateComplaint(complaintId, { status });
  }

  deleteComplaint(id: string): Observable<boolean> {
    const complaints = this._complaints();
    const filtered = complaints.filter(c => c.id !== id);
    
    if (filtered.length === complaints.length) {
      return throwError(() => new Error('Complaint not found'));
    }

    this._complaints.set(filtered);
    return of(true).pipe(delay(300));
  }
}
