import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { RequestsService } from '../../services/requests/requests.service';
import { GroupsService, Channel } from '../../services/groups/groups.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-group',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.css']
})
export class UserGroupComponent implements OnInit {
  groups: string[] = [];
  channels: { [group: string]: Channel[] } = {};
  badgeClasses = [
    'bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning text-dark',
  ];
  openGroups: boolean[] = [];
  userID: string = '';
  username: string = '';
  roles: string[] = [];
  groupCreators: { [group: string]: string } = {};
  newGroupName: string = ''; 
  showCreateGroup: boolean = false; 
  showCreateChannelForGroup: string | null = null; 
  newChannelName: string = ''; 
  newChannelDescription: string = '';
  requestCount: number = 0; 

  constructor(
    private router: Router, 
    private authService: AuthService,
    private requestsService: RequestsService,
    private groupsService: GroupsService
  ) {}

  ngOnInit(): void {
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userID = storedUser.userId;
    this.username = storedUser.username;
    this.roles = storedUser.roles;
  
    console.log('Stored user:', storedUser); // Log stored user info to verify
  
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
  
    if (this.isSuperAdmin()) {
      // Fetch all groups for super admin
      this.groupsService.getAllGroups().subscribe({
        next: (allGroups) => {
          console.log('All groups:', allGroups); // Log all groups received
          this.groups = allGroups.map(group => group.name);
          this.openGroups = new Array(this.groups.length).fill(false);
  
          // Fetch channels and group creators for each group
          this.groups.forEach(group => {
            console.log(`Fetching channels and creator for group: ${group}`); // Log group name
  
            forkJoin([
              this.groupsService.getGroupChannels(group),
              this.groupsService.getGroupCreator(group)
            ]).subscribe({
              next: ([channels, creator]) => {
                this.channels[group] = channels;
                this.groupCreators[group] = creator;
  
                // Log the group and creator to the console
                console.log(`Group: ${group}, Creator: ${creator}`);
              },
              error: (error) => {
                console.error(`Failed to load channels or creator for group "${group}":`, error);
              }
            });
          });
        },
        error: (error) => {
          console.error('Failed to load all groups:', error);
        }
      });
    } else {
      // Fetch groups only for the logged-in user
      console.log('Fetching groups for user:', this.userID);
      this.groups = storedUser.groups;
      this.openGroups = new Array(this.groups.length).fill(false);
  
      // Fetch channels and group creators for each group the user is part of
      this.groups.forEach(group => {  
        forkJoin([
          this.groupsService.getGroupChannels(group),
          this.groupsService.getGroupCreator(group)
        ]).subscribe({
          next: ([channels, creator]) => {
            this.channels[group] = channels;
            this.groupCreators[group] = creator;
  
          },
          error: (error) => {
            console.error(`Failed to load channels or creator for group "${group}":`, error);
          }
        });
      });
    }
  }
  
  
  //******************************Checks******************************
  isGroupAdminOrSuperAdmin(): boolean {
    return this.roles.includes('groupAdmin') || this.roles.includes('superAdmin');
  }

  isUserOrGroupAdmin(): boolean {
    return this.roles.includes('user') || this.roles.includes('groupAdmin');
  }

  isSuperAdmin(): boolean {
    return this.roles.includes('superAdmin');
  }

  canCreateGroup(): boolean {
    return this.roles.includes('groupAdmin') || this.roles.includes('superAdmin');
  }

  canDeleteGroup(group: string): boolean {
    return this.userID === this.groupCreators[group] || this.roles.includes('superAdmin');
  }
  
  isGroupCreator(group: string): boolean {
    return this.userID === this.groupCreators[group];
  }
  
  //******************************UI Methods******************************
  getBadgeClass(index: number): string {
    return this.badgeClasses[index % this.badgeClasses.length];
  }

  toggleGroup(index: number): void {
    this.openGroups[index] = !this.openGroups[index];
  }

  showCreateGroupForm(): void {
    this.showCreateGroup = true;
  }

  showCreateChannelForm(group: string): void {
    this.showCreateChannelForGroup = group;
  }

  //******************************Group/Channel Methods******************************
  deleteGroup(group: string): void {
    const confirmed = window.confirm('Are you sure you want to delete this group? This action cannot be undone.');
    if (confirmed) {
      this.groupsService.deleteGroup(group, this.userID, this.roles.includes('superAdmin')).subscribe({
        next: () => {
          alert('Group deleted successfully.');
          // Remove the group from the local state
          this.groups = this.groups.filter(g => g !== group);
          delete this.channels[group];
  
          // Update local storage if needed
          const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
          if (storedUser.groups) {
            storedUser.groups = storedUser.groups.filter(g => g !== group);
            localStorage.setItem('currentUser', JSON.stringify(storedUser));
          }
        },
        error: (error) => {
          console.error('Failed to delete group:', error);
          alert('Failed to delete group.');
        }
      });
    }
  }
  
  

  createGroup(): void {
    if (this.newGroupName.trim()) {
      const isSuperAdmin = this.roles.includes('superAdmin');
      
      this.groupsService.createGroup(this.newGroupName, this.username, this.userID).subscribe({
        next: () => {
          this.groups.push(this.newGroupName);
          this.channels[this.newGroupName] = [];
          this.groupCreators[this.newGroupName] = this.username;
  
          // Reset the form and hide it
          this.showCreateGroup = false;
          this.newGroupName = '';
          this.openGroups.push(false);
        },
        error: (error) => {
          console.error('Failed to create group:', error);
          alert('Failed to create group.');
        }
      });
    } else {
      alert('Please enter a group name.');
    }
  }
  


  cancelCreateGroup(): void {
    this.showCreateGroup = false;
    this.newGroupName = '';
  }

  createChannel(group: string): void {
    if (this.newChannelName.trim() && this.newChannelDescription.trim()) {
      const currentUsername = this.username;
      const isSuperAdmin = this.roles.includes('superAdmin');

      this.groupsService.createChannel(
        group,
        this.newChannelName,
        this.newChannelDescription,
        currentUsername,
        isSuperAdmin
      ).subscribe({
        next: () => {
          this.channels[group].push({ name: this.newChannelName, description: this.newChannelDescription });
          this.showCreateChannelForGroup = null;
          this.newChannelName = '';
          this.newChannelDescription = '';
        },
        error: (error) => {
          console.error('Failed to create channel:', error);
          alert('Failed to create channel.');
        }
      });
    } else {
      alert('Please enter both channel name and description.');
    }
  }

  leaveGroup(groupName: string): void {
    const confirmed = window.confirm(`Are you sure you want to leave the group "${groupName}"?`);
    if (confirmed) {
      this.groupsService.leaveGroup(groupName, this.userID).subscribe({
        next: () => {
          this.groups = this.groups.filter(g => g !== groupName);
          delete this.channels[groupName];
  
          // Update local storage to reflect the removed group
          const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
          storedUser.groups = this.groups;
          localStorage.setItem('currentUser', JSON.stringify(storedUser));
  
          alert(`You have left the group "${groupName}".`);
        },
        error: (error) => {
          console.error('Failed to leave group:', error);
          alert('Failed to leave group.');
        }
      });
    }
  }
  

  cancelCreateChannel(): void {
    this.showCreateChannelForGroup = null;
    this.newChannelName = '';
    this.newChannelDescription = '';
  }

  //******************************Component Navigation******************************
  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  navigateToInbox(): void {
    this.router.navigate(['/inbox']);
  }

  navigateToChannel(groupName: string, channelName: string): void {
    this.router.navigate(['/channel', groupName, channelName]);
  }

  navigateToAllGroups(): void {
    this.router.navigate(['/all-group-list']);
  }
}
