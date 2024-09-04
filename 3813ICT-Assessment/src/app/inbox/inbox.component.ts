import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RequestsService } from '../services/requests/requests.service';
import { GroupsService } from '../services/groups/groups.service';
import { AuthService } from '../services/auth/auth.service';

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
  activeTab: string = 'joinRequests'; 
  joinRequests: any[] = []; 
  reportRequests: any[] = []; 
  promotionRequests: any[] = []; 
  requestCount: number = 0; 
  groupAdmins: { username: string; role: string }[] = [];


  constructor(
    private router: Router, 
    private requestsService: RequestsService,
    private groupsService: GroupsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.username = storedUser.username;
    this.roles = storedUser.roles;

    console.log(this.joinRequests.length);
    console.log(this.reportRequests.length);
    console.log(this.promotionRequests.length);

    // Load requests based on roles and active tab
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

  loadPromotionRequests(): void {
    this.promotionRequests = this.requestsService.getPromotionRequests();
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
        this.reportRequests = this.reportRequests.filter(user => user !== reportedUser);
  
        // Remove the report request after banning
        this.removeReportedUserRequest(reportedUser);
      } else {
        alert(`Failed to ban ${reportedUser.reportedUsername} from the group.`);
      }
    }
  }
  
  removeReportedUserRequest(user: any): void {
    const groupName = user.groupName;
    let requests = this.requestsService.getReportRequests();
    const requestIndex = requests.findIndex(req => req.reportedUsername === user.reportedUsername && req.groupName === groupName);
  
    if (requestIndex !== -1) {
      requests.splice(requestIndex, 1);  // Remove the specific report request
      this.requestsService.saveReportRequests(requests);  // Save the updated list

      // Refresh local reportRequests
      this.reportRequests = this.reportRequests.filter(reportedUser => reportedUser !== user);
    } else {
      console.warn('Report request not found.');
    }
  }

  approvePromotionRequest(promotionRequest: any): void {
    if (!promotionRequest || !promotionRequest.promotionUser) {
      console.error('Invalid promotion request');
      return;
    }
  
    const confirmed = window.confirm('Are you sure you want to promote this user to Group Admin?');
    if (confirmed) {
      const success = this.authService.promoteToGroupAdmin(promotionRequest.promotionUser);
      if (success) {
        alert('User promoted to Group Admin successfully.');
  
        // Remove the approved request from the list
        this.promotionRequests = this.promotionRequests.filter(req => req !== promotionRequest);
      } else {
        alert('Failed to promote user.');
      }
    }
  }
  

  denyPromotionRequest(promotionRequest: any): void {
    if (!promotionRequest || !promotionRequest.promotionUser) {
      console.error('Invalid promotion request');
      return;
    }
  
    const confirmed = window.confirm('Are you sure you want to deny this promotion request?');
    if (confirmed) {
      // Optionally, handle any backend operations or logic needed to deny the request
  
      // Remove the denied request from the list
      this.promotionRequests = this.promotionRequests.filter(req => req !== promotionRequest);
      alert('Promotion request denied.');
    }
  }
  

  //******************************UI Methods******************************
  setActiveTab(tab: string): void {
    this.activeTab = tab;

    if (tab === 'joinRequests' && this.isGroupAdminOrSuperAdmin()) {
      this.loadJoinRequests();
    } else if (tab === 'reportedUsers' && this.isSuperAdmin()) {
      this.loadReportedUsers();
    } else if (tab === 'promotionRequests' && this.isSuperAdmin()) {
      this.loadPromotionRequests();
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
