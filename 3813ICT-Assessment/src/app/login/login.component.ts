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
    { username: 'user1', password: 'user1', securityLevel: 'user' },
    { username: 'user2', password: 'user2', securityLevel: 'user' },
    { username: 'user3', password: 'user3', securityLevel: 'user' },
    { username: 'groupAdmin1', password: 'groupAdmin1', securityLevel: 'groupAdmin' },
    { username: 'groupAdmin2', password: 'groupAdmin2', securityLevel: 'groupAdmin' },
    { username: 'super', password: '123', securityLevel: 'superAdmin' },
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
