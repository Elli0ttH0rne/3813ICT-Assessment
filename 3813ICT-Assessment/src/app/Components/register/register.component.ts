import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsersService } from '../../services/users/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule, RouterModule], 
  standalone: true
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private usersService: UsersService,
  ) {}

  handleSubmit() {
    this.usersService.getValidUsers().subscribe({
      next: (users) => {
        // Check if any fields are empty
        if (this.username === '' || this.email === '' || this.password === '') {
          alert('Please fill in all fields');
          return;
        }
  
        // Generate a new user ID
        const newUserId = this.generateUserId(users);
  
        const newUser = {
          userId: newUserId,
          username: this.username,
          email: this.email,
          password: this.password,
          roles: ['user'],
          groups: []
        };
  
        // Add the new user to users.json via API request
        this.usersService.addUser(newUser).subscribe({
          next: () => {
            // Store user information in localStorage
            localStorage.setItem('currentUser', JSON.stringify({
              userId: newUser.userId,
              username: newUser.username,
              email: newUser.email,
              roles: newUser.roles,
              valid: true
            }));
  
            // Navigate to user group page after successful registration
            this.router.navigate(['/user-group']);
          },
          error: (err) => {
            console.error('Failed to add user:', err);
            alert('Failed to register. Please try again.');
          }
        });
      },
      error: (err) => {
        console.error('Failed to load users:', err);
      }
    });
  }
  

  // Generate a unique userId (e.g., 'u007')
  private generateUserId(users: any[]): string {
    const lastUserId = users.length ? users[users.length - 1].userId : 'u000';
    const lastIdNumber = parseInt(lastUserId.substring(1));
    const newUserId = 'u' + (lastIdNumber + 1).toString().padStart(3, '0');
    return newUserId;
  }
}
