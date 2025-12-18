import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Http } from '../../../core/services/http/http.service';
import { Category } from '../../../Models/category';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  url: string = 'categories';

  constructor(private http: Http) { }

  private totalCategories: number = 0;

  getAll(): Observable<Category[]> {
    return this.http.getAll<Category>(this.url).pipe(
      map(categories => {
        this.totalCategories = categories.length;
        return categories;
      })
    );
  }

  getById(id: number): Observable<Category> {
    return this.http.getById<Category>(`${this.url}/${id}`);
  }

  create(cat: Category): Observable<Category> {
    return this.http.create<Category>(this.url, cat);
  }

  update(cat: Category): Observable<Category> {
    return this.http.update<Category>(`${this.url}/${cat.id}`, cat);
  }

  delete(id: number): Observable<void> {
    return this.http.deleteById<void>(`${this.url}/${id}`);
  }

  getTotalCategories(): number {
    return this.totalCategories;
  }
}
