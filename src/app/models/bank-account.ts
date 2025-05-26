export interface BankAccount {
  id: number;
  accountNumber: string;
  accountType: AccountType;
  balance: number;
  customerId: number;
  customerName?: string;
  dateCreated?: Date;
  status: AccountStatus;
}

export enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  BUSINESS = 'BUSINESS'
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}
