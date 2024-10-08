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
      next: async ([users, admins, superAdmins, creatorId]) => {
        this.groupCreatorId = creatorId;  
        this.isCreator = this.userID === this.groupCreatorId || this.isSuperAdmin;
  
        // Combine users and admins but keep the types separate
        const groupUsers = users.map(user =>
          this.usersService.getUserProfilePicture(user.username).pipe(
            map(response => ({ ...user, profilePicture: response.imageUrl } as GroupUser))
          )
        );
  
        const adminPictureRequests = [...admins, ...superAdmins].map(admin =>
          this.usersService.getUserProfilePicture(admin.username).pipe(
            map(response => ({ ...admin, profilePicture: response.imageUrl } as Admin))
          )
        );
  
        // Wait for all requests to complete
        this.usersInGroup = await forkJoin(groupUsers).toPromise();
        this.groupAdmins = await forkJoin(adminPictureRequests).toPromise();
  
        // Now 'usersInGroup' has only GroupUser objects and 'groupAdmins' has only Admin objects
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
        imageUrl: this.selectedFile ? `/uploads/messages/${this.selectedFile.name}` : null  // Ensure the correct relative path
      };

      this.channelsService.addChannelMessage(this.groupName, this.channelName, formData).subscribe({
        next: () => {
          this.newMessageContent = '';
          this.selectedFile = null;
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

  getAvatarImg(sender: string): string {
    const user = this.usersInGroup.find(u => u.username === sender);
    
    // Return the user's profile picture if available, otherwise return the default image
    return user && user.profilePicture
      ? user.profilePicture
      : 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg';
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
