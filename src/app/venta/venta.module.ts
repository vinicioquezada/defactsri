import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CajeroComponent } from './components/cajero/cajero.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { ExploradorCajeroComponent } from './components/explorador-cajero/explorador-cajero.component';
import { ExploradorFacturaComponent } from './components/explorador-factura/explorador-factura.component';
import { ExploradorGuiaRemisionComponent } from './components/explorador-guia-remision/explorador-guia-remision.component';
import { ExploradorNotaCreditoComponent } from './components/explorador-nota-credito/explorador-nota-credito.component';
import { ExploradorPedidosComponent } from './components/explorador-pedidos/explorador-pedidos.component';
import { ExploradorVentaComponent } from './components/explorador-venta/explorador-venta.component';
import { GuiaRemisionComponent } from './components/guia-remision/guia-remision.component';
import { MenuVentaComponent } from './components/menu-venta/menu-venta.component';
import { NotaCreditoComponent } from './components/nota-credito/nota-credito.component';
import { ReporteClienteComponent } from './components/reporte-cliente/reporte-cliente.component';
import { ReporteGuiaRemisionComponent } from './components/reporte-guia-remision/reporte-guia-remision.component';
import { ReporteNotaCreditoComponent } from './components/reporte-nota-credito/reporte-nota-credito.component';
import { ReporteRotacionProductoComponent } from './components/reporte-rotacion-producto/reporte-rotacion-producto.component';
import { ReporteVentaComponent } from './components/reporte-venta/reporte-venta.component';
import { ReporteVentaCreditoComponent } from './components/reporte-venta-credito/reporte-venta-credito.component';
import { ReporteVentaDetallesComponent } from './components/reporte-venta-detalles/reporte-venta-detalles.component';
import { ReporteVentaPorCategoriaComponent } from './components/reporte-venta-por-categoria/reporte-venta-por-categoria.component';
import { ReporteVentaPorProductoComponent } from './components/reporte-venta-por-producto/reporte-venta-por-producto.component';
import { TipoClienteComponent } from './components/tipo-cliente/tipo-cliente.component';
import { TransportistaComponent } from './components/transportista/transportista.component';
import { VentaComponent } from './components/venta/venta.component';
import { ClienteFormComponent } from './components/cliente/cliente-form/cliente-form.component';
import { ReporteControlVentaComponent } from './components/reporte-control-venta/reporte-control-venta.component';
import { PedidoComponent } from './components/pedido/pedido.component';
import { ExploradorVentaRecaudacionComponent } from './components/explorador-venta-recaudacion/explorador-venta-recaudacion.component';
import { PreVentaComponent } from './components/pre-venta/pre-venta.component';
import { AprobarPreVentaComponent } from './components/aprobar-pre-venta/aprobar-pre-venta.component';
import { VentaDescuentoComponent } from './components/venta-descuento/venta-descuento.component';
import { PagoNotaCreditoComponent } from './components/pago-nota-credito/pago-nota-credito.component';
import { ReporteSaldoNotaCreditoComponent } from './components/reporte-saldo-nota-credito/reporte-saldo-nota-credito.component';
import { ResumenVentasComponent } from './components/resumen-ventas/resumen-ventas.component';
import { ReporteVentaFormaPagoComponent } from './components/reporte-venta-forma-pago/reporte-venta-forma-pago.component';
import { ReporteConsolidadoSaldoPendienteNotaCreditoComponent } from './components/reporte-consolidado-saldo-pendiente-nota-credito/reporte-consolidado-saldo-pendiente-nota-credito.component';
import { ReportePagoNotaCreditoComponent } from './components/reporte-pago-nota-credito/reporte-pago-nota-credito.component';
import { ReporteVentaConsolidadoVendedorComponent } from './components/reporte-venta-consolidado-vendedor/reporte-venta-consolidado-vendedor.component';
import { ReporteNotaCreditoDetallesComponent } from './components/reporte-nota-credito-detalles/reporte-nota-credito-detalles.component';
import { TipoClienteFormComponent } from './components/tipo-cliente/tipo-cliente-form/tipo-cliente-form.component';
import { TransportistaFormComponent } from './components/transportista/transportista-form/transportista-form.component';



@NgModule({
  declarations: [
    CajeroComponent,
    ClienteComponent,
    ExploradorCajeroComponent,
    ExploradorFacturaComponent,
    ExploradorGuiaRemisionComponent,
    ExploradorNotaCreditoComponent,
    ExploradorPedidosComponent,
    ExploradorVentaComponent,
    GuiaRemisionComponent,
    MenuVentaComponent,
    NotaCreditoComponent,
    ReporteClienteComponent,
    ReporteGuiaRemisionComponent,
    ReporteNotaCreditoComponent,
    ReporteRotacionProductoComponent,
    ReporteVentaComponent,
    ReporteVentaCreditoComponent,
    ReporteVentaDetallesComponent,
    ReporteVentaPorCategoriaComponent,
    ReporteVentaPorProductoComponent,
    TipoClienteComponent,
    TransportistaComponent,
    VentaComponent,
    ClienteFormComponent,
    ReporteControlVentaComponent,
    PedidoComponent,
    ExploradorVentaRecaudacionComponent,
    PreVentaComponent,
    AprobarPreVentaComponent,
    VentaDescuentoComponent,
    PagoNotaCreditoComponent,
    ReporteSaldoNotaCreditoComponent,
    ResumenVentasComponent,
    ReporteVentaFormaPagoComponent,
    ReporteConsolidadoSaldoPendienteNotaCreditoComponent,
    ReportePagoNotaCreditoComponent,
    ReporteVentaConsolidadoVendedorComponent,
    ReporteNotaCreditoDetallesComponent,
    TipoClienteFormComponent,
    TransportistaFormComponent
  ],
  imports: [
    CommonModule
  ]
})
export class VentaModule { }
