import { Routes } from '@angular/router';
import { App } from './components/paginas/app/app';
import { Products } from './components/paginas/products/products';
import { Categories } from './components/paginas/categories/categories';
import { CategoryEdit } from './components/paginas/category-edit/category-edit';
import { CategoryAdd } from './components/paginas/category-add/category-add';
import { Inicio } from './components/paginas/inicio/inicio';

export const routes: Routes = [
    {path: '', component:Inicio},
    {path: 'products',component:Products},
    {path: 'categories',component:Categories},
    {path: 'categories-add',component:CategoryAdd},
    {path: 'categories-edit/:id',component:CategoryEdit},
    {path: '**', redirectTo: ''}
    
];
