import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RequestsService } from '../../services/requests/requests.service';
import { GroupsService, Admin } from '../../services/groups/groups.service';
import { UsersService } from '../../services/users/users.service';
import { ChannelsService } from '../../services/channels/channels.service';
import { SocketService } from '../../services/socket/socket.service'; 
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators'
import { ChangeDetectorRef } from '@angular/core'; 

interface Message {
  _id?: string;
  sender: string;
  content: string;
  timestamp: string;
}

interface GroupUser {
  userId: string;
  username: string;
  profilePicture?: string;
}

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  groupName: string | null = null;
  channelName: string | null = null;

  // User information
  userID: string = '';  
  username: string = '';
  roles: string[] = [];

  // Group and user information
  usersInGroup: (GroupUser | Admin)[] = []; 
  groupAdmins: Admin[] = [];
  groupCreatorId: string = ''; 
  requestCount: number = 0;

  // Flags to check user permissions
  isCreator: boolean = false;
  isSuperAdmin: boolean = false;
  isGroupAdmin: boolean = false;
  showUserLists: boolean = false;

  // Chat messages
  messages: Message[] = [];
  newMessageContent: string = '';
  selectedFile: File | null = null;
  selectedFileName: string | null = null; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestsService: RequestsService,
    private groupsService: GroupsService,
    private usersService: UsersService,
    private channelsService: ChannelsService,
    private socketService: SocketService
  ) {
    // Retrieve groupName and channelName from route parameters
    this.route.paramMap.subscribe(params => {
      this.groupName = params.get('groupName');
      this.channelName = params.get('channelName');
    });
  }

  ngOnInit(): void {
    this.loadInitialData();

    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userID = storedUser.userId || ''; 
    this.username = storedUser.username || '';
    this.roles = storedUser.roles || [];
  
    this.isSuperAdmin = this.roles.includes('superAdmin');

    if (this.groupName && this.channelName) {
      this.loadChatMessages(true);
  
      // Emit the join event when the component loads
      this.socketService.emit('joinChat', { username: this.username, channelName: this.channelName });
      
      // Subscribe to real-time messages using Socket.IO
      this.socketService.onMessageReceived().subscribe((message: any) => {
        if (message) {
          this.messages.push(message);
          this.scrollToBottom();
        }
      });
    }
  }

  //******************************Data Loading******************************
  private loadInitialData(): void {
    console.log('loadInitialData called.');
  
    // Fetch request count if the user is group admin or super admin
    if (this.isGroupAdminOrSuperAdmin()) {
      console.log('User is a group admin or super admin. Loading request count...');
      this.loadRequestCount();
    }
  
    // Load users, admins, and creator of the group
    console.log('Fetching users, admins, super admins, and group creator...');
    forkJoin([
      this.groupsService.getUsersInGroup(this.groupName!),
      this.groupsService.getGroupAdmins(this.groupName!),
      this.usersService.getSuperAdmins(),
      this.groupsService.getGroupCreator(this.groupName!)
    ]).subscribe({
      next: async ([users, admins, superAdmins, creatorId]) => {
        console.log('Data fetched successfully.');
        console.log('Users:', users);
        console.log('Admins:', admins);
        console.log('SuperAdmins:', superAdmins);
        console.log('Creator ID:', creatorId);
  
        this.groupCreatorId = creatorId;
        this.isCreator = this.userID === this.groupCreatorId || this.isSuperAdmin;
        this.isGroupAdmin = this.roles.includes('groupAdmin');
  
        // Combine users and admins but keep the types separate
        console.log('Fetching profile pictures for users...');
        const groupUsers = users.map(user =>
          this.usersService.getUserProfilePicture(user.username).pipe(
            map(response => {
              console.log(`Profile picture fetched for user ${user.username}:`, response);
              return { ...user, profilePicture: response.imageUrl } as GroupUser;
            })
          )
        );
  
        console.log('Fetching profile pictures for admins...');
        const adminPictureRequests = [...admins, ...superAdmins].map(admin =>
          this.usersService.getUserProfilePicture(admin.username).pipe(
            map(response => {
              console.log(`Profile picture fetched for admin ${admin.username}:`, response);
              return { ...admin, profilePicture: response.imageUrl } as Admin;
            })
          )
        );
  
        // Wait for all requests to complete
        try {
          console.log('Waiting for all profile picture requests to complete...');
          this.usersInGroup = await forkJoin(groupUsers).toPromise();
          this.groupAdmins = await forkJoin(adminPictureRequests).toPromise();
          console.log('Profile pictures loaded successfully.');
          console.log('Users in group:', this.usersInGroup);
          console.log('Group admins:', this.groupAdmins);
        } catch (err) {
          console.error('Error while fetching profile pictures:', err);
        }
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

  loadChatMessages(initialLoad: boolean = false): void {
    if (this.groupName && this.channelName) {
      this.channelsService.getChannelMessages(this.groupName, this.channelName).subscribe({
        next: (messages) => {
          this.messages = messages;
          if (initialLoad) {
            setTimeout(() => this.scrollToBottom(), 0);
          }
        },
        error: (error) => {
          console.error('Failed to load chat messages:', error);
        }
      });
    }
  }
  
  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true 
    });
  }

  // Method to handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file; 
      this.selectedFileName = file.name; 
    } else {
      this.selectedFile = null; 
      this.selectedFileName = null; 
    }
  }

  //******************************Chat Actions******************************
  sendMessage(): void {
    if (!this.newMessageContent.trim() && !this.selectedFile) {
      alert('Message cannot be empty.');
      return;
    }
  
    if (this.groupName && this.channelName) {
      const formData = new FormData();
      formData.append('sender', this.username);
      formData.append('channelName', this.channelName);
      formData.append('content', this.newMessageContent || '');
  
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
  
      const socketMessage = {
        sender: this.username,
        content: this.newMessageContent || '',
        timestamp: new Date().toISOString(),
        channelName: this.channelName,
        imageUrl: this.selectedFile ? `/uploads/messages/${this.selectedFile.name}` : null 
      };

      this.channelsService.addChannelMessage(this.groupName, this.channelName, formData).subscribe({
        next: () => {
          this.newMessageContent = '';
          this.selectedFile = null;
          this.selectedFileName = null; 
        },
        error: (error) => {
          console.error('Failed to send message:', error);
          alert('Failed to send message.');
        }
      });
    }
  }
  
  

  deleteMessage(messageId: string): void {
    if (this.groupName && this.channelName) {
      const confirmed = window.confirm('Are you sure you want to delete this message?');
      if (confirmed) {
        this.channelsService.deleteChannelMessage(this.groupName, this.channelName, messageId).subscribe({
          next: () => {
            this.messages = this.messages.filter(message => message._id !== messageId);
            console.log('Message deleted successfully.');
          },
          error: (error) => {
            console.error('Failed to delete message:', error);
            alert('Failed to delete message.');
          }
        });
      }
    }
  }

  //******************************Scroll to Bottom******************************
  private scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }, 100);
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
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

  deleteUsersAccount(username: string): void {
    const confirmed = window.confirm('Are you sure you want to delete this account? This action cannot be undone.');
  
    if (confirmed) {
      // Delete the specified user's account
      this.usersService.deleteUserByUsername(username).subscribe({
        next: () => {
          // Remove any pending requests related to the user after account deletion
          this.requestsService.removePendingRequests(username).subscribe({
            next: () => {
              console.log(`Pending requests for ${username} removed successfully.`);
            },
            error: (err) => {
              console.error('Failed to remove pending requests:', err);
            }
          });
  
          alert('Account deleted successfully.');;
        },
        error: (err) => {
          console.error('Failed to delete user:', err);
          alert('Failed to delete account. Please try again later.');
        }
      });
    } else {
      console.log('Account deletion cancelled');
    }
  }
  

  toggleUserLists(): void {
    this.showUserLists = !this.showUserLists;
  }

  getAvatarImg(sender: string): string {
    const user = this.usersInGroup.find(u => u.username === sender) 
                 || this.groupAdmins.find(admin => admin.username === sender);
    
    if (user) {
      console.log(`Displaying avatar for ${sender}:`, user.profilePicture);
      return user.profilePicture 
             ? user.profilePicture 
             : 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg';
    }
  
    // If no user is found, return a placeholder image
    console.log(`No user found for ${sender}, using default avatar.`);
    return 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg';
  }
  

    //******************************Promotion Actions******************************
    promoteToGroupAdmin(username: string): void {
      const confirmed = window.confirm(`Are you sure you want to promote ${username} to Group Admin?`);
      if (confirmed && this.groupName) {
        this.usersService.promoteToGroupAdmin(username).subscribe({
          next: () => {
            alert(`${username} has been promoted to Group Admin.`);
          },
          error: (err) => {
            console.error('Failed to promote user to Group Admin:', err);
            alert('Promotion to Group Admin failed.');
          }
        });
      }
    }
  
    promoteToSuperAdmin(username: string): void {
      const confirmed = window.confirm(`Are you sure you want to promote ${username} to Super Admin?`);
      if (confirmed) {
        this.usersService.promoteToSuperAdmin(username).subscribe({
          next: () => {
            alert(`${username} has been promoted to Super Admin.`);
          },
          error: (err) => {
            console.error('Failed to promote user to Super Admin:', err);
            alert('Promotion to Super Admin failed.');
          }
        });
      }
    }

  //******************************Component Navigation******************************
  navigateToUserGroup(): void {
    this.socketService.emit('leaveChat', { username: this.username, channelName: this.channelName }); 
    setTimeout(() => {
      this.router.navigate(['/user-group']); 
    }, 100); 
  }
  
  navigateToAccount(): void {
    this.socketService.emit('leaveChat', { username: this.username, channelName: this.channelName }); 
    setTimeout(() => {
      this.router.navigate(['/account']); 
    }, 100);
  }
  
  navigateToInbox(): void {
    this.socketService.emit('leaveChat', { username: this.username, channelName: this.channelName }); 
    setTimeout(() => {
      this.router.navigate(['/inbox']); 
    }, 100);
  }
}
