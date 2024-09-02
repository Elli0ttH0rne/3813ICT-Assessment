import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

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
  roles: string[] = []; // Changed to an array of roles

  // Group and user information
  usersInGroup: { userId: string; username: string }[] = [];
  groupAdmins: { username: string; role: string }[] = [];
  groupCreator: string = '';

  // Flags to check user permissions
  isCreator: boolean = false;
  isSuperAdmin: boolean = false; // Added property

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    this.route.paramMap.subscribe(params => {
      this.groupName = params.get('groupName');
      this.channelName = params.get('channelName');
    });
  }

  ngOnInit(): void {
    // Retrieve currentUser information from local storage
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.username = storedUser.username || '';
    this.roles = storedUser.roles || []; // Set as array

    this.isSuperAdmin = this.roles.includes('superAdmin'); // Check if user is a super admin

    if (this.groupName) {
      this.usersInGroup = this.authService.getUsersInGroup(this.groupName);
      this.groupAdmins = this.authService.getGroupAdmins(this.groupName);
      this.groupCreator = this.authService.getGroupCreator(this.groupName);

      // Check if the current user is the group creator or a super admin
      this.isCreator = this.username === this.groupCreator || this.isSuperAdmin;
    }
  }

  // Navigate back to the user group component
  navigateToUserGroup(): void {
    this.router.navigate(['/user-group']);
  }

  // Navigate to the account component
  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  // Method to delete the channel
  deleteChannel(): void {
    if (this.groupName && this.channelName) {
        const success = this.authService.deleteChannel(this.groupName, this.channelName, this.username, this.isSuperAdmin);
        if (success) {
            alert('Channel deleted successfully.');
            // Navigate or refresh as needed
            this.navigateToUserGroup();
        } else {
            alert('Failed to delete channel.');
        }
    }
  }
}
