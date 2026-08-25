import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaGastosComponent } from './components/categoria-gastos/categoria-gastos.component';
import { CategoriaIngresosComponent } from './components/categoria-ingresos/categoria-ingresos.component';
import { GastosComponent } from './components/gastos/gastos.component';
import { IngresosComponent } from './components/ingresos/ingresos.component';
import { MenuGastosIngresosComponent } from './components/menu-gastos-ingresos/menu-gastos-ingresos.component';
import { ReporteGastosComponent } from './components/reporte-gastos/reporte-gastos.component';
import { ReporteIngresosComponent } from './components/reporte-ingresos/reporte-ingresos.component';
import { CategoriaGastosFormComponent } from './components/categoria-gastos/categoria-gastos-form/categoria-gastos-form.component';
import { CategoriaIngresosFormComponent } from './components/categoria-ingresos/categoria-ingresos-form/categoria-ingresos-form.component';



@NgModule({
  declarations: [
    CategoriaGastosComponent,
    CategoriaIngresosComponent,
    GastosComponent,
    IngresosComponent,
    MenuGastosIngresosComponent,
    ReporteGastosComponent,
    ReporteIngresosComponent,
    CategoriaGastosFormComponent,
    CategoriaIngresosFormComponent
  ],
  imports: [
    CommonModule
  ]
})
export class GastosIngresosModule { }
