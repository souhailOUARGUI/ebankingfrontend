import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankAccount, AccountStatus } from '../../models/bank-account';
import { BankAccountService } from '../../services/bank-account.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-bank-account-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="account-list-container">
      <!-- Header Section -->
      <div class="header-section">
        <div class="header-content">
          <h1 class="page-title">
            <span class="title-icon">💳</span>
            {{ customerId ? 'Customer Accounts' : 'Bank Accounts' }}
          </h1>
          <p class="page-subtitle">
            {{ customerId ? 'Manage customer bank accounts' : 'Manage all bank accounts in the system' }}
          </p>
        </div>
        <button class="add-account-btn" (click)="onAddAccount()">
          <span class="btn-icon">+</span>
          <span class="btn-text">New Account</span>
        </button>
      </div>

      <!-- Stats Overview -->
      <div class="stats-overview" *ngIf="accounts.length > 0">
        <div class="stat-card">
          <div class="stat-value">{{ accounts.length }}</div>
          <div class="stat-label">Total Accounts</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ getTotalBalance() | currency:'USD':'symbol':'1.0-0' }}</div>
          <div class="stat-label">Total Balance</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ getActiveAccountsCount() }}</div>
          <div class="stat-label">Active Accounts</div>
        </div>
      </div>

      <!-- Accounts Table-Row Style -->
      <div class="accounts-list" *ngIf="accounts.length > 0; else noAccounts">
        <div class="account-row" *ngFor="let account of accounts; trackBy: trackByAccountId">
          <!-- Account Type Icon -->
          <div class="account-type-icon" [ngClass]="'type-' + getAccountTypeBadgeClass(account)">
            {{ getAccountTypeIcon(account) }}
          </div>

          <!-- Account Info -->
          <div class="account-info">
            <div class="account-primary">
              <span class="account-balance">{{ account.balance | currency:'USD':'symbol':'1.2-2' }}</span>
              <span class="account-type-text">{{ getAccountTypeDisplay(account) }}</span>
            </div>
            <div class="account-secondary">
              <span class="account-id">{{ account.id | slice:0:12 }}...</span>
              <span class="account-status" [ngClass]="'status-' + (account.status || 'created').toLowerCase()">
                {{ account.status || 'CREATED' }}
              </span>
              <span class="customer-name" *ngIf="!customerId && (account.customer || account.customerDTO)">
                👤 {{ (account.customer || account.customerDTO)?.name }}
              </span>
              <span class="interest-rate" *ngIf="account.type === 'SavingAccount' && account.interestRate">
                📈 {{ account.interestRate }}%
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button class="action-btn operations" (click)="onViewOperations(account)" title="View Operations">
              📊
            </button>
            <button class="action-btn edit" (click)="onEditAccount(account)" title="Edit Account">
              ✏️
            </button>
            <button class="action-btn delete" (click)="onDeleteAccount(account.id)" title="Delete Account">
              🗑️
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <ng-template #noAccounts>
        <div class="empty-state">
          <div class="empty-icon">🏦</div>
          <h2 class="empty-title">No Accounts Found</h2>
          <p class="empty-description">
            {{ customerId ? 'This customer doesn\'t have any accounts yet.' : 'No bank accounts in the system.' }}
          </p>
          <button class="empty-action-btn" (click)="onAddAccount()">
            <span class="btn-icon">+</span>
            <span class="btn-text">Create First Account</span>
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .account-list-container {
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

    .add-account-btn {
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

    .add-account-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
    }

    .btn-icon {
      font-size: 1.2rem;
      font-weight: bold;
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

    /* Accounts List - Table Row Style */
    .accounts-list {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .account-row {
      display: flex;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid rgba(102, 126, 234, 0.1);
      transition: all 0.3s ease;
      gap: 1rem;
    }

    .account-row:last-child {
      border-bottom: none;
    }

    .account-row:hover {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
      transform: translateX(5px);
    }

    /* Account Type Icon */
    .account-type-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .type-saving {
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      color: white;
    }

    .type-current {
      background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
      color: white;
    }

    .type-standard {
      background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
      color: white;
    }

    /* Account Info */
    .account-info {
      flex: 1;
      min-width: 0;
    }

    .account-primary {
      display: flex;
      align-items: baseline;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .account-balance {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2d3748;
    }

    .account-type-text {
      font-size: 1rem;
      font-weight: 600;
      color: #4a5568;
    }

    .account-secondary {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .account-id {
      font-family: 'Courier New', monospace;
      font-size: 0.8rem;
      color: #718096;
      background: #f7fafc;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .account-status {
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-active {
      background: #c6f6d5;
      color: #22543d;
    }

    .status-inactive {
      background: #fed7d7;
      color: #742a2a;
    }

    .status-suspended {
      background: #fefcbf;
      color: #744210;
    }

    .status-created {
      background: #e6fffa;
      color: #234e52;
    }

    .customer-name {
      font-size: 0.8rem;
      color: #4a5568;
      font-weight: 500;
    }

    .interest-rate {
      font-size: 0.8rem;
      color: #38a169;
      font-weight: 600;
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

    .action-btn.operations {
      background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
      color: white;
    }

    .action-btn.operations:hover {
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
      .account-list-container {
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

      .account-row {
        padding: 0.75rem 1rem;
        gap: 0.75rem;
      }

      .account-type-icon {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
      }

      .account-balance {
        font-size: 1.2rem;
      }

      .account-type-text {
        font-size: 0.9rem;
      }

      .account-secondary {
        gap: 0.5rem;
      }

      .action-btn {
        width: 35px;
        height: 35px;
        font-size: 1rem;
      }
    }
  `]
})
export class BankAccountListComponent implements OnInit {
  @Input() customerId: number | null = null;
  public accounts: BankAccount[] = [];
  @Output() addAccount = new EventEmitter<number | null>();
  @Output() editAccount = new EventEmitter<BankAccount>();
  @Output() viewOperations = new EventEmitter<BankAccount>();

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
        console.log('Accounts received from backend:', response);
        this.accounts = response;
        console.log('Accounts array after assignment:', this.accounts);
        console.log('Accounts length:', this.accounts.length);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading accounts:', error);
        alert('Error loading accounts: ' + error.message);
      }
    });
  }

  public getAccountTypeDisplay(account: BankAccount): string {
    if (account.type === 'SavingAccount') return 'Saving';
    if (account.type === 'CurrentAccount') return 'Current';
    return 'Standard';
  }

  public getAccountTypeBadgeClass(account: BankAccount): string {
    if (account.type === 'SavingAccount') return 'saving';
    if (account.type === 'CurrentAccount') return 'current';
    return 'standard';
  }

  public getAccountTypeIcon(account: BankAccount): string {
    if (account.type === 'SavingAccount') return '🏦';
    if (account.type === 'CurrentAccount') return '💳';
    return '🏛️';
  }

  public getTotalBalance(): number {
    return this.accounts.reduce((total, account) => total + account.balance, 0);
  }

  public getActiveAccountsCount(): number {
    return this.accounts.filter(account => account.status && account.status.toLowerCase() === 'active').length;
  }

  public getSavingAccountRate(account: BankAccount): number {
    return account.interestRate || 5.5;
  }

  public getCurrentAccountOverdraft(account: BankAccount): number {
    // Since the backend doesn't return overdraft in the DTO, we'll show a default
    // In a real app, you'd need to fetch this from the backend or include it in the DTO
    return 1000;
  }

  public trackByAccountId(index: number, account: BankAccount): string {
    return account.id;
  }

  public onAddAccount(): void {
    this.addAccount.emit(this.customerId);
  }

  public onEditAccount(account: BankAccount): void {
    this.editAccount.emit(account);
  }

  public onViewOperations(account: BankAccount): void {
    this.viewOperations.emit(account);
  }

  public onDeleteAccount(accountId: string): void {
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
