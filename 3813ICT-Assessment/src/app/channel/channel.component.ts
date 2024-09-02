import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {
  groupName: string | null = null;
  channelName: string | null = null;

  // User information
  username: string = '';
  roles: string[] = [];

  // Group and user information
  usersInGroup: { userId: string; username: string }[] = [];
  groupAdmins: { username: string; role: string }[] = [];
  groupCreator: string = '';
  requestCount: number = 0;

  // Flags to check user permissions
  isCreator: boolean = false;
  isSuperAdmin: boolean = false;
  showUserLists: boolean = false;  // New property to control the visibility of user lists

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    this.route.paramMap.subscribe(params => {
      this.groupName = params.get('groupName');
      this.channelName = params.get('channelName');
    });
  }

  ngOnInit(): void {
    // Retrieve currentUser information from local storage
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.username = storedUser.username || '';
    this.roles = storedUser.roles || []; 

    this.isSuperAdmin = this.roles.includes('superAdmin'); 

    // Fetch request count
    if (this.isGroupAdminOrSuperAdmin()) {
      this.updateRequestCount();
    }

    if (this.groupName) {
      // Fetch users and admins including super admins
      this.usersInGroup = this.authService.getUsersInGroup(this.groupName);
      this.groupAdmins = this.authService.getGroupAdmins(this.groupName).concat(this.authService.getSuperAdmins());
      this.groupCreator = this.authService.getGroupCreator(this.groupName);

      // Check if the current user is the group creator or a super admin
      this.isCreator = this.username === this.groupCreator || this.isSuperAdmin;
    }
  }

  // Method to check if the user is a groupAdmin or superAdmin
  isGroupAdminOrSuperAdmin(): boolean {
    return this.roles.includes('groupAdmin') || this.roles.includes('superAdmin');
  }

  

  // Navigate back to the user group component
  navigateToUserGroup(): void {
    this.router.navigate(['/user-group']);
  }

  // Navigate to the account component
  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  // Navigate to the inbox component
  navigateToInbox(): void {
    this.router.navigate(['/inbox']);
  }

  // Method to delete the channel
  deleteChannel(): void {
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete this channel? This action cannot be undone.');

    if (confirmed) {
      if (this.groupName && this.channelName) {
        const success = this.authService.deleteChannel(this.groupName, this.channelName, this.username, this.isSuperAdmin);
        if (success) {
          alert('Channel deleted successfully.');
          // Navigate or refresh as needed
          this.navigateToUserGroup();
        } else {
          alert('Failed to delete channel.');
        }
      }
    }
  }
  
  // Method to toggle the visibility of user lists
  toggleUserLists(): void {
    this.showUserLists = !this.showUserLists;
  }

  // Method to remove a user from the group
  kickUserFromGroup(username: string): void {
    const confirmed = window.confirm('Are you sure you want to remove this user from the group?');
    if (confirmed) {
      const success = this.authService.kickUserFromGroup(username, this.groupName);
      if (success) {
        alert('User removed successfully.');
        // Update user list after removal
        this.usersInGroup = this.authService.getUsersInGroup(this.groupName);
      } else {
        alert('Failed to remove user.');
      }
    }
  }

  // Method to promote a user to group admin
  promoteToGroupAdmin(username: string): void {
    const confirmed = window.confirm('Are you sure you want to promote this user to Group Admin?');
    if (confirmed) {
      const success = this.authService.promoteToGroupAdmin(username);
      if (success) {
        alert('User promoted to Group Admin successfully.');
        // Update group admins and user list after promotion
        this.groupAdmins = this.authService.getGroupAdmins(this.groupName).concat(this.authService.getSuperAdmins());
      } else {
        alert('Failed to promote user.');
      }
    }
  }

  // Method to promote a user to super admin
  promoteToSuperAdmin(username: string): void {
    const confirmed = window.confirm('Are you sure you want to promote this user to Super Admin?');
    if (confirmed) {
      const success = this.authService.promoteToSuperAdmin(username);
      if (success) {
        alert('User promoted to Super Admin successfully.');
        // Update group admins and user list after promotion
        this.groupAdmins = this.authService.getGroupAdmins(this.groupName).concat(this.authService.getSuperAdmins());
      } else {
        alert('Failed to promote user.');
      }
    }
  }

  // Fetch the number of requests for the badge
  private updateRequestCount(): void {
    if (this.isGroupAdminOrSuperAdmin()) {
      this.requestCount = this.authService.getRequestCount();
    }
  }
}
