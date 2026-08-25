import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbonoCompraComponent } from './components/abono-compra/abono-compra.component';
import { AbonoVentaComponent } from './components/abono-venta/abono-venta.component';
import { CreditoComponent } from './components/credito/credito.component';
import { MenuCuentaPcComponent } from './components/menu-cuenta-pc/menu-cuenta-pc.component';
import { ReporteAbonoComprasComponent } from './components/reporte-abono-compras/reporte-abono-compras.component';
import { ReporteAbonoVentasComponent } from './components/reporte-abono-ventas/reporte-abono-ventas.component';
import { ReporteCortePorCobrarComponent } from './components/reporte-corte-por-cobrar/reporte-corte-por-cobrar.component';
import { ReportePorCobrarComponent } from './components/reporte-por-cobrar/reporte-por-cobrar.component';
import { ReportePorPagarComponent } from './components/reporte-por-pagar/reporte-por-pagar.component';
import { ReporteFormaPagoVencimientoComponent } from './components/reporte-forma-pago-vencimiento/reporte-forma-pago-vencimiento.component';
import { ReporteCuentasPagarConsolidadoComponent } from './components/reporte-cuentas-pagar-consolidado/reporte-cuentas-pagar-consolidado.component';
import { ReporteCuentasCobrarConsolidadoComponent } from './components/reporte-cuentas-cobrar-consolidado/reporte-cuentas-cobrar-consolidado.component';


@NgModule({
  declarations: [
    AbonoCompraComponent,
    AbonoVentaComponent,
    CreditoComponent,
    MenuCuentaPcComponent,
    ReporteAbonoComprasComponent,
    ReporteAbonoVentasComponent,
    ReporteCortePorCobrarComponent,
    ReportePorCobrarComponent,
    ReportePorPagarComponent,
    ReporteFormaPagoVencimientoComponent,
    ReporteCuentasPagarConsolidadoComponent,
    ReporteCuentasCobrarConsolidadoComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CuentaPcModule { }
