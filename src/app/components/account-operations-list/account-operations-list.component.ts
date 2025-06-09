import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountOperation, OperationType } from '../../models/account-operation';
import { AccountOperationService } from '../../services/account-operation.service';
import { BankAccount } from '../../models/bank-account';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-account-operations-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="operations-modal" *ngIf="account">
      <div class="modal-backdrop" (click)="onClose()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>Account Operations</h2>
          <button class="close-btn" (click)="onClose()">&times;</button>
        </div>
        
        <div class="account-info">
          <h3>Account: {{ account.id }}</h3>
          <p>Balance: {{ account.balance | currency:'USD':'symbol':'1.2-2' }}</p>
        </div>

        <div class="modal-body">
          <!-- Loading State -->
          <div class="loading-container" *ngIf="isLoading">
            <div class="loading-spinner"></div>
            <p>Loading operations...</p>
          </div>

          <!-- Error State -->
          <div class="error-container" *ngIf="errorMessage && !isLoading">
            <div class="error-message">
              <h4>⚠️ Error Loading Operations</h4>
              <p>{{ errorMessage }}</p>
              <button class="btn btn-primary" (click)="loadOperations()">
                🔄 Retry
              </button>
            </div>
          </div>

          <!-- Operations List -->
          <div class="operations-list" *ngIf="!isLoading && !errorMessage">
            <div class="table-container" *ngIf="operations.length > 0; else noOperations">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let operation of operations" 
                      [ngClass]="'operation-' + operation.operationType.toLowerCase()">
                    <td>{{ operation.operationDate | date:'short' }}</td>
                    <td>
                      <span class="operation-type" 
                            [ngClass]="'type-' + operation.operationType.toLowerCase()">
                        {{ operation.operationType }}
                      </span>
                    </td>
                    <td class="amount" 
                        [ngClass]="operation.operationType === 'CREDIT' ? 'credit' : 'debit'">
                      {{ operation.operationType === 'CREDIT' ? '+' : '-' }}{{ operation.amount | currency:'USD':'symbol':'1.2-2' }}
                    </td>
                    <td>{{ operation.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ng-template #noOperations>
              <div class="no-data">
                <p>No operations found for this account.</p>
              </div>
            </ng-template>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="onClose()">Close</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .operations-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-content {
      position: relative;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 90%;
      max-width: 800px;
      max-height: 80vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
    }

    .modal-header h2 {
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

    .account-info {
      padding: 1rem 1.5rem;
      background-color: #e9ecef;
      border-bottom: 1px solid #dee2e6;
    }

    .account-info h3 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .account-info p {
      margin: 0;
      color: #6c757d;
    }

    .modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-container {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }

    .error-message {
      text-align: center;
      padding: 2rem;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      color: #721c24;
    }

    .error-message h4 {
      margin-bottom: 1rem;
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

    .operation-type {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .type-credit {
      background-color: #d4edda;
      color: #155724;
    }

    .type-debit {
      background-color: #f8d7da;
      color: #721c24;
    }

    .amount {
      font-weight: 600;
    }

    .amount.credit {
      color: #28a745;
    }

    .amount.debit {
      color: #dc3545;
    }

    .no-data {
      text-align: center;
      padding: 2rem;
      color: #6c757d;
    }

    .modal-footer {
      padding: 1rem 1.5rem;
      background-color: #f8f9fa;
      border-top: 1px solid #dee2e6;
      display: flex;
      justify-content: flex-end;
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

    @media (max-width: 768px) {
      .modal-content {
        width: 95%;
        max-height: 90vh;
      }

      .modal-header,
      .modal-body,
      .modal-footer {
        padding: 1rem;
      }

      .account-info {
        padding: 1rem;
      }
    }
  `]
})
export class AccountOperationsListComponent implements OnInit, OnChanges {
  @Input() account: BankAccount | null = null;
  @Output() close = new EventEmitter<void>();

  public operations: AccountOperation[] = [];
  public isLoading = false;
  public errorMessage = '';

  constructor(private accountOperationService: AccountOperationService) {}

  ngOnInit(): void {
    if (this.account) {
      this.loadOperations();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['account'] && this.account) {
      this.loadOperations();
    }
  }

  public loadOperations(): void {
    if (!this.account) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.accountOperationService.getOperationsByAccount(this.account.id).subscribe({
      next: (operations: AccountOperation[]) => {
        this.operations = operations.sort((a, b) => 
          new Date(b.operationDate).getTime() - new Date(a.operationDate).getTime()
        );
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }

  public onClose(): void {
    this.close.emit();
  }
}
