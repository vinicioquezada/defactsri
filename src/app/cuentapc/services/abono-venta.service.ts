import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class AbonoVentaService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/cuentaspc/abonoventa/";
  }

  listarClientesPorCobrar(cod_sucursal: string)
  {
    return this.http.get(this.api + "listarclientesporcobrar?cod_sucursal=" + cod_sucursal);
  }

  buscarClientesPorCobrar(cod_sucursal: string, cedula : string)
  {
    return this.http.get(this.api + "buscarclientesporcobrar?cod_sucursal=" + cod_sucursal + "&cedula=" + cedula);
  }

  listarCuentasCobrarCliente(cod_cliente: string)
  {
    return this.http.get(this.api + "listarcuentascobrarcliente?cod_cliente=" + cod_cliente);
  }

  listarAbonosCobrarCliente(cod_factura_venta: string)
  {
    return this.http.get(this.api + "listarabonoscobrarcliente?cod_factura_venta=" + cod_factura_venta);
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

  listarCuentasCobrarGeneral(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_venta : string, id_forma_pago : string, cod_cliente : string)
  {
    return this.http.get(this.api + "listarcuentascobrargeneral?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&id_forma_pago=" + id_forma_pago + "&cod_cliente=" + cod_cliente);
  }

  listarCortesCobrar(fechahasta: string, cod_sucursal : string, cod_cliente : string)
  {
    return this.http.get(this.api + "listarcortescobrar?fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_cliente=" + cod_cliente);
  }

  calcularMora(fecha_maximo_pago: string, valor_cuota : number)
  {
    return this.http.get(this.api + "calcularmora?fecha_maximo_pago=" + fecha_maximo_pago + "&valor_cuota=" + valor_cuota);
  }

  listarAbonosVentas(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_venta : string, id_forma_pago : string, cod_cliente : string)
  {
    return this.http.get(this.api + "listarabonosventas?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&id_forma_pago=" + id_forma_pago + "&cod_cliente=" + cod_cliente);
  }

  listarFormaPagoVencimiento(fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_venta : string, id_forma_pago : string, cod_cliente : string)
  {
    return this.http.get(this.api + "listarformapagovencimiento?fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&id_forma_pago=" + id_forma_pago + "&cod_cliente=" + cod_cliente);
  }

  listarCuentasPorCobrar(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_venta : string, id_forma_pago : string, cod_cliente : string, cod_tipo_deuda: string)
  {
    return this.http.get(this.api + "listarcuentasporcobrar?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&id_forma_pago=" + id_forma_pago + "&cod_cliente=" + cod_cliente + "&cod_tipo_deuda=" + cod_tipo_deuda);
  }

  listarCuentasCobrarConsolidado(cod_sucursal : string, cod_usuario : string, tipo_venta : string, cod_cliente : string, cod_tipo_deuda: string)
  {
    return this.http.get(this.api + "listarcuentascobrarconsolidado?cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&cod_cliente=" + cod_cliente + "&cod_tipo_deuda=" + cod_tipo_deuda);
  }
}