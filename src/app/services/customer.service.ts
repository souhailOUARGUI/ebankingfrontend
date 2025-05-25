import { Customer } from '../models/customer';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, catchError, throwError, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {
  private apiServerUrl = 'http://localhost:8085';

  constructor(private http: HttpClient) {
  }

  public getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiServerUrl}/customers`)
      .pipe(
        retry({ count: 3, delay: 1000 }),
        catchError(this.handleError)
      );
  }

  public getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiServerUrl}/customers/${id}`)
      .pipe(
        retry({ count: 2, delay: 1000 }),
        catchError(this.handleError)
      );
  }

  public addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiServerUrl}/customers`, customer)
      .pipe(
        catchError(this.handleError)
      );
  }

  public updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiServerUrl}/customers`, customer)
      .pipe(
        catchError(this.handleError)
      );
  }

  public deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/customers/${id}`)
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

    console.error('CustomerService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
