import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
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
      roles: ['groupAdmin'], 
      groups: ['Music', 'Reading', 'Gaming', 'DIY', 'Art'] 
    },
    { 
      userId: 'u022',
      username: 'groupAdmin2', 
      password: 'groupAdmin2', 
      email: 'groupAdmin2@gmail.com', 
      roles: ['groupAdmin'], 
      groups: ['Music', 'Reading', 'Gaming', 'DIY', 'Art'] 
    },
    { 
      userId: 'u023',
      username: 'super', 
      password: '123', 
      email: 'super1@gmail.com', 
      roles: ['superAdmin'], 
      groups: [] 
    },
  ];

  private groups = [
    { 
      name: 'Photography', 
      channels: [
        { name: 'Camera Gear', description: 'Discuss camera equipment' },
        { name: 'Photo Editing', description: 'Share editing tips' },
        { name: 'Techniques', description: 'Learn and discuss techniques' }
      ],
      admins: [
        { userId: 'u021', username: 'groupAdmin1', role: 'creator' },
        { userId: 'u022', username: 'groupAdmin2', role: 'admin' }
      ],
      creatorId: 'u021'
    },
    { 
      name: 'Cooking', 
      channels: [
        { name: 'Recipes', description: 'Share and discuss recipes' },
        { name: 'Cooking Tips', description: 'Exchange cooking tips' },
        { name: 'Kitchen Gadgets', description: 'Discuss kitchen gadgets' }
      ],
      admins: [
        { userId: 'u021', username: 'groupAdmin1', role: 'creator' },
        { userId: 'u022', username: 'groupAdmin2', role: 'admin' }
      ],
      creatorId: 'u021'
    },
    { 
      name: 'Gardening', 
      channels: [
        { name: 'Plant Care', description: 'Discuss plant care' },
        { name: 'Garden Design', description: 'Exchange design ideas' },
        { name: 'Tools', description: 'Discuss gardening tools' }
      ],
      admins: [
        { userId: 'u021', username: 'groupAdmin1', role: 'creator' },
        { userId: 'u022', username: 'groupAdmin2', role: 'admin' }
      ],
      creatorId: 'u021'
    },
    { 
      name: 'Travel', 
      channels: [
        { name: 'Destinations', description: 'Discuss travel destinations' },
        { name: 'Travel Tips', description: 'Share travel tips' },
        { name: 'Gear', description: 'Discuss travel gear' }
      ],
      admins: [
        { userId: 'u021', username: 'groupAdmin1', role: 'creator' },
        { userId: 'u022', username: 'groupAdmin2', role: 'admin' }
      ],
      creatorId: 'u021'
    },
    { 
      name: 'Fitness', 
      channels: [
        { name: 'Workouts', description: 'Discuss workouts' },
        { name: 'Nutrition', description: 'Share nutrition tips' },
        { name: 'Gear', description: 'Discuss fitness gear' }
      ],
      admins: [
        { userId: 'u021', username: 'groupAdmin1', role: 'creator' },
        { userId: 'u022', username: 'groupAdmin2', role: 'admin' }
      ],
      creatorId: 'u021'
    },
    { 
      name: 'Music', 
      channels: [
        { name: 'Instruments', description: 'Discuss instruments' },
        { name: 'Music Theory', description: 'Share music theory knowledge' },
        { name: 'Recording', description: 'Discuss recording techniques' }
      ],
      admins: [
        { userId: 'u021', username: 'groupAdmin1', role: 'admin' },
        { userId: 'u022', username: 'groupAdmin2', role: 'creator' }
      ],
      creatorId: 'u021'
    },
    { 
      name: 'Reading', 
      channels: [
        { name: 'Book Recommendations', description: 'Share book recommendations' },
        { name: 'Genres', description: 'Discuss different genres' },
        { name: 'Authors', description: 'Discuss authors' }
      ],
      admins: [
        { userId: 'u021', username: 'groupAdmin1', role: 'admin' },
        { userId: 'u022', username: 'groupAdmin2', role: 'creator' }
      ],
      creatorId: 'u021'
    },
    { 
      name: 'Gaming', 
      channels: [
        { name: 'Game Reviews', description: 'Share game reviews' },
        { name: 'Tips and Tricks', description: 'Exchange gaming tips' },
        { name: 'Hardware', description: 'Discuss gaming hardware' }
      ],
      admins: [
        { userId: 'u021', username: 'groupAdmin1', role: 'admin' },
        { userId: 'u022', username: 'groupAdmin2', role: 'creator' }
      ],
      creatorId: 'u021'
    },
    { 
      name: 'DIY', 
      channels: [
        { name: 'Projects', description: 'Discuss DIY projects' },
        { name: 'Tools', description: 'Exchange tool recommendations' },
        { name: 'Techniques', description: 'Discuss techniques' }
      ],
      admins: [
        { userId: 'u021', username: 'groupAdmin1', role: 'admin' },
        { userId: 'u022', username: 'groupAdmin2', role: 'creator' }
      ],
      creatorId: 'u021'
    },
    { 
      name: 'Art', 
      channels: [
        { name: 'Drawing', description: 'Discuss drawing techniques' },
        { name: 'Painting', description: 'Share painting tips' },
        { name: 'Digital Art', description: 'Discuss digital art' }
      ],
      admins: [
        { userId: 'u021', username: 'groupAdmin1', role: 'admin' },
        { userId: 'u022', username: 'groupAdmin2', role: 'creator' }
      ],
      creatorId: 'u021'
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

  deleteUser(username: string) {
    const users = this.getValidUsers();
  
    if (users.length === 0) {
      console.warn('No users available to delete.');
      return;
    }
  
    const updatedUsers = users.filter(user => user.username !== username);
  
    if (users.length === updatedUsers.length) {
      console.warn(`User with username "${username}" not found.`);
      return;
    }
  
    localStorage.setItem('validUsers', JSON.stringify(updatedUsers));
  }  

  getAllGroups() {
    return this.groups;
  }

  getGroupChannels(groupName: string): { name: string, description: string }[] {
    const group = this.groups.find(g => g.name === groupName);
    return group ? group.channels : [];
  }

  getUsersInGroup(groupName: string): { userId: string; username: string }[] {
    const users = this.getValidUsers();
    return users.filter(user => user.groups.includes(groupName))
                .map(user => ({ userId: user.userId, username: user.username }));
  }

  getGroupAdmins(groupName: string): { username: string; role: string }[] {
    const group = this.groups.find(g => g.name === groupName);
    if (group) {
      return group.admins.map(admin => ({ username: admin.username, role: admin.role }));
    }
    return [];
  }

  getGroupCreator(groupName: string): string {
    const group = this.groups.find(g => g.name === groupName);
    if (group) {
      const creator = this.getValidUsers().find(user => user.userId === group.creatorId);
      return creator ? creator.username : '';
    }
    return '';
  }
}
