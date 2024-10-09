import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs';

export interface Channel {
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})

export class ChannelsService {
  private apiUrl = 'http://localhost:3000/api/channels';

  constructor(private http: HttpClient) {}

  getChannelsByGroupName(groupName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/group/${groupName}`);
  }

  createChannel(groupName: string, name: string, description: string): Observable<any> {
    return this.http.post(this.apiUrl, { groupName, name, description });
  }

  // Method to delete a channel
  deleteChannel(groupName: string, channelName: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${groupName}/${channelName}`);
  }

  addChannelMessage(groupName: string, channelName: string, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupName}/${channelName}/messages`, formData);
  }
  
  getChannelMessages(groupName: string, channelName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${groupName}/${channelName}/messages`);
  }
  
  deleteChannelMessage(groupName: string, channelName: string, messageId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/messages/${groupName}/${channelName}/${messageId}`);
  }
}
