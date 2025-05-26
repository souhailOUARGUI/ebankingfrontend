import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankAccountListComponent } from '../../components/bank-account-list/bank-account-list.component';
import { BankAccountFormComponent } from '../../components/bank-account-form/bank-account-form.component';
import { BankAccount } from '../../models/bank-account';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    BankAccountListComponent,
    BankAccountFormComponent
  ],
  template: `
    <div class="accounts-page">
      <div class="page-header">
        <h1>Account Management</h1>
        <p>Manage all bank accounts in the system</p>
      </div>
      
      <div class="page-content">
        <!-- Account List -->
        <app-bank-account-list
          (addAccount)="onAddAccount($event)"
          (editAccount)="onEditAccount($event)"
          (viewTransactions)="onViewTransactions($event)"
        ></app-bank-account-list>
      </div>
      
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
    .accounts-page {
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
    
    @media (max-width: 768px) {
      .accounts-page {
        padding: 1rem;
      }
    }
  `]
})
export class AccountsComponent {
  public showAccountForm = false;
  public accountToEdit: BankAccount | null = null;
  public preselectedCustomerId: number | null = null;

  public onAddAccount(customerId: number | null): void {
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
