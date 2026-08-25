import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalleCompraComponent } from './components/detalle-compra/detalle-compra.component';
import { DetalleFijarPreciosComponent } from './components/detalle-fijar-precios/detalle-fijar-precios.component';
import { DetalleNotaCreditoComponent } from './components/detalle-nota-credito/detalle-nota-credito.component';
import { DetalleProductosComponent } from './components/detalle-productos/detalle-productos.component';
import { DetalleProductosSalidasComponent } from './components/detalle-productos-salidas/detalle-productos-salidas.component';
import { DetalleVentaComponent } from './components/detalle-venta/detalle-venta.component';
import { EncabezadoComponent } from './components/encabezado/encabezado.component';
import { ListadoClienteComponent } from './components/listado-cliente/listado-cliente.component';
import { ListadoEmpleadoComponent } from './components/listado-empleado/listado-empleado.component';
import { ListadoPlanesGymComponent } from './components/listado-planes-gym/listado-planes-gym.component';
import { ListadoProveedorComponent } from './components/listado-proveedor/listado-proveedor.component';
import { ListadoTarifasComponent } from './components/listado-tarifas/listado-tarifas.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MenuComponent } from './components/menu/menu.component';
import { ModalCargaComponent } from './components/modal-carga/modal-carga.component';
import { OpcionesExploradorVentaComponent } from './components/venta/opciones-explorador-venta/opciones-explorador-venta.component';
import { PieComponent } from './components/pie/pie.component';
import { ListadoTransportistaComponent } from './components/transportista/listado-transportista/listado-transportista.component';
import { NuevoPuntoTransporteComponent } from './components/transportista/nuevo-punto-transporte/nuevo-punto-transporte.component';
import { NuevaRutaComponent } from './components/transportista/nueva-ruta/nueva-ruta.component';
import { NuevoVehiculoComponent } from './components/transportista/nuevo-vehiculo/nuevo-vehiculo.component';
import { LoaderListadoComponent } from './components/loader-listado/loader-listado.component';
import { DetalleRegistroCaducidadComponent } from './components/detalle-registro-caducidad/detalle-registro-caducidad.component';
import { FormaPagoComponent } from './components/forma-pago/forma-pago.component';
import { RegistroAbonoVentaComponent } from './components/registro-abono-venta/registro-abono-venta.component';
import { PedidoPanaderiaComponent } from './components/venta/pedido-panaderia/pedido-panaderia.component';
import { ListarNotaCreditoComponent } from './components/venta/listar-nota-credito/listar-nota-credito.component';
import { ListarGuiaRemisionComponent } from './components/venta/listar-guia-remision/listar-guia-remision.component';
import { OpcionesExploradorNotaCreditoComponent } from './components/venta/opciones-explorador-nota-credito/opciones-explorador-nota-credito.component';
import { OpcionesExploradorGuiaRemisionComponent } from './components/venta/opciones-explorador-guia-remision/opciones-explorador-guia-remision.component';
import { OpcionesExploradorRetencionComponent } from './components/retencion/opciones-explorador-retencion/opciones-explorador-retencion.component';
import { ListadoExistenciasSucursalComponent } from './components/listado-existencias-sucursal/listado-existencias-sucursal.component';
import { DetalleProductosMovimientosComponent } from './components/detalle-productos-movimientos/detalle-productos-movimientos.component';
import { DetalleProductosRevisionComponent } from './components/detalle-productos-revision/detalle-productos-revision.component';
import { RecargoFacturaComponent } from './components/recargo-factura/recargo-factura.component';
import { TransaccionesBancoComponent } from './components/venta/transacciones-banco/transacciones-banco.component';
import { ListarVentasClienteComponent } from './components/venta/listar-ventas-cliente/listar-ventas-cliente.component';
import { FilterGenericoPipe } from './pipes/filter-generico.pipe';
import { ListadoVendedorComponent } from './components/listado-vendedor/listado-vendedor.component';
import { CodigoProductoComponent } from './components/codigo-producto/codigo-producto.component';
import { CompensacionComponent } from './components/compensacion/compensacion.component';
import { ConfigurarFirmaVentaComponent } from './components/venta/configurar-firma-venta/configurar-firma-venta.component';
import { AccesoDenegadoComponent } from './components/acceso-denegado/acceso-denegado.component';
import { ListarFacturasVentasComponent } from './components/venta/listar-facturas-ventas/listar-facturas-ventas.component';
import { RegistroAbonoComponent } from './components/registro-abono/registro-abono.component';
import { VisualizarListadoVentaClienteComponent } from './components/venta/visualizar-listado-venta-cliente/visualizar-listado-venta-cliente.component';
import { VisualizarListadoPedidoClienteComponent } from './components/venta/visualizar-listado-pedido-cliente/visualizar-listado-pedido-cliente.component';
import { OpcionesExploradorPedidoComponent } from './components/venta/opciones-explorador-pedido/opciones-explorador-pedido.component';
import { DetalleMovimientoCajaComponent } from './components/cajero/detalle-movimiento-caja/detalle-movimiento-caja.component';
import { ListadoSociosComponent } from './components/listado-socios/listado-socios.component';
import { DetalleVentaGuiaRemisionComponent } from './components/detalle-venta-guia-remision/detalle-venta-guia-remision.component';
import { ListadoProductoVentasComponent } from './components/listado-producto/listado-producto-ventas/listado-producto-ventas.component';
import { ListadoProductoComprasComponent } from './components/listado-producto/listado-producto-compras/listado-producto-compras.component';
import { ListadoProductoIngresosComponent } from './components/listado-producto/listado-producto-ingresos/listado-producto-ingresos.component';
import { ListadoProductoSalidasComponent } from './components/listado-producto/listado-producto-salidas/listado-producto-salidas.component';
import { ListadoProductoGeneralComponent } from './components/listado-producto/listado-producto-general/listado-producto-general.component';
import { ListadoClienteVentaComponent } from './components/venta/listado-cliente-venta/listado-cliente-venta.component';
import { ObservacionClienteComponent } from './components/observacion-cliente/observacion-cliente.component';





@NgModule({
  declarations: [
    DetalleCompraComponent,
    DetalleFijarPreciosComponent,
    DetalleNotaCreditoComponent,
    DetalleProductosComponent,
    DetalleProductosSalidasComponent,
    DetalleVentaComponent,
    EncabezadoComponent,
    ListadoClienteComponent,
    ListadoEmpleadoComponent,
    ListadoPlanesGymComponent,
    //ListadoProductoComponent,
    ListadoProveedorComponent,
    ListadoTarifasComponent,
    LoaderComponent,
    MenuComponent,
    ModalCargaComponent,
    OpcionesExploradorVentaComponent,
    PieComponent,
    ListadoTransportistaComponent,
    NuevoPuntoTransporteComponent,
    NuevaRutaComponent,
    NuevoVehiculoComponent,
    LoaderListadoComponent,
    DetalleRegistroCaducidadComponent,
    FormaPagoComponent,
    RegistroAbonoVentaComponent,
    PedidoPanaderiaComponent,
    ListarNotaCreditoComponent,
    ListarGuiaRemisionComponent,
    OpcionesExploradorNotaCreditoComponent,
    OpcionesExploradorGuiaRemisionComponent,
    OpcionesExploradorRetencionComponent,
    ListadoExistenciasSucursalComponent,
    DetalleProductosMovimientosComponent,
    DetalleProductosRevisionComponent,
    RecargoFacturaComponent,
    TransaccionesBancoComponent,
    ListarVentasClienteComponent,
    FilterGenericoPipe,
    ListadoVendedorComponent,
    CodigoProductoComponent,
    CompensacionComponent,
    ConfigurarFirmaVentaComponent,
    AccesoDenegadoComponent,
    ListarFacturasVentasComponent,
    RegistroAbonoComponent,
    VisualizarListadoVentaClienteComponent,
    VisualizarListadoPedidoClienteComponent,
    OpcionesExploradorPedidoComponent,
    DetalleMovimientoCajaComponent,
    ListadoSociosComponent,
    DetalleVentaGuiaRemisionComponent,
    ListadoProductoVentasComponent,
    ListadoProductoComprasComponent,
    ListadoProductoIngresosComponent,
    ListadoProductoSalidasComponent,
    ListadoProductoGeneralComponent,
    ListadoClienteVentaComponent,
    ObservacionClienteComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
