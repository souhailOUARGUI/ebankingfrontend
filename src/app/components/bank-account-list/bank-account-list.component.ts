import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankAccount, AccountType, AccountStatus } from '../../models/bank-account';
import { BankAccountService } from '../../services/bank-account.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-bank-account-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="account-list">
      <div class="list-header">
        <h3>{{ customerId ? 'Customer Accounts' : 'All Bank Accounts' }}</h3>
        <button class="btn btn-primary" (click)="onAddAccount()">
          <i class="icon">+</i> Add Account
        </button>
      </div>
      
      <div class="table-container" *ngIf="accounts.length > 0; else noAccounts">
        <table class="data-table">
          <thead>
            <tr>
              <th>Account Number</th>
              <th>Type</th>
              <th>Balance</th>
              <th *ngIf="!customerId">Customer</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let account of accounts">
              <td>{{ account.accountNumber }}</td>
              <td>
                <span class="badge" [ngClass]="'badge-' + account.accountType.toLowerCase()">
                  {{ account.accountType }}
                </span>
              </td>
              <td class="balance">{{ account.balance | currency:'USD':'symbol':'1.2-2' }}</td>
              <td *ngIf="!customerId">{{ account.customerName || 'N/A' }}</td>
              <td>
                <span class="status" [ngClass]="'status-' + account.status.toLowerCase()">
                  {{ account.status }}
                </span>
              </td>
              <td class="actions">
                <button class="btn btn-sm btn-secondary" (click)="onEditAccount(account)">
                  Edit
                </button>
                <button class="btn btn-sm btn-info" (click)="onViewTransactions(account)">
                  Transactions
                </button>
                <button class="btn btn-sm btn-danger" (click)="onDeleteAccount(account.id)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <ng-template #noAccounts>
        <div class="no-data">
          <p>No accounts found. <a href="#" (click)="onAddAccount()">Add the first account</a></p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .account-list {
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
    
    .balance {
      font-weight: 600;
      color: #28a745;
    }
    
    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }
    
    .badge-checking {
      background-color: #e3f2fd;
      color: #1976d2;
    }
    
    .badge-savings {
      background-color: #e8f5e8;
      color: #388e3c;
    }
    
    .badge-business {
      background-color: #fff3e0;
      color: #f57c00;
    }
    
    .status {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }
    
    .status-active {
      background-color: #d4edda;
      color: #155724;
    }
    
    .status-inactive {
      background-color: #f8d7da;
      color: #721c24;
    }
    
    .status-suspended {
      background-color: #fff3cd;
      color: #856404;
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
  `]
})
export class BankAccountListComponent implements OnInit {
  @Input() customerId: number | null = null;
  public accounts: BankAccount[] = [];
  @Output() addAccount = new EventEmitter<number | null>();
  @Output() editAccount = new EventEmitter<BankAccount>();
  @Output() viewTransactions = new EventEmitter<BankAccount>();

  constructor(private bankAccountService: BankAccountService) {}

  ngOnInit(): void {
    this.getAccounts();
  }

  public getAccounts(): void {
    const request = this.customerId 
      ? this.bankAccountService.getAccountsByCustomer(this.customerId)
      : this.bankAccountService.getAccounts();

    request.subscribe({
      next: (response: BankAccount[]) => {
        this.accounts = response;
      },
      error: (error: HttpErrorResponse) => {
        alert('Error loading accounts: ' + error.message);
      }
    });
  }

  public onAddAccount(): void {
    this.addAccount.emit(this.customerId);
  }

  public onEditAccount(account: BankAccount): void {
    this.editAccount.emit(account);
  }

  public onViewTransactions(account: BankAccount): void {
    this.viewTransactions.emit(account);
  }

  public onDeleteAccount(accountId: number): void {
    if (confirm('Are you sure you want to delete this account?')) {
      this.bankAccountService.deleteAccount(accountId).subscribe({
        next: () => {
          this.getAccounts(); // Refresh the list
        },
        error: (error: HttpErrorResponse) => {
          alert('Error deleting account: ' + error.message);
        }
      });
    }
  }
}
