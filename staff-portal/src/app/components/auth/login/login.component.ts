import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title class="login-title">
            <mat-icon class="login-icon">apartment</mat-icon>
            Building Maintenance Portal
          </mat-card-title>
          <mat-card-subtitle>Sign in to your account</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput 
                     type="email" 
                     formControlName="email"
                     placeholder="Enter your email"
                     [disabled]="authService.loading()">
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput 
                     [type]="hidePassword() ? 'password' : 'text'"
                     formControlName="password"
                     placeholder="Enter your password"
                     [disabled]="authService.loading()">
              <button mat-icon-button 
                      matSuffix 
                      type="button"
                      (click)="togglePasswordVisibility()"
                      [disabled]="authService.loading()">
                <mat-icon>{{hidePassword() ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
                Password must be at least 6 characters
              </mat-error>
            </mat-form-field>

            <div class="login-actions">
              <button mat-raised-button 
                      color="primary" 
                      type="submit"
                      class="login-button full-width"
                      [disabled]="loginForm.invalid || authService.loading()">
                <mat-spinner diameter="20" *ngIf="authService.loading()"></mat-spinner>
                <span *ngIf="!authService.loading()">Sign In</span>
                <span *ngIf="authService.loading()">Signing In...</span>
              </button>
            </div>
          </form>
        </mat-card-content>
        
        <mat-card-actions class="demo-credentials">
          <div class="demo-info">
            <h4>Demo Credentials:</h4>
            <div class="credential-item">
              <strong>Admin:</strong> admin&#64;building.com / password123
            </div>
            <div class="credential-item">
              <strong>Supervisor:</strong> supervisor&#64;building.com / password123
            </div>
            <div class="credential-item">
              <strong>Technician:</strong> tech&#64;building.com / password123
            </div>
          </div>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .login-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 24px;
      color: #3f51b5;
    }

    .login-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 20px;
    }

    .login-actions {
      margin-top: 20px;
    }

    .login-button {
      height: 48px;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .demo-credentials {
      background: #f5f5f5;
      padding: 16px;
      margin-top: 16px;
    }

    .demo-info h4 {
      margin: 0 0 12px 0;
      color: #666;
      font-size: 14px;
    }

    .credential-item {
      font-size: 12px;
      margin: 4px 0;
      color: #777;
    }

    .credential-item strong {
      color: #555;
    }

    @media (max-width: 480px) {
      .login-container {
        padding: 16px;
      }
      
      .login-card {
        max-width: 100%;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = signal(true);

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      
      this.authService.login(credentials).subscribe({
        next: (user) => {
          this.authService.completeLogin(user);
          this.notificationService.showSuccess(`Welcome back, ${user.name}!`);
        },
        error: (error) => {
          this.notificationService.showError(error.message || 'Login failed. Please try again.');
        }
      });
    }
  }
}
