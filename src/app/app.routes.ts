import { Routes } from '@angular/router';
import { App } from './components/paginas/app/app';
import { Products } from './components/paginas/products/products';
import { Categories } from './components/paginas/categorias/categories';
import { Inicio } from './components/paginas/inicio/inicio';

export const routes: Routes = [
    {path: '', component:Inicio},
    {path: 'products',component:Products},
    {path: 'categories',component:Categories},
    {path: '**', redirectTo: ''}
    
];
