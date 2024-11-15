import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
    RouterModule
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private router = inject(Router);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  usuario = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmarPassword: ''
  };

  onRegister() {
    if (this.usuario.password !== this.usuario.confirmarPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Las contraseñas no coinciden'
      });
      return;
    }

    const userData = {
      email: this.usuario.email,
      password: this.usuario.password,
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Registro exitoso'
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message || 'Error al registrar usuario'
        });
      }
    });
  }

  validarFormulario(): boolean {
    return !!(
      this.usuario.nombre && 
      this.usuario.apellido && 
      this.usuario.email && 
      this.usuario.password && 
      this.usuario.confirmarPassword
    );
  }
} 