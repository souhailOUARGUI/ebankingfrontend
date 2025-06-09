import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="customer-list-container">
      <!-- Header Section -->
      <div class="header-section">
        <div class="header-content">
          <h1 class="page-title">
            <span class="title-icon">👥</span>
            Customer Management
          </h1>
          <p class="page-subtitle">Manage your customers and their information</p>
        </div>
        <button class="add-customer-btn" (click)="onAddCustomer()" [disabled]="isLoading">
          <span class="btn-icon">+</span>
          <span class="btn-text">New Customer</span>
        </button>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="isLoading">
        <div class="loading-spinner"></div>
        <p>Loading customers...</p>
      </div>

      <!-- Error State -->
      <div class="error-state" *ngIf="errorMessage && !isLoading">
        <div class="error-icon">⚠️</div>
        <h3>Error Loading Customers</h3>
        <p>{{ errorMessage }}</p>
        <button class="retry-btn" (click)="retryLoad()">Retry</button>
      </div>

      <!-- Stats Overview -->
      <div class="stats-overview" *ngIf="!isLoading && !errorMessage && customers.length > 0">
        <div class="stat-card">
          <div class="stat-value">{{ customers.length }}</div>
          <div class="stat-label">Total Customers</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ getActiveCustomersCount() }}</div>
          <div class="stat-label">Active Customers</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ getRecentCustomersCount() }}</div>
          <div class="stat-label">Recent Additions</div>
        </div>
      </div>

      <!-- Customers Table-Row Style -->
      <div class="customers-list" *ngIf="!isLoading && !errorMessage && customers.length > 0; else noCustomers">
        <div class="customer-row" *ngFor="let customer of customers; trackBy: trackByCustomerId">
          <!-- Customer Avatar -->
          <div class="customer-avatar">
            <span class="avatar-icon">{{ getCustomerInitials(customer.name) }}</span>
          </div>

          <!-- Customer Info -->
          <div class="customer-info">
            <div class="customer-name">{{ customer.name }}</div>
            <div class="customer-email">{{ customer.email }}</div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button class="action-btn accounts" (click)="onViewAccounts(customer)" title="View Customer Accounts">
              🏦
            </button>
            <button class="action-btn edit" (click)="onEditCustomer(customer)" title="Edit Customer">
              ✏️
            </button>
            <button class="action-btn delete" (click)="onDeleteCustomer(customer.id)" title="Delete Customer">
              🗑️
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <ng-template #noCustomers>
        <div class="empty-state" *ngIf="!isLoading && !errorMessage">
          <div class="empty-icon">👥</div>
          <h2 class="empty-title">No Customers Found</h2>
          <p class="empty-description">Start by adding your first customer to the system.</p>
          <button class="empty-action-btn" (click)="onAddCustomer()">
            <span class="btn-icon">+</span>
            <span class="btn-text">Add First Customer</span>
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .customer-list-container {
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }

    /* Header Section */
    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      flex: 1;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .title-icon {
      font-size: 2.5rem;
    }

    .page-subtitle {
      font-size: 1.1rem;
      color: #718096;
      margin: 0;
    }

    .add-customer-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 15px;
      padding: 1rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .add-customer-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
    }

    .add-customer-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }

    .btn-icon {
      font-size: 1.2rem;
      font-weight: bold;
    }

    /* Loading State */
    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(102, 126, 234, 0.2);
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Error State */
    .error-state {
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .error-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .retry-btn {
      background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
      color: white;
      border: none;
      border-radius: 15px;
      padding: 1rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(245, 101, 101, 0.4);
    }

    .retry-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(245, 101, 101, 0.6);
    }

    /* Stats Overview */
    .stats-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 1.5rem;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #718096;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Customers List - Table Row Style */
    .customers-list {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .customer-row {
      display: flex;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid rgba(102, 126, 234, 0.1);
      transition: all 0.3s ease;
      gap: 1rem;
    }

    .customer-row:last-child {
      border-bottom: none;
    }

    .customer-row:hover {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
      transform: translateX(5px);
    }

    /* Customer Avatar */
    .customer-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .avatar-icon {
      color: white;
      font-size: 1rem;
      font-weight: 700;
    }

    /* Customer Info */
    .customer-info {
      flex: 1;
      min-width: 0;
    }

    .customer-name {
      font-size: 1.1rem;
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 0.25rem 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .customer-email {
      font-size: 0.9rem;
      color: #718096;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Action Buttons */
    .action-buttons {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .action-btn {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .action-btn:hover {
      transform: translateY(-2px) scale(1.1);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .action-btn.accounts {
      background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
      color: white;
    }

    .action-btn.accounts:hover {
      box-shadow: 0 4px 15px rgba(66, 153, 225, 0.4);
    }

    .action-btn.edit {
      background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
      color: white;
    }

    .action-btn.edit:hover {
      box-shadow: 0 4px 15px rgba(160, 174, 192, 0.4);
    }

    .action-btn.delete {
      background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
      color: white;
    }

    .action-btn.delete:hover {
      box-shadow: 0 4px 15px rgba(245, 101, 101, 0.4);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
    }

    .empty-title {
      font-size: 2rem;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 1rem;
    }

    .empty-description {
      font-size: 1.1rem;
      color: #718096;
      margin-bottom: 2rem;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .empty-action-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 15px;
      padding: 1rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .empty-action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .customer-list-container {
        padding: 1rem;
      }

      .header-section {
        flex-direction: column;
        gap: 1.5rem;
        text-align: center;
      }

      .page-title {
        font-size: 2rem;
      }

      .stats-overview {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .customer-row {
        padding: 0.75rem 1rem;
        gap: 0.75rem;
      }

      .customer-name {
        font-size: 1rem;
      }

      .customer-email {
        font-size: 0.8rem;
      }

      .action-btn {
        width: 35px;
        height: 35px;
        font-size: 1rem;
      }
    }
  `]
})
export class CustomerListComponent implements OnInit {
  public customers: Customer[] = [];
  public isLoading = false;
  public errorMessage = '';
  @Output() addCustomer = new EventEmitter<void>();
  @Output() editCustomer = new EventEmitter<Customer>();
  @Output() viewAccounts = new EventEmitter<Customer>();

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.getCustomers();
  }

  public getCustomers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.customerService.getCustomers().subscribe({
      next: (response: Customer[]) => {
        this.customers = response;
        this.isLoading = false;
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
        console.error('Error loading customers:', error);
      }
    });
  }

  public retryLoad(): void {
    this.getCustomers();
  }

  public onAddCustomer(): void {
    this.addCustomer.emit();
  }

  public onEditCustomer(customer: Customer): void {
    this.editCustomer.emit(customer);
  }

  public onViewAccounts(customer: Customer): void {
    this.viewAccounts.emit(customer);
  }

  public onDeleteCustomer(customerId: number): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(customerId).subscribe({
        next: () => {
          this.getCustomers(); // Refresh the list
        },
        error: (error: Error) => {
          alert('Error deleting customer: ' + error.message);
        }
      });
    }
  }

  public trackByCustomerId(index: number, customer: Customer): number {
    return customer.id;
  }

  public getCustomerInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  public getActiveCustomersCount(): number {
    return this.customers.length; // All customers are considered active for now
  }

  public getRecentCustomersCount(): number {
    // Assuming customers with higher IDs are more recent
    const recentThreshold = Math.max(...this.customers.map(c => c.id)) - 5;
    return this.customers.filter(c => c.id > recentThreshold).length;
  }
}
