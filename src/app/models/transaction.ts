export interface Transaction {
  id: number;
  accountId: number;
  type: TransactionType;
  amount: number;
  description: string;
  date: Date;
  balance: number;
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER'
}
