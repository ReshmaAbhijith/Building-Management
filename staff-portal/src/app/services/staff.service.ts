import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private _staff = signal<User[]>([
    {
      id: '1',
      email: 'admin@building.com',
      name: 'John Admin',
      role: 'Admin',
      phone: '+1-555-0101',
      isActive: true,
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      email: 'supervisor@building.com',
      name: 'Jane Supervisor',
      role: 'Supervisor',
      phone: '+1-555-0102',
      isActive: true,
      createdAt: new Date('2024-01-01')
    },
    {
      id: '3',
      email: 'tech@building.com',
      name: 'Mike Technician',
      role: 'Technician',
      phone: '+1-555-0103',
      isActive: true,
      createdAt: new Date('2024-01-01')
    },
    {
      id: '4',
      email: 'tech2@building.com',
      name: 'Sarah Tech',
      role: 'Technician',
      phone: '+1-555-0104',
      isActive: true,
      createdAt: new Date('2024-02-01')
    },
    {
      id: '5',
      email: 'supervisor2@building.com',
      name: 'Tom Supervisor',
      role: 'Supervisor',
      phone: '+1-555-0105',
      isActive: false,
      createdAt: new Date('2024-01-15')
    }
  ]);

  public staff = this._staff.asReadonly();

  getAllStaff(): Observable<User[]> {
    return of(this._staff()).pipe(delay(300));
  }

  getActiveStaff(): Observable<User[]> {
    const activeStaff = this._staff().filter(s => s.isActive);
    return of(activeStaff).pipe(delay(300));
  }

  getStaffById(id: string): Observable<User | undefined> {
    const staff = this._staff().find(s => s.id === id);
    return of(staff).pipe(delay(200));
  }

  getStaffByRole(role: UserRole): Observable<User[]> {
    const filteredStaff = this._staff().filter(s => s.role === role && s.isActive);
    return of(filteredStaff).pipe(delay(300));
  }

  getTechnicians(): Observable<User[]> {
    return this.getStaffByRole('Technician');
  }

  createStaff(staffData: Omit<User, 'id' | 'createdAt'>): Observable<User> {
    // Check if email already exists
    const existingStaff = this._staff().find(s => s.email === staffData.email);
    if (existingStaff) {
      return throwError(() => new Error('Email already exists'));
    }

    const newStaff: User = {
      ...staffData,
      id: `staff_${Date.now()}`,
      createdAt: new Date()
    };

    const staff = [...this._staff(), newStaff];
    this._staff.set(staff);

    return of(newStaff).pipe(delay(500));
  }

  updateStaff(id: string, updates: Partial<User>): Observable<User> {
    const staff = this._staff();
    const index = staff.findIndex(s => s.id === id);
    
    if (index === -1) {
      return throwError(() => new Error('Staff member not found'));
    }

    // Check email uniqueness if updating email
    if (updates.email && updates.email !== staff[index].email) {
      const existingStaff = staff.find(s => s.email === updates.email && s.id !== id);
      if (existingStaff) {
        return throwError(() => new Error('Email already exists'));
      }
    }

    const updatedStaff = {
      ...staff[index],
      ...updates
    };

    const newStaff = [...staff];
    newStaff[index] = updatedStaff;
    this._staff.set(newStaff);

    return of(updatedStaff).pipe(delay(500));
  }

  deactivateStaff(id: string): Observable<User> {
    return this.updateStaff(id, { isActive: false });
  }

  activateStaff(id: string): Observable<User> {
    return this.updateStaff(id, { isActive: true });
  }

  deleteStaff(id: string): Observable<boolean> {
    const staff = this._staff();
    const filtered = staff.filter(s => s.id !== id);
    
    if (filtered.length === staff.length) {
      return throwError(() => new Error('Staff member not found'));
    }

    this._staff.set(filtered);
    return of(true).pipe(delay(300));
  }

  searchStaff(query: string): Observable<User[]> {
    const lowercaseQuery = query.toLowerCase();
    const filtered = this._staff().filter(staff =>
      staff.name.toLowerCase().includes(lowercaseQuery) ||
      staff.email.toLowerCase().includes(lowercaseQuery) ||
      staff.role.toLowerCase().includes(lowercaseQuery) ||
      (staff.phone && staff.phone.includes(query))
    );

    return of(filtered).pipe(delay(300));
  }
}
