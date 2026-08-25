import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuAdministrarComponent } from './components/menu-administrar/menu-administrar.component';
import { RolesComponent } from './components/roles/roles.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { SucursalComponent } from './components/sucursal/sucursal.component';
import { RucComponent } from './components/ruc/ruc.component';
import { RucFormComponent } from './components/ruc/ruc-form/ruc-form.component';
import { SucursalFormComponent } from './components/sucursal/sucursal-form/sucursal-form.component';
import { LogoRucComponent } from './components/ruc/logo-ruc/logo-ruc.component';
import { FirmaRucComponent } from './components/ruc/firma-ruc/firma-ruc.component';
import { AsignacionRucComponent } from './components/sucursal/asignacion-ruc/asignacion-ruc.component';
import { LogoSucursalComponent } from './components/sucursal/logo-sucursal/logo-sucursal.component';
import { SecuenciasFacturaComponent } from './components/ruc/secuencias-factura/secuencias-factura.component';
import { ConfiguracionServicioComponent } from './components/sucursal/configuracion-servicio/configuracion-servicio.component';
import { RolesFormComponent } from './components/roles/roles-form/roles-form.component';
import { ConfiguracionImpresionComponent } from './components/configuracion-impresion/configuracion-impresion.component';
import { UsuarioFormComponent } from './components/usuario/usuario-form/usuario-form.component';



@NgModule({
  declarations: [
    MenuAdministrarComponent,
    RolesComponent,
    UsuarioComponent,
    SucursalComponent,
    RucComponent,
    RucFormComponent,
    SucursalFormComponent,
    LogoRucComponent,
    FirmaRucComponent,
    AsignacionRucComponent,
    LogoSucursalComponent,
    SecuenciasFacturaComponent,
    ConfiguracionServicioComponent,
    RolesFormComponent,
    ConfiguracionImpresionComponent,
    UsuarioFormComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxPaginationModule
  ]
})
export class AdministrarModule { }
