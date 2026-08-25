import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsignacionComponent } from './components/asignacion/asignacion.component';
import { ExploradorDepartamentosComponent } from './components/explorador-departamentos/explorador-departamentos.component';
import { ExploradorPagosComponent } from './components/explorador-pagos/explorador-pagos.component';
import { FacturaReservaComponent } from './components/factura-reserva/factura-reserva.component';
import { MenuHotelComponent } from './components/menu-hotel/menu-hotel.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { ServiciosHotelComponent } from './components/servicios-hotel/servicios-hotel.component';
import { DisponibilidadDepartamentosComponent } from './components/disponibilidad-departamentos/disponibilidad-departamentos.component';
import { ServiciosHotelFormComponent } from './components/servicios-hotel/servicios-hotel-form/servicios-hotel-form.component';



@NgModule({
  declarations: [
    AsignacionComponent,
    ExploradorDepartamentosComponent,
    ExploradorPagosComponent,
    FacturaReservaComponent,
    MenuHotelComponent,
    ReservasComponent,
    ServiciosHotelComponent,
    DisponibilidadDepartamentosComponent,
    ServiciosHotelFormComponent
  ],
  imports: [
    CommonModule
  ]
})
export class HotelModule { }
