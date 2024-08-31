import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule], // Import CommonModule and RouterModule
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
    // Implement your logout logic here
    console.log('User logged out');
    this.router.navigate(['/']);
  }

  // Handle delete account functionality
  deleteAccount(): void {
    // Implement your delete account logic here
    console.log('Account deleted');
    this.router.navigate(['/']);
  }

  // Navigate to the account component (if needed)
  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }
}