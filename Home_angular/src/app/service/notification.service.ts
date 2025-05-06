// notification.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environment/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private socket: Socket;
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  private countSubject = new BehaviorSubject<number>(0);

  notifications$ = this.notificationsSubject.asObservable();
  notificationCount$ = this.countSubject.asObservable();
  token: any;
  constructor(private authService: AuthService) {
    this.token = authService.getToken();
    this.socket = io(`${environment.url1}/alerts`, {
      transports: ['websocket'],
      auth: {
        token: this.token,
      },
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('incident_notification', (data: any) => {
      console.log('data no', data);

      const currentNotifications = this.notificationsSubject.value;
      this.notificationsSubject.next([data, ...currentNotifications]);
      this.countSubject.next(currentNotifications.length + 1);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  clearNotifications() {
    this.notificationsSubject.next([]);
    this.countSubject.next(0);
  }
}
