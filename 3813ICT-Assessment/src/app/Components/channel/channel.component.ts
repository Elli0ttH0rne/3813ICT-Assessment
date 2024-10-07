import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RequestsService } from '../../services/requests/requests.service';
import { GroupsService, Admin } from '../../services/groups/groups.service';
import { UsersService } from '../../services/users/users.service';
import { ChannelsService } from '../../services/channels/channels.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {
  groupName: string | null = null;
  channelName: string | null = null;

  // User information
  userID: string = '';  
  username: string = '';
  roles: string[] = [];

  // Group and user information
  usersInGroup: { userId: string; username: string }[] = [];
  groupAdmins: Admin[] = [];
  groupCreatorId: string = ''; 
  requestCount: number = 0;

  // Flags to check user permissions
  isCreator: boolean = false;
  isSuperAdmin: boolean = false;
  isGroupAdmin: boolean = false;
  showUserLists: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestsService: RequestsService,
    private groupsService: GroupsService,
    private usersService: UsersService,
    private channelsService: ChannelsService 
  ) {
    // Retrieve groupName and channelName from route parameters
    this.route.paramMap.subscribe(params => {
      this.groupName = params.get('groupName');
      this.channelName = params.get('channelName');
    });
  }

  ngOnInit(): void {
    // Retrieve currentUser information from local storage
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userID = storedUser.userId || ''; 
    this.username = storedUser.username || '';
    this.roles = storedUser.roles || [];
    this.isSuperAdmin = this.roles.includes('superAdmin');
    this.isGroupAdmin = this.roles.includes('groupAdmin');

    if (this.groupName) {
      this.loadInitialData();
    }
  }

  //******************************Data Loading******************************
  private loadInitialData(): void {
    // Fetch request count if the user is group admin or super admin
    if (this.isGroupAdminOrSuperAdmin()) {
      this.loadRequestCount();
    }

    // Load users, admins, and creator of the group
    forkJoin([
      this.groupsService.getUsersInGroup(this.groupName!),
      this.groupsService.getGroupAdmins(this.groupName!),
      this.usersService.getSuperAdmins(),
      this.groupsService.getGroupCreator(this.groupName!)
    ]).subscribe({
      next: ([users, admins, superAdmins, creatorId]) => {
        this.usersInGroup = users;
        this.groupAdmins = [...admins, ...superAdmins];
        this.groupCreatorId = creatorId;  
        this.isCreator = this.userID === this.groupCreatorId || this.isSuperAdmin;  
      },
      error: (error) => {
        console.error('Failed to load initial data:', error);
      }
    });
  }

  private loadRequestCount(): void {
    this.requestsService.getRequestCount().subscribe({
      next: (count: number) => {
        this.requestCount = count;
      },
      error: (err) => {
        console.error('Failed to get request count:', err);
      }
    });
  }

  private loadUsersInGroup(): void {
    if (this.groupName) {
      this.groupsService.getUsersInGroup(this.groupName).subscribe({
        next: (users) => {
          this.usersInGroup = users;
        },
        error: (error) => {
          console.error('Failed to load users in group:', error);
        }
      });
    }
  }

  //******************************Checks******************************
  isGroupAdminOrSuperAdmin(): boolean {
    return this.roles.includes('groupAdmin') || this.roles.includes('superAdmin');
  }

  //******************************User Actions******************************
  reportUser(reportedUsername: string): void {
    if (reportedUsername === this.username) {
      alert('You cannot report yourself.');
      return;
    }
  
    this.requestsService.createRequest(this.username, this.groupName || '', 'report', reportedUsername, 'Violation of group rules')
      .subscribe({
        next: () => {
          alert('User reported successfully.');
        },
        error: (error) => {
          console.error('Failed to report user:', error);
          alert('Failed to report user.');
        }
      });
  }

  kickUserFromGroup(username: string): void {
    if (username === this.username) {
      alert('You cannot remove yourself from the group.');
      return;
    }
  
    const confirmed = window.confirm('Are you sure you want to remove this user from the group?');
    if (confirmed && this.groupName) {
      const user = this.usersInGroup.find(user => user.username === username);
      if (!user) {
        alert('User not found in the group.');
        return;
      }
  
      this.groupsService.kickUserFromGroup(this.groupName, user.username).subscribe({
        next: () => {
          alert('User removed successfully.');
          this.loadUsersInGroup();
        },
        error: (error) => {
          console.error('Failed to remove user:', error);
          alert('Failed to remove user.');
        }
      });
    }
  }

  kickUserFromGroupAndReport(username: string): void {
    if (username === this.username) {
      alert('You cannot remove yourself from the group.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to remove this user from the group and report them?');
    if (confirmed) {
      this.kickUserFromGroup(username);
      this.reportUser(username);
    }
  }

  requestPromotionToGroupAdmin(username: string): void {
    if (username === this.username) {
      alert('You cannot request a promotion for yourself.');
      return;
    }
  
    const confirmed = window.confirm('Are you sure you want to request this user to be promoted to Group Admin?');
    if (confirmed && this.groupName) {
      this.requestsService.createRequest(
        this.username,  // The user making the request
        this.groupName,
        'promotion',
        undefined,  // No reported user in case of promotion
        undefined,  // No reason required for promotion
        username // The user to be promoted
      ).subscribe({
        next: () => {
          alert('Promotion request sent successfully.');
        },
        error: (error) => {
          console.error('Failed to create promotion request:', error);
          alert('Failed to create promotion request.');
        }
      });
    }
  }
  
  deleteUsersAccount(username: string): void {
    if (!this.isSuperAdmin) {
      alert('Only Super Admins can delete user accounts.');
      return;
    }
  
    const confirmed = window.confirm('Are you sure you want to delete this user\'s account? This action cannot be undone.');
    if (confirmed) {
      this.usersService.deleteUserByUsername(username).subscribe({
        next: () => {
          alert('User account deleted successfully.');
          this.loadUsersInGroup(); // Reload users in group after deletion
        },
        error: (error) => {
          console.error('Failed to delete user account:', error);
          alert('Failed to delete user account.');
        }
      });
    }
  }

  promoteToGroupAdmin(username: string): void {
    if (!this.isSuperAdmin) {
      alert('Only Super Admins can promote users to Group Admin.');
      return;
    }
  
    const confirmed = window.confirm('Are you sure you want to promote this user to Group Admin?');
    if (confirmed) {
      this.usersService.promoteToGroupAdmin(username).subscribe({
        next: () => {
          alert('User has been promoted to Group Admin successfully.');
          this.loadUsersInGroup(); // Reload users to update roles
        },
        error: (error) => {
          console.error('Failed to promote user to Group Admin:', error);
          alert('Failed to promote user to Group Admin.');
        }
      });
    }
  }
  
  promoteToSuperAdmin(username: string): void {
    if (!this.isSuperAdmin) {
      alert('Only Super Admins can promote users to Super Admin.');
      return;
    }
  
    const confirmed = window.confirm('Are you sure you want to promote this user to Super Admin?');
    if (confirmed) {
      this.usersService.promoteToSuperAdmin(username).subscribe({
        next: () => {
          alert('User has been promoted to Super Admin successfully.');
          this.loadUsersInGroup(); // Reload users to update roles
        },
        error: (error) => {
          console.error('Failed to promote user to Super Admin:', error);
          alert('Failed to promote user to Super Admin.');
        }
      });
    }
  }

  //******************************Channel Management******************************
  deleteChannel(): void {
    const confirmed = window.confirm('Are you sure you want to delete this channel? This action cannot be undone.');

    if (confirmed) {
      if (this.groupName && this.channelName) {
        this.channelsService.deleteChannel(this.groupName, this.channelName).subscribe({
          next: () => {
            alert('Channel deleted successfully.');
            this.navigateToUserGroup();
          },
          error: (error) => {
            console.error('Failed to delete channel:', error);
            alert('Failed to delete channel.');
          }
        });
      }
    }
  }

  toggleUserLists(): void {
    this.showUserLists = !this.showUserLists;
  }

  //******************************Component Navigation******************************
  navigateToUserGroup(): void {
    this.router.navigate(['/user-group']);
  }

  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  navigateToInbox(): void {
    this.router.navigate(['/inbox']);
  }
}
