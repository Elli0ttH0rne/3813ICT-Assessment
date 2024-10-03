import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { RequestsService } from '../../services/requests/requests.service';
import { GroupsService, Admin } from '../../services/groups/groups.service';
import { UsersService } from '../../services/users/users.service';
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
  username: string = '';
  roles: string[] = [];

  // Group and user information
  usersInGroup: { userId: string; username: string }[] = [];
  groupAdmins: Admin[] = [];
  groupCreator: string = '';
  requestCount: number = 0;

  // Flags to check user permissions
  isCreator: boolean = false;
  isSuperAdmin: boolean = false;
  isGroupAdmin: boolean = false;
  showUserLists: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private requestsService: RequestsService,
    private groupsService: GroupsService,
    private usersService: UsersService,
  ) {
    this.route.paramMap.subscribe(params => {
      this.groupName = params.get('groupName');
      this.channelName = params.get('channelName');
    });
  }

  ngOnInit(): void {
    // Retrieve currentUser information from local storage
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.username = storedUser.username || '';
    this.roles = storedUser.roles || [];

    this.isSuperAdmin = this.roles.includes('superAdmin');

    // Fetch request count
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

    if (this.groupName) {
      // Fetch users in the group
      this.groupsService.getUsersInGroup(this.groupName).subscribe({
        next: (users) => {
          this.usersInGroup = users;
        },
        error: (error) => {
          console.error('Failed to load users in group:', error);
        }
      });

      // Fetch group admins and super admins using forkJoin
      forkJoin([
        this.groupsService.getGroupAdmins(this.groupName),
        this.authService.getSuperAdmins()
      ]).subscribe({
        next: ([admins, superAdmins]) => {
          this.groupAdmins = [...admins, ...superAdmins];
        },
        error: (error) => {
          console.error('Failed to load group admins:', error);
        }
      });

      // Fetch group creator
      this.groupsService.getGroupCreator(this.groupName).subscribe({
        next: (creator) => {
          this.groupCreator = creator;
          // Check if the current user is the group creator or a super admin
          this.isCreator = this.username === this.groupCreator || this.isSuperAdmin;
        },
        error: (error) => {
          console.error('Failed to load group creator:', error);
        }
      });

      this.isGroupAdmin = this.roles.includes('groupAdmin');
    }
  }

  //******************************Checks******************************
  isGroupAdminOrSuperAdmin(): boolean {
    return this.roles.includes('groupAdmin') || this.roles.includes('superAdmin');
  }

  //******************************Drop Down Menu Functions**************************
  reportUser(reportedUsername: string): void {
    // Check if the user is trying to report themselves
    if (reportedUsername === this.username) {
      alert('You cannot report yourself.');
      return;
    }

    // Retrieve existing report requests
    this.requestsService.getReportRequests().subscribe({
      next: (existingReports) => {
        // Check if a report from this user about this reported user and group already exists
        const duplicateReport = existingReports.some(req =>
          req.reporterUsername === this.username &&
          req.reportedUsername === reportedUsername &&
          req.groupName === this.groupName
        );

        if (duplicateReport) {
          alert('You have already reported this user.');
          return;
        }

        // Create a new report request
        this.requestsService.createReportRequest(
          this.username,                // reporterUsername
          reportedUsername,             // reportedUsername
          'Violation of group rules',   // Reason for reporting
          this.groupName || ''          // Group name where the user was reported
        ).subscribe({
          next: () => {
            alert('User reported successfully.');
          },
          error: (err) => {
            console.error('Failed to report user:', err);
          }
        });
      },
      error: (err) => {
        console.error('Failed to retrieve existing reports:', err);
      }
    });
  }

  kickUserFromGroup(username: string): void {
    // Check if the user attempting to kick is the same as the user being kicked
    if (username === this.username) {
      alert('You cannot remove yourself from the group.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to remove this user from the group?');
    if (confirmed) {
      this.groupsService.kickUserFromGroup(this.groupName || '', username).subscribe({
        next: () => {
          alert('User removed successfully.');
          // Update user list after removal
          this.loadUsersInGroup();
        },
        error: (error) => {
          console.error('Failed to remove user:', error);
          alert('Failed to remove user.');
        }
      });
    }
  }

  // Function to reload users in the group
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

  //******************************Button Methods******************************
  deleteChannel(): void {
    const confirmed = window.confirm('Are you sure you want to delete this channel? This action cannot be undone.');

    if (confirmed) {
      if (this.groupName && this.channelName) {
        this.groupsService.deleteChannel(this.groupName, this.channelName, this.username, this.isSuperAdmin).subscribe({
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
