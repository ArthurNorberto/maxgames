import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';

export const routes: Routes = [
    { path: '', component: InicioComponent },
    {
        path: 'basket',
        loadComponent: () =>
            import('./pages/games/basquete/basquete.component').then(m => m.BasqueteComponent)
    },
    {
        path: 'memory',
        loadComponent: () =>
            import('./pages/games/memory/memory.component').then(m => m.MemoryComponent)
    },
     {
        path: 'milhao',
        loadComponent: () =>
            import('./pages/games/milhao/milhao.component').then(m => m.MilhaoComponent)
    }
    , { path: '**', redirectTo: '' }
];