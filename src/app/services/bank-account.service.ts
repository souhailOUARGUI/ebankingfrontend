import { BankAccount, SavingBankAccount, CurrentBankAccount } from '../models/bank-account';
import { CreateAccountRequest, CreateCurrentAccountRequest, CreateSavingAccountRequest } from '../models/account-requests';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, catchError, throwError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BankAccountService {
  private apiServerUrl = '/api';

  constructor(private http: HttpClient) {
  }

  public getAccounts(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(`${this.apiServerUrl}/accounts`)
      .pipe(
        retry({ count: 3, delay: 1000 }),
        catchError(this.handleError)
      );
  }

  public getAccount(id: string): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.apiServerUrl}/accounts/${id}`)
      .pipe(
        retry({ count: 2, delay: 1000 }),
        catchError(this.handleError)
      );
  }

  public getAccountsByCustomer(customerId: number): Observable<BankAccount[]> {
    // Since the backend doesn't have a specific endpoint for customer accounts,
    // we'll get all accounts and filter by customer ID on the frontend
    return this.getAccounts().pipe(
      map((accounts: BankAccount[]) =>
        accounts.filter(account =>
          account.customerId === customerId ||
          account.customer?.id === customerId ||
          account.customerDTO?.id === customerId
        )
      )
    );
  }

  public addAccount(request: CreateAccountRequest): Observable<BankAccount> {
    console.log('Creating account with request:', request);

    return this.http.post<BankAccount>(`${this.apiServerUrl}/accounts`, request)
      .pipe(
        catchError(this.handleError)
      );
  }

  public addCurrentAccount(request: CreateCurrentAccountRequest): Observable<CurrentBankAccount> {
    console.log('Creating current account with request:', request);

    return this.http.post<CurrentBankAccount>(`${this.apiServerUrl}/accounts/current`, request)
      .pipe(
        catchError(this.handleError)
      );
  }

  public addSavingAccount(request: CreateSavingAccountRequest): Observable<SavingBankAccount> {
    console.log('Creating saving account with request:', request);

    return this.http.post<SavingBankAccount>(`${this.apiServerUrl}/accounts/saving`, request)
      .pipe(
        catchError(this.handleError)
      );
  }

  public deleteAccount(accountId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/accounts/${accountId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  public updateAccount(account: BankAccount | SavingBankAccount | CurrentBankAccount): Observable<BankAccount> {
    return this.http.put<BankAccount>(`${this.apiServerUrl}/accounts`, account)
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
