import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="customer-list">
      <div class="list-header">
        <h3>Customers</h3>
        <button class="btn btn-primary" (click)="onAddCustomer()" [disabled]="isLoading">
          <i class="icon">+</i> Add Customer
        </button>
      </div>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="isLoading">
        <div class="loading-spinner"></div>
        <p>Loading customers...</p>
      </div>

      <!-- Error State -->
      <div class="error-container" *ngIf="errorMessage && !isLoading">
        <div class="error-message">
          <h4>⚠️ Error Loading Customers</h4>
          <p>{{ errorMessage }}</p>
          <button class="btn btn-primary" (click)="retryLoad()">
            🔄 Retry
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="table-container" *ngIf="!isLoading && !errorMessage && customers.length > 0">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let customer of customers">
              <td>{{ customer.id }}</td>
              <td>{{ customer.name }}</td>
              <td>{{ customer.email }}</td>
              <td>{{ customer.phone || 'N/A' }}</td>
              <td class="actions">
                <button class="btn btn-sm btn-secondary" (click)="onEditCustomer(customer)">
                  Edit
                </button>
                <button class="btn btn-sm btn-info" (click)="onViewAccounts(customer)">
                  Accounts
                </button>
                <button class="btn btn-sm btn-danger" (click)="onDeleteCustomer(customer.id)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- No Data State -->
      <div class="no-data" *ngIf="!isLoading && !errorMessage && customers.length === 0">
        <p>No customers found. <a href="#" (click)="onAddCustomer()">Add the first customer</a></p>
      </div>
    </div>
  `,
  styles: [`
    .customer-list {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
    }

    .list-header h3 {
      margin: 0;
      color: #2c3e50;
    }

    .table-container {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th,
    .data-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }

    .data-table th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: #495057;
    }

    .data-table tbody tr:hover {
      background-color: #f8f9fa;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .no-data {
      padding: 3rem;
      text-align: center;
      color: #6c757d;
    }

    .no-data a {
      color: #007bff;
      text-decoration: none;
    }

    .no-data a:hover {
      text-decoration: underline;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.2s;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }

    .btn-info {
      background-color: #17a2b8;
      color: white;
    }

    .btn-info:hover {
      background-color: #117a8b;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c82333;
    }

    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
    }

    .icon {
      font-size: 1rem;
    }

    .loading-container {
      padding: 3rem;
      text-align: center;
      color: #6c757d;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-container {
      padding: 2rem;
    }

    .error-message {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 8px;
      padding: 1.5rem;
      text-align: center;
    }

    .error-message h4 {
      color: #721c24;
      margin-bottom: 1rem;
    }

    .error-message p {
      color: #721c24;
      margin-bottom: 1.5rem;
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
}
