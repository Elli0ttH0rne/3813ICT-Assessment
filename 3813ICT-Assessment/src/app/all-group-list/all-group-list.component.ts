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

  userID: string = '';
  username: string = '';
  roles: string[] = [];

  constructor(private router: Router,private authService: AuthService) {}

  ngOnInit(): void {
    this.loadGroups();
    this.loadUserGroups();

    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userID = storedUser.userId;
    this.username = storedUser.username;
    this.roles = storedUser.roles;
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

  // Method to check if the user is a groupAdmin or superAdmin
  isGroupAdminOrSuperAdmin(): boolean {
    return this.roles.includes('groupAdmin') || this.roles.includes('superAdmin');
  }

  isUserInGroup(groupName: string): boolean {
    return this.userGroups.includes(groupName);
  }

  requestToJoin(groupName: string): void {
    // Handle the request to join logic here
    console.log(`Request to join ${groupName}`);
  }

  // Navigate back to the user group component
  navigateToUserGroup(): void {
    this.router.navigate(['/user-group']);
  }
}
