import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private defaultUsers = [
    { 
      username: 'user1', 
      password: 'user1', 
      email: 'user1@gmail.com', 
      securityLevel: 'user' 
    },
    { 
      username: 'user2', 
      password: 'user2', 
      email: 'user2@gmail.com', 
      securityLevel: 'user' 
    },
    { 
      username: 'user3', 
      password: 'user3', 
      email: 'user3@gmail.com', 
      securityLevel: 'user' 
    },
    { username: 'groupAdmin1', 
      password: 'groupAdmin1', 
      email: 'groupAdmin1@gmail.com', 
      securityLevel: 'groupAdmin' 
    },
    { 
      username: 'super', 
      password: '123', 
      email: 'super1@gmail.com', 
      securityLevel: 'superAdmin' 
    },
  ];

  constructor() {
    this.initializeUsers();
  }

  private initializeUsers() {
    const validUsers = localStorage.getItem('validUsers');
    if (!validUsers) {
      localStorage.setItem('validUsers', JSON.stringify(this.defaultUsers));
    }
  }

  getValidUsers(): { username: string, password: string, email: string, securityLevel: string }[] {
    return JSON.parse(localStorage.getItem('validUsers') || '[]');
  }

  addUser(user: { username: string, password: string, email: string, securityLevel: string }) {
    const users = this.getValidUsers();
    users.push(user);
    localStorage.setItem('validUsers', JSON.stringify(users));
  }

  deleteUser(username: string) {
    const users = this.getValidUsers().filter(user => user.username !== username);
    localStorage.setItem('validUsers', JSON.stringify(users));
  }
}
