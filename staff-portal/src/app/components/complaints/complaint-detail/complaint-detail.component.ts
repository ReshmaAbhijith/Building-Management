import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ComplaintService } from '../../../services/complaint.service';
import { StaffService } from '../../../services/staff.service';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { Complaint, ComplaintStatus, ComplaintNote } from '../../../models/complaint.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-complaint-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="complaint-detail-container" *ngIf="complaint(); else loading">
      <div class="page-header">
        <button mat-icon-button (click)="goBack()" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="header-info">
          <h1>Complaint #{{complaint()?.id}}</h1>
          <p>{{complaint()?.title}}</p>
        </div>
        <div class="header-actions">
          <mat-chip-set>
            <mat-chip [class]="'status-' + (complaint()?.status ? complaint()!.status.toLowerCase().replace(' ', '-') : '')">
              {{complaint()?.status}}
            </mat-chip>
          </mat-chip-set>
        </div>
      </div>

      <div class="content-grid">
        <!-- Complaint Details -->
        <mat-card class="details-card">
          <mat-card-header>
            <mat-card-title>Complaint Details</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Tenant</label>
                <span>{{complaint()?.tenantName}}</span>
              </div>
              <div class="detail-item">
                <label>Apartment</label>
                <span>{{complaint()?.apartmentNo}}</span>
              </div>
              <div class="detail-item">
                <label>Category</label>
                <mat-chip-set>
                  <mat-chip [class]="'category-' + complaint()?.category?.toLowerCase()">
                    {{complaint()?.category}}
                  </mat-chip>
                </mat-chip-set>
              </div>
              <div class="detail-item">
                <label>Priority</label>
                <span [class]="'priority-' + complaint()?.priority?.toLowerCase()">
                  <mat-icon class="priority-icon">{{getPriorityIcon(complaint()?.priority)}}</mat-icon>
                  {{complaint()?.priority}}
                </span>
              </div>
              <div class="detail-item">
                <label>Created</label>
                <span>{{complaint()?.createdAt | date:'MMM d, y, h:mm a'}}</span>
              </div>
              <div class="detail-item">
                <label>Last Updated</label>
                <span>{{complaint()?.updatedAt | date:'MMM d, y, h:mm a'}}</span>
              </div>
              <div class="detail-item full-width">
                <label>Description</label>
                <p class="description">{{complaint()?.description}}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Status & Assignment -->
        <mat-card class="actions-card">
          <mat-card-header>
            <mat-card-title>Actions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="updateForm" (ngSubmit)="updateComplaint()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status">
                  <mat-option *ngFor="let status of statusOptions" [value]="status">
                    {{status}}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width" 
                             *ngIf="authService.canAssignComplaints()">
                <mat-label>Assign Technician</mat-label>
                <mat-select formControlName="assignedStaffId">
                  <mat-option value="">Unassigned</mat-option>
                  <mat-option *ngFor="let tech of technicians()" [value]="tech.id">
                    {{tech.name}}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <div class="form-actions">
                <button mat-raised-button 
                        color="primary" 
                        type="submit"
                        [disabled]="updateForm.invalid || updating()">
                  <mat-spinner diameter="20" *ngIf="updating()"></mat-spinner>
                  <span *ngIf="!updating()">Update</span>
                  <span *ngIf="updating()">Updating...</span>
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Internal Notes -->
      <mat-card class="notes-card">
        <mat-card-header>
          <mat-card-title>Internal Notes</mat-card-title>
          <mat-card-subtitle>Communication between staff members</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <!-- Add Note Form -->
          <form [formGroup]="noteForm" (ngSubmit)="addNote()" class="note-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Add a note</mat-label>
              <textarea matInput 
                        formControlName="note"
                        rows="3"
                        placeholder="Enter your note here..."></textarea>
            </mat-form-field>
            <div class="note-actions">
              <button mat-raised-button 
                      color="primary" 
                      type="submit"
                      [disabled]="noteForm.invalid || addingNote()">
                <mat-spinner diameter="20" *ngIf="addingNote()"></mat-spinner>
                <span *ngIf="!addingNote()">Add Note</span>
                <span *ngIf="addingNote()">Adding...</span>
              </button>
            </div>
          </form>

          <mat-divider class="notes-divider"></mat-divider>

          <!-- Notes List -->
          <div class="notes-list" *ngIf="complaint()?.internalNotes?.length; else noNotes">
            <div class="note-item" *ngFor="let note of complaint()?.internalNotes; trackBy: trackByNoteId">
              <div class="note-header">
                <div class="note-author">
                  <mat-icon>person</mat-icon>
                  <span>{{note.authorName}}</span>
                </div>
                <div class="note-date">
                  {{note.createdAt | date:'MMM d, y, h:mm a'}}
                </div>
              </div>
              <div class="note-content">
                {{note.note}}
              </div>
            </div>
          </div>

          <ng-template #noNotes>
            <div class="no-notes">
              <mat-icon>note</mat-icon>
              <p>No internal notes yet</p>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </div>

    <ng-template #loading>
      <div class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Loading complaint details...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .complaint-detail-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding: 16px 0;
    }

    .back-button {
      flex-shrink: 0;
    }

    .header-info {
      flex: 1;
    }

    .header-info h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 400;
    }

    .header-info p {
      margin: 4px 0 0 0;
      color: #666;
      font-size: 16px;
    }

    .header-actions {
      flex-shrink: 0;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }

    .details-card {
      height: fit-content;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-item.full-width {
      grid-column: 1 / -1;
    }

    .detail-item label {
      font-size: 12px;
      font-weight: 500;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-item span, .detail-item p {
      font-size: 14px;
      color: #333;
    }

    .description {
      margin: 0;
      line-height: 1.5;
      background: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
    }

    .priority-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 4px;
      vertical-align: middle;
    }

    .actions-card {
      height: fit-content;
    }

    .form-actions, .note-actions {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }

    .notes-card {
      margin-bottom: 24px;
    }

    .note-form {
      margin-bottom: 16px;
    }

    .notes-divider {
      margin: 16px 0;
    }

    .notes-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .note-item {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 16px;
      border-left: 4px solid #3f51b5;
    }

    .note-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .note-author {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      color: #333;
    }

    .note-author mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #666;
    }

    .note-date {
      font-size: 12px;
      color: #666;
    }

    .note-content {
      color: #555;
      line-height: 1.5;
    }

    .no-notes {
      text-align: center;
      padding: 32px;
      color: #666;
    }

    .no-notes mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      gap: 16px;
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

    /* Status Styles */
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

    /* Category Styles */
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
      .content-grid {
        grid-template-columns: 1fr;
      }

      .detail-grid {
        grid-template-columns: 1fr;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .page-header .back-button {
        align-self: flex-start;
      }
    }
  `]
})
export class ComplaintDetailComponent implements OnInit {
  complaint = signal<Complaint | null>(null);
  technicians = signal<User[]>([]);
  updating = signal(false);
  addingNote = signal(false);

  statusOptions: ComplaintStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed'];

  updateForm: FormGroup;
  noteForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private complaintService: ComplaintService,
    private staffService: StaffService,
    public authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.updateForm = this.fb.group({
      status: ['', Validators.required],
      assignedStaffId: ['']
    });

    this.noteForm = this.fb.group({
      note: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    const complaintId = this.route.snapshot.paramMap.get('id');
    if (complaintId) {
      this.loadComplaint(complaintId);
      this.loadTechnicians();
    }
  }

  loadComplaint(id: string): void {
    this.complaintService.getComplaintById(id).subscribe({
      next: (complaint) => {
        if (complaint) {
          this.complaint.set(complaint);
          this.updateForm.patchValue({
            status: complaint.status,
            assignedStaffId: complaint.assignedStaffId || ''
          });
        } else {
          this.notificationService.showError('Complaint not found');
          this.router.navigate(['/complaints']);
        }
      },
      error: (error) => {
        this.notificationService.showError('Failed to load complaint details');
        console.error('Error loading complaint:', error);
      }
    });
  }

  loadTechnicians(): void {
    this.staffService.getTechnicians().subscribe({
      next: (techs) => {
        this.technicians.set(techs);
      },
      error: (error) => {
        console.error('Error loading technicians:', error);
      }
    });
  }

  updateComplaint(): void {
    if (this.updateForm.valid && this.complaint()) {
      this.updating.set(true);
      const formValue = this.updateForm.value;
      const complaintId = this.complaint()!.id;

      // Find assigned staff name
      let assignedStaffName = '';
      if (formValue.assignedStaffId) {
        const assignedStaff = this.technicians().find(t => t.id === formValue.assignedStaffId);
        assignedStaffName = assignedStaff?.name || '';
      }

      const updates = {
        status: formValue.status,
        assignedStaffId: formValue.assignedStaffId || undefined,
        assignedStaffName: assignedStaffName || undefined
      };

      this.complaintService.updateComplaint(complaintId, updates).subscribe({
        next: (updatedComplaint) => {
          this.complaint.set(updatedComplaint);
          this.updating.set(false);
          this.notificationService.showSuccess('Complaint updated successfully');
        },
        error: (error) => {
          this.updating.set(false);
          this.notificationService.showError('Failed to update complaint');
          console.error('Error updating complaint:', error);
        }
      });
    }
  }

  addNote(): void {
    if (this.noteForm.valid && this.complaint()) {
      this.addingNote.set(true);
      const currentUser = this.authService.user();
      
      if (!currentUser) {
        this.notificationService.showError('User not authenticated');
        this.addingNote.set(false);
        return;
      }

      const noteData = {
        complaintId: this.complaint()!.id,
        authorId: currentUser.id,
        authorName: currentUser.name,
        note: this.noteForm.value.note
      };

      this.complaintService.addNote(this.complaint()!.id, noteData).subscribe({
        next: () => {
          // Reload complaint to get updated notes
          this.loadComplaint(this.complaint()!.id);
          this.noteForm.reset();
          this.addingNote.set(false);
          this.notificationService.showSuccess('Note added successfully');
        },
        error: (error) => {
          this.addingNote.set(false);
          this.notificationService.showError('Failed to add note');
          console.error('Error adding note:', error);
        }
      });
    }
  }

  getPriorityIcon(priority?: string): string {
    switch (priority) {
      case 'Critical': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'check_circle';
      default: return 'help';
    }
  }

  trackByNoteId(index: number, note: ComplaintNote): string {
    return note.id;
  }

  goBack(): void {
    this.router.navigate(['/complaints']);
  }
}
