import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class GuiaRemisionService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/ventas/guiaremision/";
  }

  private get apisri() {
    return this.configService.settings.baseUrlSri + "/api/comprobante/" + "guiaremision/";
  }

  private get apisriride() {
    return this.configService.settings.baseUrlSri + "/ride/guiaremision.php";
  }

  buscarGuiaRemisionPorFactura(cod_factura_venta: string)
  {
    return this.http.get(this.api + "buscarguiaremisionporfactura?cod_factura_venta=" + cod_factura_venta);
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

  buscarGuiaRemision(cod_guia_remision: string)
  {
    return this.http.get(this.api + "buscarguiaremision?cod_guia_remision=" + cod_guia_remision);
  }

  buscarFacturaGuiaRemision(cod_guia_remision: string)
  {
    return this.http.get(this.api + "buscarfacturaguiaremision?cod_guia_remision=" + cod_guia_remision);
  }

  claveAccesoActualizar(numero_guia: string, serieestab: string, ptoemi: string, fecha: string, ruc: string, tipo_ambiente: string)
  {
    return this.http.get(this.api + "claveaccesoactualizar?numero_guia=" + numero_guia + "&serieestab=" + serieestab + "&ptoemi=" + ptoemi + "&fecha=" + fecha + "&ruc=" + ruc + "&tipoambiente=" + tipo_ambiente);
  }

  listarGuiasRemision(fechadesde: string, fechahasta: string, opcion : string, cod_sucursal : string, estado_comprobante : string, cod_tipo_venta: string, cod_ruc: string){
    return this.http.get(this.api + "listarguiasremision?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&opcion=" + opcion + "&cod_sucursal=" + cod_sucursal + "&estado_comprobante=" + estado_comprobante + "&cod_tipo_venta=" + cod_tipo_venta + "&cod_ruc=" + cod_ruc);
  }

  listarGuiaRemisionVenta(cod_factura_venta: string){
    return this.http.get(this.api + "listarguiaremisionventa?cod_factura_venta=" + cod_factura_venta);
  }

  anularGuiaRemision(parametros: any)
  {
    return this.http.post(this.api + "anularguiaremision", parametros);
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
    return this.http.post(this.apisriride, parametros);
  }

  enviarCorreoGuiaRemision(parametros: any)
  {
    return this.http.post(this.apisri + "enviarcorreoguiaremision", parametros);
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
  listarReporteGuiaRemision(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, cod_ruc: string)
  {
    return this.http.get(this.api + "listarreporteguiaremision?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&cod_ruc=" + cod_ruc);
  }

  actualizarFechaClaveAccesoActual(parametros: any){
    return this.http.post(this.api + "actualizarfechaclaveaccesoactual", parametros);
  }
}