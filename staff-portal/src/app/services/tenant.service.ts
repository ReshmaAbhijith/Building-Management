import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Tenant } from '../models/tenant.model';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private _tenants = signal<Tenant[]>([
    {
      id: 'tenant1',
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phone: '+1-555-0201',
      buildingId: 'bld-001',
      buildingName: 'Sunrise Apartments',
      apartmentNo: '101',
      floor: 1,
      leaseStartDate: new Date('2024-01-15'),
      leaseEndDate: new Date('2025-01-14'),
      rentAmount: 1200,
      securityDeposit: 1200,
      isActive: true,
      emergencyContact: {
        name: 'Robert Johnson',
        phone: '+1-555-0301',
        relationship: 'Spouse'
      },
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: 'tenant2',
      name: 'Bob Smith',
      email: 'bob.smith@email.com',
      phone: '+1-555-0202',
      buildingId: 'bld-001',
      buildingName: 'Sunrise Apartments',
      apartmentNo: '205',
      floor: 2,
      leaseStartDate: new Date('2024-03-01'),
      leaseEndDate: new Date('2025-02-28'),
      rentAmount: 1350,
      securityDeposit: 1350,
      isActive: true,
      emergencyContact: {
        name: 'Mary Smith',
        phone: '+1-555-0302',
        relationship: 'Mother'
      },
      createdAt: new Date('2024-02-25'),
      updatedAt: new Date('2024-02-25')
    },
    {
      id: 'tenant3',
      name: 'Carol Davis',
      email: 'carol.davis@email.com',
      phone: '+1-555-0203',
      buildingId: 'bld-002',
      buildingName: 'Garden View Complex',
      apartmentNo: '312',
      floor: 3,
      leaseStartDate: new Date('2023-12-01'),
      leaseEndDate: new Date('2024-11-30'),
      rentAmount: 1450,
      securityDeposit: 1450,
      isActive: true,
      createdAt: new Date('2023-11-25'),
      updatedAt: new Date('2023-11-25')
    },
    {
      id: 'tenant4',
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1-555-0204',
      buildingId: 'bld-002',
      buildingName: 'Garden View Complex',
      apartmentNo: '408',
      floor: 4,
      leaseStartDate: new Date('2024-06-01'),
      leaseEndDate: new Date('2025-05-31'),
      rentAmount: 1500,
      securityDeposit: 1500,
      isActive: true,
      emergencyContact: {
        name: 'Sarah Wilson',
        phone: '+1-555-0304',
        relationship: 'Sister'
      },
      createdAt: new Date('2024-05-25'),
      updatedAt: new Date('2024-05-25')
    },
    {
      id: 'tenant5',
      name: 'Eva Brown',
      email: 'eva.brown@email.com',
      phone: '+1-555-0205',
      buildingId: 'bld-003',
      buildingName: 'Metro Heights',
      apartmentNo: '501',
      floor: 5,
      leaseStartDate: new Date('2024-04-15'),
      leaseEndDate: new Date('2025-04-14'),
      rentAmount: 1600,
      securityDeposit: 1600,
      isActive: true,
      createdAt: new Date('2024-04-10'),
      updatedAt: new Date('2024-04-10')
    }
  ]);

  public tenants = this._tenants.asReadonly();

  getAllTenants(): Observable<Tenant[]> {
    return of(this._tenants()).pipe(delay(300));
  }

  getTenantById(id: string): Observable<Tenant | undefined> {
    const tenant = this._tenants().find(t => t.id === id);
    return of(tenant).pipe(delay(200));
  }

  getTenantByApartment(apartmentNo: string): Observable<Tenant | undefined> {
    const tenant = this._tenants().find(t => t.apartmentNo === apartmentNo);
    return of(tenant).pipe(delay(200));
  }

  createTenant(tenantData: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>): Observable<Tenant> {
    const newTenant: Tenant = {
      ...tenantData,
      id: `tenant_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Check if apartment is already occupied
    const existingTenant = this._tenants().find(t => 
      t.apartmentNo === tenantData.apartmentNo && t.isActive
    );
    
    if (existingTenant) {
      return throwError(() => new Error(`Apartment ${tenantData.apartmentNo} is already occupied`));
    }

    const tenants = [...this._tenants(), newTenant];
    this._tenants.set(tenants);

    return of(newTenant).pipe(delay(500));
  }

  updateTenant(id: string, updates: Partial<Tenant>): Observable<Tenant> {
    const tenants = this._tenants();
    const index = tenants.findIndex(t => t.id === id);
    
    if (index === -1) {
      return throwError(() => new Error('Tenant not found'));
    }

    // If updating apartment number, check availability
    if (updates.apartmentNo && updates.apartmentNo !== tenants[index].apartmentNo) {
      const existingTenant = tenants.find(t => 
        t.apartmentNo === updates.apartmentNo && t.isActive && t.id !== id
      );
      
      if (existingTenant) {
        return throwError(() => new Error(`Apartment ${updates.apartmentNo} is already occupied`));
      }
    }

    const updatedTenant = {
      ...tenants[index],
      ...updates,
      updatedAt: new Date()
    };

    const newTenants = [...tenants];
    newTenants[index] = updatedTenant;
    this._tenants.set(newTenants);

    return of(updatedTenant).pipe(delay(500));
  }

  deactivateTenant(id: string): Observable<Tenant> {
    return this.updateTenant(id, { isActive: false });
  }

  activateTenant(id: string): Observable<Tenant> {
    return this.updateTenant(id, { isActive: true });
  }

  deleteTenant(id: string): Observable<boolean> {
    const tenants = this._tenants();
    const filtered = tenants.filter(t => t.id !== id);
    
    if (filtered.length === tenants.length) {
      return throwError(() => new Error('Tenant not found'));
    }

    this._tenants.set(filtered);
    return of(true).pipe(delay(300));
  }

  searchTenants(query: string): Observable<Tenant[]> {
    const lowercaseQuery = query.toLowerCase();
    const filtered = this._tenants().filter(tenant =>
      tenant.name.toLowerCase().includes(lowercaseQuery) ||
      tenant.email.toLowerCase().includes(lowercaseQuery) ||
      tenant.apartmentNo.toLowerCase().includes(lowercaseQuery) ||
      tenant.phone.includes(query)
    );

    return of(filtered).pipe(delay(300));
  }
}
