import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { catchError } from 'rxjs';
import { of } from 'rxjs';


export interface Admin {
  userId: string;
  username: string;
  role: string;
  profilePicture?: string;
}

export interface Group {
  name: string;
  admins: Admin[];
  creatorId: string;
}

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private apiUrl = 'http://localhost:3000/api/groups';

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

  // Delete a specific group
  deleteGroup(groupName: string, currentUserId: string, isSuperAdmin: boolean): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${groupName}`, { body: { currentUserId, isSuperAdmin } });
  }
 
  // Get users in a specific group
  getUsersInGroup(groupName: string): Observable<{ userId: string; username: string }[]> {
    return this.http.get<{ userId: string; username: string }[]>(`${this.apiUrl}/${groupName}/users`);
  }

  // Get group admins
  getGroupAdmins(groupName: string): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.apiUrl}/${groupName}/admins`);
  }

  // Function to add a group to the user's groups array
  addGroupToUser(username: string, groupName: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/add-group-to-user/${username}`, { groupName }).pipe(
      catchError((error) => {
        console.error(`Failed to add group to user: ${error.message}`);
        return of(null);
      })
    );
  }

  // Leave a group
  leaveGroup(groupName: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupName}/leave`, { userId });
  }

  // Kick a user from a group
  kickUserFromGroup(groupName: string, username: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/groups/${groupName}/users/${username}`);
  }
  
}
