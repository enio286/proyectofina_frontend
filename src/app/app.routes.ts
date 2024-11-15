import { Routes } from '@angular/router';
import { ClientesComponent } from './components/clientes/clientes.component';
import { DestinosComponent } from './components/destinos/destinos.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'clientes', 
    component: ClientesComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'destinos', 
    component: DestinosComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'reservas', 
    component: ReservasComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
