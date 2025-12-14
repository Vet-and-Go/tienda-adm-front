import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../../../Models/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  url: string = '/api/auth/';

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}login`, credentials).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.username);
        localStorage.setItem('role', res.role);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.url}logout`, { username: this.getUsername() }).pipe(
      tap(() => this.clearSession())
    );
  }

  clearSession(): void {
    ['token', 'username', 'role'].forEach(k => localStorage.removeItem(k));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }
}
