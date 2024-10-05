import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

// Define the structure of Group, Channel, and Admin for typing
export interface Channel {
  name: string;
  description: string;
}

export interface Admin {
  userId: string;
  username: string;
  role: string;
}

export interface Group {
  name: string;
  channels: Channel[];
  admins: Admin[];
  creatorId: string;
}

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private apiUrl = 'http://localhost:3000/api/groups'; // Update this to match your server address

  constructor(private http: HttpClient) {}

  // Get all groups
  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl);
  }

  // Get group creator
  getGroupCreator(groupName: string): Observable<string> {
    return this.http.get<Group>(`${this.apiUrl}/${groupName}`).pipe(
      map((group: Group) => group.creatorId)
    );
  }

  // Create a new group
  createGroup(groupName: string, creatorUsername: string, creatorId: string): Observable<any> {
    return this.http.post(this.apiUrl, { groupName, creatorUsername, creatorId });
  }

  // Create a new channel in a group
  createChannel(groupName: string, channelName: string, channelDescription: string, currentUsername: string, isSuperAdmin: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupName}/channels`, { channelName, channelDescription, currentUsername, isSuperAdmin });
  }

  // Get all channels for a specific group
  getGroupChannels(groupName: string): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/${groupName}/channels`);
  }

  // Delete a specific group
  deleteGroup(groupName: string, currentUserId: string, isSuperAdmin: boolean): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${groupName}`, { body: { currentUserId, isSuperAdmin } });
  }


  // Delete a specific channel from a group
  deleteChannel(groupName: string, channelName: string, currentUsername: string, isSuperAdmin: boolean): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${groupName}/channels/${channelName}`, { body: { currentUsername, isSuperAdmin } });
  }

  // Get group admins
  getGroupAdmins(groupName: string): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.apiUrl}/${groupName}/admins`);
  }


  // Get users in a specific group
  getUsersInGroup(groupName: string): Observable<{ userId: string; username: string }[]> {
    return this.http.get<{ userId: string; username: string }[]>(`${this.apiUrl}/${groupName}/users`);
  }

  // Leave a group
  leaveGroup(groupName: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupName}/leave`, { userId });
  }


  // Kick a user from a group
  kickUserFromGroup(groupName: string, username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupName}/kick`, { username });
  }
}
