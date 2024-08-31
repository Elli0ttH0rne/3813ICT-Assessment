import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-group',
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class UserGroupComponent {
  constructor(private router: Router) {}

  // Track the open state of each group
  openGroups: { [key: number]: boolean } = {};

  // Data for the groups
  groups = [
    { name: 'Group 1', channel: ['Channel 1', 'Channel 2', 'Channel 3'] },
    { name: 'Group 2', channel: ['Channel 1', 'Channel 2', 'Channel 3'] },
    { name: 'Group 3', channel: ['Channel 1', 'Channel 2', 'Channel 3'] },
    { name: 'Group 4', channel: ['Channel 1', 'Channel 2', 'Channel 3'] },
    { name: 'Group 5', channel: ['Channel 1', 'Channel 2', 'Channel 3'] },
    { name: 'Group 6', channel: ['Channel 1', 'Channel 2', 'Channel 3'] },
    { name: 'Group 7', channel: ['Channel 1', 'Channel 2', 'Channel 3'] },
    { name: 'Group 8', channel: ['Channel 1', 'Channel 2', 'Channel 3'] },
    { name: 'Group 9', channel: ['Channel 1', 'Channel 2', 'Channel 3'] },
    { name: 'Group 10', channel: ['Channel 1', 'Channel 2', 'Channel 3'] },
  ];

  // Badge classes for each group
  badgeClasses = [
    'bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning text-dark',
  ];

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
}