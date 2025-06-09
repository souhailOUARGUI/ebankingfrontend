export interface BankAccount {
  id: string;
  balance: number;
  createdAt: Date | string;
  status: string | null; // Can be null
  customerId?: number; // Optional since backend has customer object
  customer?: {
    id: number;
    name: string;
    email: string;
  };
  customerDTO?: {
    id: number;
    name: string;
    email: string;
  };
  type: string; // "CurrentAccount" or "SavingAccount"
  currency?: string;
  interestRate?: number; // For saving accounts
  overdraft?: number; // For current accounts
}

export interface SavingBankAccount extends BankAccount {
  interestRate: number;
}

export interface CurrentBankAccount extends BankAccount {
  overDraft: number;
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}
