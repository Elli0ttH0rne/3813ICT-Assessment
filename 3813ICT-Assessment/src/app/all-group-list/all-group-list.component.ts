import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RequestsService } from '../services/requests/requests.service';
import { GroupsService } from '../services/groups/groups.service';



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
      this.requestCount = this.requestsService.getRequestCount(); 
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
    this.groups = this.groupsService.getAllGroups();
  }

  private loadUserGroups(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userGroups = currentUser.groups || [];
  }

  requestToJoin(groupName: string): void {
    if (this.joinRequests[groupName]) return;

    this.joinRequests[groupName] = true;

    const success = this.requestsService.requestToJoinGroup(this.username, groupName);
    if (success) {
      console.log(`Request to join ${groupName} sent successfully by ${this.username}`);
    } else {
      console.error(`Failed to send request to join ${groupName}.`);
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
