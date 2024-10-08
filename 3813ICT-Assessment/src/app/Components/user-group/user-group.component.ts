import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RequestsService } from '../../services/requests/requests.service';
import { GroupsService } from '../../services/groups/groups.service';
import { ChannelsService, Channel } from '../../services/channels/channels.service';
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
    private requestsService: RequestsService,
    private groupsService: GroupsService,
    private channelsService: ChannelsService
  ) {}

  ngOnInit(): void {
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userID = storedUser.userId;
    this.username = storedUser.username;
    this.roles = storedUser.roles;
  
    console.log('Stored user:', storedUser);
  
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
          this.groups = allGroups.map(group => group.name);
          this.openGroups = new Array(this.groups.length).fill(false);
  
          this.groups.forEach(group => {
  
            forkJoin([
              this.channelsService.getChannelsByGroupName(group),
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
        },
        error: (error) => {
          console.error('Failed to load all groups:', error);
        }
      });
    } else {
      this.groups = storedUser.groups;
      this.openGroups = new Array(this.groups.length).fill(false);
  
      // Fetch channels and group creators for each group the user is part of
      this.groups.forEach(group => {  
        forkJoin([
          this.channelsService.getChannelsByGroupName(group),
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
      // Make the delete request to the backend
      this.groupsService.deleteGroup(group, this.userID, this.roles.includes('superAdmin')).subscribe({
        next: () => {
          // If the request is successful, update the local state
          this.groups = this.groups.filter(g => g !== group);
          delete this.channels[group];
          
          // Update local storage if needed
          const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
          if (storedUser.groups) {
            storedUser.groups = storedUser.groups.filter(g => g !== group);
            localStorage.setItem('currentUser', JSON.stringify(storedUser));
          }
  
          // Alert the user about the successful deletion
          alert('Group deleted successfully.');
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
      this.groupsService.createGroup(this.newGroupName, this.username, this.userID).subscribe({
        next: () => {
          // Add the new group to the local groups state
          this.groups.push(this.newGroupName);
          this.channels[this.newGroupName] = [];
          this.groupCreators[this.newGroupName] = this.userID;
  
          // Update local storage with the new group
          const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
          if (!storedUser.groups) {
            storedUser.groups = [];
          }
          storedUser.groups.push(this.newGroupName);
          localStorage.setItem('currentUser', JSON.stringify(storedUser));
  
          // Reset the form and hide it
          this.showCreateGroup = false;
          this.newGroupName = '';
          this.openGroups.push(false);
  
          // Refresh visibility of buttons based on updated state
          this.updateGroupPermissions();
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
  
  private updateGroupPermissions(): void {
    this.groups.forEach(group => {
      // Ensure the group creator is set correctly in the state
      if (!this.groupCreators[group]) {
        // If the group creator is not set yet, fetch the creator (could also use cached value)
        this.groupCreators[group] = this.userID;
      }
    });
  }
  

  cancelCreateGroup(): void {
    this.showCreateGroup = false;
    this.newGroupName = '';
  }

  createChannel(group: string): void {
    if (this.newChannelName.trim() && this.newChannelDescription.trim()) {
      this.channelsService.createChannel(
        group,
        this.newChannelName,
        this.newChannelDescription
      ).subscribe({
        next: () => {
          // Update local channels and reset form
          if (!this.channels[group]) {
            this.channels[group] = [];
          }
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
