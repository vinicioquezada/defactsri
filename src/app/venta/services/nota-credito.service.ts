import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class NotaCreditoService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/ventas/notacredito/";
  }

  private get apisri() {
    return this.configService.settings.baseUrlSri + "/api/notacredito/";
  }

  private get apisriride() {
    return this.configService.settings.baseUrlSri + "/ride/notacredito.php";
  }

  buscarnotacreditoporfactura(cod_factura_venta: string)
  {
    return this.http.get(this.api + "buscarnotacreditoporfactura?cod_factura_venta=" + cod_factura_venta);
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

  buscarNotaCredito(cod_nota_credito: string)
  {
    return this.http.get(this.api + "buscarnotacredito?cod_nota_credito=" + cod_nota_credito);
  }

  buscarFacturaNotaCredito(cod_factura_venta: string)
  {
    return this.http.get(this.api + "buscarfacturanotacredito?cod_factura_venta=" + cod_factura_venta);
  }

  claveAccesoActualizar(n_nota_credito: string, serieestab: string, ptoemi: string, fecha: string, ruc: string, tipo_ambiente: string)
  {
    return this.http.get(this.api + "claveaccesoactualizar?n_nota_credito=" + n_nota_credito + "&serieestab=" + serieestab + "&ptoemi=" + ptoemi + "&fecha=" + fecha + "&ruc=" + ruc + "&tipoambiente=" + tipo_ambiente);
  }

  listarNotasCreditos(fechadesde: string, fechahasta: string, opcion : string, cod_sucursal : string, estado_comprobante : string,cod_tipo_venta: string, cod_ruc: string, id_forma_pago: string){
    return this.http.get(this.api + "listarnotascredito?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&opcion=" + opcion + "&cod_sucursal=" + cod_sucursal + "&estado_comprobante=" + estado_comprobante + "&cod_tipo_venta=" + cod_tipo_venta + "&cod_ruc=" + cod_ruc + "&id_forma_pago=" + id_forma_pago);
  }

  listarNotaCreditoVenta(cod_factura_venta: string){
    return this.http.get(this.api + "listarnotacreditoventa?cod_factura_venta=" + cod_factura_venta);
  }

  anularNotaCredito(parametros: any)
  {
    return this.http.post(this.api + "anularnotacredito", parametros);
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

  enviarCorreoNotaCredito(parametros: any)
  {
    return this.http.post(this.apisri + "enviarcorreonotacredito", parametros);
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
  listarReporteNotasCreditos(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, cod_cliente : string, cod_tipo_documento: string, cod_ruc: string, cod_tipo_fecha: string)
  {
    return this.http.get(this.api + "listarreportenotascredito?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&cod_cliente=" + cod_cliente + "&tipo_venta=" + cod_tipo_documento + "&cod_ruc=" + cod_ruc + "&cod_tipo_fecha=" + cod_tipo_fecha);
  }

  listarReporteSaldoNotasCreditos(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, cod_cliente : string, cod_tipo_documento: string, cod_ruc: string)
  {
    return this.http.get(this.api + "listarreportesaldonotascredito?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&cod_cliente=" + cod_cliente + "&tipo_venta=" + cod_tipo_documento + "&cod_ruc=" + cod_ruc);
  }

  verificarNotaCredito(cod_factura_venta: string)
  {
    return this.http.get(this.api + "verificarnotacredito?cod_factura_venta=" + cod_factura_venta);
  }

  listarNotasCreditosCliente(cod_cliente: string)
  {
    return this.http.get(this.api + "listarnotascreditoscliente?cod_cliente=" + cod_cliente);
  }

  listarReporteConsolidadoSaldoPendienteNotasCreditos(cod_sucursal : string, cod_usuario : string, cod_cliente : string, cod_tipo_documento: string, cod_ruc: string)
  {
    return this.http.get(this.api + "listarreporteconsolidadosaldopendientenotascreditos?cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&cod_cliente=" + cod_cliente + "&tipo_venta=" + cod_tipo_documento + "&cod_ruc=" + cod_ruc);
  }

  actualizarEncabezado(parametros: any){
    return this.http.post(this.api + "actualizarencabezado", parametros);
  }

  actualizarFechaClaveAccesoActual(parametros: any){
    return this.http.post(this.api + "actualizarfechaclaveaccesoactual", parametros);
  }

  listarNotasCreditosDetalles(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, cod_cliente : string, cod_tipo_documento: string, cod_ruc: string, cod_tipo_forma_devolucion: string)
  {
    return this.http.get(this.api + "listarnotascreditosdetalles?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&cod_cliente=" + cod_cliente + "&tipo_venta=" + cod_tipo_documento + "&cod_ruc=" + cod_ruc + "&cod_tipo_forma_devolucion=" + cod_tipo_forma_devolucion);
  }

  async descargarXMLMasivo(parametros: any): Promise<Blob>
  {
    return await this.http.post(
      this.configService.settings.baseUrlSri + "/ride/descargararchivonotacredito.php?op=4",
      parametros,
      {
        responseType: 'blob'
      }
    ).toPromise();
  }

  async descargarRidesMasivo(parametros: any): Promise<Blob>
  {
    return await this.http.post(
      this.configService.settings.baseUrlSri + "/ride/descargararchivonotacredito.php?op=3",
      parametros,
      {
        responseType: 'blob'
      }
    ).toPromise();
  }
}