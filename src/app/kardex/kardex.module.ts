import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KardexComponent } from './components/kardex/kardex.component';
import { ReporteCostoProductoComponent } from './components/reporte-costo-producto/reporte-costo-producto.component';
import { ReporteIngresosManualesComponent } from './components/reporte-ingresos-manuales/reporte-ingresos-manuales.component';
import { ReporteMargenGananciaComponent } from './components/reporte-margen-ganancia/reporte-margen-ganancia.component';
import { ReporteSalidasManualesComponent } from './components/reporte-salidas-manuales/reporte-salidas-manuales.component';
import { RegistroCaducidadComponent } from './components/registro-caducidad/registro-caducidad.component';
import { ReporteCaducidadComponent } from './components/reporte-caducidad/reporte-caducidad.component';
import { RegistroCaducidadIngresoComponent } from './components/registro-caducidad-ingreso/registro-caducidad-ingreso.component';



@NgModule({
  declarations: [
    KardexComponent,
    ReporteCostoProductoComponent,
    ReporteIngresosManualesComponent,
    ReporteMargenGananciaComponent,
    ReporteSalidasManualesComponent,
    RegistroCaducidadComponent,
    ReporteCaducidadComponent,
    RegistroCaducidadIngresoComponent
  ],
  imports: [
    CommonModule
  ]
})
export class KardexModule { }
