import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHandler,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private notificationReceived = new Subject<void>();
  notificationReceived$ = this.notificationReceived.asObservable();

  private notifications: string[] = [];
  private notificationListSubject = new BehaviorSubject<string[]>([]);
  notifications$ = this.notificationListSubject.asObservable();

  notifyDashboard(): void {
    this.notificationReceived.next();
  }

  addNotification(msg: string): void {
    this.notifications.unshift(msg);
    this.notificationListSubject.next([...this.notifications]);
  }

  clearNotifications(): void {
    this.notifications = [];
    this.notificationListSubject.next([]);
  }
  constructor(private http: HttpClient) {}
  login(loginData: any): Observable<any> {
    return this.http.post(`${environment.url}/login`, loginData);
  }

  getIncedeentData(page: any, item: any) {
    const token = localStorage.getItem('auth_token'); // or from a service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(
      `${environment.url}/getIncidents?page=${page}&limit=${item}`,
      { headers }
    );
  }
  registerNewuser(userData: FormData) {
    return this.http.post(`${environment.url}/register`, userData);
  }

  getuserData() {
    const token = localStorage.getItem('auth_token'); // or from a service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${environment.url}/event/getUser/`, { headers });
  }

  addCameraType(cameraData: any) {
    const token = localStorage.getItem('auth_token'); // or from a service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    console.log('Sending Camera Data:', cameraData);
    return this.http.post(`${environment.url}/event/Addcam/`, cameraData, {
      headers,
    });
  }
  deleteUser(userId: any) {
    return this.http.delete(`${environment.url}/getUser/${userId}/`);
  }

  updateUser(UserId: string, userData: any) {
    const token = localStorage.getItem('auth_token'); // or from a service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.patch(
      `${environment.url}/event/getUser/${UserId}/`,
      userData,
      { headers }
    );
  }
}
