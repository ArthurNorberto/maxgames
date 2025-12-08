import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./pages/landing/landing.component').then(m => m.LandingComponent)
            },
            {
                path: '',
                redirectTo: '',
                pathMatch: 'full'
            }
        ]

    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },

    {
        path: 'login',
        component: PublicLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./pages/auth/login-usuario/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'admin',
                loadComponent: () =>
                    import('./pages/auth/login-admin/login-admin.component').then(m => m.LoginAdminComponent)
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./pages/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'inicio',
                loadComponent: () =>
                    import('./pages/inicio/inicio.component').then(m => m.InicioComponent)
            },
            {
                path: 'metas',
                loadComponent: () =>
                    import('./pages/metas/metas.component').then(m => m.MetasComponent)
            },
            {
                path: 'lista-games',
                loadComponent: () =>
                    import('./pages/games/lista-games.component').then(m => m.ListaGamesComponent)
            },
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
                path: 'acerte-ou-erre',
                loadComponent: () =>
                    import('./pages/games/acerte-ou-erre/acerte-ou-erre.component').then(m => m.AcerteOuErreComponent)
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
            },
            {
                path: 'sobre',
                loadComponent: () =>
                    import('./pages/sobre/sobre.component').then(m => m.SobreComponent)
            },
            {
                path: 'premios',
                loadComponent: () =>
                    import('./pages/premios/premios.component').then(m => m.PremiosComponent)
            },
            {
                path: 'ranks',
                loadComponent: () =>
                    import('./pages/ranks/ranks.component').then(m => m.RanksComponent)
            },
            {
                path: 'meu-perfil',
                loadComponent: () =>
                    import('./pages/meu-perfil/meu-perfil.component').then(m => m.MeuPerfilComponent)
            },
            {
                path: 'perfil/:id',
                loadComponent: () =>
                    import('./pages/perfil-usuario/perfil-usuario.component').then(m => m.PerfilUsuarioComponent)
            },
            {
                path: '',
                redirectTo: 'inicio',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        loadComponent: () =>
            import('./pages/pagina-not-found/pagina-not-found.component').then(m => m.PaginaNotFoundComponent)
    }


];
