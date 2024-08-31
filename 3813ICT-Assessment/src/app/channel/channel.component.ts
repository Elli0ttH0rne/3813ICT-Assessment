import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule, RouterModule], // Import CommonModule and RouterModule
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent {
  groupName: string | null = null;
  channelName: string | null = null;

  // User information
  username: string = '';
  securityLevel: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.paramMap.subscribe(params => {
      this.groupName = params.get('groupName');
      this.channelName = params.get('channelName');
    });
  }

  ngOnInit(): void {
    // Retrieve currentUser information from local storage
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.username = storedUser.username;
    this.securityLevel = storedUser.securityLevel ;
  }

  // Navigate back to the user group component
  navigateToUserGroup(): void {
    this.router.navigate(['/user-group']);
  }

  // Navigate to the account component
  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }
}