import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from '../../components/customer-list/customer-list.component';
import { CustomerFormComponent } from '../../components/customer-form/customer-form.component';
import { BankAccountListComponent } from '../../components/bank-account-list/bank-account-list.component';
import { BankAccountFormComponent } from '../../components/bank-account-form/bank-account-form.component';
import { AccountOperationsListComponent } from '../../components/account-operations-list/account-operations-list.component';
import { Customer } from '../../models/customer';
import { BankAccount } from '../../models/bank-account';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    CustomerListComponent,
    CustomerFormComponent,
    BankAccountListComponent,
    BankAccountFormComponent,
    AccountOperationsListComponent
  ],
  template: `
    <div class="customers-page">
      <div class="page-header">
        <h1>Customer Management</h1>
        <p>Manage your customers and their bank accounts</p>
      </div>

      <div class="page-content">
        <!-- Customer List -->
        <app-customer-list
          (addCustomer)="onAddCustomer()"
          (editCustomer)="onEditCustomer($event)"
          (viewAccounts)="onViewCustomerAccounts($event)"
        ></app-customer-list>

        <!-- Customer Accounts Modal -->
        <div class="customer-accounts-modal" *ngIf="selectedCustomer" (click)="closeCustomerAccounts()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>
                <span class="customer-icon">👤</span>
                {{ selectedCustomer.name }}'s Accounts
              </h2>
              <button class="close-btn" (click)="closeCustomerAccounts()">&times;</button>
            </div>

            <div class="modal-body">
              <app-bank-account-list
                [customerId]="selectedCustomer.id"
                (addAccount)="onAddAccountForCustomer($event)"
                (editAccount)="onEditAccount($event)"
                (viewOperations)="onViewOperations($event)"
              ></app-bank-account-list>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer Form Modal -->
      <app-customer-form
        *ngIf="showCustomerForm"
        [customerToEdit]="customerToEdit"
        (formSubmit)="onCustomerFormSubmit($event)"
        (formCancel)="onCustomerFormCancel()"
      ></app-customer-form>

      <!-- Account Form Modal -->
      <app-bank-account-form
        *ngIf="showAccountForm"
        [accountToEdit]="accountToEdit"
        [preselectedCustomerId]="preselectedCustomerId"
        (formSubmit)="onAccountFormSubmit($event)"
        (formCancel)="onAccountFormCancel()"
      ></app-bank-account-form>

      <!-- Account Operations Modal -->
      <app-account-operations-list
        [account]="selectedAccountForOperations"
        (close)="onCloseOperations()"
      ></app-account-operations-list>
    </div>
  `,
  styles: [`
    .customers-page {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .page-header h1 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
      font-size: 2.5rem;
    }

    .page-header p {
      color: #6c757d;
      font-size: 1.1rem;
    }

    .page-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    /* Customer Accounts Modal */
    .customer-accounts-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-content {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 25px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      width: 95%;
      max-width: 1200px;
      max-height: 90vh;
      overflow: hidden;
      animation: slideUp 0.4s ease-out;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .modal-header {
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .customer-icon {
      font-size: 2rem;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 2rem;
      cursor: pointer;
      padding: 0;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: rotate(90deg);
    }

    .modal-body {
      padding: 0;
      overflow-y: auto;
      max-height: calc(90vh - 120px);
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background-color 0.2s;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }

    /* Override the account list container styles when in modal */
    .modal-body ::ng-deep .account-list-container {
      background: transparent;
      padding: 2rem;
      min-height: auto;
    }

    .modal-body ::ng-deep .header-section {
      display: none; /* Hide the header since we have modal header */
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .modal-content {
        width: 98%;
        margin: 1rem;
        border-radius: 20px;
      }

      .modal-header {
        padding: 1.5rem;
      }

      .modal-header h2 {
        font-size: 1.5rem;
      }

      .modal-body ::ng-deep .account-list-container {
        padding: 1rem;
      }
    }
  `]
})
export class CustomersComponent {
  public selectedCustomer: Customer | null = null;
  public showCustomerForm = false;
  public showAccountForm = false;
  public customerToEdit: Customer | null = null;
  public accountToEdit: BankAccount | null = null;
  public preselectedCustomerId: number | null = null;
  public selectedAccountForOperations: BankAccount | null = null;

  // Customer management methods
  public onAddCustomer(): void {
    this.customerToEdit = null;
    this.showCustomerForm = true;
  }

  public onEditCustomer(customer: Customer): void {
    this.customerToEdit = customer;
    this.showCustomerForm = true;
  }

  public onViewCustomerAccounts(customer: Customer): void {
    this.selectedCustomer = customer;
  }

  public closeCustomerAccounts(): void {
    this.selectedCustomer = null;
  }

  public onCustomerFormSubmit(customer: Customer): void {
    this.showCustomerForm = false;
    this.customerToEdit = null;
    // The customer list will automatically refresh
  }

  public onCustomerFormCancel(): void {
    this.showCustomerForm = false;
    this.customerToEdit = null;
  }

  // Account management methods
  public onAddAccountForCustomer(customerId: number | null): void {
    this.accountToEdit = null;
    this.preselectedCustomerId = customerId;
    this.showAccountForm = true;
  }

  public onEditAccount(account: BankAccount): void {
    this.accountToEdit = account;
    this.preselectedCustomerId = null;
    this.showAccountForm = true;
  }

  public onViewOperations(account: BankAccount): void {
    this.selectedAccountForOperations = account;
  }

  public onCloseOperations(): void {
    this.selectedAccountForOperations = null;
  }

  public onAccountFormSubmit(account: BankAccount): void {
    this.showAccountForm = false;
    this.accountToEdit = null;
    this.preselectedCustomerId = null;
    // The account list will automatically refresh
  }

  public onAccountFormCancel(): void {
    this.showAccountForm = false;
    this.accountToEdit = null;
    this.preselectedCustomerId = null;
  }
}
