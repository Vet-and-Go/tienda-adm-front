import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http } from '../../../core/services/http/http.service';
import { Product } from '../../../Models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  url: string = 'products';

  constructor(private http: Http) { }

  getAll(): Observable<Product[]> {
    return this.http.getAll<Product>(this.url);
  }

  getById(id: number): Observable<Product> {
    return this.http.getById<Product>(`${this.url}/${id}`);
  }

  create(prod: Product): Observable<Product> {
    return this.http.create<Product>(this.url, prod);
  }

  upate(prod: Product): Observable<Product> {
    return this.http.update<Product>(`${this.url}/${prod.id}`, prod);
  }

  delete(id: number): Observable<void> {
    return this.http.deleteById<void>(`${this.url}/${id}`);
  }
}
