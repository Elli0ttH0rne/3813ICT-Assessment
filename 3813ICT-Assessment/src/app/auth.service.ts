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
      roles: ['user'], 
      groups: ['Photography', 'Cooking'] 
    },
    { 
      username: 'user2', 
      password: 'user2', 
      email: 'user2@gmail.com', 
      roles: ['user'], 
      groups: ['Gaming', 'Reading']  
    },
    { 
      username: 'user3', 
      password: 'user3', 
      email: 'user3@gmail.com', 
      roles: ['user'], 
      groups: ['Gaming', 'Reading'] 
    },
    { 
      username: 'groupAdmin1', 
      password: 'groupAdmin1', 
      email: 'groupAdmin1@gmail.com', 
      roles: ['groupAdmin'], 
      groups: ['group1'] 
    },
    { 
      username: 'super', 
      password: '123', 
      email: 'super1@gmail.com', 
      roles: ['superAdmin'], 
      groups: [] 
    },
  ];

  private groups = [
    { name: 'Photography', channel: ['Camera Gear', 'Photo Editing', 'Techniques'] },
    { name: 'Cooking', channel: ['Recipes', 'Cooking Tips', 'Kitchen Gadgets'] },
    { name: 'Gardening', channel: ['Plant Care', 'Garden Design', 'Tools'] },
    { name: 'Travel', channel: ['Destinations', 'Travel Tips', 'Gear'] },
    { name: 'Fitness', channel: ['Workouts', 'Nutrition', 'Gear'] },
    { name: 'Music', channel: ['Instruments', 'Music Theory', 'Recording'] },
    { name: 'Reading', channel: ['Book Recommendations', 'Genres', 'Authors'] },
    { name: 'Gaming', channel: ['Game Reviews', 'Tips and Tricks', 'Hardware'] },
    { name: 'DIY', channel: ['Projects', 'Tools', 'Techniques'] },
    { name: 'Art', channel: ['Drawing', 'Painting', 'Digital Art'] },
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

  getValidUsers() {
    return JSON.parse(localStorage.getItem('validUsers') || '[]');
  }

  addUser(user: { 
    username: string, 
    password: string, 
    email: string, 
    roles: string[], 
    groups: string[] 
  }) {
    const users = this.getValidUsers();
    users.push(user);
    localStorage.setItem('validUsers', JSON.stringify(users));
  }

  deleteUser(username: string) {
    // Retrieve the current list of users from local storage
    const users = this.getValidUsers();
  
    // Check if the users array is empty or does not contain the username
    if (users.length === 0) {
      console.warn('No users available to delete.');
      return;
    }
  
    // Filter out the user with the specified username
    const updatedUsers = users.filter(user => user.username !== username);
  
    // Check if the user was found and deleted
    if (users.length === updatedUsers.length) {
      console.warn(`User with username "${username}" not found.`);
      return;
    }
  
    // Save the updated list back to local storage
    localStorage.setItem('validUsers', JSON.stringify(updatedUsers));
  }  

  // Public method to get all groups
  getAllGroups() {
    return this.groups;
  }

  // Method to get channels for a specific group
  getGroupChannels(groupName: string): string[] {
    const group = this.groups.find(g => g.name === groupName);
    return group ? group.channel : [];
  }
}
