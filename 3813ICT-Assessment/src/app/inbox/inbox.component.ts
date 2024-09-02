import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  reportedUsers: any[] = []; // Store reported users
  promotionRequests: any[] = []; // Store promotion requests
  requestCount: number = 0; // New property for request count

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.username = storedUser.username;
    this.roles = storedUser.roles;

    if (this.isGroupAdminOrSuperAdmin()) {
      this.loadJoinRequests();
      this.updateRequestCount();
    }
    
    if (this.isSuperAdmin()) {
      this.loadReportedUsers();
    }
  }

  isGroupAdminOrSuperAdmin(): boolean {
    return this.roles.includes('groupAdmin') || this.roles.includes('superAdmin');
  }

  isSuperAdmin(): boolean {
    return this.roles.includes('superAdmin');
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;

    if (tab === 'joinRequests' && this.isGroupAdminOrSuperAdmin()) {
      this.loadJoinRequests();
    } else if (tab === 'reportedUsers' && this.isSuperAdmin()) {
      this.loadReportedUsers();
    }
  }

  loadJoinRequests(): void {
    this.joinRequests = this.authService.getJoinRequests();
  }

  loadReportedUsers(): void {
    this.reportedUsers = this.authService.getReportedUsers();
  }

  approveRequest(request: any): void {
    if (!request.username) {
      console.error('Username is undefined');
      return;
    }
    const success = this.authService.approveJoinRequest(request.username, request.groupName);
    if (success) {
      this.joinRequests = this.joinRequests.filter(req => req !== request);
      console.log(`Approved request from ${request.username}`);
    } else {
      console.error(`Failed to approve request from ${request.username}`);
    }
  }

  denyRequest(request: any): void {
    if (!request.username) {
      console.error('username is undefined');
      return;
    }
    const success = this.authService.rejectJoinRequest(request.username, request.groupName);
    if (success) {
      this.joinRequests = this.joinRequests.filter(req => req !== request);
      console.log(`Denied request from ${request.username}`);
    } else {
      console.error(`Failed to deny request from ${request.username}`);
    }
  }

  banReportedUser(user: any): void {
    
  }

  removeReportedUser(user: any): void {

  }

  approvePromotionRequest(request: any): void {

  }

  denyPromotionRequest(request: any): void {

  }

  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  navigateToInbox(): void {
    this.router.navigate(['/inbox']);
  }

  navigateToUserGroup(): void {
    this.router.navigate(['/user-group']);
  }
  // Fetch the number of requests for the badge
  private updateRequestCount(): void {
    if (this.isGroupAdminOrSuperAdmin()) {
      this.requestCount = this.authService.getRequestCount();
    }
  }
}
