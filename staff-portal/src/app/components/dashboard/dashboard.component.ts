import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

import { ComplaintService } from '../../services/complaint.service';
import { AuthService } from '../../services/auth.service';
import { Complaint } from '../../models/complaint.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {{authService.user()?.name}}!</p>
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards">
        <mat-card class="summary-card total">
          <mat-card-content>
            <div class="card-content">
              <div class="card-icon">
                <mat-icon>assignment</mat-icon>
              </div>
              <div class="card-info">
                <h3>{{complaintService.totalComplaints()}}</h3>
                <p>Total Complaints</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card open">
          <mat-card-content>
            <div class="card-content">
              <div class="card-icon">
                <mat-icon>error_outline</mat-icon>
              </div>
              <div class="card-info">
                <h3>{{complaintService.openComplaints()}}</h3>
                <p>Open Complaints</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card resolved">
          <mat-card-content>
            <div class="card-content">
              <div class="card-icon">
                <mat-icon>check_circle</mat-icon>
              </div>
              <div class="card-info">
                <h3>{{complaintService.resolvedComplaints()}}</h3>
                <p>Resolved Complaints</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card pending">
          <mat-card-content>
            <div class="card-content">
              <div class="card-icon">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="card-info">
                <h3>{{complaintService.pendingAssignment()}}</h3>
                <p>Pending Assignment</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="dashboard-content">
        <!-- Trend Visualization -->
        <mat-card class="trend-card">
          <mat-card-header>
            <mat-card-title>Complaint Trends</mat-card-title>
            <mat-card-subtitle>Weekly overview</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="trend-chart">
              <div class="chart-placeholder">
                <mat-icon>trending_up</mat-icon>
                <p>Complaint trends visualization would go here</p>
                <div class="mock-bars">
                  <div class="bar" style="height: 60%"></div>
                  <div class="bar" style="height: 80%"></div>
                  <div class="bar" style="height: 45%"></div>
                  <div class="bar" style="height: 90%"></div>
                  <div class="bar" style="height: 70%"></div>
                  <div class="bar" style="height: 55%"></div>
                  <div class="bar" style="height: 85%"></div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- AI Insights -->
        <mat-card class="insights-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>lightbulb</mat-icon>
              AI Insights
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="insight-item">
              <mat-icon color="warn">trending_up</mat-icon>
              <p>AC complaints increased by 15% this week</p>
            </div>
            <div class="insight-item">
              <mat-icon color="primary">schedule</mat-icon>
              <p>Average resolution time: 2.3 days</p>
            </div>
            <div class="insight-item">
              <mat-icon color="accent">people</mat-icon>
              <p>Mike Technician has the highest resolution rate</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Recent Complaints -->
      <mat-card class="recent-complaints">
        <mat-card-header>
          <mat-card-title>Recent Complaints</mat-card-title>
          <mat-card-subtitle>Latest 5 complaints</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="complaintService.recentComplaints()" class="complaints-table">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let complaint">{{complaint.id}}</td>
              </ng-container>

              <ng-container matColumnDef="tenant">
                <th mat-header-cell *matHeaderCellDef>Tenant</th>
                <td mat-cell *matCellDef="let complaint">
                  <div class="tenant-info">
                    <span class="tenant-name">{{complaint.tenantName}}</span>
                    <span class="apartment">{{complaint.apartmentNo}}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="title">
                <th mat-header-cell *matHeaderCellDef>Title</th>
                <td mat-cell *matCellDef="let complaint">{{complaint.title}}</td>
              </ng-container>

              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef>Category</th>
                <td mat-cell *matCellDef="let complaint">
                  <mat-chip-set>
                    <mat-chip>{{complaint.category}}</mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <ng-container matColumnDef="priority">
                <th mat-header-cell *matHeaderCellDef>Priority</th>
                <td mat-cell *matCellDef="let complaint">
                  <span [class]="'priority-' + complaint.priority.toLowerCase()">
                    {{complaint.priority}}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let complaint">
                  <span [class]="'status-' + complaint.status.toLowerCase().replace(' ', '-')">
                    {{complaint.status}}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let complaint">
                  <button mat-button color="primary" [routerLink]="['/complaints', complaint.id]">
                    View
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
          
          <div class="table-actions">
            <button mat-raised-button color="primary" routerLink="/complaints">
              View All Complaints
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 24px;
    }

    .dashboard-header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 300;
    }

    .dashboard-header p {
      margin: 8px 0 0 0;
      color: #666;
      font-size: 16px;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .summary-card {
      cursor: pointer;
      transition: transform 0.2s ease-in-out;
    }

    .summary-card:hover {
      transform: translateY(-2px);
    }

    .card-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }

    .total .card-icon {
      background: rgba(63, 81, 181, 0.1);
      color: #3f51b5;
    }

    .open .card-icon {
      background: rgba(244, 67, 54, 0.1);
      color: #f44336;
    }

    .resolved .card-icon {
      background: rgba(76, 175, 80, 0.1);
      color: #4caf50;
    }

    .pending .card-icon {
      background: rgba(255, 152, 0, 0.1);
      color: #ff9800;
    }

    .card-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .card-info h3 {
      margin: 0;
      font-size: 28px;
      font-weight: 500;
    }

    .card-info p {
      margin: 4px 0 0 0;
      color: #666;
      font-size: 14px;
    }

    .dashboard-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }

    .trend-chart {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chart-placeholder {
      text-align: center;
      color: #666;
    }

    .chart-placeholder mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .mock-bars {
      display: flex;
      align-items: end;
      justify-content: center;
      gap: 8px;
      height: 80px;
      margin-top: 16px;
    }

    .bar {
      width: 20px;
      background: #3f51b5;
      border-radius: 2px;
      opacity: 0.7;
    }

    .insights-card .insight-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 12px 0;
    }

    .insights-card .insight-item p {
      margin: 0;
      font-size: 14px;
    }

    .recent-complaints {
      margin-bottom: 24px;
    }

    .table-container {
      overflow-x: auto;
    }

    .complaints-table {
      width: 100%;
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

    .table-actions {
      margin-top: 16px;
      text-align: center;
    }

    @media (max-width: 768px) {
      .dashboard-content {
        grid-template-columns: 1fr;
      }

      .summary-cards {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['id', 'tenant', 'title', 'category', 'priority', 'status', 'actions'];

  constructor(
    public complaintService: ComplaintService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // Dashboard data is automatically available through signals
  }
}
