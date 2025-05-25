import { Customer } from './customer';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {
  private apiServerUrl = 'http://localhost:8080/api/customers';

  constructor(private http: HttpClient) {
  }
  public getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiServerUrl}/customers`);
  }

  public getCustomer( id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiServerUrl}/customers/${id}`);
  }
  public addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiServerUrl}/customers`, customer);
  }

  public updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiServerUrl}/customers`, customer);
  }

  public deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/customers/${id}`);
  }
}
