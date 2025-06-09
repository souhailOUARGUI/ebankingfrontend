export interface AccountOperation {
  id: number;
  amount: number;
  operationDate: Date;
  operationType: OperationType;
  bankAccountId: string;  // To reference the bank account
  description: string;
}

export enum OperationType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT'
}
