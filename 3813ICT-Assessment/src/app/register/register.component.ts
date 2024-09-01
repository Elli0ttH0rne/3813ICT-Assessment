import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { group } from 'node:console';

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

    // Add the new user
    const newUser = {
      username: this.username,
      email: this.email,
      password: this.password,
      roles: ['user'],
      groups: []
    };

    this.authService.addUser(newUser);

    // Store the new user data in local storage
    localStorage.setItem('currentUser', JSON.stringify({
      username: newUser.username,
      email: newUser.email,
      roles: newUser.roles,
      valid: true
    }));

    // Navigate to the user group
    this.router.navigate(['/user-group']);
  }
}
