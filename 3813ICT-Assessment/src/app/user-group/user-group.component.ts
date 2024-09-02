import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-group',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.css']
})
export class UserGroupComponent implements OnInit {
  groups: string[] = [];
  channels: { [group: string]: { name: string; description: string; }[] } = {};
  badgeClasses = [
    'bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning text-dark',
  ];
  openGroups: boolean[] = [];
  userID: string = '';
  username: string = '';
  roles: string[] = [];
  groupCreators: { [group: string]: string } = {};
  newGroupName: string = ''; 
  showCreateGroup: boolean = false; 
  showCreateChannelForGroup: string | null = null; 
  newChannelName: string = ''; 
  newChannelDescription: string = ''; //

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userID = storedUser.userId;
    this.username = storedUser.username;
    this.roles = storedUser.roles;

    if (this.roles.includes('superAdmin')) {
      const allGroups = this.authService.getAllGroups();
      localStorage.setItem('allGroups', JSON.stringify(allGroups));
      this.groups = allGroups.map(group => group.name);
      this.groups.forEach(group => {
        this.channels[group] = this.authService.getGroupChannels(group);
        this.groupCreators[group] = this.authService.getGroupCreator(group);
      });
    } else {
      this.groups = storedUser.groups;
      this.openGroups = new Array(this.groups.length).fill(false);
      this.groups.forEach(group => {
        this.channels[group] = this.authService.getGroupChannels(group);
        this.groupCreators[group] = this.authService.getGroupCreator(group);
      });
    }
  }

  // Method to check if the user is a groupAdmin or superAdmin
  isGroupAdminOrSuperAdmin(): boolean {
    return this.roles.includes('groupAdmin') || this.roles.includes('superAdmin');
  }

  getBadgeClass(index: number): string {
    return this.badgeClasses[index % this.badgeClasses.length];
  }

  toggleGroup(index: number): void {
    this.openGroups[index] = !this.openGroups[index];
  }

  canDeleteGroup(group: string): boolean {
    return this.username === this.groupCreators[group] || this.roles.includes('superAdmin');
  }

  canCreateGroup(): boolean {
    return this.roles.includes('groupAdmin') || this.roles.includes('superAdmin');
  }

  canCreateChannel(group: string): boolean {
    return this.username === this.groupCreators[group];
  }

  deleteGroup(group: string): void {
    const confirmed = window.confirm('Are you sure you want to delete this group? This action cannot be undone.');
    if (confirmed) {
      const success = this.authService.deleteGroup(group, this.username, this.roles.includes('superAdmin'));
      if (success) {
        alert('Group deleted successfully.');
        this.groups = this.groups.filter(g => g !== group);
        delete this.channels[group];
      } else {
        alert('Failed to delete group.');
      }
    }
  }

  showCreateGroupForm(): void {
    this.showCreateGroup = true;
  }

  createGroup(): void {
    if (this.newGroupName.trim()) {
      const isSuperAdmin = this.roles.includes('superAdmin');
      
      // Create the group using the `authService`
      const success = this.authService.createGroup(this.newGroupName, this.username, isSuperAdmin);
  
      if (success) {
        alert('Group created successfully.');
  
        // Update the groups array directly
        this.groups.push(this.newGroupName);
        this.channels[this.newGroupName] = []; // Initialize channels for the new group
        this.groupCreators[this.newGroupName] = this.username; // Set the creator of the new group
  
        // Reset the form and hide it
        this.showCreateGroup = false;
        this.newGroupName = '';
  
        // Optionally, reset openGroups array to include the new group
        this.openGroups.push(false);
      } else {
        alert('Failed to create group.');
      }
    } else {
      alert('Please enter a group name.');
    }
  }

  cancelCreateGroup(): void {
    this.showCreateGroup = false;
    this.newGroupName = '';
  }

  showCreateChannelForm(group: string): void {
    this.showCreateChannelForGroup = group;
  }

  createChannel(group: string): void {
    if (this.newChannelName.trim() && this.newChannelDescription.trim()) {
      const currentUsername = this.username;
      const isSuperAdmin = this.roles.includes('superAdmin');
  
      const success = this.authService.createChannel(
        group, 
        this.newChannelName, 
        this.newChannelDescription, 
        currentUsername, 
        isSuperAdmin
      );
  
      if (success) {
        alert('Channel created successfully.');
        this.channels[group].push({ name: this.newChannelName, description: this.newChannelDescription });
        this.showCreateChannelForGroup = null;
        this.newChannelName = '';
        this.newChannelDescription = '';
      } else {
        alert('Failed to create channel.');
      }
    } else {
      alert('Please enter both channel name and description.');
    }
  }

  cancelCreateChannel(): void {
    this.showCreateChannelForGroup = null;
    this.newChannelName = '';
    this.newChannelDescription = '';
  }

  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  navigateToInbox(): void {
    this.router.navigate(['/inbox']);
  }

  navigateToChannel(groupName: string, channelName: string): void {
    this.router.navigate(['/channel', groupName, channelName]);
  }
}
