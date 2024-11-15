import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, 
    MenubarModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  menuItems: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      routerLink: ['/destinos'],
      visible: this.authService.isLoggedIn()
    },
    {
      label: 'Destinos',
      icon: 'pi pi-map-marker',
      routerLink: ['/destinos'],
      visible: this.authService.isLoggedIn()
    },
    {
      label: 'Reservas',
      icon: 'pi pi-calendar',
      routerLink: ['/reservas'],
      visible: this.authService.isLoggedIn()
    },
    {
      label: 'Clientes',
      icon: 'pi pi-users',
      routerLink: ['/clientes'],
      visible: this.authService.isLoggedIn()
    },
    {
      separator: true,
      visible: this.authService.isLoggedIn()
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => {
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      visible: this.authService.isLoggedIn()
    }
  ];

  isAuthRoute(): boolean {
    const currentRoute = this.router.url;
    return currentRoute === '/login' || currentRoute === '/register';
  }
}
