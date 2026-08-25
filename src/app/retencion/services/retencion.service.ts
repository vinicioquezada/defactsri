import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class RetencionService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/retencion/retencion/";
  }

  private get apisri() {
    return this.configService.settings.baseUrlSri + "/api/comprobante/" + "retencion/";
  }

  private get apisriride() {
    return this.configService.settings.baseUrlSri + "/ride/retencion.php";
  }

  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }

  actualizar(parametros: any){
    return this.http.post(this.api + "actualizar", parametros);
  }

  verificarRegistro()
  {
    return this.http.get(this.api + "verificarregistro");
  }

  buscarRetencionCompra(cod_retencion: string)
  {
    return this.http.get(this.api + "buscarretencioncompra?cod_retencion=" + cod_retencion);
  }

  claveAccesoActualizar(n_retencion: string, serieestab: string, ptoemi: string, fecha: string, ruc: string, tipo_ambiente: string)
  {
    return this.http.get(this.api + "claveaccesoactualizar?n_retencion=" + n_retencion + "&serieestab=" + serieestab + "&ptoemi=" + ptoemi + "&fecha=" + fecha + "&ruc=" + ruc + "&tipoambiente=" + tipo_ambiente);
  }

  /*
  buscarNumeroFactura(numero_retencion: string)
  {
    return this.http.get(this.api + "buscarnumeroretencion?numero_retencion=" + numero_retencion);
  }
  */

  listarRetencionesCompras(fechadesde: string, fechahasta: string, opcion : string, cod_sucursal : string, estado_comprobante : string){
    return this.http.get(this.api + "listarretencionescompras?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&opcion=" + opcion + "&cod_sucursal=" + cod_sucursal + "&estado_comprobante=" + estado_comprobante);
  }
  
  anularRetencionCompra(parametros: any)
  {
    return this.http.post(this.api + "anularretencioncompra", parametros);
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

  actualizarEstado(parametros: any)
  {
    return this.http.post(this.api + "actualizarestado", parametros);
  }

  crearRide(parametros: any)
  {
    return this.http.post(this.apisriride, parametros);
  }

  enviarCorreoRetencion(parametros: any)
  {
    return this.http.post(this.apisri + "enviarcorreoretencion", parametros);
  }

  actualizarEstadoCorreo(parametros: any)
  {
    return this.http.post(this.api + "actualizarestadocorreo", parametros);
  }

  verificarComprobanteSri(parametros: any)
  {
    return this.http.post(this.apisri + "verificarcomprobantesri", parametros);
  }

  listarReporteRetenciones(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, cod_proveedor : string, codigo_tipo_impuesto : string)
  {
    return this.http.get(this.api + "listarreporteretenciones?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario  + "&cod_proveedor=" + cod_proveedor + "&codigo_tipo_impuesto=" + codigo_tipo_impuesto);
  }

  /*
  //Iniciar enlaces de reportes
  listarVentas(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_venta : string, id_forma_pago : string, tipo_deuda : string, cod_cliente : string)
  {
    return this.http.get(this.api + "listarventas?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&id_forma_pago=" + id_forma_pago + "&tipo_deuda=" + tipo_deuda + "&cod_cliente=" + cod_cliente);
  }
  
  listarVentasDetalles(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_venta : string, id_forma_pago : string, tipo_deuda : string, cod_cliente : string)
  {
    return this.http.get(this.api + "listarventasdetalles?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&id_forma_pago=" + id_forma_pago + "&tipo_deuda=" + tipo_deuda + "&cod_cliente=" + cod_cliente);
  }

  listarVentasCategorias(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_venta : string, id_forma_pago : string, tipo_deuda : string, cod_cliente : string, cod_categoria : string, cod_subcategoria : string)
  {
    return this.http.get(this.api + "listarventascategorias?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&id_forma_pago=" + id_forma_pago + "&tipo_deuda=" + tipo_deuda + "&cod_cliente=" + cod_cliente + "&cod_categoria=" + cod_categoria + "&cod_subcategoria=" + cod_subcategoria);
  }

  listarVentasProductos(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_venta : string, id_forma_pago : string, tipo_deuda : string, cod_cliente : string)
  {
    return this.http.get(this.api + "listarventasproductos?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&id_forma_pago=" + id_forma_pago + "&tipo_deuda=" + tipo_deuda + "&cod_cliente=" + cod_cliente);
  }

  listarProductosRotacion(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_categoria : string, cod_subcategoria : string)
  {
    return this.http.get(this.api + "listarproductosrotacion?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_categoria=" + cod_categoria + "&cod_subcategoria=" + cod_subcategoria);
  }

  listarVentasCredito(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_venta : string, id_forma_pago : string, cod_cliente : string)
  {
    return this.http.get(this.api + "listarventascredito?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&id_forma_pago=" + id_forma_pago + "&cod_cliente=" + cod_cliente);
  }
  //Termina enlaces de reporte

  listarPedidos(fechadesde: string, fechahasta: string, cod_sucursal : string, estado_pedido : string){
    return this.http.get(this.api + "listarpedidos?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&estado_pedido=" + estado_pedido);
  }
  */
}