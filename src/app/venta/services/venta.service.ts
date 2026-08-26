import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/ventas/facturaventa/";
  }

  private get apisri() {
    return this.configService.settings.baseUrlSri + "/api/factura/";
  }

  private get apiReportes() {
    return this.configService.settings.baseUrl + "/reportes/ventas/";
  }

  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }

  actualizarFechaClaveAcceso(parametros: any){
    return this.http.post(this.api + "actualizarfechaclaveacceso", parametros);
  }

  actualizarFechaClaveAccesoActual(parametros: any){
    return this.http.post(this.api + "actualizarfechaclaveaccesoactual", parametros);
  }

  aprobarRecaudacionVenta(parametros: any){
    return this.http.post(this.api + "aprobarrecaudacionventa", parametros);
  }

  actualizar(parametros: any){
    return this.http.post(this.api + "actualizar", parametros);
  }
  
  verificarRegistro()
  {
    return this.http.get(this.api + "verificarregistro");
  }

  buscarFactura(cod_factura_venta: string)
  {
    return this.http.get(this.api + "buscarfactura?cod_factura_venta=" + cod_factura_venta);
  }

  claveAccesoActualizar(n_factura_venta: string, serieestab: string, ptoemi: string, fecha: string, ruc: string, tipo_ambiente: string)
  {
    return this.http.get(this.api + "claveaccesoactualizar?n_factura_venta=" + n_factura_venta + "&serieestab=" + serieestab + "&ptoemi=" + ptoemi + "&fecha=" + fecha + "&ruc=" + ruc + "&tipoambiente=" + tipo_ambiente);
  }

  buscarNumeroFactura(numero_factura: string)
  {
    return this.http.get(this.api + "buscarnumerofactura?numero_factura=" + numero_factura);
  }

  listarFacturas(fechadesde: string, fechahasta: string, opcion : string, cod_sucursal : string, estado_comprobante : string, cod_tipo_venta: string, solo_usuario: string, cod_ruc: string, id_forma_pago: string){
    return this.http.get(this.api + "listarfacturas?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&opcion=" + opcion + "&cod_sucursal=" + cod_sucursal + "&estado_comprobante=" + estado_comprobante + "&cod_tipo_venta=" + cod_tipo_venta + "&solo_usuario=" + solo_usuario + "&cod_ruc=" + cod_ruc + "&id_forma_pago=" + id_forma_pago);
  }

  anularFacturaVenta(parametros: any)
  {
    return this.http.post(this.api + "anularfacturaventa", parametros);
  }

  anularPedidoVenta(parametros: any)
  {
    return this.http.post(this.api + "anularpedidoventa", parametros);
  }

  buscarFormasPagoVenta(cod_factura_venta: string)
  {
    return this.http.get(this.api + "buscarformaspagoventa?cod_factura_venta=" + cod_factura_venta);
  }

  crearFirmarXml(parametros: any)
  {
    return this.http.post(this.apisri + "crearfirmarxml", parametros);
  }

  enviarSri(parametros: any)
  {
    return this.http.post(this.apisri + "enviarsri", parametros);
  }

  comprobarSri(parametros: any)
  {
    return this.http.post(this.apisri + "comprobarsri", parametros);
  }

  comprobarSriRapido(parametros: any)
  {
    return this.http.post(this.apisri + "comprobarsrirapido", parametros);
  }

  actualizarEstado(parametros: any)
  {
    return this.http.post(this.api + "actualizarestado", parametros);
  }

  actualizarEstadoError(parametros: any)
  {
    return this.http.post(this.api + "actualizarestadoerror", parametros);
  }

  crearRide(parametros: any)
  {
    return this.http.post(this.apisri + "crearride", parametros);
  }

  enviarCorreoFactura(parametros: any)
  {
    return this.http.post(this.apisri + "enviarcorreofactura", parametros);
  }

  actualizarEstadoCorreo(parametros: any)
  {
    return this.http.post(this.api + "actualizarestadocorreo", parametros);
  }

  verificarComprobanteSri(parametros: any)
  {
    return this.http.post(this.apisri + "verificarcomprobantesri", parametros);
  }

  //Iniciar enlaces de reportes
  listarVentas(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_venta : string, tipo_deuda : string, cod_cliente : string, cod_identificacion: string, cod_empleado : string, cod_ruc: any, cod_tipo_fecha: string, cod_estado_recaudacion: string)
  {
    return this.http.get(this.api + "listarventas?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&tipo_deuda=" + tipo_deuda + "&cod_cliente=" + cod_cliente + "&cod_identificacion=" + cod_identificacion + "&cod_empleado=" + cod_empleado + "&cod_ruc=" + cod_ruc + "&cod_tipo_fecha=" + cod_tipo_fecha + "&cod_estado_recaudacion=" + cod_estado_recaudacion);
  }

  listarVentasFormaPago(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_venta : string, tipo_deuda : string, cod_cliente : string, cod_identificacion: string, cod_empleado : string, id_forma_pago: string, cod_ruc: string, cod_tipo_fecha: string, cod_estado_recaudacion: string)
  {
    return this.http.get(this.api + "listarventasformapago?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&tipo_deuda=" + tipo_deuda + "&cod_cliente=" + cod_cliente + "&cod_identificacion=" + cod_identificacion + "&cod_empleado=" + cod_empleado + "&id_forma_pago=" + id_forma_pago + "&cod_ruc=" + cod_ruc + "&cod_tipo_fecha=" + cod_tipo_fecha + "&cod_estado_recaudacion=" + cod_estado_recaudacion);
  }
  
  listarVentasDetalles(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_venta : string, tipo_deuda : string, cod_cliente : string,cod_ruc: string, cod_tipo_fecha: string)
  {
    return this.http.get(this.api + "listarventasdetalles?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&tipo_deuda=" + tipo_deuda + "&cod_cliente=" + cod_cliente + "&cod_ruc=" + cod_ruc + "&cod_tipo_fecha=" + cod_tipo_fecha);
  }

  listarVentasCategorias(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_venta : string, tipo_deuda : string, cod_cliente : string, cod_categoria : string, cod_subcategoria : string, cod_ruc: string)
  {
    return this.http.get(this.api + "listarventascategorias?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&tipo_deuda=" + tipo_deuda + "&cod_cliente=" + cod_cliente + "&cod_categoria=" + cod_categoria + "&cod_subcategoria=" + cod_subcategoria + "&cod_ruc=" + cod_ruc);
  }

  listarVentasProductos(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_venta : string, tipo_deuda : string, cod_cliente : string, cod_ruc: string)
  {
    return this.http.get(this.api + "listarventasproductos?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&tipo_deuda=" + tipo_deuda + "&cod_cliente=" + cod_cliente + "&cod_ruc=" + cod_ruc);
  }

  listarProductosRotacion(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_categoria : string, cod_subcategoria : string, cod_ruc: string)
  {
    return this.http.get(this.api + "listarproductosrotacion?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_categoria=" + cod_categoria + "&cod_subcategoria=" + cod_subcategoria + "&cod_ruc=" + cod_ruc);
  }

  listarVentasCredito(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_venta : string, cod_cliente : string, cod_ruc: string)
  {
    return this.http.get(this.api + "listarventascredito?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&cod_cliente=" + cod_cliente + "&cod_ruc=" + cod_ruc);
  }

  listarPagosNotasCreditosVentas(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_venta : string, tipo_deuda : string, cod_cliente : string, cod_identificacion: string, cod_empleado : string, id_forma_pago: string, cod_ruc: string)
  {
    return this.http.get(this.api + "listarpagosnotascreditosventas?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&tipo_deuda=" + tipo_deuda + "&cod_cliente=" + cod_cliente + "&cod_identificacion=" + cod_identificacion + "&cod_empleado=" + cod_empleado + "&id_forma_pago=" + id_forma_pago + "&cod_ruc=" + cod_ruc);
  }
  //Termina enlaces de reporte

  listarPedidos(fechadesde: string, fechahasta: string, cod_sucursal : string, estado_pedido : string){
    return this.http.get(this.api + "listarpedidos?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&estado_pedido=" + estado_pedido);
  }

  listarPorRecaudarVentas(fechadesde: string, fechahasta: string, cod_sucursal : string, estado_pedido : string){
    return this.http.get(this.api + "listarporrecaudarventas?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&estado_pedido=" + estado_pedido);
  }

  registrarControlVenta(parametros: any){
    return this.http.post(this.api + "registrarcontrolventa", parametros);
  }

  listarControlVentas(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string)
  {
    return this.http.get(this.api + "listarcontrolventas?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario);
  }

  subirImagenPedido(form: FormData){
    return this.http.post(this.api + "subirimagenpedido", form);
  }

  eliminarImagenPedido(form: FormData){
    return this.http.post(this.api + "eliminarimagenpedido", form);
  }

  verificarRecaudacionFactura(cod_factura_venta: string)
  {
    return this.http.get(this.api + "verificarrecaudacionfactura?cod_factura_venta=" + cod_factura_venta);
  }

  buscarTransaccionesBanco(cod_factura_venta: string)
  {
    return this.http.get(this.api + "buscartransaccionesbanco?cod_factura_venta=" + cod_factura_venta);
  }

  buscarFacturaDescuento(cod_factura_venta: string)
  {
    return this.http.get(this.api + "buscarfacturadescuento?cod_factura_venta=" + cod_factura_venta);
  }

  listarFacturasVentasPorCliente(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_cliente : string)
  {
    return this.http.get(this.api + "listarfacturasventasporcliente?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_cliente=" + cod_cliente);
  }

  verificarNumeroActualFactura(tipo_venta: string, cod_sucursal : string)
  {
    return this.http.get(this.api + "verificarnumeroactualfactura?tipo_venta=" + tipo_venta + "&cod_sucursal=" + cod_sucursal);
  }

  resumenVentas(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, cod_ruc: string)
  {
    return this.http.get(this.api + "resumenventas?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&cod_ruc=" + cod_ruc);
  }

  listarFacturasVentasPorProducto(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_venta : string, tipo_deuda : string, cod_cliente : string, cod_ruc: string, cod_producto: string)
  {
    return this.http.get(this.api + "listarfacturasventasporproducto?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&tipo_deuda=" + tipo_deuda + "&cod_cliente=" + cod_cliente + "&cod_ruc=" + cod_ruc + "&cod_producto=" + cod_producto);
  }

  listarPedidosPorCliente(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_cliente: string){
    return this.http.get(this.api + "listarpedidosporcliente?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_cliente=" + cod_cliente);
  }

  buscarFacturasPorCodigo(parametros: any){
    return this.http.post(this.api + "buscarfacturasporcodigo", parametros);
  }

  listarTipoVenta()
  {
    return this.http.get(this.api + "listartipoventa");
  }

  listarConsolidadosVendedores(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_venta : string, tipo_deuda : string, cod_cliente : string, cod_identificacion: string, cod_empleado : string, cod_ruc: string, cod_estado_recaudacion: string)
  {
    return this.http.get(this.api + "listarconsolidadosvendedores?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&tipo_deuda=" + tipo_deuda + "&cod_cliente=" + cod_cliente + "&cod_identificacion=" + cod_identificacion + "&cod_empleado=" + cod_empleado + "&cod_ruc=" + cod_ruc + "&cod_estado_recaudacion=" + cod_estado_recaudacion);
  }

  listarConsolidadosComisiones(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_venta : string, tipo_deuda : string, cod_cliente : string, cod_identificacion: string, cod_empleado : string, cod_ruc: string, cod_estado_recaudacion: string)
  {
    return this.http.get(this.api + "listarconsolidadoscomisiones?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&tipo_deuda=" + tipo_deuda + "&cod_cliente=" + cod_cliente + "&cod_identificacion=" + cod_identificacion + "&cod_empleado=" + cod_empleado + "&cod_ruc=" + cod_ruc + "&cod_estado_recaudacion=" + cod_estado_recaudacion);
  }

  async descargarXMLMasivo(parametros: any): Promise<Blob>
  {
    return await this.http.post(
      this.configService.settings.baseUrlSri + "/api/factura/descargarxmlsmasivo",
      parametros,
      {
        responseType: 'blob'
      }
    ).toPromise();
  }

  async descargarRidesMasivo(parametros: any): Promise<Blob>
  {
    return await this.http.post(
      this.configService.settings.baseUrlSri + "/api/factura/descargarridesmasivo",
      parametros,
      {
        responseType: 'blob'
      }
    ).toPromise();
  }

  async descargarFacturasMasivo(parametros: any): Promise<Blob>
  {
    return await this.http.post(
      this.apiReportes + "descargarfacturasmasivo",
      parametros,
      {
        responseType: 'blob'
      }
    ).toPromise();
  }
}