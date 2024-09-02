import { Component, OnInit } from '@angular/core';
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
export class AccountComponent implements OnInit {
  // User information
  username: string = '';
  roles: string[] = [];
  email: string = '';
  userId: string = '';

  constructor(private router: Router, private authService: AuthService) {}

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
    // Check if the user is a groupAdmin or superAdmin
    if (this.isGroupAdminOrSuperAdmin()) {
      alert('Group Admins and Super Admins cannot delete their accounts.');
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');

    if (confirmed) {
      // Call the deleteUser method from AuthService
      this.authService.deleteUser(this.username);

      // Remove any pending requests for the user
      if (this.username) {
        this.authService.removePendingRequests(this.username);
      }

      // Clear user data from local storage
      localStorage.removeItem('currentUser');

      // Navigate back to the login screen or home page
      this.router.navigate(['/']);
    } else {
      console.log('Account deletion cancelled');
    }
  }

  // Method to check if the user is a groupAdmin or superAdmin
  isGroupAdminOrSuperAdmin(): boolean {
    return this.roles.includes('groupAdmin') || this.roles.includes('superAdmin');
  }

  ngOnInit(): void {
    // Retrieve currentUser information from local storage
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.username = storedUser.username || '';
    this.roles = storedUser.roles || [];
    this.email = storedUser.email || '';
    this.userId = storedUser.userId || '';
  }

  // Navigate to the account component (if needed)
  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }
  
  navigateToInbox(): void {
    this.router.navigate(['/inbox']);
  }
  
  // Navigate back to the user group component
  navigateToUserGroup(): void {
    this.router.navigate(['/user-group']);
  }
}
