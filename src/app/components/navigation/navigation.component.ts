import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <h2>E-Banking System</h2>
        </div>
        <ul class="nav-menu">
          <li class="nav-item">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a>
          </li>
          <li class="nav-item">
            <a routerLink="/customers" routerLinkActive="active" class="nav-link">Customers</a>
          </li>
          <li class="nav-item">
            <a routerLink="/accounts" routerLinkActive="active" class="nav-link">Accounts</a>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: #2c3e50;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
    }
    
    .nav-brand h2 {
      color: white;
      margin: 0;
      font-size: 1.5rem;
    }
    
    .nav-menu {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 2rem;
    }
    
    .nav-link {
      color: #ecf0f1;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    
    .nav-link:hover,
    .nav-link.active {
      background-color: #34495e;
      color: white;
    }
  `]
})
export class NavigationComponent {}
