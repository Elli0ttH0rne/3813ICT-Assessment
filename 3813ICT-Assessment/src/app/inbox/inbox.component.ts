import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RequestsService } from '../services/requests/requests.service';
import { GroupsService } from '../services/groups/groups.service';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  username: string = '';
  roles: string[] = [];
  activeTab: string = 'joinRequests'; // Default active tab
  joinRequests: any[] = []; // Store join requests
  reportRequests: any[] = []; // Store reported users
  promotionRequests: any[] = []; // Store promotion requests
  requestCount: number = 0; // New property for request count
  usersInGroup: any[] = []; // Store users in the group
  selectedGroupName: string = ''; // Store the selected group's name

  constructor(
    private router: Router, 
    private requestsService: RequestsService,
    private groupsService: GroupsService
  ) {}

  ngOnInit(): void {
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.username = storedUser.username;
    this.roles = storedUser.roles;

    if (this.isGroupAdminOrSuperAdmin()) {
      this.loadJoinRequests();
      this.requestCount = this.requestsService.getRequestCount(this.username); 
    }
    
    if (this.isSuperAdmin()) {
      this.loadReportedUsers();
    }
  }

  //******************************Checks******************************
  isGroupAdminOrSuperAdmin(): boolean {
    return this.roles.includes('groupAdmin') || this.roles.includes('superAdmin');
  }

  isSuperAdmin(): boolean {
    return this.roles.includes('superAdmin');
  }

  //******************************Loading Methods******************************
  loadJoinRequests(): void {
    this.joinRequests = this.requestsService.getGroupJoinRequests();
  }

  loadReportedUsers(): void {
    this.reportRequests = this.requestsService.getReportRequests();
  }

  //******************************Group Request Methods******************************
  approveRequest(request: any): void {
    if (!request.username) {
      console.error('Username is undefined');
      return;
    }
    const success = this.requestsService.approveJoinRequest(request.username, request.groupName);
    if (success) {
      this.joinRequests = this.joinRequests.filter(req => req !== request);
      console.log(`Approved request from ${request.username}`);
    } else {
      console.error(`Failed to approve request from ${request.username}`);
    }
  }

  denyRequest(request: any): void {
    if (!request.username) {
      console.error('Username is undefined');
      return;
    }
    const success = this.requestsService.rejectJoinRequest(request.username, request.groupName);
    if (success) {
      this.joinRequests = this.joinRequests.filter(req => req !== request);
      console.log(`Denied request from ${request.username}`);
    } else {
      console.error(`Failed to deny request from ${request.username}`);
    }
  }

  //******************************Report Request Methods******************************
  banReportedUser(reportedUser: any): void {
    if (!reportedUser.reportedUsername) {
      console.error('Username is undefined');
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to ban ${reportedUser.reportedUsername} from the group ${reportedUser.groupName}? This action cannot be undone.`);

    if (confirmed) {
      const success = this.groupsService.kickUserFromGroup(reportedUser.reportedUsername, reportedUser.groupName);
  
      if (success) {          
        // Refresh the list of reported users after banning
        this.reportRequests = this.reportRequests.filter(reportedUsername => reportedUsername !== reportedUsername);
  
        // Remove the report request after banning
        this.removeReportedUserRequest(reportedUser);
      } else {
        alert(`Failed to ban ${reportedUser.reportedUsername} from the group.`);
      }
    }
  }
  
  removeReportedUserRequest(user: any): void {
    const groupName = user.groupName;
    const requests = this.requestsService.getReportRequests();
    const requestIndex = requests.findIndex(req => req.reportedUserId === user.userId && req.groupName === groupName);
  
    if (requestIndex !== -1) {
      this.reportRequests = this.reportRequests.filter(reportedUsername => reportedUsername !== reportedUsername);
      requests.splice(requestIndex, 1);  // Remove the specific report request
      this.requestsService.saveReportRequests(requests);  // Save the updated list
  
    } else {
      console.warn('Report request not found.');
    }
  }

  approvePromotionRequest(request: any): void {
    // Implementation for approving promotion requests
  }

  denyPromotionRequest(request: any): void {
    // Implementation for denying promotion requests
  }

  //******************************UI Methods******************************
  setActiveTab(tab: string): void {
    this.activeTab = tab;

    if (tab === 'joinRequests' && this.isGroupAdminOrSuperAdmin()) {
      this.loadJoinRequests();
    } else if (tab === 'reportedUsers' && this.isSuperAdmin()) {
      this.loadReportedUsers();
    }
  }

  //******************************Component Navigation******************************
  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  navigateToInbox(): void {
    this.router.navigate(['/inbox']);
  }

  navigateToUserGroup(): void {
    this.router.navigate(['/user-group']);
  }
}
