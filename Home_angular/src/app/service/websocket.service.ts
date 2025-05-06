// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environment/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket;
  private readonly SERVER_URL = `${environment.url1}`; 
  token: any;
  constructor(private authService: AuthService) {
    this.token = authService.getToken();
    // console.log('this.token',this.token);
    
    this.socket = io(this.SERVER_URL, {
      transports: ['websocket'],
      auth: {
        token: this.token,
      },
    });

  }

  listenForIncidents(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('incident_notification', data => {
        console.log('data notification',data);
        
        observer.next(data);
      });
    });
  }

  // Emit custom event
  sendIncident(message: any): void {
    this.socket.emit('incident_notification', message);
  }

  // Listen to custom events
  onIncidentResponse(callback: (data: any) => void): void {
    this.socket.on('incident_response', callback);
  }

  // Optional: expose socket for more flexibility
  getSocket(): Socket {
    return this.socket;
  }
}
