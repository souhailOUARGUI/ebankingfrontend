// Request DTOs to match the backend API

export interface CreateAccountRequest {
  initialBalance: number;
  customerId: number;
  type: string; // "current", "saving", or other
  overdraft?: number; // for current accounts
  interestRate?: number; // for saving accounts
}

export interface CreateCurrentAccountRequest {
  initialBalance: number;
  overdraft: number;
  customerId: number;
}

export interface CreateSavingAccountRequest {
  initialBalance: number;
  interestRate: number;
  customerId: number;
}
