import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RequestsService } from '../../services/requests/requests.service';
import { GroupsService } from '../../services/groups/groups.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  username: string = '';
  roles: string[] = [];
  activeTab: string = 'joinRequests'; 
  joinRequests: any[] = []; 
  reportRequests: any[] = []; 
  promotionRequests: any[] = []; 
  requestCount: number = 0; 
  groupAdmins: { username: string; role: string }[] = [];

  constructor(
    private router: Router, 
    private requestsService: RequestsService,
    private groupsService: GroupsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.username = storedUser.username;
    this.roles = storedUser.roles;

    // Load requests based on roles and active tab
    if (this.isGroupAdminOrSuperAdmin()) {
      this.loadJoinRequests();
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
      this.loadReportedUsers();
    }
  }

  //******************************Checks******************************
  isGroupAdminOrSuperAdmin(): boolean {
    return this.roles.includes('groupAdmin') || this.roles.includes('superAdmin');
  }

  isSuperAdmin(): boolean {
    return this.roles.includes('superAdmin');
  }

  //******************************Loading Methods******************************
  loadJoinRequests(): void {
    this.requestsService.getGroupJoinRequests().subscribe({
      next: (requests) => {
        this.joinRequests = requests;
      },
      error: (err) => {
        console.error('Failed to load join requests:', err);
      }
    });
  }

  loadReportedUsers(): void {
    this.requestsService.getReportRequests().subscribe({
      next: (requests) => {
        this.reportRequests = requests;
      },
      error: (err) => {
        console.error('Failed to load report requests:', err);
      }
    });
  }

  loadPromotionRequests(): void {
    this.requestsService.getPromotionRequests().subscribe({
      next: (requests) => {
        this.promotionRequests = requests;
      },
      error: (err) => {
        console.error('Failed to load promotion requests:', err);
      }
    });
  }

  //******************************Group Request Methods******************************
  approveRequest(request: any): void {
    if (!request.username) {
      console.error('Username is undefined');
      return;
    }
    this.requestsService.approveJoinRequest(request).subscribe({
      next: () => {
        this.joinRequests = this.joinRequests.filter(req => req !== request);
        console.log(`Approved request from ${request.username}`);
      },
      error: (err) => {
        console.error(`Failed to approve request from ${request.username}`, err);
      }
    });
  }

  denyRequest(request: any): void {
    if (!request.username) {
      console.error('Username is undefined');
      return;
    }
    this.requestsService.rejectJoinRequest(request).subscribe({
      next: () => {
        this.joinRequests = this.joinRequests.filter(req => req !== request);
        console.log(`Denied request from ${request.username}`);
      },
      error: (err) => {
        console.error(`Failed to deny request from ${request.username}`, err);
      }
    });
  }

  //******************************Report Request Methods******************************
  banReportedUser(reportedUser: any): void {
    if (!reportedUser.reportedUsername) {
      console.error('Username is undefined');
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to ban ${reportedUser.reportedUsername} from the group ${reportedUser.groupName}? This action cannot be undone.`);

    if (confirmed) {
      this.groupsService.kickUserFromGroup(reportedUser.groupName, reportedUser.reportedUsername).subscribe({
        next: () => {
          alert(`User ${reportedUser.reportedUsername} removed successfully.`);
          this.reportRequests = this.reportRequests.filter(user => user !== reportedUser);
          this.removeReportedUserRequest(reportedUser);
        },
        error: (error) => {
          console.error('Failed to remove user:', error);
          alert('Failed to remove user.');
        }
      });
    }
  }

  removeReportedUserRequest(user: any): void {
    this.requestsService.getReportRequests().subscribe({
      next: (requests) => {
        const updatedRequests = requests.filter(req => !(req.reportedUsername === user.reportedUsername && req.groupName === user.groupName));
        this.requestsService.updateReportRequests(updatedRequests).subscribe({
          next: () => {
            console.log('Requests updated successfully.');
          },
          error: (err) => {
            console.error('Failed to update requests:', err);
          }
        });
      },
      error: (err) => {
        console.error('Failed to load report requests:', err);
      }
    });
  }

  approvePromotionRequest(promotionRequest: any): void {
    if (!promotionRequest || !promotionRequest.promotionUser) {
      console.error('Invalid promotion request');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to promote this user to Group Admin?');
    if (confirmed) {
      this.authService.promoteToGroupAdmin(promotionRequest.promotionUser).subscribe({
        next: () => {
          alert('User promoted to Group Admin successfully.');
          this.promotionRequests = this.promotionRequests.filter(req => req !== promotionRequest);
        },
        error: (err) => {
          console.error('Failed to promote user:', err);
          alert('Failed to promote user.');
        }
      });
    }
  }

  denyPromotionRequest(promotionRequest: any): void {
    if (!promotionRequest || !promotionRequest.promotionUser) {
      console.error('Invalid promotion request');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to deny this promotion request?');
    if (confirmed) {
      this.promotionRequests = this.promotionRequests.filter(req => req !== promotionRequest);
      alert('Promotion request denied.');
    }
  }

  //******************************UI Methods******************************
  setActiveTab(tab: string): void {
    this.activeTab = tab;

    if (tab === 'joinRequests' && this.isGroupAdminOrSuperAdmin()) {
      this.loadJoinRequests();
    } else if (tab === 'reportedUsers' && this.isSuperAdmin()) {
      this.loadReportedUsers();
    } else if (tab === 'promotionRequests' && this.isSuperAdmin()) {
      this.loadPromotionRequests();
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
