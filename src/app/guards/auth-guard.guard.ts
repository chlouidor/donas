import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RegistrologinService } from '../services/registrologin.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private registrologinService: RegistrologinService, private router: Router) {}

  canActivate(): boolean {
    const user = this.registrologinService.getCurrentUser();
    
    // Verificar si el usuario es el usuario específico permitido
    if (user && user.username === 'christ' && user.email === 'ch.louidor@duocuc.cl') {
      return true; // Permitir acceso
    } else {
      this.router.navigate(['/inicio']); // Redirigir a inicio si no es permitido
      return false; // No permitir acceso
    }
  }
}
