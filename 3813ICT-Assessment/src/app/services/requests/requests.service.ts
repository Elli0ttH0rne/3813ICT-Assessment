import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  private apiUrl = 'http://localhost:3000/api/requests';

  constructor(private http: HttpClient) {}

  //******************************Join Group Request Methods******************************
  // Create a new request
  createRequest(username: string, groupName: string, typeOfRequest: string, reportedUsername?: string, reason?: string): Observable<any> {
    return this.http.post(this.apiUrl, { username, groupName, typeOfRequest, reportedUsername, reason });
  }

  // Get all requests
  getAllRequests(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getGroupJoinRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?type=joinGroup`).pipe(
      catchError((error) => {
        console.error('Failed to get join requests:', error);
        return of([]);
      })
    );
  }

  approveJoinRequest(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, { status: 'approved' }).pipe(
      catchError((error) => {
        console.error('Failed to approve join request:', error);
        return of(null);
      })
    );
  }

  rejectJoinRequest(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, { status: 'rejected' }).pipe(
      catchError((error) => {
        console.error('Failed to reject join request:', error);
        return of(null);
      })
    );
  }

  //******************************Reported User Methods******************************
  createReportRequest(reporterUsername: string, reportedUsername: string, reason: string, groupName: string): Observable<any> {
    const newRequest = { reporterUsername, reportedUsername, reason, groupName, status: 'pending', type: 'report' };
    return this.http.post(this.apiUrl, newRequest).pipe(
      catchError((error) => {
        console.error('Failed to create report request:', error);
        return of(null);
      })
    );
  }

  resolveReportRequest(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, { status: 'resolved' }).pipe(
      catchError((error) => {
        console.error('Failed to resolve report request:', error);
        return of(null);
      })
    );
  }

  getReportRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?type=report`).pipe(
      catchError((error) => {
        console.error('Failed to get report requests:', error);
        return of([]);
      })
    );
  }

  updateReportRequests(updatedRequests: any[]): Observable<any> {
    return this.http.put(this.apiUrl, updatedRequests).pipe( 
      catchError((error) => {
        console.error('Failed to update report requests:', error);
        return of(null);
      })
    );
  }
  

  //******************************Group Admin Promotion Requests Methods******************************
  createPromotionRequest(requestedAdmin: string, promotionUser: string): Observable<any> {
    const newRequest = { requestedAdmin, promotionUser, status: 'pending', type: 'promotion' };
    return this.http.post(this.apiUrl, newRequest).pipe(
      catchError((error) => {
        console.error('Failed to create promotion request:', error);
        return of(null);
      })
    );
  }

  resolvePromotionRequest(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, { status: 'resolved' }).pipe(
      catchError((error) => {
        console.error('Failed to resolve promotion request:', error);
        return of(null);
      })
    );
  }

  getPromotionRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?type=promotion`).pipe(
      catchError((error) => {
        console.error('Failed to get promotion requests:', error);
        return of([]);
      })
    );
  }

  //******************************Pending Requests******************************
  removePendingRequestsByGroup(groupName: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?groupName=${groupName}`).pipe(
      catchError((error) => {
        console.error('Failed to remove pending requests by group:', error);
        return of(null);
      })
    );
  }
  
  removePendingRequests(username: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/requests/user/${username}`);
  }
  
  
  // Example for deleting request (id is required)
  deleteRequest(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Failed to delete request:', error);
        return of(null);
      })
    );
  }

  getRequestCount(): Observable<number> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((requests) => requests.length),
      catchError(() => of(0))
    );
  }
}
