import { Injectable } from '@angular/core';
import { UsersService } from '../users/users.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
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

  constructor(
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

  saveGroupsToLocalStorage(groups: any[]) {
    localStorage.setItem('allGroups', JSON.stringify(groups));
  }

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

  getGroupsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('allGroups') || '[]');
  }

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

}
