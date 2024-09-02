import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadGroups();
    this.loadUserGroups();

    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userId = storedUser.userId || ''; // Ensure default value
    this.username = storedUser.username || '';
    this.roles = storedUser.roles || [];
  }

  private loadGroups(): void {
    this.groups = this.authService.getAllGroups();
  }

  private loadUserGroups(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userGroups = currentUser.groups || [];
  }

  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  navigateToInbox(): void {
    this.router.navigate(['/inbox']);
  }

  isGroupAdminOrSuperAdmin(): boolean {
    return this.roles.includes('groupAdmin') || this.roles.includes('superAdmin');
  }

  isUserInGroup(groupName: string): boolean {
    return this.userGroups.includes(groupName);
  }

  requestToJoin(groupName: string): void {
    if (this.joinRequests[groupName]) return;

    this.joinRequests[groupName] = true;

    const success = this.authService.requestToJoinGroup(this.username, groupName);
    if (success) {
      console.log(`Request to join ${groupName} sent successfully by ${this.username}`);
    } else {
      console.error(`Failed to send request to join ${groupName}.`);
    }
  }

  navigateToUserGroup(): void {
    this.router.navigate(['/user-group']);
  }
}
