import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  private apiUrl = 'http://localhost:3000/api/requests';

  constructor(private http: HttpClient) {}

  //******************************Create Request******************************
  createRequest(username: string, groupName: string, typeOfRequest: string, reportedUsername?: string, reason?: string, promotionUser?: string): Observable<any> {
    const newRequest: any = { username, groupName, typeOfRequest };

    if (typeOfRequest === 'report' && reportedUsername && reason) {
      newRequest.reportedUsername = reportedUsername;
      newRequest.reason = reason;
    }

    if (typeOfRequest === 'promotion' && promotionUser) {
      newRequest.promotionUser = promotionUser;
    }

    return this.http.post(this.apiUrl, newRequest).pipe(
      catchError(this.handleError('createRequest'))
    );
  }

  //******************************Get Requests******************************
  getAllRequests(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(this.handleError('getAllRequests', []))
    );
  }

  getRequestsByType(type: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?type=${type}`).pipe(
      catchError(this.handleError(`getRequestsByType(${type})`, []))
    );
  }

  getGroupJoinRequests(): Observable<any[]> {
    return this.getRequestsByType('join');
  }

  getReportRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?type=report`).pipe(
      map(requests => {
        console.log('Report requests received from backend:', requests);
        return requests;
      }),
      catchError((error) => {
        console.error('Failed to get report requests:', error);
        return of([]);
      })
    );
  }
  

  getPromotionRequests(): Observable<any[]> {
    return this.getRequestsByType('promotion');
  }

  //******************************Update Requests Status******************************
  updateRequestStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, { status }).pipe(
      catchError(this.handleError(`updateRequestStatus(${id}, ${status})`))
    );
  }

  approveJoinRequest(id: string): Observable<any> {
    return this.updateRequestStatus(id, 'approved');
  }

  rejectJoinRequest(id: string): Observable<any> {
    return this.updateRequestStatus(id, 'rejected');
  }

  resolveReportRequest(id: string): Observable<any> {
    return this.updateRequestStatus(id, 'resolved');
  }

  resolvePromotionRequest(id: string): Observable<any> {
    return this.updateRequestStatus(id, 'resolved');
  }

  //******************************Delete Requests******************************
  deleteRequest(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError(`deleteRequest(${id})`))
    );
  }

  removePendingRequestsByGroup(groupName: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}?groupName=${groupName}`).pipe(
      catchError(this.handleError(`removePendingRequestsByGroup(${groupName})`))
    );
  }

  //******************************Request Count******************************
  getRequestCount(): Observable<number> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(requests => requests.length),
      catchError(() => of(0))
    );
  }

  //******************************Handle Error******************************
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
