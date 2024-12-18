import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistroService } from '../registro.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-registro',
  standalone: false,
  
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {

  email: string = ''; 
  password: string = ''; 
  nombre: string='';
  showPassword: boolean = false;
  confirmPassword: string='';
  passwordMismatch: boolean = false;
  dni: any;
  telefono: any;
  apellidos: any;
  errorMessage: string | null = null;

  constructor(private registroService: RegistroService, 
              private router: Router,
              private authService: AuthService,) {}


  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  validatePasswords() {
    this.passwordMismatch = this.password !== this.confirmPassword;
  }

  registro():void{
    if(!this.passwordMismatch){
      this.registroService.registrar(this.email, this.confirmPassword, this.nombre, this.apellidos, this.dni, this.telefono).subscribe({
        next: (response) => {
          this.router.navigate(['/login']); // Redirige al usuario a la página principal
        },
        error: (error) => {
          this.errorMessage= error.error.error;
          //console.error('Error en el registro:', error);
        }
      });
   
  }
}

}
