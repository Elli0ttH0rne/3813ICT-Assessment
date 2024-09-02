import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule, RouterModule],
  standalone: true
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  handleSubmit() {
    const currentUser = this.authService.getValidUsers().find(
      u => u.username === this.username && u.password === this.password
    );
  
    if (currentUser) {
      console.log('Login successful');
      
      // Store user data in local storage
      localStorage.setItem('currentUser', JSON.stringify({
        userID: currentUser.userId,  // Ensure userID is stored
        username: currentUser.username,
        email: currentUser.email,
        roles: currentUser.roles,
        groups: currentUser.groups,
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
