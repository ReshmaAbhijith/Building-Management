import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

import { SettingsService } from '../../services/settings.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { BuildingSettings } from '../../models/settings.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  template: `
    <div class="settings-container">
      <div class="page-header">
        <h1>Building Settings</h1>
        <p>Configure building information and system settings</p>
      </div>

      <!-- Building Information -->
      <mat-card class="settings-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>apartment</mat-icon>
            Building Information
          </mat-card-title>
          <mat-card-subtitle>Basic building details and contact information</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="settingsForm" (ngSubmit)="saveSettings()" class="settings-form">
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Building Name</mat-label>
                <input matInput formControlName="buildingName" placeholder="Enter building name">
                <mat-error *ngIf="settingsForm.get('buildingName')?.hasError('required')">
                  Building name is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Address</mat-label>
                <input matInput formControlName="address" placeholder="Enter street address">
                <mat-error *ngIf="settingsForm.get('address')?.hasError('required')">
                  Address is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>City</mat-label>
                <input matInput formControlName="city" placeholder="Enter city">
                <mat-error *ngIf="settingsForm.get('city')?.hasError('required')">
                  City is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>State</mat-label>
                <input matInput formControlName="state" placeholder="Enter state">
                <mat-error *ngIf="settingsForm.get('state')?.hasError('required')">
                  State is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>ZIP Code</mat-label>
                <input matInput formControlName="zipCode" placeholder="Enter ZIP code">
                <mat-error *ngIf="settingsForm.get('zipCode')?.hasError('required')">
                  ZIP code is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Number of Floors</mat-label>
                <input matInput 
                       type="number" 
                       formControlName="numberOfFloors" 
                       placeholder="Enter number of floors"
                       min="1">
                <mat-error *ngIf="settingsForm.get('numberOfFloors')?.hasError('required')">
                  Number of floors is required
                </mat-error>
                <mat-error *ngIf="settingsForm.get('numberOfFloors')?.hasError('min')">
                  Must be at least 1 floor
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Number of Units</mat-label>
                <input matInput 
                       type="number" 
                       formControlName="numberOfUnits" 
                       placeholder="Enter number of units"
                       min="1">
                <mat-error *ngIf="settingsForm.get('numberOfUnits')?.hasError('required')">
                  Number of units is required
                </mat-error>
                <mat-error *ngIf="settingsForm.get('numberOfUnits')?.hasError('min')">
                  Must be at least 1 unit
                </mat-error>
              </mat-form-field>
            </div>

            <mat-divider class="section-divider"></mat-divider>

            <h3 class="section-title">Contact Information</h3>
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Contact Email</mat-label>
                <input matInput 
                       type="email" 
                       formControlName="contactEmail" 
                       placeholder="Enter contact email">
                <mat-error *ngIf="settingsForm.get('contactEmail')?.hasError('required')">
                  Contact email is required
                </mat-error>
                <mat-error *ngIf="settingsForm.get('contactEmail')?.hasError('email')">
                  Please enter a valid email
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Contact Phone</mat-label>
                <input matInput formControlName="contactPhone" placeholder="Enter contact phone">
                <mat-error *ngIf="settingsForm.get('contactPhone')?.hasError('required')">
                  Contact phone is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Emergency Phone</mat-label>
                <input matInput formControlName="emergencyPhone" placeholder="Enter emergency phone">
                <mat-error *ngIf="settingsForm.get('emergencyPhone')?.hasError('required')">
                  Emergency phone is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="resetForm()">Reset</button>
              <button mat-raised-button 
                      color="primary" 
                      type="submit"
                      [disabled]="settingsForm.invalid || saving()">
                <mat-spinner diameter="20" *ngIf="saving()"></mat-spinner>
                <span *ngIf="!saving()">Save Settings</span>
                <span *ngIf="saving()">Saving...</span>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Building Logo -->
      <mat-card class="logo-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>image</mat-icon>
            Building Logo
          </mat-card-title>
          <mat-card-subtitle>Upload and manage building logo</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="logo-section">
            <div class="current-logo" *ngIf="currentSettings()?.logoUrl; else noLogo">
              <img [src]="currentSettings()?.logoUrl" alt="Building Logo" class="logo-preview">
              <p>Current Logo</p>
            </div>
            
            <ng-template #noLogo>
              <div class="no-logo">
                <mat-icon>image</mat-icon>
                <p>No logo uploaded</p>
              </div>
            </ng-template>

            <div class="logo-actions">
              <input type="file" 
                     #fileInput 
                     accept="image/*" 
                     (change)="onFileSelected($event)"
                     style="display: none;">
              <button mat-raised-button 
                      color="accent" 
                      (click)="fileInput.click()"
                      [disabled]="uploadingLogo()">
                <mat-spinner diameter="20" *ngIf="uploadingLogo()"></mat-spinner>
                <mat-icon *ngIf="!uploadingLogo()">upload</mat-icon>
                <span>{{uploadingLogo() ? 'Uploading...' : 'Upload Logo'}}</span>
              </button>
              
              <button mat-button 
                      color="warn" 
                      (click)="removeLogo()"
                      *ngIf="currentSettings()?.logoUrl"
                      [disabled]="uploadingLogo()">
                <mat-icon>delete</mat-icon>
                Remove Logo
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- System Information -->
      <mat-card class="info-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>info</mat-icon>
            System Information
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="info-grid">
            <div class="info-item">
              <label>Last Updated</label>
              <span>{{currentSettings()?.updatedAt | date:'MMM d, y, h:mm a'}}</span>
            </div>
            <div class="info-item">
              <label>Updated By</label>
              <span>{{currentSettings()?.updatedBy}}</span>
            </div>
            <div class="info-item">
              <label>Current User</label>
              <span>{{authService.user()?.name}} ({{authService.user()?.role}})</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 800px;
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

    .settings-card, .logo-card, .info-card {
      margin-bottom: 24px;
    }

    .settings-card mat-card-title,
    .logo-card mat-card-title,
    .info-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .settings-form {
      padding-top: 16px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-grid mat-form-field:first-child {
      grid-column: span 2;
    }

    .section-divider {
      margin: 24px 0;
    }

    .section-title {
      margin: 16px 0;
      color: #333;
      font-size: 18px;
      font-weight: 500;
    }

    .form-actions {
      margin-top: 24px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .logo-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 16px 0;
    }

    .current-logo, .no-logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .logo-preview {
      max-width: 200px;
      max-height: 100px;
      object-fit: contain;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 8px;
    }

    .no-logo {
      color: #666;
      padding: 32px;
    }

    .no-logo mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      opacity: 0.5;
    }

    .logo-actions {
      display: flex;
      gap: 12px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-item label {
      font-size: 12px;
      font-weight: 500;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-item span {
      font-size: 14px;
      color: #333;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-grid mat-form-field:first-child {
        grid-column: span 1;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .logo-actions {
        flex-direction: column;
        width: 100%;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  currentSettings = signal<BuildingSettings | null>(null);
  saving = signal(false);
  uploadingLogo = signal(false);

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    public authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.settingsForm = this.fb.group({
      buildingName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      numberOfFloors: ['', [Validators.required, Validators.min(1)]],
      numberOfUnits: ['', [Validators.required, Validators.min(1)]],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', Validators.required],
      emergencyPhone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.settingsService.getSettings().subscribe({
      next: (settings) => {
        this.currentSettings.set(settings);
        this.settingsForm.patchValue(settings);
      },
      error: (error) => {
        this.notificationService.showError('Failed to load settings');
        console.error('Error loading settings:', error);
      }
    });
  }

  saveSettings(): void {
    if (this.settingsForm.valid) {
      this.saving.set(true);
      const currentUser = this.authService.user();
      
      if (!currentUser) {
        this.notificationService.showError('User not authenticated');
        this.saving.set(false);
        return;
      }

      const formValue = this.settingsForm.value;
      
      this.settingsService.updateSettings(formValue, currentUser.name).subscribe({
        next: (updatedSettings) => {
          this.currentSettings.set(updatedSettings);
          this.saving.set(false);
          this.notificationService.showSuccess('Settings saved successfully');
        },
        error: (error) => {
          this.saving.set(false);
          this.notificationService.showError('Failed to save settings');
          console.error('Error saving settings:', error);
        }
      });
    }
  }

  resetForm(): void {
    if (this.currentSettings()) {
      this.settingsForm.patchValue(this.currentSettings()!);
      this.notificationService.showInfo('Form reset to saved values');
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.notificationService.showError('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.notificationService.showError('File size must be less than 5MB');
        return;
      }

      this.uploadLogo(file);
    }
  }

  uploadLogo(file: File): void {
    this.uploadingLogo.set(true);
    
    this.settingsService.uploadLogo(file).subscribe({
      next: (logoUrl) => {
        const currentUser = this.authService.user();
        if (currentUser) {
          this.settingsService.updateSettings({ logoUrl }, currentUser.name).subscribe({
            next: (updatedSettings) => {
              this.currentSettings.set(updatedSettings);
              this.uploadingLogo.set(false);
              this.notificationService.showSuccess('Logo uploaded successfully');
            },
            error: (error) => {
              this.uploadingLogo.set(false);
              this.notificationService.showError('Failed to save logo');
              console.error('Error saving logo:', error);
            }
          });
        }
      },
      error: (error) => {
        this.uploadingLogo.set(false);
        this.notificationService.showError('Failed to upload logo');
        console.error('Error uploading logo:', error);
      }
    });
  }

  removeLogo(): void {
    if (confirm('Are you sure you want to remove the current logo?')) {
      const currentUser = this.authService.user();
      if (currentUser) {
        this.settingsService.updateSettings({ logoUrl: undefined }, currentUser.name).subscribe({
          next: (updatedSettings) => {
            this.currentSettings.set(updatedSettings);
            this.notificationService.showSuccess('Logo removed successfully');
          },
          error: (error) => {
            this.notificationService.showError('Failed to remove logo');
            console.error('Error removing logo:', error);
          }
        });
      }
    }
  }
}
