import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-group',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.css']
})
export class UserGroupComponent implements OnInit {
  // Data for the groups
  groups = [
    { name: 'Photography', channel: ['Camera Gear', 'Photo Editing', 'Techniques'] },
    { name: 'Cooking', channel: ['Recipes', 'Cooking Tips', 'Kitchen Gadgets'] },
    { name: 'Gardening', channel: ['Plant Care', 'Garden Design', 'Tools'] },
    { name: 'Travel', channel: ['Destinations', 'Travel Tips', 'Gear'] },
    { name: 'Fitness', channel: ['Workouts', 'Nutrition', 'Gear'] },
    { name: 'Music', channel: ['Instruments', 'Music Theory', 'Recording'] },
    { name: 'Reading', channel: ['Book Recommendations', 'Genres', 'Authors'] },
    { name: 'Gaming', channel: ['Game Reviews', 'Tips and Tricks', 'Hardware'] },
    { name: 'DIY', channel: ['Projects', 'Tools', 'Techniques'] },
    { name: 'Art', channel: ['Drawing', 'Painting', 'Digital Art'] },
  ];

  // Badge classes for each group
  badgeClasses = [
    'bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning text-dark',
  ];

  // Track the open state of each group
  openGroups: boolean[] = [];

  // User information
  username: string = '';
  securityLevel: string = '';

  constructor(private router: Router) {
    // Initialize openGroups with false values
    this.openGroups = new Array(this.groups.length).fill(false);
  }

  ngOnInit(): void {
    // Retrieve currentUser information from local storage
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.username = storedUser.username;
    this.securityLevel = storedUser.securityLevel ;
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
