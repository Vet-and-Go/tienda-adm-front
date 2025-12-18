import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../../../Models/auth';
import { catchError, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  url: string = '/api/users/auth/';
  private roleState = false;
  private _username: string | null = null;

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest, role: string = 'user'): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}login/${role}`, credentials).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        this._username = res.username;
        this.roleState = res.role === 'ADMIN';
      })
    );
  }


  logout(): Observable<void> {
    return this.http.post<void>(`${this.url}logout`, { username: this.getUsername() }).pipe(
      tap(() => this.clearSession())
    );
  }

  validateSession(): Observable<User> {
    const token = this.getToken();
    if (!token) {
      return new Observable(observer => {
        observer.error('No token');
        observer.complete();
      });
    }
    return this.http.post<User>(`${this.url}session`, token).pipe(
      tap(user => {
        this.roleState = user.role === 'ADMIN';
        this._username = user.username;
      })
    );
  }

  clearSession(): void {
    localStorage.removeItem('token');
    this.roleState = false;
    this._username = null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsername(): string | null {
    return this._username;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.roleState;
  }
}
