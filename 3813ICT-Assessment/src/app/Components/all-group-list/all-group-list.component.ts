import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RequestsService } from '../../services/requests/requests.service';
import { GroupsService } from '../../services/groups/groups.service';



@Component({
  selector: 'app-all-group-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-group-list.component.html',
  styleUrls: ['./all-group-list.component.css']
})
export class AllGroupListComponent implements OnInit {
  groups: any[] = [];
  userGroups: string[] = [];
  userId: string = '';
  username: string = '';
  roles: string[] = [];
  joinRequests: { [groupName: string]: boolean } = {};
  requestCount: number = 0;

  constructor(
    private router: Router, 
    private requestsService: RequestsService,
    private groupsService: GroupsService
  ) {}

  ngOnInit(): void {
    this.loadGroups();
    this.loadUserGroups();

    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userId = storedUser.userId || '';
    this.username = storedUser.username || '';
    this.roles = storedUser.roles || [];

    if (this.isGroupAdminOrSuperAdmin()) {
      this.requestsService.getRequestCount().subscribe({
        next: (count: number) => {
          this.requestCount = count;
        },
        error: (err) => {
          console.error('Failed to get request count:', err);
        }
      });
    }
    
  }
  
  //******************************Checks******************************
  isGroupAdminOrSuperAdmin(): boolean {
    return this.roles.includes('groupAdmin') || this.roles.includes('superAdmin');
  }

  isUserInGroup(groupName: string): boolean {
    return this.userGroups.includes(groupName);
  }
  



  //******************************Group List Methods******************************
  private loadGroups(): void {
    this.groupsService.getAllGroups().subscribe({
      next: (groups) => {
        this.groups = groups;
      },
      error: (error) => {
        console.error('Failed to load groups:', error);
      }
    });
  }
  

  private loadUserGroups(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userGroups = currentUser.groups || [];
  }

  requestToJoin(groupName: string): void {
    // Check if the request has already been sent
    if (this.joinRequests[groupName]) {
      alert(`You have already requested to join the group "${groupName}".`);
      return;
    }
  
    // Set request status to true to prevent duplicate requests
    this.joinRequests[groupName] = true;
  
    // Send the join request
    this.requestsService.createRequest(this.username, groupName, 'join').subscribe({
      next: () => {
        console.log(`Request to join ${groupName} sent successfully by ${this.username}`);
        alert(`Your request to join the group "${groupName}" has been sent successfully.`);
      },
      error: (error) => {
        console.error(`Failed to send request to join ${groupName}:`, error);
        alert(`You have already requested to join "${groupName}".`);
        // If the request fails, reset the status so the user can try again
        this.joinRequests[groupName] = false;
      }
    });
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
