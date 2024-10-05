import { Injectable } from '@angular/core';
import { RequestsService } from '../requests/requests.service';
import { UsersService } from '../users/users.service';
import { GroupsService } from '../groups/groups.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api'; 

  constructor(
    private requestsService: RequestsService,
    private usersService: UsersService,
    private groupsService: GroupsService,
    private http: HttpClient
  ) { }

  promoteToGroupAdmin(username: string): Observable<boolean> {
    return this.http.post(`${this.apiUrl}/promote/groupAdmin`, { username }).pipe(
      map(() => {
        console.log(`User ${username} has been promoted to group admin.`);
        return true;
      })
    );
  }

  promoteToSuperAdmin(username: string): Observable<boolean> {
    return this.http.post(`${this.apiUrl}/promote/superAdmin`, { username }).pipe(
      map(() => {
        console.log(`User ${username} has been promoted to super admin.`);
        return true;
      })
    );
  }

  getSuperAdmins(): Observable<{ userId: string; username: string; role: string }[]> {
    return this.http.get<{ userId: string; username: string; role: string }[]>(`${this.apiUrl}/users/superAdmins`);
  }
}
