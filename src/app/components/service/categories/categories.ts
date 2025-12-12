import { Injectable } from '@angular/core';
import { Http } from '../../ui/http/http';
import { Category } from '../../../Models/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  url: string = 'categories'

  constructor(private http: Http) {}

  getAll(): Observable<Category[]> {
    return this.http.getAll<Category>(this.url);
  }

  getById(id: number): Observable<Category> {
    return this.http.getById<Category>(this.url + '/' + id);
  }

  getByName(name: string): Observable<Category> {
    return this.http.getByName<Category>(this.url + '/' + name);
  }

  create(category: Category): Observable<Category> {
    return this.http.create<Category>(this.url, category);
  }

  update(category: Category): Observable<Category> {
    return this.http.update<Category>(this.url + '/' + category.id, category);
  }

  delete(id: number): Observable<Category> {
    return this.http.deleteById<Category>(this.url + '/' + id);
  }
}
