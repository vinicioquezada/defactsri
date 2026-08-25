import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class AbonoCompraService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/cuentaspc/abonocompra/";
  }

  listarProveedoresPorPagar(cod_sucursal: string)
  {
    return this.http.get(this.api + "listarproveedoresporpagar?cod_sucursal=" + cod_sucursal);
  }

  buscarProveedoresPorPagar(cod_sucursal: string, ruc : string)
  {
    return this.http.get(this.api + "buscarproveedoresporpagar?cod_sucursal=" + cod_sucursal + "&ruc=" + ruc);
  }

  listarCuentasPagarProveedor(cod_proveedor: string)
  {
    return this.http.get(this.api + "listarcuentaspagarproveedor?cod_proveedor=" + cod_proveedor);
  }

  listarAbonosPagarProveedor(cod_factura_compra: string)
  {
    return this.http.get(this.api + "listarabonospagarproveedor?cod_factura_compra=" + cod_factura_compra);
  }

  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }

  actualizar(parametros: any){
    return this.http.post(this.api + "actualizar", parametros);
  }

  anular(parametros: any){
    return this.http.post(this.api + "anular", parametros);
  }

  listarCuentasPagarGeneral(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_compra : string, id_forma_pago : string, cod_proveedor : string, cod_tipo_deuda: string)
  {
    return this.http.get(this.api + "listarcuentaspagargeneral?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_compra=" + tipo_compra + "&id_forma_pago=" + id_forma_pago + "&cod_proveedor=" + cod_proveedor + "&cod_tipo_deuda=" + cod_tipo_deuda);
  }

  listarCortesPagar(fechahasta: string, cod_sucursal : string, cod_proveedor : string)
  {
    return this.http.get(this.api + "listarcortespagar?fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_proveedor=" + cod_proveedor);
  }

  calcularMora(fecha_maximo_pago: string, valor_cuota : number)
  {
    return this.http.get(this.api + "calcularmora?fecha_maximo_pago=" + fecha_maximo_pago + "&valor_cuota=" + valor_cuota);
  }

  listarAbonosCompras(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_compra : string, id_forma_pago : string, cod_proveedor : string)
  {
    return this.http.get(this.api + "listarabonoscompras?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_compra=" + tipo_compra + "&id_forma_pago=" + id_forma_pago + "&cod_proveedor=" + cod_proveedor);
  }

  listarCuentasPagarConsolidado(cod_sucursal : string, cod_usuario : string, tipo_compra : string, id_forma_pago : string, cod_proveedor : string, cod_tipo_deuda: string)
  {
    return this.http.get(this.api + "listarcuentaspagarconsolidado?cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_compra=" + tipo_compra + "&id_forma_pago=" + id_forma_pago + "&cod_proveedor=" + cod_proveedor + "&cod_tipo_deuda=" + cod_tipo_deuda);
  }
}