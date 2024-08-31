import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AccountComponent {
  username: string = 'JohnDoe'; // Example username
  email: string = 'john.doe@example.com'; // Example email

  constructor(private router: Router) {}

  // Navigate back to the user-group component
  navigateBack(): void {
    this.router.navigate(['/user-group']);
  }

  // Navigate to the root route (logout)
  logout(): void {
    this.router.navigate(['']);
  }

  // Handle account deletion
  deleteAccount(): void {
    // Add your account deletion logic here
    console.log('Account deleted');
    this.router.navigate(['']);
  }
}