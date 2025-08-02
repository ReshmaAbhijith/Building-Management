import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { AuthService } from './services/auth.service';

interface NavigationItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule
  ],
  template: `
    <div class="app-container" *ngIf="authService.isLoggedIn(); else loginView">
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav 
          #drawer 
          class="sidenav" 
          fixedInViewport 
          [attr.role]="isHandset() ? 'dialog' : 'navigation'"
          [mode]="isHandset() ? 'over' : 'side'"
          [opened]="!isHandset()">
          
          <mat-toolbar class="sidenav-header">
            <span class="logo">Building Portal</span>
          </mat-toolbar>
          
          <mat-nav-list>
            <a mat-list-item 
               *ngFor="let item of visibleNavItems()" 
               [routerLink]="item.route"
               routerLinkActive="active-nav-item"
               (click)="isHandset() && drawer.close()">
              <mat-icon matListItemIcon>{{item.icon}}</mat-icon>
              <span matListItemTitle>{{item.label}}</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>
        
        <mat-sidenav-content>
          <mat-toolbar color="primary" class="main-toolbar">
            <button
              type="button"
              aria-label="Toggle sidenav"
              mat-icon-button
              (click)="drawer.toggle()"
              *ngIf="isHandset()">
              <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
            </button>
            
            <span class="toolbar-title">Building Maintenance Portal</span>
            
            <span class="spacer"></span>
            
            <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-button">
              <mat-icon>account_circle</mat-icon>
              <span class="user-name">{{authService.user()?.name}}</span>
              <mat-icon>arrow_drop_down</mat-icon>
            </button>
            
            <mat-menu #userMenu="matMenu">
              <div class="user-info">
                <div class="user-name">{{authService.user()?.name}}</div>
                <div class="user-role">{{authService.user()?.role}}</div>
              </div>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </mat-toolbar>
          
          <div class="main-content">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
    
    <ng-template #loginView>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styles: [`
    .app-container {
      height: 100vh;
    }

    .sidenav-container {
      height: 100%;
    }

    .sidenav {
      width: 250px;
      background: #fafafa;
    }

    .sidenav-header {
      background: #3f51b5;
      color: white;
      min-height: 64px;
    }

    .logo {
      font-size: 18px;
      font-weight: 500;
    }

    .main-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .toolbar-title {
      font-size: 18px;
      font-weight: 500;
    }

    .user-menu-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-name {
      font-size: 14px;
    }

    .user-info {
      padding: 16px;
      text-align: center;
    }

    .user-info .user-name {
      font-weight: 500;
      font-size: 16px;
    }

    .user-info .user-role {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }

    .main-content {
      padding: 20px;
      min-height: calc(100vh - 64px);
      background: #f5f5f5;
    }

    .active-nav-item {
      background: rgba(63, 81, 181, 0.1) !important;
      color: #3f51b5 !important;
    }

    .active-nav-item mat-icon {
      color: #3f51b5 !important;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 16px;
      }
      
      .user-name {
        display: none;
      }
    }
  `]
})
export class AppComponent {
  private isHandsetSignal = signal(false);

  navigationItems: NavigationItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Complaints', icon: 'report_problem', route: '/complaints' },
    { label: 'Tenants', icon: 'people', route: '/tenants' },
    { label: 'Staff', icon: 'group', route: '/staff', roles: ['Admin', 'Supervisor'] },
    { label: 'Settings', icon: 'settings', route: '/settings', roles: ['Admin'] }
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver.observe(Breakpoints.Handset)
      .subscribe(result => {
        this.isHandsetSignal.set(result.matches);
      });
  }

  isHandset = computed(() => this.isHandsetSignal());

  visibleNavItems = computed(() => {
    const userRole = this.authService.userRole();
    return this.navigationItems.filter(item => {
      if (!item.roles) return true;
      return userRole && item.roles.includes(userRole);
    });
  });

  logout(): void {
    this.authService.logout();
  }
}
