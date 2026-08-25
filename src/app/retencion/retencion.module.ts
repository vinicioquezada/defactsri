import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodigoRetencionComponent } from './components/codigo-retencion/codigo-retencion.component';
import { ExploradorRetencionComponent } from './components/explorador-retencion/explorador-retencion.component';
import { MenuRetencionComponent } from './components/menu-retencion/menu-retencion.component';
import { ReporteRetencionComponent } from './components/reporte-retencion/reporte-retencion.component';
import { RetencionComponent } from './components/retencion/retencion.component';
import { ExploradorCompraRetencionComponent } from './components/explorador-compra-retencion/explorador-compra-retencion.component';
import { ListadoCompraRetencionComponent } from './components/listado-compra-retencion/listado-compra-retencion.component';



@NgModule({
  declarations: [
    CodigoRetencionComponent,
    ExploradorRetencionComponent,
    MenuRetencionComponent,
    ReporteRetencionComponent,
    RetencionComponent,
    ExploradorCompraRetencionComponent,
    ListadoCompraRetencionComponent
  ],
  imports: [
    CommonModule
  ]
})
export class RetencionModule { }
