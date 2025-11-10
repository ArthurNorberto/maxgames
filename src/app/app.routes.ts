import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { authGuard } from './pages/guards/auth.guard';

export const routes: Routes = [
    // 🔹 Login SEM guard
    {
        path: 'login',
        loadComponent: () =>
            import('./pages/login/login.component').then(m => m.LoginComponent)
    },

    // 🔹 Rotas protegidas
    {
        path: '',
        component: InicioComponent,
        canActivate: [authGuard]
    },
    {
        path: 'inicio',
        loadComponent: () =>
            import('./pages/inicio/inicio.component').then(m => m.InicioComponent),
        canActivate: [authGuard]
    },
    {
        path: 'memoria',
        loadComponent: () =>
            import('./pages/games/memoria/memoria.component').then(m => m.MemoriaComponent),
        canActivate: [authGuard]
    },
    {
        path: 'quiz',
        loadComponent: () =>
            import('./pages/games/quiz/quiz.component').then(m => m.QuizComponent),
        canActivate: [authGuard]
    },
    {
        path: 'acerte-ou-erre',
        loadComponent: () =>
            import('./pages/games/acerte-ou-erre/acerte-ou-erre.component').then(m => m.AcerteOuErreComponent),
        canActivate: [authGuard]
    },
    {
        path: 'autowordle',
        loadComponent: () =>
            import('./pages/games/autowordle/autowordle.component').then(m => m.AutowordleComponent),
        canActivate: [authGuard]
    },
    {
        path: 'caca-palavras',
        loadComponent: () =>
            import('./pages/games/caca-palavras/caca-palavras.component').then(m => m.CacaPalavrasComponent),
        canActivate: [authGuard]
    },
    {
        path: 'forca',
        loadComponent: () =>
            import('./pages/games/forca/forca.component').then(m => m.ForcaComponent),
        canActivate: [authGuard]
    },
    {
        path: 'palavras-cruzadas',
        loadComponent: () =>
            import('./pages/games/palavras-cruzadas/palavras-cruzadas.component').then(m => m.PalavrasCruzadasComponent),
        canActivate: [authGuard]
    },
    ,
    {
        path: 'sobre',
        loadComponent: () =>
            import('./pages/sobre/sobre.component').then(m => m.SobreComponent),
        canActivate: [authGuard]
    },

    { path: '**', redirectTo: '' }
];
