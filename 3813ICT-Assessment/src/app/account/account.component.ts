import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  username: string = 'JohnDoe';
  email: string = 'john.doe@example.com';

  constructor(private router: Router) {}

  // Navigate back to the user group component
  navigateToUserGroup(): void {
    this.router.navigate(['/user-group']);
  }

  // Handle logout functionality
  logout(): void {
    // Clear user data from local storage
    localStorage.removeItem('user');
    
    // Implement additional logout logic here if needed
    console.log('User logged out');
    
    // Navigate back to the login screen or home page
    this.router.navigate(['/']);
  }

  // Handle delete account functionality
  deleteAccount(): void {
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');

    if (confirmed) {
      // Implement your delete account logic here
      console.log('Account deleted');

      // Clear user data from local storage
      localStorage.removeItem('user');
      
      // Navigate back to the login screen or home page
      this.router.navigate(['/']);
    } else {
      console.log('Account deletion cancelled');
    }
  }

  // Navigate to the account component (if needed)
  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }
}
