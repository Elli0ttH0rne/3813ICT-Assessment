import { Injectable } from '@angular/core';
import { RequestsService } from '../requests/requests.service';
import { UsersService } from '../users/users.service';
import { GroupsService } from '../groups/groups.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private requestsService: RequestsService,
    private usersService: UsersService,
    private groupsService: GroupsService
  ) { }


  promoteToGroupAdmin(username: string): boolean {
    // Retrieve the current list of users and groups from local storage
    const users = this.usersService.getValidUsers();
    const groups = this.groupsService.getGroupsFromLocalStorage();
  
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
          this.groupsService.saveGroupsToLocalStorage(groups);
        }
      }
    });
  
    console.log(`User ${username} has been promoted to group admin.`);
    return true;
  }
  
  promoteToSuperAdmin(username: string): boolean {
    // Retrieve the current list of users and groups from local storage
    const users = this.usersService.getValidUsers();
    const groups = this.groupsService.getGroupsFromLocalStorage();
  
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
          this.groupsService.saveGroupsToLocalStorage(groups);
        }
      }
    });
  
    console.log(`User ${username} has been promoted to group admin.`);
    return true;
  }

  getSuperAdmins(): { username: string; role: string }[] {
    const users = this.usersService.getValidUsers()
    return users
      .filter(user => user.roles.includes('superAdmin'))
      .map(user => ({ username: user.username, role: 'superAdmin' }));
  }

}