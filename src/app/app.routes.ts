import { Routes } from '@angular/router';
import { Products } from './components/paginas/products/products';
import { Categories } from './components/paginas/categories/categories';
import { CategoryEdit } from './components/paginas/category-edit/category-edit';
import { CategoryAdd } from './components/paginas/category-add/category-add';
import { Inicio } from './components/paginas/inicio/inicio';
import { Login } from './components/paginas/login/login';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: '', component: Inicio, canActivate: [authGuard] },
  { path: 'products', component: Products, canActivate: [authGuard] },
  { path: 'categories', component: Categories, canActivate: [authGuard] },
  { path: 'categories-add', component: CategoryAdd, canActivate: [authGuard] },
  { path: 'categories-edit/:id', component: CategoryEdit, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
