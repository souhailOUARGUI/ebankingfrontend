import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { BankAccountService } from '../../services/bank-account.service';
import { HealthCheckService } from '../../services/health-check.service';
import { Customer } from '../../models/customer';
import { BankAccount } from '../../models/bank-account';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>E-Banking Dashboard</h1>
        <p>Welcome to your banking management system</p>

        <!-- Backend Status -->
        <div class="backend-status" *ngIf="!isCheckingConnection">
          <div class="status-indicator" [ngClass]="backendConnected ? 'connected' : 'disconnected'">
            <span class="status-dot"></span>
            <span class="status-text">
              {{ backendConnected ? 'Backend Connected' : 'Backend Disconnected' }}
            </span>
          </div>
          <p class="status-message" *ngIf="!backendConnected">
            Please ensure your backend server is running on http://localhost:8085
          </p>
        </div>

        <div class="backend-status" *ngIf="isCheckingConnection">
          <div class="status-indicator checking">
            <span class="status-dot"></span>
            <span class="status-text">Checking backend connection...</span>
          </div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon customers">👥</div>
          <div class="stat-content">
            <h3>{{ totalCustomers }}</h3>
            <p>Total Customers</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon accounts">🏦</div>
          <div class="stat-content">
            <h3>{{ totalAccounts }}</h3>
            <p>Bank Accounts</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon balance">💰</div>
          <div class="stat-content">
            <h3>{{ totalBalance | currency:'USD':'symbol':'1.2-2' }}</h3>
            <p>Total Balance</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon active">✅</div>
          <div class="stat-content">
            <h3>{{ activeAccounts }}</h3>
            <p>Active Accounts</p>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-grid">
          <a routerLink="/customers" class="action-card">
            <div class="action-icon">👤</div>
            <h3>Manage Customers</h3>
            <p>Add, edit, or view customer information</p>
          </a>

          <a routerLink="/accounts" class="action-card">
            <div class="action-icon">🏦</div>
            <h3>Manage Accounts</h3>
            <p>Create and manage bank accounts</p>
          </a>
        </div>
      </div>

      <div class="recent-section" *ngIf="recentCustomers.length > 0">
        <h2>Recent Customers</h2>
        <div class="recent-list">
          <div class="recent-item" *ngFor="let customer of recentCustomers">
            <div class="recent-info">
              <h4>{{ customer.name }}</h4>
              <p>{{ customer.email }}</p>
            </div>
            <a routerLink="/customers" class="view-link">View →</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .dashboard-header h1 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
      font-size: 2.5rem;
    }

    .dashboard-header p {
      color: #6c757d;
      font-size: 1.1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .stat-icon.customers {
      background-color: #e3f2fd;
    }

    .stat-icon.accounts {
      background-color: #e8f5e8;
    }

    .stat-icon.balance {
      background-color: #fff3e0;
    }

    .stat-icon.active {
      background-color: #f3e5f5;
    }

    .stat-content h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1.75rem;
      color: #2c3e50;
    }

    .stat-content p {
      margin: 0;
      color: #6c757d;
      font-size: 0.9rem;
    }

    .quick-actions {
      margin-bottom: 3rem;
    }

    .quick-actions h2 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
    }

    .action-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .action-card {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-decoration: none;
      color: inherit;
      transition: transform 0.2s, box-shadow 0.2s;
      text-align: center;
    }

    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .action-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .action-card h3 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .action-card p {
      color: #6c757d;
      margin: 0;
    }

    .recent-section h2 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
    }

    .recent-list {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .recent-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #dee2e6;
    }

    .recent-item:last-child {
      border-bottom: none;
    }

    .recent-info h4 {
      margin: 0 0 0.25rem 0;
      color: #2c3e50;
    }

    .recent-info p {
      margin: 0;
      color: #6c757d;
      font-size: 0.9rem;
    }

    .view-link {
      color: #007bff;
      text-decoration: none;
      font-weight: 500;
    }

    .view-link:hover {
      text-decoration: underline;
    }

    .backend-status {
      margin-top: 1rem;
      text-align: center;
    }

    .status-indicator {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .status-indicator.connected {
      background-color: #d4edda;
      color: #155724;
    }

    .status-indicator.disconnected {
      background-color: #f8d7da;
      color: #721c24;
    }

    .status-indicator.checking {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }

    .connected .status-dot {
      background-color: #28a745;
    }

    .disconnected .status-dot {
      background-color: #dc3545;
    }

    .checking .status-dot {
      background-color: #ffc107;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .status-message {
      margin-top: 0.5rem;
      font-size: 0.85rem;
      color: #6c757d;
    }

    @media (max-width: 768px) {
      .dashboard {
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .action-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  public totalCustomers = 0;
  public totalAccounts = 0;
  public totalBalance = 0;
  public activeAccounts = 0;
  public recentCustomers: Customer[] = [];
  public backendConnected = false;
  public isCheckingConnection = true;

  constructor(
    private customerService: CustomerService,
    private bankAccountService: BankAccountService,
    private healthCheckService: HealthCheckService
  ) {}

  ngOnInit(): void {
    this.checkBackendConnection();
  }

  private checkBackendConnection(): void {
    this.healthCheckService.checkCustomersEndpoint().subscribe({
      next: (isConnected: boolean) => {
        this.backendConnected = isConnected;
        this.isCheckingConnection = false;
        if (isConnected) {
          this.loadDashboardData();
        }
      },
      error: () => {
        this.backendConnected = false;
        this.isCheckingConnection = false;
      }
    });
  }

  private loadDashboardData(): void {
    // Load customers
    this.customerService.getCustomers().subscribe({
      next: (customers: Customer[]) => {
        this.totalCustomers = customers.length;
        this.recentCustomers = customers.slice(-5).reverse(); // Last 5 customers
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading customers:', error);
      }
    });

    // Load accounts
    this.bankAccountService.getAccounts().subscribe({
      next: (accounts: BankAccount[]) => {
        this.totalAccounts = accounts.length;
        this.totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
        this.activeAccounts = accounts.filter(account => account.status === 'ACTIVE').length;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading accounts:', error);
      }
    });
  }
}
