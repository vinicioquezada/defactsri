import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';



@NgModule({
  declarations: [
    InicioComponent,
    LoginComponent,
    PerfilComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UsuarioModule { }
