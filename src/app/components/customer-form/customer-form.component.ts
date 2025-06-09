import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-overlay" (click)="onCancel()">
      <div class="form-modal" (click)="$event.stopPropagation()">
        <div class="form-header">
          <h2>
            <span class="header-icon">{{ isEditMode ? '✏️' : '👤' }}</span>
            {{ isEditMode ? 'Edit Customer' : 'Add New Customer' }}
          </h2>
          <button class="close-btn" (click)="onCancel()">&times;</button>
        </div>

        <form (ngSubmit)="onSubmit()" #customerForm="ngForm" class="customer-form">
          <div class="form-group">
            <label for="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              [(ngModel)]="customer.name"
              required
              class="form-control"
              placeholder="Enter customer name"
            >
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="customer.email"
              required
              email
              class="form-control"
              placeholder="Enter email address"
            >
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="!customerForm.form.valid || isSubmitting"
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
    }

    .customer-form {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
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
      font-size: 1rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      transition: border-color 0.15s ease-in-out;
    }

    .form-control:focus {
      border-color: #80bdff;
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background-color 0.2s;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
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
export class CustomerFormComponent implements OnInit {
  @Input() customerToEdit: Customer | null = null;
  @Output() formSubmit = new EventEmitter<Customer>();
  @Output() formCancel = new EventEmitter<void>();

  public customer: Customer = {
    id: 0,
    name: '',
    email: ''
  };

  public isEditMode = false;
  public isSubmitting = false;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    if (this.customerToEdit) {
      this.isEditMode = true;
      this.customer = { ...this.customerToEdit };
    }
  }

  public onSubmit(): void {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    console.log('Submitting customer:', this.customer);

    const operation = this.isEditMode
      ? this.customerService.updateCustomer(this.customer)
      : this.customerService.addCustomer(this.customer);

    operation.subscribe({
      next: (response: Customer) => {
        console.log('Customer saved successfully:', response);
        this.formSubmit.emit(response);
        this.isSubmitting = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error saving customer:', error);
        alert('Error saving customer: ' + error.message);
        this.isSubmitting = false;
      }
    });
  }

  public onCancel(): void {
    this.formCancel.emit();
  }
}
