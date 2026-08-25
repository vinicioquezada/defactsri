import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';

import { AuthInterceptorService } from './auth-interceptor.service';
 
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';

import { NgxPaginationModule } from 'ngx-pagination';

import { NgxChartsModule } from '@swimlane/ngx-charts';

/*SHARED*/
/*SHARED*/
/*SHARED*/
import { DetalleCompraComponent } from './shared/components/detalle-compra/detalle-compra.component';
import { DetalleFijarPreciosComponent } from './shared/components/detalle-fijar-precios/detalle-fijar-precios.component';
import { DetalleNotaCreditoComponent } from './shared/components/detalle-nota-credito/detalle-nota-credito.component';
import { DetalleProductosComponent } from './shared/components/detalle-productos/detalle-productos.component';
import { DetalleProductosSalidasComponent } from './shared/components/detalle-productos-salidas/detalle-productos-salidas.component';
import { DetalleVentaComponent } from './shared/components/detalle-venta/detalle-venta.component';
import { EncabezadoComponent } from './shared/components/encabezado/encabezado.component';
import { ListadoClienteComponent } from './shared/components/listado-cliente/listado-cliente.component';
import { ListadoEmpleadoComponent } from './shared/components/listado-empleado/listado-empleado.component';
import { ListadoPlanesGymComponent } from './shared/components/listado-planes-gym/listado-planes-gym.component';
import { ListadoProveedorComponent } from './shared/components/listado-proveedor/listado-proveedor.component';
import { ListadoTarifasComponent } from './shared/components/listado-tarifas/listado-tarifas.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { MenuComponent } from './shared/components/menu/menu.component';
import { ModalCargaComponent } from './shared/components/modal-carga/modal-carga.component';
import { OpcionesExploradorVentaComponent } from './shared/components/venta/opciones-explorador-venta/opciones-explorador-venta.component';
import { PieComponent } from './shared/components/pie/pie.component';
import { DatosSujetoRetenidoComponent } from './retencion/components/retencion/datos-sujeto-retenido/datos-sujeto-retenido.component';
import { DatosVentasComponent } from './retencion/components/retencion/datos-ventas/datos-ventas.component';
import { DetalleRetencionComponent } from './retencion/components/retencion/detalle-retencion/detalle-retencion.component';
import { ListadoTransportistaComponent } from './shared/components/transportista/listado-transportista/listado-transportista.component';
import { NuevoPuntoTransporteComponent } from './shared/components/transportista/nuevo-punto-transporte/nuevo-punto-transporte.component';
import { NuevaRutaComponent } from './shared/components/transportista/nueva-ruta/nueva-ruta.component';
import { NuevoVehiculoComponent } from './shared/components/transportista/nuevo-vehiculo/nuevo-vehiculo.component';
import { LoaderListadoComponent } from './shared/components/loader-listado/loader-listado.component';
import { DetalleRegistroCaducidadComponent } from './shared/components/detalle-registro-caducidad/detalle-registro-caducidad.component';
import { FormaPagoComponent } from './shared/components/forma-pago/forma-pago.component';
import { RegistroAbonoVentaComponent } from './shared/components/registro-abono-venta/registro-abono-venta.component';
import { ListarNotaCreditoComponent } from './shared/components/venta/listar-nota-credito/listar-nota-credito.component';
import { ListarGuiaRemisionComponent } from './shared/components/venta/listar-guia-remision/listar-guia-remision.component';
import { OpcionesExploradorNotaCreditoComponent } from './shared/components/venta/opciones-explorador-nota-credito/opciones-explorador-nota-credito.component';
import { OpcionesExploradorGuiaRemisionComponent } from './shared/components/venta/opciones-explorador-guia-remision/opciones-explorador-guia-remision.component';
import { OpcionesExploradorRetencionComponent } from './shared/components/retencion/opciones-explorador-retencion/opciones-explorador-retencion.component';
import { ListadoExistenciasSucursalComponent } from './shared/components/listado-existencias-sucursal/listado-existencias-sucursal.component';
import { TransaccionesBancoComponent } from './shared/components/venta/transacciones-banco/transacciones-banco.component';
import { ListarVentasClienteComponent } from './shared/components/venta/listar-ventas-cliente/listar-ventas-cliente.component';
import { FilterGenericoPipe } from './shared/pipes/filter-generico.pipe';
import { ListadoVendedorComponent } from './shared/components/listado-vendedor/listado-vendedor.component';
import { CodigoProductoComponent } from './shared/components/codigo-producto/codigo-producto.component';
import { CompensacionComponent } from './shared/components/compensacion/compensacion.component';
import { ConfigurarFirmaVentaComponent } from './shared/components/venta/configurar-firma-venta/configurar-firma-venta.component';
import { AccesoDenegadoComponent } from './shared/components/acceso-denegado/acceso-denegado.component';
import { ListarFacturasVentasComponent } from './shared/components/venta/listar-facturas-ventas/listar-facturas-ventas.component';
import { RegistroAbonoComponent } from './shared/components/registro-abono/registro-abono.component';
import { VisualizarListadoVentaClienteComponent } from './shared/components/venta/visualizar-listado-venta-cliente/visualizar-listado-venta-cliente.component';
import { VisualizarListadoPedidoClienteComponent } from './shared/components/venta/visualizar-listado-pedido-cliente/visualizar-listado-pedido-cliente.component';
import { OpcionesExploradorPedidoComponent } from './shared/components/venta/opciones-explorador-pedido/opciones-explorador-pedido.component';
import { DetalleMovimientoCajaComponent } from './shared/components/cajero/detalle-movimiento-caja/detalle-movimiento-caja.component';
import { ListadoSociosComponent } from './shared/components/listado-socios/listado-socios.component';
import { DetalleVentaGuiaRemisionComponent } from './shared/components/detalle-venta-guia-remision/detalle-venta-guia-remision.component';
import { ConfigService } from './shared/services/config.service';
import { ListadoProductoVentasComponent } from './shared/components/listado-producto/listado-producto-ventas/listado-producto-ventas.component';
import { ListadoProductoIngresosComponent } from './shared/components/listado-producto/listado-producto-ingresos/listado-producto-ingresos.component';
import { ListadoProductoSalidasComponent } from './shared/components/listado-producto/listado-producto-salidas/listado-producto-salidas.component';
import { ListadoProductoComprasComponent } from './shared/components/listado-producto/listado-producto-compras/listado-producto-compras.component';
import { ListadoProductoGeneralComponent } from './shared/components/listado-producto/listado-producto-general/listado-producto-general.component';
import { ListadoClienteVentaComponent } from './shared/components/venta/listado-cliente-venta/listado-cliente-venta.component';
import { ObservacionClienteComponent } from './shared/components/observacion-cliente/observacion-cliente.component';
/*SHARED*/
/*SHARED*/
/*SHARED*/

/*USUARIO*/
/*USUARIO*/
/*USUARIO*/
import { InicioComponent } from './usuario/components/inicio/inicio.component';
import { LoginComponent } from './usuario/components/login/login.component';
import { PerfilComponent } from './usuario/components/perfil/perfil.component';
/*USUARIO*/
/*USUARIO*/
/*USUARIO*/

/*ADMINISTRACIÓN*/
/*ADMINISTRACIÓN*/
/*ADMINISTRACIÓN*/
import { MenuAdministrarComponent } from './administrar/components/menu-administrar/menu-administrar.component';
import { RolesComponent } from './administrar/components/roles/roles.component';
import { UsuarioComponent } from './administrar/components/usuario/usuario.component';
import { SucursalComponent } from './administrar/components/sucursal/sucursal.component';
import { RucComponent } from './administrar/components/ruc/ruc.component';
import { SucursalFormComponent } from './administrar/components/sucursal/sucursal-form/sucursal-form.component';
import { RucFormComponent } from './administrar/components/ruc/ruc-form/ruc-form.component';
import { LogoRucComponent } from './administrar/components/ruc/logo-ruc/logo-ruc.component';
import { FirmaRucComponent } from './administrar/components/ruc/firma-ruc/firma-ruc.component';
import { AsignacionRucComponent } from './administrar/components/sucursal/asignacion-ruc/asignacion-ruc.component';
import { LogoSucursalComponent } from './administrar/components/sucursal/logo-sucursal/logo-sucursal.component';
import { SecuenciasFacturaComponent } from './administrar/components/ruc/secuencias-factura/secuencias-factura.component';
import { ConfiguracionServicioComponent } from './administrar/components/sucursal/configuracion-servicio/configuracion-servicio.component';
import { RolesFormComponent } from './administrar/components/roles/roles-form/roles-form.component';
import { FuncionalidadComponent } from './administrar/components/roles/funcionalidad/funcionalidad.component';
import { ConfiguracionImpresionComponent } from './administrar/components/configuracion-impresion/configuracion-impresion.component';
import { UsuarioFormComponent } from './administrar/components/usuario/usuario-form/usuario-form.component';
/*ADMINISTRACIÓN*/
/*ADMINISTRACIÓN*/
/*ADMINISTRACIÓN*/

/*ALMACEN*/
/*ALMACEN*/
/*ALMACEN*/
import { BuscarProductoComponent } from './almacen/components/buscar-producto/buscar-producto.component';
import { CategoriaComponent } from './almacen/components/categoria/categoria.component';
import { CodigoBarraComponent } from './almacen/components/codigo-barra/codigo-barra.component';
import { DenominacionComponent } from './almacen/components/denominacion/denominacion.component';
import { ExploradorIngresoMercaderiaComponent } from './almacen/components/explorador-ingreso-mercaderia/explorador-ingreso-mercaderia.component';
import { ExploradorMovimientoMercaderiaComponent } from './almacen/components/explorador-movimiento-mercaderia/explorador-movimiento-mercaderia.component';
import { ExploradorSalidaMercaderiaComponent } from './almacen/components/explorador-salida-mercaderia/explorador-salida-mercaderia.component';
import { IngresoMercaderiaComponent } from './almacen/components/ingreso-mercaderia/ingreso-mercaderia.component';
import { MarcaComponent } from './almacen/components/marca/marca.component';
import { MenuAlmacenComponent } from './almacen/components/menu-almacen/menu-almacen.component';
import { MovimientoMercaderiaComponent } from './almacen/components/movimiento-mercaderia/movimiento-mercaderia.component';
import { ProductoComponent } from './almacen/components/producto/producto.component';
import { ReporteIngresoMercaderiaComponent } from './almacen/components/reporte-ingreso-mercaderia/reporte-ingreso-mercaderia.component';
import { ReporteSalidaMercaderiaComponent } from './almacen/components/reporte-salida-mercaderia/reporte-salida-mercaderia.component';
import { ReporteStockProductoComponent } from './almacen/components/reporte-stock-producto/reporte-stock-producto.component';
import { SalidaMercaderiaComponent } from './almacen/components/salida-mercaderia/salida-mercaderia.component';
import { SubcategoriaComponent } from './almacen/components/subcategoria/subcategoria.component';
import { TipoIngresoMercaderiaComponent } from './almacen/components/tipo-ingreso-mercaderia/tipo-ingreso-mercaderia.component';
import { TipoSalidaMercaderiaComponent } from './almacen/components/tipo-salida-mercaderia/tipo-salida-mercaderia.component';
import { TipoTarifaComponent } from './almacen/components/tipo-tarifa/tipo-tarifa.component';
import { UnidadMedidaComponent } from './almacen/components/unidad-medida/unidad-medida.component';
import { UnidadMedidaFormComponent } from './almacen/components/unidad-medida/unidad-medida-form/unidad-medida-form.component';
import { TipoTarifaFormComponent } from './almacen/components/tipo-tarifa/tipo-tarifa-form/tipo-tarifa-form.component';
import { TipoSalidaMercaderiaFormComponent } from './almacen/components/tipo-salida-mercaderia/tipo-salida-mercaderia-form/tipo-salida-mercaderia-form.component';
import { TipoIngresoMercaderiaFormComponent } from './almacen/components/tipo-ingreso-mercaderia/tipo-ingreso-mercaderia-form/tipo-ingreso-mercaderia-form.component';
import { CategoriaFormComponent } from './almacen/components/categoria/categoria-form/categoria-form.component';
import { SubcategoriaFormComponent } from './almacen/components/subcategoria/subcategoria-form/subcategoria-form.component';
import { MarcaFormComponent } from './almacen/components/marca/marca-form/marca-form.component';
import { DenominacionFormComponent } from './almacen/components/denominacion/denominacion-form/denominacion-form.component';
import { VerificacionMovimientoMercaderiaComponent } from './almacen/components/verificacion-movimiento-mercaderia/verificacion-movimiento-mercaderia.component';
import { MovimientoMercaderiaVerificarComponent } from './almacen/components/movimiento-mercaderia-verificar/movimiento-mercaderia-verificar.component';
import { DetalleProductosMovimientosComponent } from './shared/components/detalle-productos-movimientos/detalle-productos-movimientos.component';
import { DetalleProductosRevisionComponent } from './shared/components/detalle-productos-revision/detalle-productos-revision.component';
import { ReporteMovimientoMercaderiaComponent } from './almacen/components/reporte-movimiento-mercaderia/reporte-movimiento-mercaderia.component';
import { ProductoFormComponent } from './almacen/components/producto/producto-form/producto-form.component';
import { ProduccionComponent } from './almacen/components/produccion/produccion.component';
import { ExploradorProduccionComponent } from './almacen/components/explorador-produccion/explorador-produccion.component';
import { ReporteSalidaMercaderiaValoradasComponent } from './almacen/components/reporte-salida-mercaderia-valoradas/reporte-salida-mercaderia-valoradas.component';
import { ExistenciasComponent } from './almacen/components/producto/existencias/existencias.component';
import { TarifasComponent } from './almacen/components/producto/tarifas/tarifas.component';
import { PreciosProveedorComponent } from './almacen/components/producto/precios-proveedor/precios-proveedor.component';
import { FacturaProveedorComponent } from './almacen/components/producto/factura-proveedor/factura-proveedor.component';
/*ALMACEN*/
/*ALMACEN*/
/*ALMACEN*/

/*VENTA*/
/*VENTA*/
/*VENTA*/
import { CajeroComponent } from './venta/components/cajero/cajero.component';
import { ClienteComponent } from './venta/components/cliente/cliente.component';
import { ClienteFormComponent } from './venta/components/cliente/cliente-form/cliente-form.component'
import { ExploradorCajeroComponent } from './venta/components/explorador-cajero/explorador-cajero.component';
import { ExploradorFacturaComponent } from './venta/components/explorador-factura/explorador-factura.component';
import { ExploradorGuiaRemisionComponent } from './venta/components/explorador-guia-remision/explorador-guia-remision.component';
import { ExploradorNotaCreditoComponent } from './venta/components/explorador-nota-credito/explorador-nota-credito.component';
import { ExploradorPedidosComponent } from './venta/components/explorador-pedidos/explorador-pedidos.component';
import { ExploradorVentaComponent } from './venta/components/explorador-venta/explorador-venta.component';
import { GuiaRemisionComponent } from './venta/components/guia-remision/guia-remision.component';
import { MenuVentaComponent } from './venta/components/menu-venta/menu-venta.component';
import { NotaCreditoComponent } from './venta/components/nota-credito/nota-credito.component';
import { ReporteClienteComponent } from './venta/components/reporte-cliente/reporte-cliente.component';
import { ReporteGuiaRemisionComponent } from './venta/components/reporte-guia-remision/reporte-guia-remision.component';
import { ReporteNotaCreditoComponent } from './venta/components/reporte-nota-credito/reporte-nota-credito.component';
import { ReporteRotacionProductoComponent } from './venta/components/reporte-rotacion-producto/reporte-rotacion-producto.component';
import { ReporteVentaComponent } from './venta/components/reporte-venta/reporte-venta.component';
import { ReporteVentaCreditoComponent } from './venta/components/reporte-venta-credito/reporte-venta-credito.component';
import { ReporteVentaDetallesComponent } from './venta/components/reporte-venta-detalles/reporte-venta-detalles.component';
import { ReporteVentaPorCategoriaComponent } from './venta/components/reporte-venta-por-categoria/reporte-venta-por-categoria.component';
import { ReporteVentaPorProductoComponent } from './venta/components/reporte-venta-por-producto/reporte-venta-por-producto.component';
import { TipoClienteComponent } from './venta/components/tipo-cliente/tipo-cliente.component';
import { TransportistaComponent } from './venta/components/transportista/transportista.component';
import { VentaComponent } from './venta/components/venta/venta.component';
import { PedidoPanaderiaComponent } from './shared/components/venta/pedido-panaderia/pedido-panaderia.component';
import { ReporteControlVentaComponent } from './venta/components/reporte-control-venta/reporte-control-venta.component';
import { PedidoComponent } from './venta/components/pedido/pedido.component';
import { ExploradorVentaRecaudacionComponent } from './venta/components/explorador-venta-recaudacion/explorador-venta-recaudacion.component';
import { PreVentaComponent } from './venta/components/pre-venta/pre-venta.component';
import { AprobarPreVentaComponent } from './venta/components/aprobar-pre-venta/aprobar-pre-venta.component';
import { RecargoFacturaComponent } from './shared/components/recargo-factura/recargo-factura.component';
import { VentaDescuentoComponent } from './venta/components/venta-descuento/venta-descuento.component';
import { PagoNotaCreditoComponent } from './venta/components/pago-nota-credito/pago-nota-credito.component';
import { ReporteSaldoNotaCreditoComponent } from './venta/components/reporte-saldo-nota-credito/reporte-saldo-nota-credito.component';
import { ReporteVentaFormaPagoComponent } from './venta/components/reporte-venta-forma-pago/reporte-venta-forma-pago.component';
import { ReporteConsolidadoSaldoPendienteNotaCreditoComponent } from './venta/components/reporte-consolidado-saldo-pendiente-nota-credito/reporte-consolidado-saldo-pendiente-nota-credito.component';
import { ReportePagoNotaCreditoComponent } from './venta/components/reporte-pago-nota-credito/reporte-pago-nota-credito.component';
import { ReporteVentaConsolidadoVendedorComponent } from './venta/components/reporte-venta-consolidado-vendedor/reporte-venta-consolidado-vendedor.component';
import { ReporteNotaCreditoDetallesComponent } from './venta/components/reporte-nota-credito-detalles/reporte-nota-credito-detalles.component';
import { TipoClienteFormComponent } from './venta/components/tipo-cliente/tipo-cliente-form/tipo-cliente-form.component';
import { TransportistaFormComponent } from './venta/components/transportista/transportista-form/transportista-form.component';
/*VENTA*/
/*VENTA*/
/*VENTA*/

/*GIMNASIO*/
/*GIMNASIO*/
/*GIMNASIO*/
import { ExploradorVentaMembresiaComponent } from './gym/components/explorador-venta-membresia/explorador-venta-membresia.component';
import { FacturaPlanComponent } from './gym/components/factura-plan/factura-plan.component';
import { MembresiaComponent } from './gym/components/membresia/membresia.component';
import { MenuGymComponent } from './gym/components/menu-gym/menu-gym.component';
import { PlanComponent } from './gym/components/plan/plan.component';
import { ReporteEstadoMembresiaComponent } from './gym/components/reporte-estado-membresia/reporte-estado-membresia.component';
import { ReportePromocionAlMesComponent } from './gym/components/reporte-promocion-al-mes/reporte-promocion-al-mes.component';
import { ReporteSociosComponent } from './gym/components/reporte-socios/reporte-socios.component';
import { SocioComponent } from './gym/components/socio/socio.component';
import { MonitorComponent } from './gym/components/monitor/monitor.component';
import { MonitorCompartidoComponent } from './gym/components/monitor/monitor-compartido/monitor-compartido.component';
import { MonitorSecundarioComponent } from './gym/components/monitor-secundario/monitor-secundario.component';
import { SocioFormComponent } from './gym/components/socio/socio-form/socio-form.component';
import { ListadoAperturaDiarioComponent } from './gym/components/factura-plan/listado-apertura-diario/listado-apertura-diario.component';
import { ActividadComponent } from './gym/components/actividad/actividad.component';
import { ActividadFormComponent } from './gym/components/actividad/actividad-form/actividad-form.component';
import { ActividadHorarioComponent } from './gym/components/actividad-horario/actividad-horario.component';
import { ActividadHorarioFormComponent } from './gym/components/actividad-horario/actividad-horario-form/actividad-horario-form.component';
import { ActividadReservaComponent } from './gym/components/actividad-reserva/actividad-reserva.component';
import { ActividadReservaFormComponent } from './gym/components/actividad-reserva/actividad-reserva-form/actividad-reserva-form.component';
import { ActividadMembresiaComponent } from './gym/components/actividad-membresia/actividad-membresia.component';
import { ListadoActividadReservaComponent } from './gym/components/listado-actividad-reserva/listado-actividad-reserva.component';
import { HorarioReservaActividadComponent } from './gym/components/horario-reserva-actividad/horario-reserva-actividad.component';
import { MonitorActividadesComponent } from './gym/components/monitor-actividades/monitor-actividades.component';
import { CuponComponent } from './gym/components/cupon/cupon.component';
import { CuponFormComponent } from './gym/components/cupon/cupon-form/cupon-form.component';
import { FotoFormComponent } from './gym/components/socio/foto-form/foto-form.component';
import { PlanFormComponent } from './gym/components/plan/plan-form/plan-form.component';
/*GIMNASIO*/
/*GIMNASIO*/
/*GIMNASIO*/

/*COMPRA*/
/*COMPRA*/
/*COMPRA*/
import { CompraComponent } from './compra/components/compra/compra.component';
import { ExploradorCompraComponent } from './compra/components/explorador-compra/explorador-compra.component';
import { ExploradorNotaCreditoComprasComponent } from './compra/components/explorador-nota-credito-compras/explorador-nota-credito-compras.component';
import { ExploradorProveedorComponent } from './compra/components/explorador-proveedor/explorador-proveedor.component';
import { FijarPreciosProductosComponent } from './compra/components/fijar-precios-productos/fijar-precios-productos.component';
import { MenuCompraComponent } from './compra/components/menu-compra/menu-compra.component';
import { NotaCreditoComprasComponent } from './compra/components/nota-credito-compras/nota-credito-compras.component';
import { ProveedorComponent } from './compra/components/proveedor/proveedor.component';
import { ReporteCompraComponent } from './compra/components/reporte-compra/reporte-compra.component';
import { ReporteCompraCreditoComponent } from './compra/components/reporte-compra-credito/reporte-compra-credito.component';
import { ReporteCompraDetallesComponent } from './compra/components/reporte-compra-detalles/reporte-compra-detalles.component';
import { ReporteNotaCreditoComprasComponent } from './compra/components/reporte-nota-credito-compras/reporte-nota-credito-compras.component';
import { ReporteProveedorComponent } from './compra/components/reporte-proveedor/reporte-proveedor.component';
import { ProveedorFormComponent } from './compra/components/proveedor/proveedor-form/proveedor-form.component';
import { ListadoProductoEmparejarComponent } from './compra/components/compra/listado-producto-emparejar/listado-producto-emparejar.component';
import { ProductosProveedorComponent } from './compra/components/proveedor/productos-proveedor/productos-proveedor.component';
/*COMPRA*/
/*COMPRA*/
/*COMPRA*/


/*RETENCION*/
/*RETENCION*/
/*RETENCION*/
import { CodigoRetencionComponent } from './retencion/components/codigo-retencion/codigo-retencion.component';
import { ExploradorRetencionComponent } from './retencion/components/explorador-retencion/explorador-retencion.component';
import { MenuRetencionComponent } from './retencion/components/menu-retencion/menu-retencion.component';
import { ReporteRetencionComponent } from './retencion/components/reporte-retencion/reporte-retencion.component';
import { RetencionComponent } from './retencion/components/retencion/retencion.component';
import { ListadoCompraRetencionComponent } from './retencion/components/listado-compra-retencion/listado-compra-retencion.component';
/*RETENCION*/
/*RETENCION*/
/*RETENCION*/

/*KARDEX*/
/*KARDEX*/
/*KARDEX*/
import { KardexComponent } from './kardex/components/kardex/kardex.component';
import { ReporteCostoProductoComponent } from './kardex/components/reporte-costo-producto/reporte-costo-producto.component';
import { ReporteIngresosManualesComponent } from './kardex/components/reporte-ingresos-manuales/reporte-ingresos-manuales.component';
import { ReporteMargenGananciaComponent } from './kardex/components/reporte-margen-ganancia/reporte-margen-ganancia.component';
import { ReporteSalidasManualesComponent } from './kardex/components/reporte-salidas-manuales/reporte-salidas-manuales.component';
import { RegistroCaducidadComponent } from './kardex/components/registro-caducidad/registro-caducidad.component';
import { ReporteCaducidadComponent } from './kardex/components/reporte-caducidad/reporte-caducidad.component';
import { RegistroCaducidadIngresoComponent } from './kardex/components/registro-caducidad-ingreso/registro-caducidad-ingreso.component';
/*KARDEX*/
/*KARDEX*/
/*KARDEX*/

/*HOTEL*/
/*HOTEL*/
/*HOTEL*/
import { AsignacionComponent } from './hotel/components/asignacion/asignacion.component';
import { ExploradorDepartamentosComponent } from './hotel/components/explorador-departamentos/explorador-departamentos.component';
import { ExploradorPagosComponent } from './hotel/components/explorador-pagos/explorador-pagos.component';
import { FacturaReservaComponent } from './hotel/components/factura-reserva/factura-reserva.component';
import { MenuHotelComponent } from './hotel/components/menu-hotel/menu-hotel.component';
import { ReservasComponent } from './hotel/components/reservas/reservas.component';
import { ServiciosHotelComponent } from './hotel/components/servicios-hotel/servicios-hotel.component';
import { DisponibilidadDepartamentosComponent } from './hotel/components/disponibilidad-departamentos/disponibilidad-departamentos.component';
import { ServiciosHotelFormComponent } from './hotel/components/servicios-hotel/servicios-hotel-form/servicios-hotel-form.component';
/*HOTEL*/
/*HOTEL*/
/*HOTEL*/

/*GASTOSINGRESOS*/
/*GASTOSINGRESOS*/
/*GASTOSINGRESOS*/
import { CategoriaGastosComponent } from './gastosingresos/components/categoria-gastos/categoria-gastos.component';
import { CategoriaIngresosComponent } from './gastosingresos/components/categoria-ingresos/categoria-ingresos.component';
import { GastosComponent } from './gastosingresos/components/gastos/gastos.component';
import { IngresosComponent } from './gastosingresos/components/ingresos/ingresos.component';
import { MenuGastosIngresosComponent } from './gastosingresos/components/menu-gastos-ingresos/menu-gastos-ingresos.component';
import { ReporteGastosComponent } from './gastosingresos/components/reporte-gastos/reporte-gastos.component';
import { ReporteIngresosComponent } from './gastosingresos/components/reporte-ingresos/reporte-ingresos.component';
/*GASTOSINGRESOS*/
/*GASTOSINGRESOS*/
/*GASTOSINGRESOS*/

/*CUENTAPC*/
/*CUENTAPC*/
/*CUENTAPC*/
import { AbonoCompraComponent } from './cuentapc/components/abono-compra/abono-compra.component';
import { AbonoVentaComponent } from './cuentapc/components/abono-venta/abono-venta.component';
import { CreditoComponent } from './cuentapc/components/credito/credito.component';
import { MenuCuentaPcComponent } from './cuentapc/components/menu-cuenta-pc/menu-cuenta-pc.component';
import { ReporteAbonoComprasComponent } from './cuentapc/components/reporte-abono-compras/reporte-abono-compras.component';
import { ReporteAbonoVentasComponent } from './cuentapc/components/reporte-abono-ventas/reporte-abono-ventas.component';
import { ReporteCortePorCobrarComponent } from './cuentapc/components/reporte-corte-por-cobrar/reporte-corte-por-cobrar.component';
import { ReportePorCobrarComponent } from './cuentapc/components/reporte-por-cobrar/reporte-por-cobrar.component';
import { ReportePorPagarComponent } from './cuentapc/components/reporte-por-pagar/reporte-por-pagar.component';
import { ReporteFormaPagoVencimientoComponent } from './cuentapc/components/reporte-forma-pago-vencimiento/reporte-forma-pago-vencimiento.component';
import { ResumenVentasComponent } from './venta/components/resumen-ventas/resumen-ventas.component';
import { ReporteCuentasPagarConsolidadoComponent } from './cuentapc/components/reporte-cuentas-pagar-consolidado/reporte-cuentas-pagar-consolidado.component';
import { ReporteCuentasCobrarConsolidadoComponent } from './cuentapc/components/reporte-cuentas-cobrar-consolidado/reporte-cuentas-cobrar-consolidado.component';
import { ReporteVentasSociosComponent } from './gym/components/reporte-ventas-socios/reporte-ventas-socios.component';
import { CategoriaGastosFormComponent } from './gastosingresos/components/categoria-gastos/categoria-gastos-form/categoria-gastos-form.component';
import { CategoriaIngresosFormComponent } from './gastosingresos/components/categoria-ingresos/categoria-ingresos-form/categoria-ingresos-form.component';
import { EliminacionProductoComponent } from './almacen/components/eliminacion-producto/eliminacion-producto.component';
import { ReporteAsistenciaComponent } from './gym/components/reporte-asistencia/reporte-asistencia.component';
/*CUENTAPC*/
/*CUENTAPC*/
/*CUENTAPC*/

function initializeApp(configService: ConfigService) {
  return () => configService.loadConfig();
}

@NgModule({
  declarations: [
    AppComponent,
    
    /*SHARED*/
    /*SHARED*/
    /*SHARED*/
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
    ListadoProveedorComponent,
    ListadoTarifasComponent,
    LoaderComponent,
    MenuComponent,
    ModalCargaComponent,
    OpcionesExploradorVentaComponent,
    PieComponent,
    DatosSujetoRetenidoComponent,
    DatosVentasComponent,
    DetalleRetencionComponent,
    ListadoTransportistaComponent,
    NuevoPuntoTransporteComponent,
    NuevaRutaComponent,
    NuevoVehiculoComponent,
    LoaderListadoComponent,
    DetalleRegistroCaducidadComponent,
    FormaPagoComponent,
    RegistroAbonoVentaComponent,
    ListarNotaCreditoComponent,
    ListarGuiaRemisionComponent,
    OpcionesExploradorNotaCreditoComponent,
    OpcionesExploradorGuiaRemisionComponent,
    OpcionesExploradorRetencionComponent,
    ListadoExistenciasSucursalComponent,
    TransaccionesBancoComponent,
    ListarVentasClienteComponent,
    FilterGenericoPipe,
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
    ListadoProductoIngresosComponent,
    ListadoProductoSalidasComponent,
    ListadoProductoComprasComponent,
    ListadoProductoGeneralComponent,
    ListadoClienteVentaComponent,
    ObservacionClienteComponent,
    /*SHARED*/
    /*SHARED*/
    /*SHARED*/

    /*USUARIO*/
    /*USUARIO*/
    /*USUARIO*/
    InicioComponent,
    LoginComponent,
    PerfilComponent,
    /*USUARIO*/
    /*USUARIO*/
    /*USUARIO*/

    /*ADMINISTRACIÓN*/
    /*ADMINISTRACIÓN*/
    /*ADMINISTRACIÓN*/
    MenuAdministrarComponent,
    RolesComponent,
    UsuarioComponent,
    SucursalComponent,
    RucComponent,
    SucursalFormComponent,
    RucFormComponent,
    LogoRucComponent,
    FirmaRucComponent,
    AsignacionRucComponent,
    LogoSucursalComponent,
    SecuenciasFacturaComponent,
    ConfiguracionServicioComponent,
    RolesFormComponent,
    FuncionalidadComponent,
    ConfiguracionImpresionComponent,
    UsuarioFormComponent,
    /*ADMINISTRACIÓN*/
    /*ADMINISTRACIÓN*/
    /*ADMINISTRACIÓN*/

    /*ALMACEN*/
    /*ALMACEN*/
    /*ALMACEN*/
    BuscarProductoComponent,
    CategoriaComponent,
    CodigoBarraComponent,
    DenominacionComponent,
    ExploradorIngresoMercaderiaComponent,
    ExploradorMovimientoMercaderiaComponent,
    ExploradorSalidaMercaderiaComponent,
    IngresoMercaderiaComponent,
    MarcaComponent,
    MenuAlmacenComponent,
    MovimientoMercaderiaComponent,
    ProductoComponent,
    ReporteIngresoMercaderiaComponent,
    ReporteSalidaMercaderiaComponent,
    ReporteStockProductoComponent,
    SalidaMercaderiaComponent,
    SubcategoriaComponent,
    TipoIngresoMercaderiaComponent,
    TipoSalidaMercaderiaComponent,
    TipoTarifaComponent,
    UnidadMedidaComponent,
    CategoriaFormComponent,
    CategoriaFormComponent,
    SubcategoriaFormComponent,
    MarcaFormComponent,
    DenominacionFormComponent,
    UnidadMedidaFormComponent,
    TipoTarifaFormComponent,
    TipoSalidaMercaderiaFormComponent,
    TipoIngresoMercaderiaFormComponent,
    VerificacionMovimientoMercaderiaComponent,
    MovimientoMercaderiaVerificarComponent,
    DetalleProductosMovimientosComponent,
    DetalleProductosRevisionComponent,
    ReporteMovimientoMercaderiaComponent,
    ProductoFormComponent,
    ProduccionComponent,
    ExploradorProduccionComponent,
    ReporteSalidaMercaderiaValoradasComponent,
    ExistenciasComponent,
    TarifasComponent,
    PreciosProveedorComponent,
    FacturaProveedorComponent,
    EliminacionProductoComponent,
    /*ALMACEN*/
    /*ALMACEN*/
    /*ALMACEN*/


    /*VENTA*/
    /*VENTA*/
    /*VENTA*/
    CajeroComponent,
    ClienteComponent,
    ClienteFormComponent,
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
    ReporteVentaFormaPagoComponent,
    ReporteVentaCreditoComponent,
    ReporteVentaDetallesComponent,
    ReporteVentaPorCategoriaComponent,
    ReporteVentaPorProductoComponent,
    TipoClienteComponent,
    TransportistaComponent,
    VentaComponent,
    PedidoPanaderiaComponent,
    ReporteControlVentaComponent,
    PedidoComponent,
    ExploradorVentaRecaudacionComponent,
    PreVentaComponent,
    AprobarPreVentaComponent,
    RecargoFacturaComponent,
    VentaDescuentoComponent,
    PagoNotaCreditoComponent,
    ReporteSaldoNotaCreditoComponent,
    ListadoVendedorComponent,
    ResumenVentasComponent,
    ReporteConsolidadoSaldoPendienteNotaCreditoComponent,
    ReportePagoNotaCreditoComponent,
    ReporteVentaConsolidadoVendedorComponent,
    ReporteNotaCreditoDetallesComponent,
    TipoClienteFormComponent,
    TransportistaFormComponent,
    /*VENTA*/
    /*VENTA*/
    /*VENTA*/


    /*GIMNASIO*/
    /*GIMNASIO*/
    /*GIMNASIO*/
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
    MonitorCompartidoComponent,
    MonitorSecundarioComponent,
    SocioFormComponent,
    ListadoAperturaDiarioComponent,
    ReporteVentasSociosComponent,
    ActividadComponent,
    ActividadFormComponent,
    ActividadHorarioComponent,
    ActividadHorarioFormComponent,
    ActividadMembresiaComponent,
    ActividadReservaComponent,
    ActividadReservaFormComponent,
    ListadoActividadReservaComponent,
    HorarioReservaActividadComponent,
    MonitorActividadesComponent,
    CuponComponent,
    CuponFormComponent,
    FotoFormComponent,
    PlanFormComponent,
    ReporteAsistenciaComponent,
    /*GIMNASIO*/
    /*GIMNASIO*/
    /*GIMNASIO*/


    /*COMPRA*/
    /*COMPRA*/
    /*COMPRA*/
    CompraComponent,
    ExploradorCompraComponent,
    ExploradorNotaCreditoComprasComponent,
    ExploradorProveedorComponent,
    FijarPreciosProductosComponent,
    MenuCompraComponent,
    NotaCreditoComprasComponent,
    ProveedorComponent,
    ReporteCompraComponent,
    ReporteCompraCreditoComponent,
    ReporteCompraDetallesComponent,
    ReporteNotaCreditoComprasComponent,
    ReporteProveedorComponent,
    ProveedorFormComponent,
    ListadoProductoEmparejarComponent,
    ProductosProveedorComponent,
    /*COMPRA*/
    /*COMPRA*/
    /*COMPRA*/

    /*RETENCION*/
    /*RETENCION*/
    /*RETENCION*/
    CodigoRetencionComponent,
    ExploradorRetencionComponent,
    MenuRetencionComponent,
    ReporteRetencionComponent,
    RetencionComponent,
    ListadoCompraRetencionComponent,
    /*RETENCION*/
    /*RETENCION*/
    /*RETENCION*/

    /*KARDEX*/
    /*KARDEX*/
    /*KARDEX*/
    KardexComponent,
    ReporteCostoProductoComponent,
    ReporteIngresosManualesComponent,
    ReporteMargenGananciaComponent,
    ReporteSalidasManualesComponent,
    RegistroCaducidadComponent,
    ReporteCaducidadComponent,
    RegistroCaducidadIngresoComponent,
    /*KARDEX*/
    /*KARDEX*/
    /*KARDEX*/

    /*HOTEL*/
    /*HOTEL*/
    /*HOTEL*/
    AsignacionComponent,
    ExploradorDepartamentosComponent,
    ExploradorPagosComponent,
    FacturaReservaComponent,
    MenuHotelComponent,
    ReservasComponent,
    ServiciosHotelComponent,
    DisponibilidadDepartamentosComponent,
    ServiciosHotelFormComponent,
    /*HOTEL*/
    /*HOTEL*/
    /*HOTEL*/

    /*GASTOSINGRESOS*/
    /*GASTOSINGRESOS*/
    /*GASTOSINGRESOS*/
    CategoriaGastosComponent,
    CategoriaIngresosComponent,
    GastosComponent,
    IngresosComponent,
    MenuGastosIngresosComponent,
    ReporteGastosComponent,
    ReporteIngresosComponent,
    CategoriaGastosFormComponent,
    CategoriaIngresosFormComponent,
    /*GASTOSINGRESOS*/
    /*GASTOSINGRESOS*/
    /*GASTOSINGRESOS*/


    /*CUENTAPC*/
    /*CUENTAPC*/
    /*CUENTAPC*/
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
    /*CUENTAPC*/
    /*CUENTAPC*/
    /*CUENTAPC*/

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      //positionClass: 'toast-top-left',
      preventDuplicates: true
    }),
    NgSelectModule,
    FullCalendarModule,
    NgxPaginationModule,
    NgxChartsModule
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
