import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { RequestsService } from '../../services/requests/requests.service';
import { GroupsService } from '../../services/groups/groups.service';
import { UsersService } from '../../services/users/users.service';


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
  isGroupAdmin: boolean = false;
  showUserLists: boolean = false;  // New property to control the visibility of user lists

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private authService: AuthService,
    private requestsService: RequestsService, 
    private groupsService: GroupsService,
    private usersService: UsersService,
  ) {
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
      this.requestCount = this.requestsService.getRequestCount(this.username); 
    }

    if (this.groupName) {
      // Fetch users and admins including super admins
      this.usersInGroup = this.groupsService.getUsersInGroup(this.groupName);
      this.groupAdmins = this.groupsService.getGroupAdmins(this.groupName).concat(this.authService.getSuperAdmins());
      this.groupCreator = this.groupsService.getGroupCreator(this.groupName);
      this.isGroupAdmin = this.roles.includes('groupAdmin')

      // Check if the current user is the group creator or a super admin
      this.isCreator = this.username === this.groupCreator || this.isSuperAdmin;
    }
  }

  //******************************Checks******************************
  isGroupAdminOrSuperAdmin(): boolean {
    return this.roles.includes('groupAdmin') || this.roles.includes('superAdmin');
  }



  
  //**************************Drop Down Menu Functions**************************
  reportUser(reportedUsername: string): void {
    // Check if the user is trying to report themselves
    if (reportedUsername === this.username) {
      alert('You cannot report yourself.');
      return;
    }
  
    // Find the reported user in the group
    const reportedUser = this.usersInGroup.find(user => user.username === reportedUsername);
  
    if (!reportedUser) {
      alert('User not found.');
      return;
    }
  
    // Retrieve existing report requests
    const existingReports = this.requestsService.getReportRequests();
  
    // Check if a report from this user about this reported user and group already exists
    const duplicateReport = existingReports.some(req =>
      req.reporterUsername === this.username &&
      req.reportedUsername === reportedUsername &&
      req.groupName === this.groupName
    );
  
    if (duplicateReport) {
      alert('You have already reported this user.');
      return;
    }
  
    // Create a new report request
    const success = this.requestsService.createReportRequest(
      this.username,                // reporterUsername
      reportedUsername,             // reportedUsername
      'Violation of group rules',   // Reason for reporting
      this.groupName || ''          // Group name where the user was reported
    );
  
    if (success) {
      alert('User reported successfully.');
    } else {
      alert('Failed to report user.');
    }
  }
  
  
  kickUserFromGroup(username: string): void {
    // Check if the user attempting to kick is the same as the user being kicked
    if (username === this.username) {
      alert('You cannot remove yourself from the group.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to remove this user from the group?');
    if (confirmed) {
      const success = this.groupsService.kickUserFromGroup(username, this.groupName);
      if (success) {
        alert('User removed successfully.');
        // Update user list after removal
        this.usersInGroup = this.groupsService.getUsersInGroup(this.groupName);
      } else {
        alert('Failed to remove user.');
      }
    }
  }

  deleteUsersAccount(username: string): void {
    const confirmed = window.confirm('Are you sure you want to delete this user account?');
    if (confirmed) {
      const success = this.usersService.deleteUser(username);
      if (success) {
        alert('User account deleted successfully.');
        // Update user list after removal
        this.usersInGroup = this.groupsService.getUsersInGroup(this.groupName);
      } else {
        alert('Failed to delete user account.');
      }
    }
  }

  kickUserFromGroupAndReport(username: string): void {
    this.reportUser(username);
    this.kickUserFromGroup(username);
  }

  requestPromotionToGroupAdmin(username: string): void {
    const confirmed = window.confirm('Are you sure you want to request this user to be promoted to Group Admin?');
    if (confirmed) {
      // Check if the user is trying to promote themselves
      if (username === this.username) {
        alert('You cannot request to promote yourself.');
        return;
      }
    
      // Find the user to be promoted in the group
      const userToPromote = this.usersInGroup.find(user => user.username === username);
    
      if (!userToPromote) {
        alert('User not found.');
        return;
      }
    
      // Create a new promotion request
      const success = this.requestsService.createPromotionRequest(
        this.username,                // requesterUsername
        username,                     // targetUsername
      );
    
      if (success) {
        alert('Promotion request submitted successfully.');
      } else {
        alert('Failed to submit promotion request.');
      }
    }
  }

  promoteToGroupAdmin(username: string): void {
    const confirmed = window.confirm('Are you sure you want to promote this user to Group Admin?');
    if (confirmed) {
      const success = this.authService.promoteToGroupAdmin(username);
      if (success) {
        alert('User promoted to Group Admin successfully.');
        // Update group admins and user list after promotion
        this.groupAdmins = this.groupsService.getGroupAdmins(this.groupName).concat(this.authService.getSuperAdmins());
      } else {
        alert('Failed to promote user.');
      }
    }
  }

  promoteToSuperAdmin(username: string): void {
    const confirmed = window.confirm('Are you sure you want to promote this user to Super Admin?');
    if (confirmed) {
      const success = this.authService.promoteToSuperAdmin(username);
      if (success) {
        alert('User promoted to Super Admin successfully.');
        // Update group admins and user list after promotion
        this.groupAdmins = this.groupsService.getGroupAdmins(this.groupName).concat(this.authService.getSuperAdmins());
      } else {
        alert('Failed to promote user.');
      }
    }
  }


  //******************************Button Methods******************************
  deleteChannel(): void {
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete this channel? This action cannot be undone.');

    if (confirmed) {
      if (this.groupName && this.channelName) {
        const success = this.groupsService.deleteChannel(this.groupName, this.channelName, this.username, this.isSuperAdmin);
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
  toggleUserLists(): void {
    this.showUserLists = !this.showUserLists;
  }

  

  
  //******************************Component Navigation******************************
  navigateToUserGroup(): void {
    this.router.navigate(['/user-group']);
  }

  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  navigateToInbox(): void {
    this.router.navigate(['/inbox']);
  }
}
