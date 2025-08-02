import { Component, OnInit, signal, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { StaffService } from '../../../services/staff.service';
import { NotificationService } from '../../../services/notification.service';
import { User, UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-staff-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>{{data ? 'Edit' : 'Add'}} Staff Member</h2>
    <mat-dialog-content>
      <form [formGroup]="staffForm" class="staff-form">
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Full Name</mat-label>
            <input matInput formControlName="name" placeholder="Enter full name">
            <mat-error *ngIf="staffForm.get('name')?.hasError('required')">
              Name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="Enter email">
            <mat-error *ngIf="staffForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="staffForm.get('email')?.hasError('email')">
              Please enter a valid email
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Phone</mat-label>
            <input matInput formControlName="phone" placeholder="Enter phone number">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Role</mat-label>
            <mat-select formControlName="role">
              <mat-option *ngFor="let role of roleOptions" [value]="role">
                {{role}}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="staffForm.get('role')?.hasError('required')">
              Role is required
            </mat-error>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="staffForm.invalid || saving()">
        {{saving() ? 'Saving...' : 'Save'}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .staff-form {
      min-width: 500px;
      padding: 16px 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    @media (max-width: 600px) {
      .staff-form {
        min-width: 300px;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StaffDialogComponent {
  staffForm: FormGroup;
  saving = signal(false);
  roleOptions: UserRole[] = ['Admin', 'Supervisor', 'Technician'];

  constructor(
    private fb: FormBuilder,
    private staffService: StaffService,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<StaffDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null
  ) {
    this.staffForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      phone: [data?.phone || ''],
      role: [data?.role || '', Validators.required]
    });
  }

  save(): void {
    if (this.staffForm.valid) {
      this.saving.set(true);
      const formValue = this.staffForm.value;
      
      const staffData = {
        ...formValue,
        isActive: true
      };

      if (this.data) {
        // Update existing staff
        this.staffService.updateStaff(this.data.id, staffData).subscribe({
          next: (updatedStaff) => {
            this.saving.set(false);
            this.notificationService.showSuccess('Staff member updated successfully');
            this.dialogRef.close(updatedStaff);
          },
          error: (error) => {
            this.saving.set(false);
            this.notificationService.showError(error.message || 'Failed to update staff member');
          }
        });
      } else {
        // Create new staff
        this.staffService.createStaff(staffData).subscribe({
          next: (newStaff) => {
            this.saving.set(false);
            this.notificationService.showSuccess('Staff member created successfully');
            this.dialogRef.close(newStaff);
          },
          error: (error) => {
            this.saving.set(false);
            this.notificationService.showError(error.message || 'Failed to create staff member');
          }
        });
      }
    }
  }
}

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="staff-container">
      <div class="page-header">
        <div class="header-info">
          <h1>Staff Management</h1>
          <p>Manage building maintenance staff members</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="openStaffDialog()">
            <mat-icon>add</mat-icon>
            Add Staff Member
          </button>
        </div>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters-grid">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search staff</mat-label>
              <input matInput 
                     [formControl]="searchControl"
                     placeholder="Search by name, email, or role">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Filter by Role</mat-label>
              <mat-select [formControl]="roleFilter" multiple>
                <mat-option *ngFor="let role of roleOptions" [value]="role">
                  {{role}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select [formControl]="statusFilter">
                <mat-option value="">All</mat-option>
                <mat-option value="active">Active</mat-option>
                <mat-option value="inactive">Inactive</mat-option>
              </mat-select>
            </mat-form-field>

            <div class="filter-actions">
              <button mat-button (click)="clearFilters()">Clear Filters</button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Staff Table -->
      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-header">
            <h3>Staff Members ({{filteredStaff().length}})</h3>
          </div>

          <div class="table-container">
            <table mat-table [dataSource]="filteredStaff()" class="staff-table" matSort>
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
                <td mat-cell *matCellDef="let staff">
                  <div class="staff-info">
                    <span class="staff-name">{{staff.name}}</span>
                    <span class="staff-email">{{staff.email}}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Role</th>
                <td mat-cell *matCellDef="let staff">
                  <mat-chip-set>
                    <mat-chip [class]="'role-' + staff.role.toLowerCase()">
                      {{staff.role}}
                    </mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef>Phone</th>
                <td mat-cell *matCellDef="let staff">
                  {{staff.phone || 'N/A'}}
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
                <td mat-cell *matCellDef="let staff">
                  <mat-chip-set>
                    <mat-chip [class]="staff.isActive ? 'status-active' : 'status-inactive'">
                      {{staff.isActive ? 'Active' : 'Inactive'}}
                    </mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Joined</th>
                <td mat-cell *matCellDef="let staff">
                  {{staff.createdAt | date:'MMM d, y'}}
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let staff">
                  <div class="action-buttons">
                    <button mat-icon-button 
                            color="primary" 
                            (click)="openStaffDialog(staff)"
                            matTooltip="Edit Staff">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button 
                            [color]="staff.isActive ? 'warn' : 'accent'"
                            (click)="toggleStaffStatus(staff)"
                            [matTooltip]="staff.isActive ? 'Deactivate' : 'Activate'">
                      <mat-icon>{{staff.isActive ? 'block' : 'check_circle'}}</mat-icon>
                    </button>
                    <button mat-icon-button 
                            color="warn" 
                            (click)="deleteStaff(staff)"
                            matTooltip="Delete Staff">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="staff-row"></tr>
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
    .staff-container {
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

    .filters-card {
      margin-bottom: 24px;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr auto;
      gap: 16px;
      align-items: end;
    }

    .filter-actions {
      display: flex;
      gap: 8px;
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

    .staff-table {
      width: 100%;
    }

    .staff-row {
      transition: background-color 0.2s ease;
    }

    .staff-row:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .staff-info {
      display: flex;
      flex-direction: column;
    }

    .staff-name {
      font-weight: 500;
    }

    .staff-email {
      font-size: 12px;
      color: #666;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    /* Role Chip Styles */
    .role-admin {
      background-color: rgba(156, 39, 176, 0.1);
      color: #9c27b0;
    }

    .role-supervisor {
      background-color: rgba(33, 150, 243, 0.1);
      color: #2196f3;
    }

    .role-technician {
      background-color: rgba(76, 175, 80, 0.1);
      color: #4caf50;
    }

    /* Status Chip Styles */
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

      .header-actions button {
        width: 100%;
      }

      .filters-grid {
        grid-template-columns: 1fr;
      }

      .filter-actions {
        justify-content: stretch;
      }

      .filter-actions button {
        flex: 1;
      }
    }
  `]
})
export class StaffListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'role', 'phone', 'status', 'createdAt', 'actions'];
  
  allStaff = signal<User[]>([]);
  filteredStaff = signal<User[]>([]);
  
  searchControl = new FormControl('');
  roleFilter = new FormControl<UserRole[]>([]);
  statusFilter = new FormControl('');
  
  roleOptions: UserRole[] = ['Admin', 'Supervisor', 'Technician'];

  constructor(
    private staffService: StaffService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    // Setup filter functionality
    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.roleFilter.valueChanges.subscribe(() => this.applyFilters());
    this.statusFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.staffService.getAllStaff().subscribe({
      next: (staff) => {
        this.allStaff.set(staff);
        this.applyFilters();
      },
      error: (error) => {
        this.notificationService.showError('Failed to load staff members');
        console.error('Error loading staff:', error);
      }
    });
  }

  applyFilters(): void {
    let filtered = this.allStaff();
    
    // Search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm) ||
        staff.email.toLowerCase().includes(searchTerm) ||
        staff.role.toLowerCase().includes(searchTerm)
      );
    }

    // Role filter
    const roleFilters = this.roleFilter.value;
    if (roleFilters && roleFilters.length > 0) {
      filtered = filtered.filter(staff => roleFilters.includes(staff.role));
    }

    // Status filter
    const statusFilter = this.statusFilter.value;
    if (statusFilter === 'active') {
      filtered = filtered.filter(staff => staff.isActive);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(staff => !staff.isActive);
    }

    this.filteredStaff.set(filtered);
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.roleFilter.setValue([]);
    this.statusFilter.setValue('');
  }

  openStaffDialog(staff?: User): void {
    const dialogRef = this.dialog.open(StaffDialogComponent, {
      width: '600px',
      data: staff || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStaff();
      }
    });
  }

  toggleStaffStatus(staff: User): void {
    const action = staff.isActive ? 'deactivate' : 'activate';
    const observable = staff.isActive 
      ? this.staffService.deactivateStaff(staff.id)
      : this.staffService.activateStaff(staff.id);

    observable.subscribe({
      next: () => {
        this.loadStaff();
        this.notificationService.showSuccess(`Staff member ${action}d successfully`);
      },
      error: (error) => {
        this.notificationService.showError(`Failed to ${action} staff member`);
        console.error(`Error ${action}ing staff:`, error);
      }
    });
  }

  deleteStaff(staff: User): void {
    if (confirm(`Are you sure you want to delete ${staff.name}? This action cannot be undone.`)) {
      this.staffService.deleteStaff(staff.id).subscribe({
        next: () => {
          this.loadStaff();
          this.notificationService.showSuccess('Staff member deleted successfully');
        },
        error: (error) => {
          this.notificationService.showError('Failed to delete staff member');
          console.error('Error deleting staff:', error);
        }
      });
    }
  }
}
