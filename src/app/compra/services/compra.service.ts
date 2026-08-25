import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/compras/facturacompra/";
  }

  private get apisri() {
    return this.configService.settings.baseUrlSri + "/api/comprobante/" + "facturacompra/";
  }

  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }

  actualizar(parametros: any){
    return this.http.post(this.api + "actualizar", parametros);
  }

  actualizarEncabezado(parametros: any){
    return this.http.post(this.api + "actualizarencabezado", parametros);
  }
  
  originarCodigo()
  {
    return this.http.get(this.api + "originarcodigo");
  }

  buscarFactura(cod_factura_compra: string)
  {
    return this.http.get(this.api + "buscarfactura?cod_factura_compra=" + cod_factura_compra);
  }

  claveAccesoActualizar(n_factura_compra: string, serieestab: string, ptoemi: string, fecha: string, ruc: string, tipo_ambiente: string)
  {
    return this.http.get(this.api + "claveaccesoactualizar?n_factura_compra=" + n_factura_compra + "&serieestab=" + serieestab + "&ptoemi=" + ptoemi + "&fecha=" + fecha + "&ruc=" + ruc + "&tipoambiente=" + tipo_ambiente);
  }

  buscarNumeroFactura(numero_factura: string)
  {
    return this.http.get(this.api + "buscarnumerofactura?numero_factura=" + numero_factura);
  }

  listarFacturas(fechadesde: string, fechahasta: string, cod_sucursal : string){
    return this.http.get(this.api + "listarfacturas?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal);
  }

  buscarNFacturaCompraProveedor(cod_proveedor : string, codigo : string)
  {
    return this.http.get(this.api + "buscarnfacturacompraproveedor?cod_proveedor=" + cod_proveedor + "&codigo=" + codigo);
  }

  anularFacturaCompra(parametros: any)
  {
    return this.http.post(this.api + "anularfacturacompra", parametros);
  }
  
  buscarFacturaProductos(cod_factura_compra : string)
  {
    return this.http.get(this.api + "buscarfacturaproductos?cod_factura_compra=" + cod_factura_compra);
  }

  guardarPrecios(parametros: any){
    return this.http.post(this.api + "guardarprecios", parametros);
  }

  //Iniciar enlaces de reportes
  listarCompras(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_compra : string, tipo_deuda : string, cod_proveedor : string, cod_tipo_control : string)
  {
    return this.http.get(this.api + "listarcompras?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_compra=" + tipo_compra + "&tipo_deuda=" + tipo_deuda + "&cod_proveedor=" + cod_proveedor + "&cod_tipo_control=" + cod_tipo_control);
  }

  listarComprasDetalles(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_compra : string, tipo_deuda : string, cod_proveedor : string, cod_tipo_control : string, iva_compra : string)
  {
    return this.http.get(this.api + "listarcomprasdetalles?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_compra=" + tipo_compra + "&tipo_deuda=" + tipo_deuda + "&cod_proveedor=" + cod_proveedor + "&cod_tipo_control=" + cod_tipo_control + "&iva_compra=" + iva_compra);
  }

  listarComprasCredito(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_compra : string, cod_proveedor : string)
  {
    return this.http.get(this.api + "listarcomprascredito?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_compra=" + tipo_compra + "&cod_proveedor=" + cod_proveedor);
  }

  listarProductoFacturasProveedor(cod_producto : string)
  {
    return this.http.get(this.api + "listarproductofacturasproveedor?cod_producto=" + cod_producto);
  }
  //Termina enlaces de reporte

  verificarComprobanteCompraSri(parametros: any)
  {
    return this.http.post(this.apisri + "verificarcomprobantecomprasri", parametros);
  }

  eliminarIngresoKardex(parametros: any)
  {
    return this.http.post(this.api + "eliminaringresokardex", parametros);
  }

  actualizarCostoIngresoMercaderiaKardex(parametros: any)
  {
    return this.http.post(this.api + "actualizarcostoingresomercaderiakardex", parametros);
  }

  actualizarStockIngresoMercaderiaKardex(parametros: any)
  {
    return this.http.post(this.api + "actualizarstockingresomercaderiakardex", parametros);
  }

  buscarFormasPagoCompra(cod_factura_compra: string)
  {
    return this.http.get(this.api + "buscarformaspagocompra?cod_factura_compra=" + cod_factura_compra);
  }
}