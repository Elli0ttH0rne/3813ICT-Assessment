import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RequestsService } from '../../services/requests/requests.service';
import { GroupsService } from '../../services/groups/groups.service';
import { AuthService } from '../../services/auth/auth.service';
import { UsersService } from '../../services/users/users.service';

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

  constructor(
    private router: Router, 
    private requestsService: RequestsService,
    private groupsService: GroupsService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.username = storedUser.username;
    this.roles = storedUser.roles;

    // Load initial requests based on roles and active tab
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
    this.requestsService.getAllRequests().subscribe({
      next: (requests) => {
        this.joinRequests = requests.filter(request => request.typeOfRequest === 'join');
      },
      error: (err) => {
        console.error('Failed to load join requests:', err);
      }
    });
  }
  
  loadReportedUsers(): void {
    this.requestsService.getAllRequests().subscribe({
      next: (requests) => {
        this.reportRequests = requests.filter(request => request.typeOfRequest === 'report');
      },
      error: (err) => {
        console.error('Failed to load report requests:', err);
      }
    });
  }
  
  loadPromotionRequests(): void {
    this.requestsService.getAllRequests().subscribe({
      next: (requests) => {
        this.promotionRequests = requests.filter(request => request.typeOfRequest === 'promotion');
      },
      error: (err) => {
        console.error('Failed to load promotion requests:', err);
      }
    });
  }
  

  //******************************Group Request Methods******************************
approveRequest(request: any): void {
  if (!request.username || !request.groupName) {
    console.error('Username or group name is undefined');
    return;
  }

  // Confirm the action with the user
  const confirmed = window.confirm(`Are you sure you want to approve the request from ${request.username} to join ${request.groupName}?`);

  if (confirmed) {
    // Add the group to the user's groups array in users.json
    this.groupsService.addGroupToUser(request.username, request.groupName).subscribe({
      next: () => {
        // Remove the approved request from the requests.json
        this.requestsService.deleteRequestByDetails(request.username, request.groupName, request.typeOfRequest).subscribe({
          next: () => {
            // Update the relevant request list based on the type of request
            this.updateRequestList(request);
            console.log(`Approved request from ${request.username} to join ${request.groupName}`);
          },
          error: (err) => {
            console.error(`Failed to remove approved request from ${request.username}`, err);
          }
        });
      },
      error: (err) => {
        console.error(`Failed to add group to user ${request.username}`, err);
        alert('Failed to approve the request.');
      }
    });
  }
}

denyRequest(request: any): void {
  if (!request || !request.username || !request.groupName || !request.typeOfRequest) {
    console.error('Request, username, group name, or type of request is undefined');
    return;
  }

  // Confirm the action with the user
  const confirmed = window.confirm(`Are you sure you want to deny the request from ${request.username}?`);

  if (confirmed) {
    // Remove the denied request from the requests.json
    this.requestsService.deleteRequestByDetails(request.username, request.groupName, request.typeOfRequest).subscribe({
      next: () => {
        // Update the relevant request list based on the type of request
        this.updateRequestList(request);
        console.log(`Denied request from ${request.username}`);
      },
      error: (err) => {
        console.error(`Failed to deny request from ${request.username}`, err);
      }
    });
  }
}

//******************************Request List Update Method******************************
private updateRequestList(request: any): void {
  switch (request.typeOfRequest) {
    case 'join':
      this.joinRequests = this.joinRequests.filter(req => req !== request);
      break;
    case 'report':
      this.reportRequests = this.reportRequests.filter(req => req !== request);
      break;
    case 'promotion':
      this.promotionRequests = this.promotionRequests.filter(req => req !== request);
      break;
    default:
      console.error(`Unknown request type: ${request.typeOfRequest}`);
  }
}

  
  

  //******************************Report Request Methods******************************
  approvePromotionRequest(promotionRequest: any): void {
    if (!promotionRequest || !promotionRequest.promotionUser) {
      console.error('Invalid promotion request');
      return;
    }
  
    const confirmed = window.confirm(`Are you sure you want to promote ${promotionRequest.promotionUser} to Group Admin?`);
  
    if (confirmed) {
      // Call promoteToGroupAdmin in UsersService to promote the user
      console.log(promotionRequest.promotionUser)
      this.usersService.promoteToGroupAdmin(promotionRequest.promotionUser).subscribe({
        next: () => {
          alert('User promoted to Group Admin successfully.');
          // Remove the promotion request after approval
          this.requestsService.deleteRequestByDetails(promotionRequest.username, promotionRequest.groupName, promotionRequest.typeOfRequest).subscribe({
            next: () => {
              this.updateRequestList(promotionRequest);
              console.log(`Approved promotion request for ${promotionRequest.promotionUser}`);
            },
            error: (err) => {
              console.error('Failed to remove promotion request:', err);
            }
          });
        },
        error: (err) => {
          console.error('Failed to promote user:', err);
          alert('Failed to promote user.');
        }
      });
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

  navigateToUserGroup(): void {
    this.router.navigate(['/user-group']);
  }
}
