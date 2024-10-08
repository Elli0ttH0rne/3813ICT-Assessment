import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

interface Message {
  _id?: string;
  sender: string;
  content: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;
  private readonly serverUrl = 'http://localhost:3000'; 

  constructor() {
    this.connect();
  }

  // Connect to the Socket.IO server
  connect(): void {
    this.socket = io(this.serverUrl);
  }

  // Send a message to the server
  sendMessage(message: Message): void {
    this.socket.emit('sendMessage', message);
  }

  // Listen for new messages from the server
  onMessageReceived(): Observable<Message> {
    return new Observable((observer) => {
      this.socket.on('newMessage', (message: Message) => {
        observer.next(message);
      });
    });
  }

  // Disconnect from the server
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
