import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class NotaCreditoComprasService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/compras/notacredito/";
  }

  private get apisri() {
    return this.configService.settings.baseUrlSri + "/api/comprobante/" + "notacredito/";
  }

  private get apisriride() {
    return this.configService.settings.baseUrlSri + "/ride/notacredito.php";
  }

  buscarnotacreditoporfactura(cod_factura_compra: string)
  {
    return this.http.get(this.api + "buscarnotacreditoporfactura?cod_factura_compra=" + cod_factura_compra);
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

  buscarFacturaNotaCredito(cod_factura_compra: string)
  {
    return this.http.get(this.api + "buscarfacturanotacredito?cod_factura_compra=" + cod_factura_compra);
  }

  claveAccesoActualizar(n_nota_credito: string, serieestab: string, ptoemi: string, fecha: string, ruc: string, tipo_ambiente: string)
  {
    return this.http.get(this.api + "claveaccesoactualizar?n_nota_credito=" + n_nota_credito + "&serieestab=" + serieestab + "&ptoemi=" + ptoemi + "&fecha=" + fecha + "&ruc=" + ruc + "&tipoambiente=" + tipo_ambiente);
  }

  listarNotasCreditos(fechadesde: string, fechahasta: string, opcion : string, cod_sucursal : string, estado_comprobante : string){
    return this.http.get(this.api + "listarnotascredito?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&opcion=" + opcion + "&cod_sucursal=" + cod_sucursal + "&estado_comprobante=" + estado_comprobante);
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

  actualizarEstado(parametros: any)
  {
    return this.http.post(this.api + "actualizarestado", parametros);
  }

  crearRide(parametros: any)
  {
    return this.http.post(this.apisriride, parametros);
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
  listarReporteNotasCreditos(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, cod_proveedor : string, cod_tipo_documento: string)
  {
    return this.http.get(this.api + "listarreportenotascredito?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&cod_proveedor=" + cod_proveedor + "&tipo_compra=" + cod_tipo_documento);
  }

  verificarNotaCreditoCompra(cod_factura_compra: string)
  {
    return this.http.get(this.api + "verificarnotacreditocompra?cod_factura_compra=" + cod_factura_compra);
  }
}