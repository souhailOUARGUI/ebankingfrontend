import { BankAccount } from '../models/bank-account';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BankAccountService {
  private apiServerUrl = 'http://localhost:8085';

  constructor(private http: HttpClient) {
  }

  public getAccounts(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(`${this.apiServerUrl}/accounts`)
      .pipe(
        retry({ count: 3, delay: 1000 }),
        catchError(this.handleError)
      );
  }

  public getAccount(id: number): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.apiServerUrl}/accounts/${id}`)
      .pipe(
        retry({ count: 2, delay: 1000 }),
        catchError(this.handleError)
      );
  }

  public getAccountsByCustomer(customerId: number): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(`${this.apiServerUrl}/accounts/customer/${customerId}`)
      .pipe(
        retry({ count: 3, delay: 1000 }),
        catchError(this.handleError)
      );
  }

  public addAccount(account: BankAccount): Observable<BankAccount> {
    return this.http.post<BankAccount>(`${this.apiServerUrl}/accounts`, account)
      .pipe(
        catchError(this.handleError)
      );
  }

  public updateAccount(account: BankAccount): Observable<BankAccount> {
    return this.http.put<BankAccount>(`${this.apiServerUrl}/accounts`, account)
      .pipe(
        catchError(this.handleError)
      );
  }

  public deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/accounts/${id}`)
      .pipe(
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

    console.error('BankAccountService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
