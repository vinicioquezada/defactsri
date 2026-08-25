import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class SaldoNotaCreditoService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/ventas/saldonotacredito/";
  }

  listarSaldosNotaCredito(cod_nota_credito: string)
  {
    return this.http.get(this.api + "listarsaldosnotacredito?cod_nota_credito=" + cod_nota_credito);
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

  buscarCompensacionesPorFactura(cod_factura_venta: string)
  {
    return this.http.get(this.api + "buscarcompensacionesporfactura?cod_factura_venta=" + cod_factura_venta);
  }

  listarNotasCreditosClienteVenta(cod_cliente: string)
  {
    return this.http.get(this.api + "listarnotascreditosclienteventa?cod_cliente=" + cod_cliente);
  }

}
