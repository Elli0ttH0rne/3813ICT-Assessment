import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service'; 

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  // User information
  username: string = '';
  roles: string = '';
  email: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  // Navigate back to the user group component
  navigateToUserGroup(): void {
    this.router.navigate(['/user-group']);
  }

  // Handle logout functionality
  logout(): void {
    // Clear previous user data from local storage
    localStorage.removeItem('currentUser');
    console.log('User logged out');
    // Navigate back to the login screen or home page
    this.router.navigate(['/']);
  }

  // Handle delete account functionality
  deleteAccount(): void {
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');

    if (confirmed) {
      // Call the deleteUser method from AuthService
      this.authService.deleteUser(this.username);
      
      // Clear user data from local storage
      localStorage.removeItem('currentUser');
      
      // Navigate back to the login screen or home page
      this.router.navigate(['/']);
    } else {
      console.log('Account deletion cancelled');
    }
  }

  ngOnInit(): void {
    // Retrieve currentUser information from local storage
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.username = storedUser.username;
    this.roles = storedUser.roles;
    this.email = storedUser.email;
  }

  // Navigate to the account component (if needed)
  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }
}
