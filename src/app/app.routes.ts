import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';

export const routes: Routes = [
    { path: '', component: InicioComponent },

    {
        path: 'memoria',
        loadComponent: () =>
            import('./pages/games/memoria/memoria.component').then(m => m.MemoriaComponent)
    },
    {
        path: 'quiz',
        loadComponent: () =>
            import('./pages/games/quiz/quiz.component').then(m => m.QuizComponent)
    },
    {
        path: 'autowordle',
        loadComponent: () =>
            import('./pages/games/autowordle/autowordle.component').then(m => m.AutowordleComponent)
    },
    {
        path: 'caca-palavras',
        loadComponent: () =>
            import('./pages/games/caca-palavras/caca-palavras.component').then(m => m.CacaPalavrasComponent)
    },
    {
        path: 'forca',
        loadComponent: () =>
            import('./pages/games/forca/forca.component').then(m => m.ForcaComponent)
    },
    {
        path: 'palavras-cruzadas',
        loadComponent: () =>
            import('./pages/games/palavras-cruzadas/palavras-cruzadas.component').then(m => m.PalavrasCruzadasComponent)
    }
    , { path: '**', redirectTo: '' }
];