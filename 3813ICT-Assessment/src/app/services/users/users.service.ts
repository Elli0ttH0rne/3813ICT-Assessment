import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  // Retrieve all users
  getValidUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Save updated list of users
  saveValidUsers(users: any[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/save`, users);
  }

  // Add a new user
  addUser(user: {
    userId: string,
    username: string,
    password: string,
    email: string,
    roles: string[],
    groups: string[]
  }): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  getSuperAdmins(): Observable<{ userId: string; username: string; role: string }[]> {
    return this.http.get<{ userId: string; username: string; role: string }[]>(`${this.apiUrl}/superAdmins`);
  }

  // Delete a user by username
  deleteUserByUsername(username: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/username/${username}`);
  }

  // Promote a user to group admin by username
  promoteToGroupAdmin(username: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/promote/groupAdmin/${username}`, {}).pipe(
      catchError((error) => {
        console.error(`Failed to promote user to Group Admin: ${error.message}`);
        return of(null);
      })
    );
  }

  // Promote a user to super admin by username
  promoteToSuperAdmin(username: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/promote/superAdmin/${username}`, {}).pipe(
      catchError((error) => {
        console.error(`Failed to promote user to Super Admin: ${error.message}`);
        return of(null);
      })
    );
  }

  // Get the profile picture of the user by username
  getUserProfilePicture(username: string): Observable<{ imageUrl: string }> {
    const url = `${this.apiUrl}/profile-picture/${username}`;
    return this.http.get<{ imageUrl: string }>(url).pipe(
      catchError((error) => {
        console.error(`Failed to retrieve profile picture for ${username}:`, error.message);
        return of({ imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg' });
      })
    );
  }

}

