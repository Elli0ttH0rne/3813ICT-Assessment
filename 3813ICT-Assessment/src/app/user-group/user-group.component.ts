import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service'; // Adjust the path as necessary

@Component({
  selector: 'app-user-group',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.css']
})
export class UserGroupComponent implements OnInit {
  // Groups data for the current user
  groups: string[] = [];
  // Channels data for the current user's groups
  channels: { [group: string]: string[] } = {};

  // Badge classes for each group
  badgeClasses = [
    'bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning text-dark',
  ];

  // Track the open state of each group
  openGroups: boolean[] = [];

  // User information
  username: string = '';
  roles: string[] = [];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Retrieve currentUser information from local storage
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.username = storedUser.username;
    this.roles = storedUser.roles;

    // Check if the user is a superAdmin
    if (this.roles.includes('superAdmin')) {
      // Fetch all groups and channels for superAdmin
      const allGroups = this.authService.getAllGroups();
      localStorage.setItem('allGroups', JSON.stringify(allGroups));

      // Update component state with all groups and channels
      this.groups = allGroups.map(group => group.name);
      this.groups.forEach(group => {
        this.channels[group] = this.authService.getGroupChannels(group);
      });

    } else {
      // Retrieve groups from local storage for non-superAdmin users
      this.groups = storedUser.groups;
      this.openGroups = new Array(this.groups.length).fill(false);

      // Fetch channels for the user's groups
      this.groups.forEach(group => {
        this.channels[group] = this.authService.getGroupChannels(group);
      });
    }
  }

  // Get the badge class for a group
  getBadgeClass(index: number): string {
    return this.badgeClasses[index % this.badgeClasses.length];
  }

  // Toggle the open state of a group
  toggleGroup(index: number): void {
    this.openGroups[index] = !this.openGroups[index];
  }

  // Navigate to the account component
  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  // Navigate to the channel component with group and channel names as route parameters
  navigateToChannel(groupName: string, channelName: string): void {
    this.router.navigate(['/channel', groupName, channelName]);
  }
}
