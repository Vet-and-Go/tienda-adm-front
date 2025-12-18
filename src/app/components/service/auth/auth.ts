import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, shareReplay, catchError, of, map } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../../../Models/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  url: string = '/api/users/auth/';

  private Role: string | null = null;
  currentUser: User | null = null;
  private _username: string | null = null;

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest, role: string = 'admin'): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}login/${role}`, credentials).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.username);
        this._username = res.username;
        this.Role = res.role;
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.url}logout`, { username: this.getUsername() }).pipe(
      tap(() => this.clearSession())
    );
  }

  private session$?: Observable<User>;

  validateSession(): Observable<User> {
    const token = this.getToken();
    if (!token) {
      return new Observable(observer => {
        observer.error('No token');
        observer.complete();
      });
    }

    if (this.currentUser) {
      return of(this.currentUser);
    }

    if (!this.session$) {
      this.session$ = this.http.post<User>(`${this.url}session`, token).pipe(
        tap(user => {
          this.currentUser = user;
          this.Role = user.role;
          this._username = user.username;
        }),
        shareReplay(1)
      );
    }

    return this.session$;
  }

  clearSession(): void {
    ['token', 'username'].forEach(k => localStorage.removeItem(k));
    this.Role = null;
    this.currentUser = null;
    this._username = null;
    this.session$ = undefined;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsername(): string | null {
    return this._username || localStorage.getItem('username');
  }

  getRole(): string | null {
    return this.Role;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.Role === 'ADMIN';
  }
}
