import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankAccount, AccountType, AccountStatus } from '../../models/bank-account';
import { Customer } from '../../models/customer';
import { BankAccountService } from '../../services/bank-account.service';
import { CustomerService } from '../../services/customer.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-bank-account-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-overlay" (click)="onCancel()">
      <div class="form-modal" (click)="$event.stopPropagation()">
        <div class="form-header">
          <h3>{{ isEditMode ? 'Edit Account' : 'Add New Account' }}</h3>
          <button class="close-btn" (click)="onCancel()">&times;</button>
        </div>
        
        <form (ngSubmit)="onSubmit()" #accountForm="ngForm" class="account-form">
          <div class="form-group">
            <label for="accountNumber">Account Number *</label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              [(ngModel)]="account.accountNumber"
              required
              class="form-control"
              placeholder="Enter account number"
              [readonly]="isEditMode"
            >
          </div>
          
          <div class="form-group">
            <label for="accountType">Account Type *</label>
            <select
              id="accountType"
              name="accountType"
              [(ngModel)]="account.accountType"
              required
              class="form-control"
            >
              <option value="">Select account type</option>
              <option *ngFor="let type of accountTypes" [value]="type">
                {{ type }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="customerId">Customer *</label>
            <select
              id="customerId"
              name="customerId"
              [(ngModel)]="account.customerId"
              required
              class="form-control"
              [disabled]="preselectedCustomerId !== null"
            >
              <option value="">Select customer</option>
              <option *ngFor="let customer of customers" [value]="customer.id">
                {{ customer.name }} ({{ customer.email }})
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="balance">Initial Balance *</label>
            <input
              type="number"
              id="balance"
              name="balance"
              [(ngModel)]="account.balance"
              required
              min="0"
              step="0.01"
              class="form-control"
              placeholder="0.00"
            >
          </div>
          
          <div class="form-group">
            <label for="status">Status *</label>
            <select
              id="status"
              name="status"
              [(ngModel)]="account.status"
              required
              class="form-control"
            >
              <option *ngFor="let status of accountStatuses" [value]="status">
                {{ status }}
              </option>
            </select>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary" 
              [disabled]="!accountForm.form.valid || isSubmitting"
            >
              {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .form-modal {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #dee2e6;
      background-color: #f8f9fa;
    }
    
    .form-header h3 {
      margin: 0;
      color: #2c3e50;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #6c757d;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .close-btn:hover {
      color: #495057;
    }
    
    .account-form {
      padding: 1.5rem;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #495057;
    }
    
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
    
    .form-control:disabled {
      background-color: #e9ecef;
      opacity: 1;
    }
    
    .form-control[readonly] {
      background-color: #e9ecef;
    }
    
    .form-control.ng-invalid.ng-touched {
      border-color: #dc3545;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #dee2e6;
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
      min-width: 100px;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }
    
    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }
    
    .btn-secondary:hover {
      background-color: #545b62;
    }
  `]
})
export class BankAccountFormComponent implements OnInit {
  @Input() accountToEdit: BankAccount | null = null;
  @Input() preselectedCustomerId: number | null = null;
  @Output() formSubmit = new EventEmitter<BankAccount>();
  @Output() formCancel = new EventEmitter<void>();

  public account: BankAccount = {
    id: 0,
    accountNumber: '',
    accountType: AccountType.CHECKING,
    balance: 0,
    customerId: 0,
    status: AccountStatus.ACTIVE
  };
  
  public customers: Customer[] = [];
  public accountTypes = Object.values(AccountType);
  public accountStatuses = Object.values(AccountStatus);
  public isEditMode = false;
  public isSubmitting = false;

  constructor(
    private bankAccountService: BankAccountService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    
    if (this.accountToEdit) {
      this.isEditMode = true;
      this.account = { ...this.accountToEdit };
    } else if (this.preselectedCustomerId) {
      this.account.customerId = this.preselectedCustomerId;
    }
  }

  private loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (customers: Customer[]) => {
        this.customers = customers;
      },
      error: (error: HttpErrorResponse) => {
        alert('Error loading customers: ' + error.message);
      }
    });
  }

  public onSubmit(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    const operation = this.isEditMode 
      ? this.bankAccountService.updateAccount(this.account)
      : this.bankAccountService.addAccount(this.account);

    operation.subscribe({
      next: (response: BankAccount) => {
        this.formSubmit.emit(response);
        this.isSubmitting = false;
      },
      error: (error: HttpErrorResponse) => {
        alert('Error saving account: ' + error.message);
        this.isSubmitting = false;
      }
    });
  }

  public onCancel(): void {
    this.formCancel.emit();
  }
}
