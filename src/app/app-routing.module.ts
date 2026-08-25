import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';

import { InicioComponent } from './usuario/components/inicio/inicio.component'

import { MenuAdministrarComponent } from './administrar/components/menu-administrar/menu-administrar.component';
import { RolesComponent } from './administrar/components/roles/roles.component';
import { UsuarioComponent } from './administrar/components/usuario/usuario.component';
import { MenuAlmacenComponent } from './almacen/components/menu-almacen/menu-almacen.component';
import { CategoriaComponent } from './almacen/components/categoria/categoria.component';
import { SubcategoriaComponent } from './almacen/components/subcategoria/subcategoria.component';
import { MarcaComponent } from './almacen/components/marca/marca.component';
import { UnidadMedidaComponent } from './almacen/components/unidad-medida/unidad-medida.component';
import { TipoTarifaComponent } from './almacen/components/tipo-tarifa/tipo-tarifa.component';
import { DenominacionComponent } from './almacen/components/denominacion/denominacion.component';
import { ProductoComponent } from './almacen/components/producto/producto.component';
import { BuscarProductoComponent } from './almacen/components/buscar-producto/buscar-producto.component';
import { CodigoBarraComponent } from './almacen/components/codigo-barra/codigo-barra.component';
import { MovimientoMercaderiaComponent } from './almacen/components/movimiento-mercaderia/movimiento-mercaderia.component';
import { ExploradorMovimientoMercaderiaComponent } from './almacen/components/explorador-movimiento-mercaderia/explorador-movimiento-mercaderia.component';
import { TipoIngresoMercaderiaComponent } from './almacen/components/tipo-ingreso-mercaderia/tipo-ingreso-mercaderia.component';
import { IngresoMercaderiaComponent } from './almacen/components/ingreso-mercaderia/ingreso-mercaderia.component';
import { TipoSalidaMercaderiaComponent } from './almacen/components/tipo-salida-mercaderia/tipo-salida-mercaderia.component';
import { SalidaMercaderiaComponent } from './almacen/components/salida-mercaderia/salida-mercaderia.component';
import { ExploradorIngresoMercaderiaComponent } from './almacen/components/explorador-ingreso-mercaderia/explorador-ingreso-mercaderia.component';
import { ExploradorSalidaMercaderiaComponent } from './almacen/components/explorador-salida-mercaderia/explorador-salida-mercaderia.component';
import { ReporteStockProductoComponent } from './almacen/components/reporte-stock-producto/reporte-stock-producto.component';
import { ReporteIngresoMercaderiaComponent } from './almacen/components/reporte-ingreso-mercaderia/reporte-ingreso-mercaderia.component';
import { ReporteSalidaMercaderiaComponent } from './almacen/components/reporte-salida-mercaderia/reporte-salida-mercaderia.component';
import { MenuGymComponent } from './gym/components/menu-gym/menu-gym.component';
import { SocioComponent } from './gym/components/socio/socio.component';
import { PlanComponent } from './gym/components/plan/plan.component';
import { MembresiaComponent } from './gym/components/membresia/membresia.component';
import { FacturaPlanComponent } from './gym/components/factura-plan/factura-plan.component';
import { ExploradorVentaMembresiaComponent } from './gym/components/explorador-venta-membresia/explorador-venta-membresia.component';
import { ReporteSociosComponent } from './gym/components/reporte-socios/reporte-socios.component';
import { ReporteEstadoMembresiaComponent } from './gym/components/reporte-estado-membresia/reporte-estado-membresia.component';
import { ReportePromocionAlMesComponent } from './gym/components/reporte-promocion-al-mes/reporte-promocion-al-mes.component';
import { MenuVentaComponent } from './venta/components/menu-venta/menu-venta.component';
import { CajeroComponent } from './venta/components/cajero/cajero.component';
import { ExploradorCajeroComponent } from './venta/components/explorador-cajero/explorador-cajero.component';
import { TipoClienteComponent } from './venta/components/tipo-cliente/tipo-cliente.component';
import { ClienteComponent } from './venta/components/cliente/cliente.component';
import { VentaComponent } from './venta/components/venta/venta.component';
import { ExploradorVentaComponent } from './venta/components/explorador-venta/explorador-venta.component';
import { ExploradorPedidosComponent } from './venta/components/explorador-pedidos/explorador-pedidos.component';
import { ExploradorFacturaComponent } from './venta/components/explorador-factura/explorador-factura.component';
import { NotaCreditoComponent } from './venta/components/nota-credito/nota-credito.component';
import { ReporteVentaComponent } from './venta/components/reporte-venta/reporte-venta.component';
import { ReporteVentaDetallesComponent } from './venta/components/reporte-venta-detalles/reporte-venta-detalles.component';
import { ReporteVentaCreditoComponent } from './venta/components/reporte-venta-credito/reporte-venta-credito.component';
import { ReporteVentaPorCategoriaComponent } from './venta/components/reporte-venta-por-categoria/reporte-venta-por-categoria.component';
import { ReporteVentaPorProductoComponent } from './venta/components/reporte-venta-por-producto/reporte-venta-por-producto.component';
import { ReporteRotacionProductoComponent } from './venta/components/reporte-rotacion-producto/reporte-rotacion-producto.component';
import { ReporteClienteComponent } from './venta/components/reporte-cliente/reporte-cliente.component';
import { ExploradorNotaCreditoComponent } from './venta/components/explorador-nota-credito/explorador-nota-credito.component';
import { TransportistaComponent } from './venta/components/transportista/transportista.component';
import { GuiaRemisionComponent } from './venta/components/guia-remision/guia-remision.component';
import { ExploradorGuiaRemisionComponent } from './venta/components/explorador-guia-remision/explorador-guia-remision.component';
import { ReporteNotaCreditoComponent } from './venta/components/reporte-nota-credito/reporte-nota-credito.component';
import { ReporteGuiaRemisionComponent } from './venta/components/reporte-guia-remision/reporte-guia-remision.component';
import { MenuHotelComponent } from './hotel/components/menu-hotel/menu-hotel.component';
import { ServiciosHotelComponent } from './hotel/components/servicios-hotel/servicios-hotel.component';
import { ExploradorDepartamentosComponent } from './hotel/components/explorador-departamentos/explorador-departamentos.component';
import { ReservasComponent } from './hotel/components/reservas/reservas.component';
import { AsignacionComponent } from './hotel/components/asignacion/asignacion.component';
import { ExploradorPagosComponent } from './hotel/components/explorador-pagos/explorador-pagos.component';
import { FacturaReservaComponent } from './hotel/components/factura-reserva/factura-reserva.component';
import { MenuCompraComponent } from './compra/components/menu-compra/menu-compra.component';
import { ProveedorComponent } from './compra/components/proveedor/proveedor.component';
import { ExploradorProveedorComponent } from './compra/components/explorador-proveedor/explorador-proveedor.component';
import { CompraComponent } from './compra/components/compra/compra.component';
import { FijarPreciosProductosComponent } from './compra/components/fijar-precios-productos/fijar-precios-productos.component';
import { ExploradorCompraComponent } from './compra/components/explorador-compra/explorador-compra.component';
import { ReporteProveedorComponent } from './compra/components/reporte-proveedor/reporte-proveedor.component';
import { ReporteCompraComponent } from './compra/components/reporte-compra/reporte-compra.component';
import { ReporteCompraDetallesComponent } from './compra/components/reporte-compra-detalles/reporte-compra-detalles.component';
import { ReporteCompraCreditoComponent } from './compra/components/reporte-compra-credito/reporte-compra-credito.component';
import { NotaCreditoComprasComponent } from './compra/components/nota-credito-compras/nota-credito-compras.component';
import { ExploradorNotaCreditoComprasComponent } from './compra/components/explorador-nota-credito-compras/explorador-nota-credito-compras.component';
import { ReporteNotaCreditoComprasComponent } from './compra/components/reporte-nota-credito-compras/reporte-nota-credito-compras.component';
import { MenuRetencionComponent } from './retencion/components/menu-retencion/menu-retencion.component';
import { CodigoRetencionComponent } from './retencion/components/codigo-retencion/codigo-retencion.component';
import { RetencionComponent } from './retencion/components/retencion/retencion.component';
import { ExploradorRetencionComponent } from './retencion/components/explorador-retencion/explorador-retencion.component';
import { ReporteRetencionComponent } from './retencion/components/reporte-retencion/reporte-retencion.component';
import { MenuCuentaPcComponent } from './cuentapc/components/menu-cuenta-pc/menu-cuenta-pc.component';
import { AbonoVentaComponent } from './cuentapc/components/abono-venta/abono-venta.component';
import { AbonoCompraComponent } from './cuentapc/components/abono-compra/abono-compra.component';
import { ReportePorCobrarComponent } from './cuentapc/components/reporte-por-cobrar/reporte-por-cobrar.component';
import { ReporteCortePorCobrarComponent } from './cuentapc/components/reporte-corte-por-cobrar/reporte-corte-por-cobrar.component';
import { ReportePorPagarComponent } from './cuentapc/components/reporte-por-pagar/reporte-por-pagar.component';
import { ReporteAbonoComprasComponent } from './cuentapc/components/reporte-abono-compras/reporte-abono-compras.component';
import { ReporteAbonoVentasComponent } from './cuentapc/components/reporte-abono-ventas/reporte-abono-ventas.component';
import { MenuGastosIngresosComponent } from './gastosingresos/components/menu-gastos-ingresos/menu-gastos-ingresos.component';
import { CategoriaIngresosComponent } from './gastosingresos/components/categoria-ingresos/categoria-ingresos.component';
import { IngresosComponent } from './gastosingresos/components/ingresos/ingresos.component';
import { ReporteIngresosComponent } from './gastosingresos/components/reporte-ingresos/reporte-ingresos.component';
import { CategoriaGastosComponent } from './gastosingresos/components/categoria-gastos/categoria-gastos.component';
import { GastosComponent } from './gastosingresos/components/gastos/gastos.component';
import { ReporteGastosComponent } from './gastosingresos/components/reporte-gastos/reporte-gastos.component';
import { KardexComponent } from './kardex/components/kardex/kardex.component';
import { ReporteCostoProductoComponent } from './kardex/components/reporte-costo-producto/reporte-costo-producto.component';
import { ReporteMargenGananciaComponent } from './kardex/components/reporte-margen-ganancia/reporte-margen-ganancia.component';
import { ReporteIngresosManualesComponent } from './kardex/components/reporte-ingresos-manuales/reporte-ingresos-manuales.component';
import { ReporteSalidasManualesComponent } from './kardex/components/reporte-salidas-manuales/reporte-salidas-manuales.component';
import { PerfilComponent } from './usuario/components/perfil/perfil.component';
import { RegistroCaducidadComponent } from './kardex/components/registro-caducidad/registro-caducidad.component';
import { ReporteCaducidadComponent } from './kardex/components/reporte-caducidad/reporte-caducidad.component';
import { RegistroCaducidadIngresoComponent } from './kardex/components/registro-caducidad-ingreso/registro-caducidad-ingreso.component';
import { ReporteControlVentaComponent } from './venta/components/reporte-control-venta/reporte-control-venta.component';
import { CreditoComponent } from './cuentapc/components/credito/credito.component';
import { PedidoComponent } from './venta/components/pedido/pedido.component';
import { VerificacionMovimientoMercaderiaComponent } from './almacen/components/verificacion-movimiento-mercaderia/verificacion-movimiento-mercaderia.component';
import { MovimientoMercaderiaVerificarComponent } from './almacen/components/movimiento-mercaderia-verificar/movimiento-mercaderia-verificar.component';
import { ExploradorVentaRecaudacionComponent } from './venta/components/explorador-venta-recaudacion/explorador-venta-recaudacion.component';
import { PreVentaComponent } from './venta/components/pre-venta/pre-venta.component';
import { AprobarPreVentaComponent } from './venta/components/aprobar-pre-venta/aprobar-pre-venta.component';
import { VentaDescuentoComponent } from './venta/components/venta-descuento/venta-descuento.component';
import { PagoNotaCreditoComponent } from './venta/components/pago-nota-credito/pago-nota-credito.component';
import { ReporteSaldoNotaCreditoComponent } from './venta/components/reporte-saldo-nota-credito/reporte-saldo-nota-credito.component';
import { ReporteFormaPagoVencimientoComponent } from './cuentapc/components/reporte-forma-pago-vencimiento/reporte-forma-pago-vencimiento.component';
import { ResumenVentasComponent } from './venta/components/resumen-ventas/resumen-ventas.component';
import { ReporteVentaFormaPagoComponent } from './venta/components/reporte-venta-forma-pago/reporte-venta-forma-pago.component';
import { ReporteCuentasPagarConsolidadoComponent } from './cuentapc/components/reporte-cuentas-pagar-consolidado/reporte-cuentas-pagar-consolidado.component';
import { ReporteMovimientoMercaderiaComponent } from './almacen/components/reporte-movimiento-mercaderia/reporte-movimiento-mercaderia.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ReporteConsolidadoSaldoPendienteNotaCreditoComponent } from './venta/components/reporte-consolidado-saldo-pendiente-nota-credito/reporte-consolidado-saldo-pendiente-nota-credito.component';
import { ReporteCuentasCobrarConsolidadoComponent } from './cuentapc/components/reporte-cuentas-cobrar-consolidado/reporte-cuentas-cobrar-consolidado.component';
import { AccesoDenegadoComponent } from './shared/components/acceso-denegado/acceso-denegado.component';
import { ReportePagoNotaCreditoComponent } from './venta/components/reporte-pago-nota-credito/reporte-pago-nota-credito.component';
import { VisualizarListadoVentaClienteComponent } from './shared/components/venta/visualizar-listado-venta-cliente/visualizar-listado-venta-cliente.component';
import { VisualizarListadoPedidoClienteComponent } from './shared/components/venta/visualizar-listado-pedido-cliente/visualizar-listado-pedido-cliente.component';
import { MonitorComponent } from './gym/components/monitor/monitor.component';
import { MonitorCompartidoComponent } from './gym/components/monitor/monitor-compartido/monitor-compartido.component';
import { MonitorSecundarioComponent } from './gym/components/monitor-secundario/monitor-secundario.component';
import { ReporteVentaConsolidadoVendedorComponent } from './venta/components/reporte-venta-consolidado-vendedor/reporte-venta-consolidado-vendedor.component';
import { ProduccionComponent } from './almacen/components/produccion/produccion.component';
import { ExploradorProduccionComponent } from './almacen/components/explorador-produccion/explorador-produccion.component';
import { SucursalComponent } from './administrar/components/sucursal/sucursal.component';
import { RucComponent } from './administrar/components/ruc/ruc.component';
import { SucursalFormComponent } from './administrar/components/sucursal/sucursal-form/sucursal-form.component';
import { RucFormComponent } from './administrar/components/ruc/ruc-form/ruc-form.component';
import { ReporteNotaCreditoDetallesComponent } from './venta/components/reporte-nota-credito-detalles/reporte-nota-credito-detalles.component';
import { ReporteVentasSociosComponent } from './gym/components/reporte-ventas-socios/reporte-ventas-socios.component';
import { ReporteSalidaMercaderiaValoradasComponent } from './almacen/components/reporte-salida-mercaderia-valoradas/reporte-salida-mercaderia-valoradas.component';
import { ActividadComponent } from './gym/components/actividad/actividad.component';
import { ActividadHorarioComponent } from './gym/components/actividad-horario/actividad-horario.component';
import { ActividadReservaComponent } from './gym/components/actividad-reserva/actividad-reserva.component';
import { HorarioReservaActividadComponent } from './gym/components/horario-reserva-actividad/horario-reserva-actividad.component';
import { CuponComponent } from './gym/components/cupon/cupon.component';
import { ConfiguracionImpresionComponent } from './administrar/components/configuracion-impresion/configuracion-impresion.component';
import { EliminacionProductoComponent } from './almacen/components/eliminacion-producto/eliminacion-producto.component';
import { ReporteAsistenciaComponent } from './gym/components/reporte-asistencia/reporte-asistencia.component';


const routes: Routes = 
[
  {
    path: 'inicio',
    component: InicioComponent
  },
  {
    path: 'accesodenegado',
    component: AccesoDenegadoComponent
  },
  {
    path: 'menuadministrar',
    component: MenuAdministrarComponent
  },
  {
    path: 'menuadministrar/roles',
    component: RolesComponent,
    canActivate: [AuthGuard],
    data: { menu: 'roles' }
  },
  {
    path: 'menuadministrar/usuario',
    component: UsuarioComponent,
    canActivate: [AuthGuard],
    data: { menu: 'usuarios' }
  },
  {
    path: 'menuadministrar/sucursal',
    component: SucursalComponent,
    data: { menu: 'sucursal' }
  },
  {
    path: 'menuadministrar/ruc',
    component: RucComponent,
    data: { menu: 'sucursal' }
  },
  {
    path: 'menuadministrar/rucform/:tipo_formulario',
    component: RucFormComponent,
    data: { menu: 'rucform' }
  },
  {
    path: 'menuadministrar/rucform/:tipo_formulario/:cod_ruc',
    component: RucFormComponent,
    data: { menu: 'rucform' }
  },
  {
    path: 'menuadministrar/configuracionimpresion',
    component: ConfiguracionImpresionComponent,
    data: { menu: 'configuracionimpresion' }
  },





  {
    path: 'menualmacen',
    component: MenuAlmacenComponent
  },

  {
    path: 'menualmacen/categoria',
    component: CategoriaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'categorias' }
  },
  {
    path: 'menualmacen/subcategoria',
    component: SubcategoriaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'subcategorias' }
  },
  {
    path: 'menualmacen/marca',
    component: MarcaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'marcas' }
  },
  {
    path: 'menualmacen/unidadmedida',
    component: UnidadMedidaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'unidadesmedida' }
  },
  {
    path: 'menualmacen/tipotarifa',
    component: TipoTarifaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'tipotarifa' }
  },
  {
    path: 'menualmacen/denominacion',
    component: DenominacionComponent,
    canActivate: [AuthGuard],
    data: { menu: 'denominacion' }
  },
  {
    path: 'menualmacen/producto',
    component: ProductoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'productos' }
  },
  {
    path: 'menualmacen/buscarproducto',
    component: BuscarProductoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'buscarproducto' }
  },
  {
    path: 'menualmacen/codigobarra',
    component: CodigoBarraComponent,
    canActivate: [AuthGuard],
    data: { menu: 'codigobarra' }
  },
  {
    path: 'menualmacen/movimientomercaderia/:tipo_formulario',
    component: MovimientoMercaderiaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'movimientomercaderia' }
  },
  {
    path: 'menualmacen/movimientomercaderia/:tipo_formulario/:cod_movimiento_mercaderia',
    component: MovimientoMercaderiaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'movimientomercaderia' }
  },
  {
    path: 'menualmacen/exploradormovimientomercaderia',
    component: ExploradorMovimientoMercaderiaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'exploradormovimientomercaderia' }
  },
  {
    path: 'menualmacen/verificacionmovimientomercaderia',
    component: VerificacionMovimientoMercaderiaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'verificacionmovimientomercaderia' }
  },
  {
    path: 'menualmacen/verificarmercaderia/:cod_movimiento_mercaderia',
    component: MovimientoMercaderiaVerificarComponent,
    canActivate: [AuthGuard],
    data: { menu: 'verificarmercaderia' }
  },
  {
    path: 'menualmacen/tipoingresomercaderia',
    component: TipoIngresoMercaderiaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'tipoingresomercaderia' }
  },
  {
    path: 'menualmacen/ingresomercaderia/:tipo_formulario',
    component: IngresoMercaderiaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'ingresomercaderia' }
  },
  {
    path: 'menualmacen/ingresomercaderia/:tipo_formulario/:cod_ingreso_mercaderia',
    component: IngresoMercaderiaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'ingresomercaderia' }
  },
  {
    path: 'menualmacen/tiposalidamercaderia',
    component: TipoSalidaMercaderiaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'tiposalidamercaderia' }
  },
  {
    path: 'menualmacen/salidamercaderia/:tipo_formulario',
    component: SalidaMercaderiaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'salidamercaderia' }
  },
  {
    path: 'menualmacen/salidamercaderia/:tipo_formulario/:cod_salida_mercaderia',
    component: SalidaMercaderiaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'salidamercaderia' }
  },
  {
    path: 'menualmacen/exploradoringresomercaderia',
    component: ExploradorIngresoMercaderiaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'exploradoringresomercaderia' }
  },
  {
    path: 'menualmacen/exploradorsalidamercaderia',
    component: ExploradorSalidaMercaderiaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'exploradorsalidamercaderia' }
  },
  {
    path: 'menualmacen/reportestockproducto',
    component: ReporteStockProductoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportestockproducto' }
  },
  {
    path: 'menualmacen/reporteingresomercaderia',
    component: ReporteIngresoMercaderiaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteingresomercaderia' }
  },
  {
    path: 'menualmacen/reportesalidamercaderia',
    component: ReporteSalidaMercaderiaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportesalidamercaderia' }
  },
  {
    path: 'menualmacen/reportemovimientomercaderia',
    component: ReporteMovimientoMercaderiaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportemovimientomercaderia' }
  },
  {
    path: 'menualmacen/registrokardex',
    component: KardexComponent,
    canActivate: [AuthGuard],
    data: { menu: 'registrokardex' }
  },
  {
    path: 'menualmacen/reportecostoproducto',
    component: ReporteCostoProductoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportecostoproducto' }
  },
  {
    path: 'menualmacen/reportemargenganancia',
    component: ReporteMargenGananciaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportemargenganancia' }
  },
  {
    path: 'menualmacen/reporteingresosmanuales',
    component: ReporteIngresosManualesComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteingresosmanuales' }
  },
  {
    path: 'menualmacen/reportesalidasmanuales',
    component: ReporteSalidasManualesComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportesalidasmanuales' }
  },
  {
    path: 'menualmacen/registrocaducidad/:cod_factura_compra',
    component: RegistroCaducidadComponent,
    canActivate: [AuthGuard],
    data: { menu: 'registrocaducidad' }
  },
  {
    path: 'menualmacen/registrocaducidadingreso/:cod_ingreso_mercaderia',
    component: RegistroCaducidadIngresoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'registrocaducidadingreso' }
  },
  {
    path: 'menualmacen/reportecaducidad',
    component: ReporteCaducidadComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportecaducidad' }
  },
  {
    path: 'menualmacen/produccion/:tipo_formulario',
    component: ProduccionComponent,
    canActivate: [AuthGuard],
    data: { menu: 'produccion' }
  },
  {
    path: 'menualmacen/produccion/:tipo_formulario/:cod_formula',
    component: ProduccionComponent,
    canActivate: [AuthGuard],
    data: { menu: 'produccion' }
  },
  {
    path: 'menualmacen/exploradorproduccion',
    component: ExploradorProduccionComponent,
    canActivate: [AuthGuard],
    data: { menu: 'exploradorproduccion' }
  },
  {
    path: 'menualmacen/reportesalidamercaderiavaloradas',
    component: ReporteSalidaMercaderiaValoradasComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportesalidamercaderiavaloradas' }
  },
  {
    path: 'menualmacen/eliminacionproducto',
    component: EliminacionProductoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'eliminacionproducto' }
  },
  



  {
    path: 'menugym',
    component: MenuGymComponent
  },
  {
    path: 'menugym/socios',
    component: SocioComponent,
    canActivate: [AuthGuard],
    data: { menu: 'socios' }
  },
  {
    path: 'menugym/planes',
    component: PlanComponent,
    canActivate: [AuthGuard],
    data: { menu: 'planes' }
  },
  {
    path: 'menugym/membresias',
    component: MembresiaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'membresias' }
  },
  {
    path: 'menugym/facturaplan/:tipo_formulario/:cod_cliente/:cod_factura_venta/:cod_tipo_plan',
    component: FacturaPlanComponent,
    canActivate: [AuthGuard],
    data: { menu: 'membresias' }
  },
  {
    path: 'menugym/facturaplan/:tipo_formulario/:cod_cliente',
    component: FacturaPlanComponent,
    canActivate: [AuthGuard],
    data: { menu: 'membresias' }
  },
  {
    path: 'menugym/exploradorventamembresias',
    component: ExploradorVentaMembresiaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'exploradorventamembresias' }
  },
  {
    path: 'menugym/reportesocios',
    component: ReporteSociosComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportesocios' }
  },
  {
    path: 'menugym/reporteestadomembresia',
    component: ReporteEstadoMembresiaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteestadomembresia' }
  },
  {
    path: 'menugym/reportepromocionalmes',
    component: ReportePromocionAlMesComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportepromocionalmes' }
  },
  {
    path: 'menugym/monitor',
    component: MonitorComponent,
    //canActivate: [AuthGuard],
    //data: { menu: 'reportepromocionalmes' }
  },
  {
    path: 'menugym/monitorcompartido',
    component: MonitorCompartidoComponent,
    //canActivate: [AuthGuard],
    //data: { menu: 'reportepromocionalmes' }
  },
  {
    path: 'menugym/monitorsecundario',
    component: MonitorSecundarioComponent,
    //canActivate: [AuthGuard],
    //data: { menu: 'reportepromocionalmes' }
  },
  {
    path: 'menugym/reporteventassocios',
    component: ReporteVentasSociosComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteventassocios' }
  },
  {
    path: 'menugym/actividad',
    component: ActividadComponent,
    canActivate: [AuthGuard],
    data: { menu: 'actividad' }
  },
  {
    path: 'menugym/actividadhorario/:cod_actividad/:actividad',
    component: ActividadHorarioComponent,
    canActivate: [AuthGuard],
    data: { menu: 'actividadhorario' }
  },
  {
    path: 'menugym/actividadreserva/:cod_cliente/:cliente/:cod_actividad/:actividad/:id_membresia/:fecha_inicio/:fecha_fin',
    component: ActividadReservaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'actividadreserva' }
  },
  {
    path: 'menugym/horarioreservaactividad/:cod_actividad/:actividad',
    component: HorarioReservaActividadComponent
  },
  {
    path: 'menugym/cupon',
    component: CuponComponent,
    canActivate: [AuthGuard],
    data: { menu: 'cupon' }
  },
  {
    path: 'menugym/reporteasistencia',
    component: ReporteAsistenciaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteasistencia' }
  },




  {
    path: 'menuventa',
    component: MenuVentaComponent
  },
  {
    path: 'menuventa/cajero',
    component: CajeroComponent,
    canActivate: [AuthGuard],
    data: { menu: 'cajero' }
  },
  {
    path: 'menuventa/exploradorcajero',
    component: ExploradorCajeroComponent,
    canActivate: [AuthGuard],
    data: { menu: 'exploradorcajero' }
  },
  {
    path: 'menuventa/tipocliente',
    component: TipoClienteComponent,
    canActivate: [AuthGuard],
    data: { menu: 'tipocliente' }
  },
  {
    path: 'menuventa/cliente',
    component: ClienteComponent,
    canActivate: [AuthGuard],
    data: { menu: 'cliente' }
  },
  {
    path: 'menuventa/venta/:tipo_formulario',
    component: VentaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'facturaventa' }
  },
  {
    path: 'menuventa/ventadescuento/:tipo_formulario/:cod_factura_venta',
    component: VentaDescuentoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'ventadescuento' }
  },
  {
    path: 'menuventa/preventa/:tipo_formulario',
    component: PreVentaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'preventa' }
  },
  {
    path: 'menuventa/aprobarpreventa/:tipo_formulario/:cod_factura_venta',
    component: AprobarPreVentaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'recaudacion' }
  },
  {
     path: 'menuventa/pedido/:tipo_formulario',
     component: PedidoComponent,
     canActivate: [AuthGuard],
    data: { menu: 'pedidos' }
  },
  {
    path: 'menuventa/pedido/:tipo_formulario/:cod_factura_venta',
    component: PedidoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'pedidos' }
  },
  {
    path: 'menuventa/venta/:tipo_formulario/:cod_factura_venta',
    component: VentaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'facturaventa' }
  },
  {
    path: 'menuventa/exploradorventarecaudacion',
    component: ExploradorVentaRecaudacionComponent,
    canActivate: [AuthGuard],
    data: { menu: 'recaudacion' }
  },
  {
    path: 'menuventa/exploradorventa',
    component: ExploradorVentaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'exploradorventa' }
  },
  {
    path: 'menuventa/exploradorpedidos',
    component: ExploradorPedidosComponent,
    canActivate: [AuthGuard],
    data: { menu: 'exploradorpedidos' }
  },
  {
    path: 'menuventa/exploradorfactura',
    component: ExploradorFacturaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'exploradorfactura' }
  },
  {
    path: 'menuventa/notacredito/:tipo_formulario/:cod_factura_venta',
    component: NotaCreditoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'notacredito' }
  },
  {
    path: 'menuventa/notacredito/:tipo_formulario/:cod_nota_credito/:cod_factura_venta',
    component: NotaCreditoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'notacredito' }
  },
  {
    path: 'menuventa/reporteventa',
    component: ReporteVentaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteventas' }
  },
  {
    path: 'menuventa/reporteventaformapago',
    component: ReporteVentaFormaPagoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteventaformapago' }
  },
  {
    path: 'menuventa/reporteventadetalles',
    component: ReporteVentaDetallesComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteventasdetalles' }
  },
  {
    path: 'menuventa/reporteventascredito',
    component: ReporteVentaCreditoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteventascredito' }
  },
  {
    path: 'menuventa/reporteventaporcategoria',
    component: ReporteVentaPorCategoriaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteventascategorias' }
  },
  {
    path: 'menuventa/reporteventaporproducto',
    component: ReporteVentaPorProductoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteventasproductos' }
  },
  {
    path: 'menuventa/reporterotacionproducto',
    component: ReporteRotacionProductoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporterotacionproductos' }
  },
  {
    path: 'menuventa/reportecliente',
    component: ReporteClienteComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteclientes' }
  },
  {
    path: 'menuventa/exploradornotacredito',
    component: ExploradorNotaCreditoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'exploradornotacredito' }
  },
  {
    path: 'menuventa/pagonotacredito',
    component: PagoNotaCreditoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'pagonotacredito' }
  },
  {
    path: 'menuventa/transportista',
    component: TransportistaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'transportista' }
  },
  {
    path: 'menuventa/guiaremision/:tipo_formulario/:cod_factura_venta/:cod_guia_remision',
    component: GuiaRemisionComponent,
    canActivate: [AuthGuard],
    data: { menu: 'guiaremision' }
  },
  {
    path: 'menuventa/exploradorguiaremision',
    component: ExploradorGuiaRemisionComponent,
    canActivate: [AuthGuard],
    data: { menu: 'exploradorguiaremision' }
  },
  {
    path: 'menuventa/reportenotacredito',
    component: ReporteNotaCreditoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportenotacredito' }
  },
  {
    path: 'menuventa/reporteguiaremision',
    component: ReporteGuiaRemisionComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteguiaremision' }
  },
  {
    path: 'menuventa/reportecontrolventa',
    component: ReporteControlVentaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportecontrolventa' }
  },
  {
    path: 'menuventa/reportesaldonotacredito',
    component: ReporteSaldoNotaCreditoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportesaldonotacredito' }
  },
  {
    path: 'menuventa/resumenventas',
    component: ResumenVentasComponent,
    canActivate: [AuthGuard],
    data: { menu: 'resumenventas' }
  },
  {
    path: 'menuventa/reporteconsolidadosaldopendientenotacredito',
    component: ReporteConsolidadoSaldoPendienteNotaCreditoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteconsolidadosaldopendientenotacredito' }
  },
  {
    path: 'menuventa/reportepagonotacredito',
    component: ReportePagoNotaCreditoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportepagonotacredito' }
  },
  {
    path: 'menuventa/reporteventaconsolidadovendedor',
    component: ReporteVentaConsolidadoVendedorComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteventaconsolidadovendedor' }
  },
  {
    path: 'menuventa/visualizarlistadoventacliente',
    component: VisualizarListadoVentaClienteComponent,
    canActivate: [AuthGuard],
    data: { menu: 'visualizarlistadoventacliente' }
  },
  {
    path: 'menuventa/visualizarlistadopedidocliente',
    component: VisualizarListadoPedidoClienteComponent,
    canActivate: [AuthGuard],
    data: { menu: 'visualizarlistadopedidocliente' }
  },
  {
    path: 'menuventa/reportenotacreditodetalles',
    component: ReporteNotaCreditoDetallesComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportenotacreditodetalles' }
  },



  {
    path: 'menuhotel',
    component: MenuHotelComponent
  },
  {
    path: 'menuhotel/servicioshotel',
    component: ServiciosHotelComponent,
    canActivate: [AuthGuard],
    data: { menu: 'servicioshotel' }
  },
  {
    path: 'menuhotel/exploradordepartamentos',
    component: ExploradorDepartamentosComponent,
    canActivate: [AuthGuard],
    data: { menu: 'exploradorhabitacion' }
  },
  {
    path: 'menuhotel/reservas/:crud/:cod_producto/:cod_reserva',
    component: ReservasComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reservas' }
  },
  {
    path: 'menuhotel/asignacion/:crud/:cod_producto/:cod_reserva',
    component: AsignacionComponent,
    canActivate: [AuthGuard],
    data: { menu: 'asignacion' }
  },
  {
    path: 'menuhotel/exploradorpagos/:cod_reserva/:cod_cliente/:codigo/:descripcion',
    component: ExploradorPagosComponent,
    canActivate: [AuthGuard],
    data: { menu: 'exploradorpagos' }
  },
  {
    path: 'menuhotel/facturareserva/:tipo_formulario/:cod_reserva/:cod_cliente/:codigo',
    component: FacturaReservaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'facturareserva' }
  },
  {
    path: 'menuhotel/facturareserva/:tipo_formulario/:cod_factura_venta/:cod_reserva',
    component: FacturaReservaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'facturareserva' }
  },




  {
    path: 'menucompra',
    component: MenuCompraComponent
  },
  {
    path: 'menucompra/proveedor',
    component: ProveedorComponent,
    canActivate: [AuthGuard],
    data: { menu: 'proveedores' }
  },
  {
    path: 'menucompra/exploradorproveedor',
    component: ExploradorProveedorComponent,
    canActivate: [AuthGuard],
    data: { menu: 'exploradorproveedores' }
  },
  {
    path: 'menucompra/compra/:tipo_formulario',
    component: CompraComponent,
    canActivate: [AuthGuard],
    data: { menu: 'facturacompra' }
  },
  {
    path: 'menucompra/compra/:tipo_formulario/:cod_factura_compra',
    component: CompraComponent,
    canActivate: [AuthGuard],
    data: { menu: 'facturacompra' }
  },
  {
    path: 'menucompra/fijarpreciosproductos/:cod_factura_compra',
    component: FijarPreciosProductosComponent,
    canActivate: [AuthGuard],
    data: { menu: 'fijarpreciosproductos' }
  },
  {
    path: 'menucompra/exploradorcompra',
    component: ExploradorCompraComponent,
    canActivate: [AuthGuard],
    data: { menu: 'exploradorcompra' }
  },
  {
    path: 'menucompra/reporteproveedor',
    component: ReporteProveedorComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteproveedores' }
  },
  {
    path: 'menucompra/reportecompras',
    component: ReporteCompraComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportecompra' }
  },
  {
    path: 'menucompra/reportecompradetalle',
    component: ReporteCompraDetallesComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportecompradetalle' }
  },
  {
    path: 'menucompra/reportecompracredito',
    component: ReporteCompraCreditoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportecomprascredito' }
  },
  {
    path: 'menucompra/notacreditocompras/:tipo_formulario/:cod_factura_compra',
    component: NotaCreditoComprasComponent,
    canActivate: [AuthGuard],
    data: { menu: 'notacreditocompras' }
  },
  {
    path: 'menucompra/notacreditocompras/:tipo_formulario/:cod_nota_credito_c/:cod_factura_compra',
    component: NotaCreditoComprasComponent,
    canActivate: [AuthGuard],
    data: { menu: 'notacreditocompras' }
  },
  {
    path: 'menucompra/exploradornotacreditocompras',
    component: ExploradorNotaCreditoComprasComponent,
    canActivate: [AuthGuard],
    data: { menu: 'exploradornotacreditocompras' }
  },
  {
    path: 'menucompra/reportenotacreditocompras',
    component: ReporteNotaCreditoComprasComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportenotacreditocompras' }
  },




  {
    path: 'menuretencion',
    component: MenuRetencionComponent
  },
  {
    path: 'menuretencion/codigoretencion',
    component: CodigoRetencionComponent,
    canActivate: [AuthGuard],
    data: { menu: 'codigoretencion' }
  },
  {
    path: 'menuretencion/retencion/:tipo_formulario',
    component: RetencionComponent,
    canActivate: [AuthGuard],
    data: { menu: 'retencion' }
  },
  {
    path: 'menuretencion/retencion/:tipo_formulario/:cod_retencion/:cod_factura_compra',
    component: RetencionComponent,
    canActivate: [AuthGuard],
    data: { menu: 'retencion' }
  },
  {
    path: 'menuretencion/exploradorretencion',
    component: ExploradorRetencionComponent,
    canActivate: [AuthGuard],
    data: { menu: 'exploradorretencion' }
  },
  {
    path: 'menuretencion/reporteretencion',
    component: ReporteRetencionComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteretencion' }
  },




  {
    path: 'menucuentapc',
    component: MenuCuentaPcComponent
  },
  {
    path: 'menucuentapc/credito',
    component: CreditoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'credito' }
  },
  {
    path: 'menucuentapc/abonoventa',
    component: AbonoVentaComponent,
    canActivate: [AuthGuard],
    data: { menu: 'abonoventa' }
  },
  {
    path: 'menucuentapc/abonocompra',
    component: AbonoCompraComponent,
    canActivate: [AuthGuard],
    data: { menu: 'abonocompra' }
  },
  {
    path: 'menucuentapc/reporteporcobrar',
    component: ReportePorCobrarComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteventaporcobrar' }
  },
  {
    path: 'menucuentapc/reportecorteporcobrar',
    component: ReporteCortePorCobrarComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportecorteporcobrar' }
  },
  {
    path: 'menucuentapc/reporteporpagar',
    component: ReportePorPagarComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportecompraporpagar' }
  },
  {
    path: 'menucuentapc/reporteabonocompra',
    component: ReporteAbonoComprasComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteabonocompra' }
  },
  {
    path: 'menucuentapc/reporteabonoventa',
    component: ReporteAbonoVentasComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteabonoventa' }
  },
  {
    path: 'menucuentapc/reporteformapagovencimiento',
    component: ReporteFormaPagoVencimientoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteformapagovencimiento' }
  },
  {
    path: 'menucuentapc/reportecuentaspagarconsolidado',
    component: ReporteCuentasPagarConsolidadoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportecuentaspagarconsolidado' }
  },
  {
    path: 'menucuentapc/reportecuentascobrarconsolidado',
    component: ReporteCuentasCobrarConsolidadoComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportecuentascobrarconsolidado' }
  },


  
  {
    path: 'menugastosingresos',
    component:MenuGastosIngresosComponent
  },
  {
    path: 'menugastosingresos/categoriaingresos',
    component: CategoriaIngresosComponent,
    canActivate: [AuthGuard],
    data: { menu: 'categoriaingresos' }
  },
  {
    path: 'menugastosingresos/ingresos',
    component: IngresosComponent,
    canActivate: [AuthGuard],
    data: { menu: 'ingresos' }
  },
  {
    path: 'menugastosingresos/reporteingresos',
    component: ReporteIngresosComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reporteingresos' }
  },
  {
    path: 'menugastosingresos/categoriagastos',
    component: CategoriaGastosComponent,
    canActivate: [AuthGuard],
    data: { menu: 'categoriagastos' }
  },
  {
    path: 'menugastosingresos/gastos',
    component: GastosComponent,
    canActivate: [AuthGuard],
    data: { menu: 'gastos' }
  },
  {
    path: 'menugastosingresos/reportegastos',
    component:ReporteGastosComponent,
    canActivate: [AuthGuard],
    data: { menu: 'reportegastos' }
  },



  {
    path: 'perfil',
    component: PerfilComponent
  },
  


  {

    path: '**',

    redirectTo: 'inicio'

  }
];

const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled'
};

@NgModule({
  //imports: [RouterModule.forRoot(routes)],
  imports: [RouterModule.forRoot(routes,  { 
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 64]
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
