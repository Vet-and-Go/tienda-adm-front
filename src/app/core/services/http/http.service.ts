import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Http {
  url: string = '/api/';

  constructor(private http: HttpClient) { }

  getAll<T>(route: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.url}${route}`)
  }

  getById<T>(route: string): Observable<T> {
    return this.http.get<T>(`${this.url}${route}`)
  }

  create<T>(route: string, newObject: T): Observable<T> {
    return this.http.post<T>(`${this.url}${route}`, newObject)
  }

  update<T>(route: string, newObject: T): Observable<T> {
    return this.http.put<T>(`${this.url}${route}`, newObject)
  }

  deleteById<T>(route: string): Observable<T> {
    return this.http.delete<T>(`${this.url}${route}`)
  }

  getByName<T>(route: string): Observable<T> {
    return this.http.get<T>(`${this.url}${route}`)
  }
}
