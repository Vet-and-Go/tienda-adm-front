import { Routes } from '@angular/router';
import { Products } from './components/paginas/products/products';
import { Categories } from './components/paginas/categories/categories';
import { CategoryEdit } from './components/paginas/category-edit/category-edit';
import { CategoryAdd } from './components/paginas/category-add/category-add';
import { ProductAdd } from './components/paginas/product-add/product-add';
import { ProductEdit } from './components/paginas/product-edit/product-edit';
import { Inicio } from './components/paginas/inicio/inicio';
import { Login } from './components/paginas/login/login';
import { adminGuard } from './core/guards/auth.guard';
import { App } from './components/paginas/app/app';

export const routes: Routes = [
  { path: '', component: App },
  { path: 'admin', component: Inicio, canActivate: [adminGuard] },
  { path: 'admin/products', component: Products, canActivate: [adminGuard] },
  { path: 'admin/products/add', component: ProductAdd, canActivate: [adminGuard] },
  { path: 'admin/products/edit/:id', component: ProductEdit, canActivate: [adminGuard] },
  { path: 'admin/categories', component: Categories, canActivate: [adminGuard] },
  { path: 'admin/categories/add', component: CategoryAdd, canActivate: [adminGuard] },
  { path: 'admin/categories/edit/:id', component: CategoryEdit, canActivate: [adminGuard] },
  { path: 'admin/login', component: Login },
  { path: '**', redirectTo: 'admin' }
];
