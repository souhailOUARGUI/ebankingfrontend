import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Customer} from './customer';
import {CustomerService} from './customer.service';
import { HttpErrorResponse } from '@angular/common/http';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent implements  OnInit {
  public customers: Customer[] = [];
  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
        this.getCustomers()
    }

    public getCustomers(): void {
    this.customerService.getCustomers().subscribe((response: Customer[]) => {
      this.customers = response;
    }), (error: HttpErrorResponse) => {
      alert(error.message);
    };
    }

    title = 'ebankingfrontend';
}
