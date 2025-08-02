import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError, delay } from 'rxjs';
import { User, UserRole, LoginCredentials, AuthState } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Mock users for demonstration
  private readonly mockUsers: User[] = [
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
    }
  ];

  // Angular Signals for state management
  private _authState = signal<AuthState>({
    user: null,
    isLoggedIn: false,
    loading: false
  });

  // Public computed signals
  public authState = this._authState.asReadonly();
  public user = computed(() => this._authState().user);
  public isLoggedIn = computed(() => this._authState().isLoggedIn);
  public userRole = computed(() => this._authState().user?.role);
  public loading = computed(() => this._authState().loading);

  constructor(private router: Router) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this._authState.update(state => ({
          ...state,
          user,
          isLoggedIn: true
        }));
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  login(credentials: LoginCredentials): Observable<User> {
    this._authState.update(state => ({ ...state, loading: true }));

    // Mock authentication logic
    const user = this.mockUsers.find(u => 
      u.email === credentials.email && 
      credentials.password === 'password123' // Mock password
    );

    if (user) {
      return of(user).pipe(
        delay(1000), // Simulate API delay
      ).pipe(
        delay(0) // Ensure async execution
      );
    } else {
      this._authState.update(state => ({ ...state, loading: false }));
      return throwError(() => new Error('Invalid email or password'));
    }
  }

  completeLogin(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this._authState.update(state => ({
      user,
      isLoggedIn: true,
      loading: false
    }));
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this._authState.update(state => ({
      user: null,
      isLoggedIn: false,
      loading: false
    }));
    this.router.navigate(['/login']);
  }

  hasRole(role: UserRole): boolean {
    return this.user()?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this.user()?.role;
    return userRole ? roles.includes(userRole) : false;
  }

  canAccessAdminFeatures(): boolean {
    return this.hasRole('Admin');
  }

  canManageStaff(): boolean {
    return this.hasAnyRole(['Admin', 'Supervisor']);
  }

  canAssignComplaints(): boolean {
    return this.hasAnyRole(['Admin', 'Supervisor']);
  }
}
