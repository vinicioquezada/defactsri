import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExploradorVentaMembresiaComponent } from './components/explorador-venta-membresia/explorador-venta-membresia.component';
import { FacturaPlanComponent } from './components/factura-plan/factura-plan.component';
import { MembresiaComponent } from './components/membresia/membresia.component';
import { MenuGymComponent } from './components/menu-gym/menu-gym.component';
import { PlanComponent } from './components/plan/plan.component';
import { ReporteEstadoMembresiaComponent } from './components/reporte-estado-membresia/reporte-estado-membresia.component';
import { ReportePromocionAlMesComponent } from './components/reporte-promocion-al-mes/reporte-promocion-al-mes.component';
import { ReporteSociosComponent } from './components/reporte-socios/reporte-socios.component';
import { SocioComponent } from './components/socio/socio.component';
import { MonitorComponent } from './components/monitor/monitor.component';
import { MonitorSecundarioComponent } from './components/monitor-secundario/monitor-secundario.component';
import { SocioFormComponent } from './components/socio/socio-form/socio-form.component';
import { ListadoAperturaDiarioComponent } from './components/factura-plan/listado-apertura-diario/listado-apertura-diario.component';
import { ReporteVentasSociosComponent } from './components/reporte-ventas-socios/reporte-ventas-socios.component';
import { ActividadComponent } from './components/actividad/actividad.component';
import { ActividadFormComponent } from './components/actividad/actividad-form/actividad-form.component';
import { ActividadHorarioComponent } from './components/actividad-horario/actividad-horario.component';
import { ActividadHorarioFormComponent } from './components/actividad-horario/actividad-horario-form/actividad-horario-form.component';
import { ActividadReservaComponent } from './components/actividad-reserva/actividad-reserva.component';
import { ActividadReservaFormComponent } from './components/actividad-reserva/actividad-reserva-form/actividad-reserva-form.component';
import { ActividadMembresiaComponent } from './components/actividad-membresia/actividad-membresia.component';
import { ListadoActividadReservaComponent } from './components/listado-actividad-reserva/listado-actividad-reserva.component';
import { HorarioReservaActividadComponent } from './components/horario-reserva-actividad/horario-reserva-actividad.component';
import { MonitorCompartidoComponent } from './components/monitor/monitor-compartido/monitor-compartido.component';
import { MonitorActividadesComponent } from './components/monitor-actividades/monitor-actividades.component';
import { CuponComponent } from './components/cupon/cupon.component';
import { CuponFormComponent } from './components/cupon/cupon-form/cupon-form.component';
import { FotoFormComponent } from './components/socio/foto-form/foto-form.component';
import { PlanFormComponent } from './components/plan/plan-form/plan-form.component';
import { ReporteAsistenciaComponent } from './components/reporte-asistencia/reporte-asistencia.component';



@NgModule({
  declarations: [
    ExploradorVentaMembresiaComponent,
    FacturaPlanComponent,
    MembresiaComponent,
    MenuGymComponent,
    PlanComponent,
    ReporteEstadoMembresiaComponent,
    ReportePromocionAlMesComponent,
    ReporteSociosComponent,
    SocioComponent,
    MonitorComponent,
    MonitorSecundarioComponent,
    SocioFormComponent,
    ListadoAperturaDiarioComponent,
    ReporteVentasSociosComponent,
    ActividadComponent,
    ActividadFormComponent,
    ActividadHorarioComponent,
    ActividadHorarioFormComponent,
    ActividadReservaComponent,
    ActividadReservaFormComponent,
    ActividadMembresiaComponent,
    ListadoActividadReservaComponent,
    HorarioReservaActividadComponent,
    MonitorCompartidoComponent,
    MonitorActividadesComponent,
    CuponComponent,
    CuponFormComponent,
    FotoFormComponent,
    PlanFormComponent,
    ReporteAsistenciaComponent
  ],
  imports: [
    CommonModule
  ]
})
export class GymModule { }
