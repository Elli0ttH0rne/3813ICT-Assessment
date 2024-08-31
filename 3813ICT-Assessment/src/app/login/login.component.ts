import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  // Example list of valid users
  validUsers = [
    { username: 'user1', password: 'user1', email: 'user1@gmail.com', securityLevel: 'user' },
    { username: 'user2', password: 'user2', email: 'user2@gmail.com', securityLevel: 'user' },
    { username: 'user3', password: 'user3', email: 'user3@gmail.com', securityLevel: 'user' },
    { username: 'groupAdmin1', password: 'groupAdmin1', email: 'groupAdmin1@gmail.com',  securityLevel: 'groupAdmin' },
    { username: 'groupAdmin2', password: 'groupAdmin2', email: 'groupAdmin2@gmail.com',  securityLevel: 'groupAdmin' },
    { username: 'super', password: '123', email: 'super1@gmail.com',  securityLevel: 'superAdmin' },
  ];

  constructor(private router: Router) {}

  handleSubmit() {
    const currentUser = this.validUsers.find(
      u => u.username === this.username && u.password === this.password
    );

    if (currentUser) {
      console.log('Login successful');
      
      // Store user data including security level in local storage
      localStorage.setItem('currentUser', JSON.stringify({
        username: currentUser.username,
        email: currentUser.email,
        securityLevel: currentUser.securityLevel,
        valid: true
      }));

      // Navigate to the user group
      this.router.navigate(['/user-group']);
    } else {
      console.log('Invalid credentials');
      alert('Invalid username or password');
    }
  }
}
