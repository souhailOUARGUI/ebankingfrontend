import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, retry, catchError, throwError } from 'rxjs';
import { AccountOperation } from '../models/account-operation';

@Injectable({
  providedIn: 'root'
})
export class AccountOperationService {
  private apiServerUrl = '/api';

  constructor(private http: HttpClient) {}

  public getOperationsByAccount(accountId: string): Observable<AccountOperation[]> {
    return this.http.get<AccountOperation[]>(`${this.apiServerUrl}/accounts/${accountId}/operations`)
      .pipe(
        retry({ count: 3, delay: 1000 }),
        catchError(this.handleError)
      );
  }

  public getOperation(id: number): Observable<AccountOperation> {
    return this.http.get<AccountOperation>(`${this.apiServerUrl}/operations/${id}`)
      .pipe(
        retry({ count: 2, delay: 1000 }),
        catchError(this.handleError)
      );
  }

  public addDebitOperation(accountId: string, amount: number, description: string): Observable<AccountOperation> {
    return this.http.post<AccountOperation>(
      `${this.apiServerUrl}/accounts/debit`,
      { accountId, amount, description }
    ).pipe(
      catchError(this.handleError)
    );
  }

  public addCreditOperation(accountId: string, amount: number, description: string): Observable<AccountOperation> {
    return this.http.post<AccountOperation>(
      `${this.apiServerUrl}/accounts/credit`,
      { accountId, amount, description }
    ).pipe(
      catchError(this.handleError)
    );
  }

  public addTransferOperation(
    sourceAccountId: string,
    destinationAccountId: string,
    amount: number,
    description: string
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiServerUrl}/accounts/transfer`,
      { sourceAccountId, destinationAccountId, amount, description }
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to the server. Please check if the backend server is running on http://localhost:8085';
      } else {
        errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }
    }

    console.error('AccountOperationService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
