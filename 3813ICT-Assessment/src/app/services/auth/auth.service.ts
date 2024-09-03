import { Injectable } from '@angular/core';
import { RequestsService } from '../requests/requests.service';
import { UsersService } from '../users/users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //******************************Hard Coded Data******************************
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
  private defaultGroups = [
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
      creatorId: 'u022'
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
      creatorId: 'u022'
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
      creatorId: 'u022'
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
      creatorId: 'u022'
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
      creatorId: 'u022'
    },
  ];

  



  //******************************Initilising Methods******************************
  constructor(
    private requestsService: RequestsService,
    private usersService: UsersService,
  ) {
    this.initializeGroups();
  }



  private initializeGroups() {
    const allGroups = localStorage.getItem('allGroups');
    if (!allGroups) {
      localStorage.setItem('allGroups', JSON.stringify(this.defaultGroups));
    }
  }


  //******************************Data Creation Methods******************************
  createGroup(groupName: string, creatorUsername: string, isSuperAdmin: boolean): boolean {
    const groups = this.getGroupsFromLocalStorage();
    
    // Check if the group already exists
    const existingGroup = groups.find(g => g.name === groupName);
    if (existingGroup) {
      console.warn('Group already exists.');
      return false;
    }
  
    // Create a new group with no channels
    const creatorUser = this.usersService.getValidUsers().find(user => user.username === creatorUsername);
    const newGroup = {
      name: groupName,
      channels: [],
      admins: [{ userId: creatorUser?.userId || '', username: creatorUsername, role: 'creator' }],
      creatorId: creatorUser?.userId || ''
    };
  
    // Add the new group to the groups list
    groups.push(newGroup);
    this.saveGroupsToLocalStorage(groups);
  
    // Update only the creator's group list
    if (creatorUser) {
      const users = this.usersService.getValidUsers();
      const updatedUsers = users.map(user => 
        user.username === creatorUsername
          ? { ...user, groups: [...user.groups, groupName] }
          : user
      );
  
      localStorage.setItem('validUsers', JSON.stringify(updatedUsers));
    }
  
    return true;
  }

  createChannel(groupName: string, channelName: string, channelDescription: string, currentUsername: string, isSuperAdmin: boolean): boolean {
    const groups = this.getGroupsFromLocalStorage();
    const group = groups.find(g => g.name === groupName);
    
    if (!group) {
      console.warn('Group not found.');
      return false;
    }
  
    const creatorUsername = this.getGroupCreator(groupName);
  
    // Allow channel creation if the user is the group creator or a super admin
    if (currentUsername !== creatorUsername && !isSuperAdmin) {
      console.warn('Only the group creator or a super admin can create channels.');
      return false;
    }
  
    // Check if the channel already exists
    const existingChannel = group.channels.find(c => c.name === channelName);
    if (existingChannel) {
      console.warn('Channel already exists.');
      return false;
    }
  
    // Add the new channel
    group.channels.push({
      name: channelName,
      description: channelDescription
    });
  
    // Save the updated group information
    this.saveGroupsToLocalStorage(groups);
    return true;
  }

  



  private saveGroupsToLocalStorage(groups: any[]) {
    localStorage.setItem('allGroups', JSON.stringify(groups));
  }

  promoteToGroupAdmin(username: string): boolean {
    // Retrieve the current list of users and groups from local storage
    const users = this.usersService.getValidUsers();
    const groups = this.getGroupsFromLocalStorage();
  
    // Find the user to be promoted
    const user = users.find(u => u.username === username);
    if (!user) {
      console.warn('User not found.');
      return false;
    }
  
    // Check if the user is already a group admin
    if (user.roles.includes('groupAdmin')) {
      console.warn('User is already a group admin.');
      return false;
    }
  
    // Add 'groupAdmin' to the user's roles
    user.roles.push('groupAdmin');
  
    // Update the users list
    this.usersService.saveValidUsers(users);
  
    // Add the user to the admins list of each group they are a member of
    user.groups.forEach(groupName => {
      const group = groups.find(g => g.name === groupName);
      if (group) {
        // Check if the user is already an admin in the group
        const adminExists = group.admins.some(a => a.username === username);
        if (!adminExists) {
          // Add user as admin
          group.admins.push({ 
            userId: user.userId, 
            username: user.username, 
            role: 'groupAdmin' 
          });
          this.saveGroupsToLocalStorage(groups);
        }
      }
    });
  
    console.log(`User ${username} has been promoted to group admin.`);
    return true;
  }
  
  promoteToSuperAdmin(username: string): boolean {
    // Retrieve the current list of users and groups from local storage
    const users = this.usersService.getValidUsers();
    const groups = this.getGroupsFromLocalStorage();
  
    // Find the user to be promoted
    const user = users.find(u => u.username === username);
    if (!user) {
      console.warn('User not found.');
      return false;
    }
  
    // Check if the user is already a group admin
    if (user.roles.includes('superAdmin')) {
      console.warn('User is already a super admin.');
      return false;
    }
  
    // Add 'superAdmin' to the user's roles
    user.roles.push('superAdmin');
  
    // Update the users list
    this.usersService.saveValidUsers(users);
  
    // Add the user to the admins list of each group they are a member of
    user.groups.forEach(groupName => {
      const group = groups.find(g => g.name === groupName);
      if (group) {
        // Check if the user is already an admin in the group
        const adminExists = group.admins.some(a => a.username === username);
        if (!adminExists) {
          // Add user as admin
          group.admins.push({ 
            userId: user.userId, 
            username: user.username, 
            role: 'superAdmin' 
          });
          this.saveGroupsToLocalStorage(groups);
        }
      }
    });
  
    console.log(`User ${username} has been promoted to group admin.`);
    return true;
  }


  //******************************Data Retrieveal Methods******************************
  getGroupsForUser(userId: string) {
    const users = this.usersService.getValidUsers();
    const user = users.find(user => user.userId === userId);
    if (user) {
      return user.groups;
    }
    return [];
  }

  getAllGroups() {
    return this.getGroupsFromLocalStorage();
  }

  getGroupChannels(groupName: string): { name: string, description: string }[] {
    const groups = this.getGroupsFromLocalStorage();
    const group = groups.find(g => g.name === groupName);
    return group ? group.channels : [];
  }

  getUsersInGroup(groupName: string): { userId: string; username: string }[] {
    const users = this.usersService.getValidUsers();
    return users.filter(user => user.groups.includes(groupName))
                .map(user => ({ userId: user.userId, username: user.username }));
  }

  getGroupAdmins(groupName: string): { username: string; role: string }[] {
    const groups = this.getGroupsFromLocalStorage();
    const group = groups.find(g => g.name === groupName);
    if (group) {
      return group.admins.map(admin => ({ username: admin.username, role: admin.role }));
    }
    return [];
  }

  getGroupCreator(groupName: string): string {
    const groups = this.getGroupsFromLocalStorage();
    const group = groups.find(g => g.name === groupName);
    if (group) {
      const creator = this.usersService.getValidUsers().find(user => user.userId === group.creatorId);
      return creator ? creator.username : '';
    }
    return '';
  }



  private getGroupsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('allGroups') || '[]');
  }

  getRequestCount(): number {
    // Implement logic to return the actual count of requests
    const count = this.requestsService.getGroupJoinRequests().length + this.requestsService.getReportedUsers().length;

    return count; // Example count
  }

  //******************************Data Removal Methods******************************
  deleteChannel(groupName: string, channelName: string, currentUsername: string, isSuperAdmin: boolean): boolean {
    const groups = this.getGroupsFromLocalStorage();
    const group = groups.find(g => g.name === groupName);
    if (!group) {
        console.warn('Group not found.');
        return false;
    }

    const creatorUsername = this.getGroupCreator(groupName);
    // Allow deletion if the user is the group creator or a super admin
    if (currentUsername !== creatorUsername && !isSuperAdmin) {
        console.warn('Only the group creator or a super admin can delete channels.');
        return false;
    }

    const channelIndex = group.channels.findIndex(c => c.name === channelName);
    if (channelIndex === -1) {
        console.warn('Channel not found.');
        return false;
    }

    group.channels.splice(channelIndex, 1);
    // Save the updated group information
    this.saveGroupsToLocalStorage(groups);
    return true;
  }

  deleteGroup(groupName: string, currentUsername: string, isSuperAdmin: boolean): boolean {
    const groups = this.getGroupsFromLocalStorage();
    const groupIndex = groups.findIndex(g => g.name === groupName);
    if (groupIndex === -1) {
      console.warn('Group not found.');
      return false;
    }

    const group = groups[groupIndex];
    const creatorUsername = this.getGroupCreator(groupName);

    // Allow deletion if the user is the group creator or a super admin
    if (currentUsername !== creatorUsername && !isSuperAdmin) {
      console.warn('Only the group creator or a super admin can delete groups.');
      return false;
    }

    groups.splice(groupIndex, 1);
    this.saveGroupsToLocalStorage(groups);
    return true;
  }

  deleteUser(username: string): boolean {
    const users = this.usersService.getValidUsers();
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
  

  leaveGroup(username: string, groupName: string): boolean {
    const users = this.usersService.getValidUsers();
    const user = users.find(u => u.username === username);
  
    if (!user) {
      console.warn(`User with username "${username}" not found.`);
      return false;
    }
  
    const groupIndex = user.groups.indexOf(groupName);
    if (groupIndex === -1) {
      console.warn(`Group "${groupName}" not found in user's groups.`);
      return false;
    }
  
    user.groups.splice(groupIndex, 1);
    this.usersService.saveValidUsers(users);
    console.log(`User ${username} removed from group ${groupName}`);
    return true;
  }

  kickUserFromGroup(username: string, groupName: string,){
    const users = this.usersService.getValidUsers();
    const user = users.find(u => u.username === username);
  
    if (!user) {
      console.warn(`User with username "${username}" not found.`);
      return false;
    }
  
    const groupIndex = user.groups.indexOf(groupName);
    if (groupIndex === -1) {
      console.warn(`Group "${groupName}" not found in user's groups.`);
      return false;
    }
  
    user.groups.splice(groupIndex, 1);
    this.usersService.saveValidUsers(users);
    console.log(`User ${username} removed from group ${groupName}`);
    return true;
  }


  //******************************Other Methods******************************
  getSuperAdmins(): { username: string; role: string }[] {
    const users = this.usersService.getValidUsers()
    return users
      .filter(user => user.roles.includes('superAdmin'))
      .map(user => ({ username: user.username, role: 'superAdmin' }));
  }

}