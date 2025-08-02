import { Component, OnInit, signal, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TenantService } from '../../../services/tenant.service';
import { NotificationService } from '../../../services/notification.service';
import { Tenant } from '../../../models/tenant.model';

@Component({
  selector: 'app-tenant-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>{{data ? 'Edit' : 'Add'}} Tenant</h2>
    <mat-dialog-content>
      <form [formGroup]="tenantForm" class="tenant-form">
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Full Name</mat-label>
            <input matInput formControlName="name" placeholder="Enter full name">
            <mat-error *ngIf="tenantForm.get('name')?.hasError('required')">
              Name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="Enter email">
            <mat-error *ngIf="tenantForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="tenantForm.get('email')?.hasError('email')">
              Please enter a valid email
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Phone</mat-label>
            <input matInput formControlName="phone" placeholder="+1-555-0123">
            <mat-error *ngIf="tenantForm.get('phone')?.hasError('required')">
              Phone is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Building Name</mat-label>
            <input matInput formControlName="buildingName" placeholder="Sunrise Apartments">
            <mat-error *ngIf="tenantForm.get('buildingName')?.hasError('required')">
              Building name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Apartment Number</mat-label>
            <input matInput formControlName="apartmentNo" placeholder="101">
            <mat-error *ngIf="tenantForm.get('apartmentNo')?.hasError('required')">
              Apartment number is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Floor</mat-label>
            <input matInput type="number" formControlName="floor" placeholder="1">
            <mat-error *ngIf="tenantForm.get('floor')?.hasError('required')">
              Floor is required
            </mat-error>
            <mat-error *ngIf="tenantForm.get('floor')?.hasError('min')">
              Floor must be at least 1
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Monthly Rent</mat-label>
            <input matInput type="number" formControlName="rentAmount" placeholder="1200">
            <mat-icon matPrefix>attach_money</mat-icon>
            <mat-error *ngIf="tenantForm.get('rentAmount')?.hasError('required')">
              Rent amount is required
            </mat-error>
            <mat-error *ngIf="tenantForm.get('rentAmount')?.hasError('min')">
              Rent amount must be positive
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Security Deposit</mat-label>
            <input matInput type="number" formControlName="securityDeposit" placeholder="1200">
            <mat-icon matPrefix>attach_money</mat-icon>
            <mat-error *ngIf="tenantForm.get('securityDeposit')?.hasError('min')">
              Security deposit must be positive
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Lease Start Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="leaseStartDate">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="tenantForm.get('leaseStartDate')?.hasError('required')">
              Lease start date is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Lease End Date</mat-label>
            <input matInput [matDatepicker]="endPicker" formControlName="leaseEndDate">
            <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="tenantForm.invalid || saving()">
        {{saving() ? 'Saving...' : 'Save'}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .tenant-form {
      min-width: 500px;
      padding: 16px 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-grid mat-form-field:nth-child(1),
    .form-grid mat-form-field:nth-child(2) {
      grid-column: span 1;
    }

    @media (max-width: 600px) {
      .tenant-form {
        min-width: 300px;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TenantDialogComponent {
  tenantForm: FormGroup;
  saving = signal(false);

  constructor(
    private fb: FormBuilder,
    private tenantService: TenantService,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<TenantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Tenant | null
  ) {
    this.tenantForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      phone: [data?.phone || '', Validators.required],
      buildingId: [data?.buildingId || 'bld-001', Validators.required],
      buildingName: [data?.buildingName || 'Sunrise Apartments', Validators.required],
      apartmentNo: [data?.apartmentNo || '', Validators.required],
      floor: [data?.floor || 1, [Validators.required, Validators.min(1)]],
      rentAmount: [data?.rentAmount || 0, [Validators.required, Validators.min(0)]],
      securityDeposit: [data?.securityDeposit || 0, Validators.min(0)],
      leaseStartDate: [data?.leaseStartDate || '', Validators.required],
      leaseEndDate: [data?.leaseEndDate || '']
    });
  }

  save(): void {
    if (this.tenantForm.valid) {
      this.saving.set(true);
      const formValue = this.tenantForm.value;
      
      const tenantData = {
        ...formValue,
        isActive: true
      };

      if (this.data) {
        // Update existing tenant
        this.tenantService.updateTenant(this.data.id, tenantData).subscribe({
          next: (updatedTenant) => {
            this.saving.set(false);
            this.notificationService.showSuccess('Tenant updated successfully');
            this.dialogRef.close(updatedTenant);
          },
          error: (error) => {
            this.saving.set(false);
            this.notificationService.showError(error.message || 'Failed to update tenant');
          }
        });
      } else {
        // Create new tenant
        this.tenantService.createTenant(tenantData).subscribe({
          next: (newTenant) => {
            this.saving.set(false);
            this.notificationService.showSuccess('Tenant created successfully');
            this.dialogRef.close(newTenant);
          },
          error: (error) => {
            this.saving.set(false);
            this.notificationService.showError(error.message || 'Failed to create tenant');
          }
        });
      }
    }
  }
}

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatTooltipModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="tenants-container">
      <div class="page-header">
        <div class="header-info">
          <h1>Tenant Management</h1>
          <p>Manage building tenants and their information</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="openTenantDialog()">
            <mat-icon>add</mat-icon>
            Add Tenant
          </button>
        </div>
      </div>

      <!-- Search -->
      <mat-card class="search-card">
        <mat-card-content>
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search tenants</mat-label>
            <input matInput 
                   [formControl]="searchControl"
                   placeholder="Search by name, email, apartment, or phone">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </mat-card-content>
      </mat-card>

      <!-- Tenants Table -->
      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-header">
            <h3>Tenants ({{filteredTenants().length}})</h3>
          </div>

          <div class="table-container">
            <table mat-table [dataSource]="filteredTenants()" class="tenants-table" matSort>
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
                <td mat-cell *matCellDef="let tenant">
                  <div class="tenant-info">
                    <span class="tenant-name">{{tenant.name}}</span>
                    <span class="tenant-email">{{tenant.email}}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="building">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Building</th>
                <td mat-cell *matCellDef="let tenant">
                  <div class="building-info">
                    <span class="building-name">{{tenant.buildingName}}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="apartment">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Apartment</th>
                <td mat-cell *matCellDef="let tenant">
                  <div class="apartment-info">
                    <span class="apartment-number">{{tenant.apartmentNo}}</span>
                    <span class="floor-info">Floor {{tenant.floor}}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef>Phone</th>
                <td mat-cell *matCellDef="let tenant">{{tenant.phone}}</td>
              </ng-container>

              <ng-container matColumnDef="lease">
                <th mat-header-cell *matHeaderCellDef>Lease Period</th>
                <td mat-cell *matCellDef="let tenant">
                  <div class="lease-info">
                    <span>{{tenant.leaseStartDate | date:'MMM d, y'}}</span>
                    <span *ngIf="tenant.leaseEndDate"> - {{tenant.leaseEndDate | date:'MMM d, y'}}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="rent">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Rent</th>
                <td mat-cell *matCellDef="let tenant">
                  <div class="rent-info">
                    <span class="rent-amount">{{tenant.rentAmount | currency}}</span>
                    <span class="deposit-info" *ngIf="tenant.securityDeposit">Deposit: {{tenant.securityDeposit | currency}}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
                <td mat-cell *matCellDef="let tenant">
                  <mat-chip-set>
                    <mat-chip [class]="tenant.isActive ? 'status-active' : 'status-inactive'">
                      {{tenant.isActive ? 'Active' : 'Inactive'}}
                    </mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let tenant">
                  <div class="action-buttons">
                    <button mat-icon-button 
                            color="primary" 
                            (click)="openTenantDialog(tenant)"
                            matTooltip="Edit Tenant">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button 
                            [color]="tenant.isActive ? 'warn' : 'accent'"
                            (click)="toggleTenantStatus(tenant)"
                            [matTooltip]="tenant.isActive ? 'Deactivate' : 'Activate'">
                      <mat-icon>{{tenant.isActive ? 'block' : 'check_circle'}}</mat-icon>
                    </button>
                    <button mat-icon-button 
                            color="warn" 
                            (click)="deleteTenant(tenant)"
                            matTooltip="Delete Tenant">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="tenant-row"></tr>
            </table>
          </div>

          <mat-paginator 
            [pageSizeOptions]="[10, 25, 50]"
            [pageSize]="25"
            showFirstLastButtons>
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .tenants-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .header-info h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 300;
    }

    .header-info p {
      margin: 8px 0 0 0;
      color: #666;
      font-size: 16px;
    }

    .search-card {
      margin-bottom: 24px;
    }

    .search-field {
      width: 100%;
      max-width: 400px;
    }

    .table-card {
      margin-bottom: 24px;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .table-header h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
    }

    .table-container {
      overflow-x: auto;
    }

    .tenants-table {
      width: 100%;
    }

    .tenant-row {
      transition: background-color 0.2s ease;
    }

    .tenant-row:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .tenant-info {
      display: flex;
      flex-direction: column;
    }

    .tenant-name {
      font-weight: 500;
    }

    .tenant-email {
      font-size: 12px;
      color: #666;
    }

    .apartment-number {
      font-weight: 500;
      color: #3f51b5;
    }

    .lease-info {
      display: flex;
      flex-direction: column;
      font-size: 12px;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .status-active {
      background-color: rgba(76, 175, 80, 0.1);
      color: #4caf50;
    }

    .status-inactive {
      background-color: rgba(158, 158, 158, 0.1);
      color: #9e9e9e;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .header-actions {
        align-self: stretch;
      }

      .header-actions button {
        width: 100%;
      }
    }
  `]
})
export class TenantListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'building', 'apartment', 'phone', 'lease', 'rent', 'status', 'actions'];
  
  allTenants = signal<Tenant[]>([]);
  searchControl = new FormControl('');
  
  filteredTenants = signal<Tenant[]>([]);

  constructor(
    private tenantService: TenantService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    // Setup search functionality
    this.searchControl.valueChanges.subscribe(searchTerm => {
      this.filterTenants(searchTerm || '');
    });
  }

  ngOnInit(): void {
    this.loadTenants();
  }

  loadTenants(): void {
    this.tenantService.getAllTenants().subscribe({
      next: (tenants) => {
        this.allTenants.set(tenants);
        this.filteredTenants.set(tenants);
      },
      error: (error) => {
        this.notificationService.showError('Failed to load tenants');
        console.error('Error loading tenants:', error);
      }
    });
  }

  filterTenants(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredTenants.set(this.allTenants());
      return;
    }

    const filtered = this.allTenants().filter(tenant =>
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.apartmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.phone.includes(searchTerm)
    );

    this.filteredTenants.set(filtered);
  }

  openTenantDialog(tenant?: Tenant): void {
    const dialogRef = this.dialog.open(TenantDialogComponent, {
      width: '600px',
      data: tenant || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTenants(); // Reload tenants after dialog closes
      }
    });
  }

  toggleTenantStatus(tenant: Tenant): void {
    const action = tenant.isActive ? 'deactivate' : 'activate';
    const observable = tenant.isActive 
      ? this.tenantService.deactivateTenant(tenant.id)
      : this.tenantService.activateTenant(tenant.id);

    observable.subscribe({
      next: () => {
        this.loadTenants();
        this.notificationService.showSuccess(`Tenant ${action}d successfully`);
      },
      error: (error) => {
        this.notificationService.showError(`Failed to ${action} tenant`);
        console.error(`Error ${action}ing tenant:`, error);
      }
    });
  }

  deleteTenant(tenant: Tenant): void {
    if (confirm(`Are you sure you want to delete ${tenant.name}? This action cannot be undone.`)) {
      this.tenantService.deleteTenant(tenant.id).subscribe({
        next: () => {
          this.loadTenants();
          this.notificationService.showSuccess('Tenant deleted successfully');
        },
        error: (error) => {
          this.notificationService.showError('Failed to delete tenant');
          console.error('Error deleting tenant:', error);
        }
      });
    }
  }
}
