import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from '../../components/customer-list/customer-list.component';
import { CustomerFormComponent } from '../../components/customer-form/customer-form.component';
import { BankAccountListComponent } from '../../components/bank-account-list/bank-account-list.component';
import { BankAccountFormComponent } from '../../components/bank-account-form/bank-account-form.component';
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
    BankAccountFormComponent
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
        
        <!-- Customer Accounts Section -->
        <div class="customer-accounts" *ngIf="selectedCustomer">
          <div class="section-header">
            <h2>{{ selectedCustomer.name }}'s Accounts</h2>
            <button class="btn btn-secondary" (click)="closeCustomerAccounts()">
              Close
            </button>
          </div>
          
          <app-bank-account-list
            [customerId]="selectedCustomer.id"
            (addAccount)="onAddAccountForCustomer($event)"
            (editAccount)="onEditAccount($event)"
            (viewTransactions)="onViewTransactions($event)"
          ></app-bank-account-list>
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
    
    .customer-accounts {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .section-header h2 {
      margin: 0;
      color: #2c3e50;
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
    
    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }
    
    .btn-secondary:hover {
      background-color: #545b62;
    }
    
    @media (max-width: 768px) {
      .customers-page {
        padding: 1rem;
      }
      
      .section-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
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

  public onViewTransactions(account: BankAccount): void {
    // TODO: Implement transaction view
    alert(`Viewing transactions for account ${account.accountNumber} - Feature coming soon!`);
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
