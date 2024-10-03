import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:3000/api/users'; // Update this to match your server address

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

  // Delete a user by username
  deleteUser(username: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${username}`);
  }
}
