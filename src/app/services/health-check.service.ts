import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {
  private apiServerUrl = '/api';

  constructor(private http: HttpClient) {}

  public checkBackendHealth(): Observable<boolean> {
    return this.http.get(`${this.apiServerUrl}/health`, {
      responseType: 'text',
      observe: 'response'
    }).pipe(
      map(response => response.status === 200),
      catchError(() => of(false))
    );
  }

  public checkCustomersEndpoint(): Observable<boolean> {
    return this.http.get(`${this.apiServerUrl}/customers`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
