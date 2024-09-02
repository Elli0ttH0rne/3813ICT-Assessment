import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule, RouterModule], // Include FormsModule
  standalone: true
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  handleSubmit() {
    // Check if the username already exists
    if (this.authService.getValidUsers().some(user => user.username === this.username)) {
      alert('Username already exists');
      return;
    }

    // Generate a unique userId
    const newUserId = this.generateUserId();

    // Add the new user
    const newUser = {
      userId: newUserId,
      username: this.username,
      email: this.email,
      password: this.password,
      roles: ['user'],
      groups: []
    };

    this.authService.addUser(newUser);

    // Store the new user data in local storage
    localStorage.setItem('currentUser', JSON.stringify({
      userId: newUser.userId,
      username: newUser.username,
      email: newUser.email,
      roles: newUser.roles,
      valid: true
    }));

    // Navigate to the user group
    this.router.navigate(['/user-group']);
  }

  // Generate a unique userId (e.g., 'u007')
  private generateUserId(): string {
    const users = this.authService.getValidUsers();
    const lastUserId = users.length ? users[users.length - 1].userId : 'u000';
    const lastIdNumber = parseInt(lastUserId.substring(1));
    const newUserId = 'u' + (lastIdNumber + 1).toString().padStart(3, '0');
    return newUserId;
  }
}
