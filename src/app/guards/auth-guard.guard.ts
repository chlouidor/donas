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
    
    if (user && user.username === 'christ' && user.email === 'ch.louidor@duocuc.cl') {
      return true; 
    } else {
      this.router.navigate(['/inicio']); 
      return false; 
    }
  }
}
