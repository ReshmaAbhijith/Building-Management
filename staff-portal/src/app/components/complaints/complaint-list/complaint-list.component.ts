import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { ComplaintService } from '../../../services/complaint.service';
import { AuthService } from '../../../services/auth.service';
import { Complaint, ComplaintStatus, ComplaintPriority, ComplaintCategory } from '../../../models/complaint.model';

@Component({
  selector: 'app-complaint-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSortModule
  ],
  template: `
    <div class="complaints-container">
      <div class="page-header">
        <h1>Complaints Management</h1>
        <p>Manage and track building maintenance complaints</p>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters-grid">
            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select [formControl]="statusFilter" multiple>
                <mat-option *ngFor="let status of statusOptions" [value]="status">
                  {{status}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Priority</mat-label>
              <mat-select [formControl]="priorityFilter" multiple>
                <mat-option *ngFor="let priority of priorityOptions" [value]="priority">
                  {{priority}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Category</mat-label>
              <mat-select [formControl]="categoryFilter" multiple>
                <mat-option *ngFor="let category of categoryOptions" [value]="category">
                  {{category}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <div class="filter-actions">
              <button mat-button (click)="clearFilters()">Clear Filters</button>
              <button mat-raised-button color="primary" (click)="applyFilters()">Apply</button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Complaints Table -->
      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-header">
            <h3>Complaints ({{filteredComplaints().length}})</h3>
          </div>

          <div class="table-container">
            <table mat-table [dataSource]="filteredComplaints()" class="complaints-table" matSort>
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let complaint">
                  <span class="complaint-id">#{{complaint.id}}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="tenant">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Tenant</th>
                <td mat-cell *matCellDef="let complaint">
                  <div class="tenant-info">
                    <span class="tenant-name">{{complaint.tenantName}}</span>
                    <span class="apartment">Apt {{complaint.apartmentNo}}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="title">
                <th mat-header-cell *matHeaderCellDef>Title</th>
                <td mat-cell *matCellDef="let complaint">
                  <div class="complaint-title">
                    <span>{{complaint.title}}</span>
                    <small>{{complaint.description | slice:0:50}}{{complaint.description.length > 50 ? '...' : ''}}</small>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Category</th>
                <td mat-cell *matCellDef="let complaint">
                  <mat-chip-set>
                    <mat-chip [class]="'category-' + complaint.category.toLowerCase()">
                      {{complaint.category}}
                    </mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <ng-container matColumnDef="priority">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Priority</th>
                <td mat-cell *matCellDef="let complaint">
                  <span [class]="'priority-' + complaint.priority.toLowerCase()">
                    <mat-icon class="priority-icon">{{getPriorityIcon(complaint.priority)}}</mat-icon>
                    {{complaint.priority}}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
                <td mat-cell *matCellDef="let complaint">
                  <mat-chip-set>
                    <mat-chip [class]="'status-' + complaint.status.toLowerCase().replace(' ', '-')">
                      {{complaint.status}}
                    </mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <ng-container matColumnDef="assignedStaff">
                <th mat-header-cell *matHeaderCellDef>Assigned Staff</th>
                <td mat-cell *matCellDef="let complaint">
                  <span *ngIf="complaint.assignedStaffName; else unassigned">
                    {{complaint.assignedStaffName}}
                  </span>
                  <ng-template #unassigned>
                    <span class="unassigned">Unassigned</span>
                  </ng-template>
                </td>
              </ng-container>

              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Created</th>
                <td mat-cell *matCellDef="let complaint">
                  {{complaint.createdAt | date:'MMM d, y'}}
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let complaint">
                  <div class="action-buttons">
                    <button mat-icon-button 
                            color="primary" 
                            [routerLink]="['/complaints', complaint.id]"
                            matTooltip="View Details">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button mat-icon-button 
                            color="accent" 
                            [routerLink]="['/complaints', complaint.id]"
                            matTooltip="Edit">
                      <mat-icon>edit</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                  class="complaint-row"
                  [routerLink]="['/complaints', row.id]"></tr>
            </table>
          </div>

          <mat-paginator 
            [pageSizeOptions]="[10, 25, 50, 100]"
            [pageSize]="25"
            showFirstLastButtons>
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .complaints-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .page-header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 300;
    }

    .page-header p {
      margin: 8px 0 0 0;
      color: #666;
      font-size: 16px;
    }

    .filters-card {
      margin-bottom: 24px;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      align-items: end;
    }

    .filter-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
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

    .complaints-table {
      width: 100%;
    }

    .complaint-row {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .complaint-row:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .complaint-id {
      font-family: monospace;
      font-weight: 500;
      color: #666;
    }

    .tenant-info {
      display: flex;
      flex-direction: column;
    }

    .tenant-name {
      font-weight: 500;
    }

    .apartment {
      font-size: 12px;
      color: #666;
    }

    .complaint-title {
      display: flex;
      flex-direction: column;
    }

    .complaint-title small {
      color: #666;
      margin-top: 4px;
    }

    .priority-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 4px;
      vertical-align: middle;
    }

    .unassigned {
      color: #999;
      font-style: italic;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    /* Priority Styles */
    .priority-critical {
      color: #d32f2f;
      font-weight: 600;
    }

    .priority-high {
      color: #f44336;
      font-weight: 500;
    }

    .priority-medium {
      color: #ff9800;
    }

    .priority-low {
      color: #4caf50;
    }

    /* Status Chip Styles */
    .status-open {
      background-color: rgba(244, 67, 54, 0.1);
      color: #f44336;
    }

    .status-in-progress {
      background-color: rgba(255, 152, 0, 0.1);
      color: #ff9800;
    }

    .status-resolved {
      background-color: rgba(76, 175, 80, 0.1);
      color: #4caf50;
    }

    .status-closed {
      background-color: rgba(158, 158, 158, 0.1);
      color: #9e9e9e;
    }

    /* Category Chip Styles */
    .category-ac {
      background-color: rgba(33, 150, 243, 0.1);
      color: #2196f3;
    }

    .category-plumbing {
      background-color: rgba(0, 188, 212, 0.1);
      color: #00bcd4;
    }

    .category-electrical {
      background-color: rgba(255, 193, 7, 0.1);
      color: #ffc107;
    }

    .category-maintenance {
      background-color: rgba(121, 85, 72, 0.1);
      color: #795548;
    }

    .category-security {
      background-color: rgba(156, 39, 176, 0.1);
      color: #9c27b0;
    }

    .category-other {
      background-color: rgba(96, 125, 139, 0.1);
      color: #607d8b;
    }

    @media (max-width: 768px) {
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
export class ComplaintListComponent implements OnInit {
  displayedColumns: string[] = [
    'id', 'tenant', 'title', 'category', 'priority', 'status', 'assignedStaff', 'createdAt', 'actions'
  ];

  statusOptions: ComplaintStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed'];
  priorityOptions: ComplaintPriority[] = ['Low', 'Medium', 'High', 'Critical'];
  categoryOptions: ComplaintCategory[] = ['AC', 'Plumbing', 'Electrical', 'Maintenance', 'Security', 'Other'];

  statusFilter = new FormControl<ComplaintStatus[]>([]);
  priorityFilter = new FormControl<ComplaintPriority[]>([]);
  categoryFilter = new FormControl<ComplaintCategory[]>([]);

  private allComplaints = signal<Complaint[]>([]);
  
  filteredComplaints = computed(() => {
    let complaints = this.allComplaints();
    
    const statusFilters = this.statusFilter.value;
    const priorityFilters = this.priorityFilter.value;
    const categoryFilters = this.categoryFilter.value;

    if (statusFilters && statusFilters.length > 0) {
      complaints = complaints.filter(c => statusFilters.includes(c.status));
    }

    if (priorityFilters && priorityFilters.length > 0) {
      complaints = complaints.filter(c => priorityFilters.includes(c.priority));
    }

    if (categoryFilters && categoryFilters.length > 0) {
      complaints = complaints.filter(c => categoryFilters.includes(c.category));
    }

    return complaints;
  });

  constructor(
    private complaintService: ComplaintService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.complaintService.getAllComplaints().subscribe(complaints => {
      this.allComplaints.set(complaints);
    });
  }

  applyFilters(): void {
    // Filters are applied automatically through computed signal
    // This method can be used for additional filter logic if needed
  }

  clearFilters(): void {
    this.statusFilter.setValue([]);
    this.priorityFilter.setValue([]);
    this.categoryFilter.setValue([]);
  }

  getPriorityIcon(priority: ComplaintPriority): string {
    switch (priority) {
      case 'Critical': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'check_circle';
      default: return 'help';
    }
  }
}
