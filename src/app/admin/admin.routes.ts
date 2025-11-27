import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { adminGuard } from '../guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: 'inicio',
        loadComponent: () =>
          import('./pages/inicio/inicio-admin.component').then(m => m.InicioAdminComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent)
      },
      {
        path: 'premios',
        loadComponent: () =>
          import('./pages/premios-admin/premios-admin.component').then(m => m.PremiosAdminComponent)
      },
      {
        path: 'metas',
        loadComponent: () =>
          import('./pages/admin-metas/admin-metas.component').then(m => m.AdminMetasComponent)
      },
      {
        path: 'jogos',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/jogos-admin/jogos-admin.component')
                .then(m => m.JogosAdminComponent)
          },
          {
            path: 'quiz',
            loadComponent: () =>
              import('./pages/quiz-config/quiz-config.component')
                .then(m => m.QuizConfigComponent)
          },
          {
            path: 'acerte',
            loadComponent: () =>
              import('./pages/acerte-ou-erro-admin/acerte-ou-erre-admin.component')
                .then(m => m.AcerteOuErreAdminComponent)
          },
          {
            path: 'memoria',
            loadComponent: () =>
              import('./pages/memoria-admin/memoria-admin.component')
                .then(m => m.MemoriaAdminComponent)
          },
          {
            path: 'autowordle',
            loadComponent: () =>
              import('./pages/autowordle-admin/autowordle-admin.component')
                .then(m => m.AutowordleAdminComponent)
          },
          {
            path: 'caca-palavras',
            loadComponent: () =>
              import('./pages/caca-palavras-config/caca-palavras-config.component')
                .then(m => m.CacaPalavrasConfigComponent)
          },
          {
            path: 'forca',
            loadComponent: () =>
              import('./pages/forca-config/forca-config.component')
                .then(m => m.ForcaConfigComponent)
          },
          {
            path: 'palavras-cruzadas',
            loadComponent: () =>
              import('./pages/palavras-cruzadas-config/palavras-cruzadas-config.component')
                .then(m => m.PalavrasCruzadasConfigComponent)
          }
        ]
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      }
    ]
  }
];
