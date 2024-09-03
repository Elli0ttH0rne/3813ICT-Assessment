import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private defaultUsers = [
    { 
      userId: 'u001',
      username: 'user1', 
      password: 'user1', 
      email: 'user1@gmail.com', 
      roles: ['user'], 
      groups: ['Photography', 'Cooking', 'Gardening', 'Travel', 'Fitness'] 
    },
    { 
      userId: 'u002',
      username: 'user2', 
      password: 'user2', 
      email: 'user2@gmail.com', 
      roles: ['user'], 
      groups: ['Music', 'Reading', 'Gaming', 'DIY', 'Art'] 
    },
    { 
      userId: 'u003',
      username: 'user3', 
      password: 'user3', 
      email: 'user3@gmail.com', 
      roles: ['user'], 
      groups: ['Photography', 'Gaming', 'Cooking', 'Travel', 'DIY'] 
    },
    { 
      userId: 'u004',
      username: 'user4', 
      password: 'user4', 
      email: 'user4@gmail.com', 
      roles: ['user'], 
      groups: ['Fitness', 'Gardening', 'Art', 'Music', 'Gaming'] 
    },
    { 
      userId: 'u005',
      username: 'user5', 
      password: 'user5', 
      email: 'user5@gmail.com', 
      roles: ['user'], 
      groups: ['Cooking', 'Reading', 'Travel', 'Photography', 'Fitness'] 
    },
    { 
      userId: 'u006',
      username: 'user6', 
      password: 'user6', 
      email: 'user6@gmail.com', 
      roles: ['user'], 
      groups: ['Gaming', 'Music', 'Art', 'Travel', 'Cooking'] 
    },
    { 
      userId: 'u007',
      username: 'user7', 
      password: 'user7', 
      email: 'user7@gmail.com', 
      roles: ['user'], 
      groups: ['Photography', 'DIY', 'Reading', 'Fitness', 'Travel'] 
    },
    { 
      userId: 'u008',
      username: 'user8', 
      password: 'user8', 
      email: 'user8@gmail.com', 
      roles: ['user'], 
      groups: ['Cooking', 'Art', 'Music', 'Fitness', 'Gardening'] 
    },
    { 
      userId: 'u009',
      username: 'user9', 
      password: 'user9', 
      email: 'user9@gmail.com', 
      roles: ['user'], 
      groups: ['Travel', 'Reading', 'Gaming', 'Art', 'Photography'] 
    },
    { 
      userId: 'u010',
      username: 'user10', 
      password: 'user10', 
      email: 'user10@gmail.com', 
      roles: ['user'], 
      groups: ['DIY', 'Music', 'Cooking', 'Fitness', 'Gaming'] 
    },
    { 
      userId: 'u011',
      username: 'user11', 
      password: 'user11', 
      email: 'user11@gmail.com', 
      roles: ['user'], 
      groups: ['Gardening', 'Photography', 'Music', 'Art', 'Reading'] 
    },
    { 
      userId: 'u012',
      username: 'user12', 
      password: 'user12', 
      email: 'user12@gmail.com', 
      roles: ['user'], 
      groups: ['Art', 'Travel', 'Photography', 'Fitness', 'Music'] 
    },
    { 
      userId: 'u013',
      username: 'user13', 
      password: 'user13', 
      email: 'user13@gmail.com', 
      roles: ['user'], 
      groups: ['Gaming', 'Travel', 'Photography', 'Fitness', 'Cooking'] 
    },
    { 
      userId: 'u014',
      username: 'user14', 
      password: 'user14', 
      email: 'user14@gmail.com', 
      roles: ['user'], 
      groups: ['Reading', 'Music', 'Fitness', 'Art', 'Travel'] 
    },
    { 
      userId: 'u015',
      username: 'user15', 
      password: 'user15', 
      email: 'user15@gmail.com', 
      roles: ['user'], 
      groups: ['DIY', 'Photography', 'Music', 'Gaming', 'Cooking'] 
    },
    { 
      userId: 'u016',
      username: 'user16', 
      password: 'user16', 
      email: 'user16@gmail.com', 
      roles: ['user'], 
      groups: ['Fitness', 'Travel', 'Gaming', 'Cooking', 'Music'] 
    },
    { 
      userId: 'u017',
      username: 'user17', 
      password: 'user17', 
      email: 'user17@gmail.com', 
      roles: ['user'], 
      groups: ['Cooking', 'Fitness', 'Gaming', 'Art', 'Music'] 
    },
    { 
      userId: 'u018',
      username: 'user18', 
      password: 'user18', 
      email: 'user18@gmail.com', 
      roles: ['user'], 
      groups: ['Travel', 'DIY', 'Art', 'Photography', 'Reading'] 
    },
    { 
      userId: 'u019',
      username: 'user19', 
      password: 'user19', 
      email: 'user19@gmail.com', 
      roles: ['user'], 
      groups: ['Music', 'Photography', 'Cooking', 'Fitness', 'Travel'] 
    },
    { 
      userId: 'u020',
      username: 'user20', 
      password: 'user20', 
      email: 'user20@gmail.com', 
      roles: ['user'], 
      groups: ['Art', 'Gaming', 'Travel', 'Music', 'Cooking'] 
    },
    { 
      userId: 'u021',
      username: 'groupAdmin1', 
      password: 'groupAdmin1', 
      email: 'groupAdmin1@gmail.com', 
      roles: ['user','groupAdmin'], 
      groups: ['Photography','Cooking', 'Gardening', 'Travel', 'Fitness',  'Music', 'Reading', 'Gaming', 'DIY', 'Art'] 
    },
    { 
      userId: 'u022',
      username: 'groupAdmin2', 
      password: 'groupAdmin2', 
      email: 'groupAdmin2@gmail.com', 
      roles: ['user','groupAdmin'], 
      groups: ['Photography','Cooking', 'Gardening', 'Travel', 'Fitness',  'Music', 'Reading', 'Gaming', 'DIY', 'Art'] 
    },
    { 
      userId: 'u023',
      username: 'super', 
      password: '123', 
      email: 'super1@gmail.com', 
      roles: ['user','groupAdmin','superAdmin'], 
      groups: [] 
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
  
  getValidUsers() {
    return JSON.parse(localStorage.getItem('validUsers') || '[]');
  }
  saveValidUsers(users: any[]) {
    localStorage.setItem('validUsers', JSON.stringify(users));
  }

  addUser(user: { 
    userId: string,
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

  deleteUser(username: string): boolean {
    const users = this.getValidUsers();
    if (users.length === 0) {
      console.warn('No users available to delete.');
      return false;
    }
  
    const updatedUsers = users.filter(user => user.username !== username);
  
    if (users.length === updatedUsers.length) {
      console.warn(`User with username "${username}" not found.`);
      return false;
    }
  
    // Save the updated user list
    localStorage.setItem('validUsers', JSON.stringify(updatedUsers));
    return true;
  }
  
}
