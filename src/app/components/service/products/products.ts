import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Http } from '../../../core/services/http/http.service';
import { Product } from '../../../Models/product';
import { Page } from '../../../Models/page';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  url: string = 'products';

  private totalProducts: number = 0;

  constructor(private http: Http) { }

  getAll(page: number, size: number): Observable<Page<Product>> {
    return this.http.getAllPaginated<Product>(this.url, page, size);
  }

  getById(id: number): Observable<Product> {
    return this.http.getById<Product>(`${this.url}/${id}`);
  }

  create(prod: Product): Observable<Product> {
    return this.http.create<Product>(this.url, prod);
  }

  update(prod: Product): Observable<Product> {
    return this.http.update<Product>(`${this.url}/${prod.id}`, prod);
  }

  delete(id: number): Observable<void> {
    return this.http.deleteById<void>(`${this.url}/${id}`);
  }

  getTotalProducts(): number {
    return this.totalProducts;
  }
}
