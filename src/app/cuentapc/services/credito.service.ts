import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class CreditoService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/cuentaspc/credito/";
  }

  listarCreditosCliente(cod_factura_venta: string)
  {
    return this.http.get(this.api + "listarcreditoscliente?cod_factura_venta=" + cod_factura_venta);
  }

  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }

  actualizar(parametros: any){
    return this.http.post(this.api + "actualizar", parametros);
  }

  /*
  listarCategorias()
  {
    return this.http.get(this.api + "listarcategorias");
  }
  */

  buscarCredito(cod_factura_venta: string)
  {
    return this.http.get(this.api + "buscarcredito?cod_factura_venta=" + cod_factura_venta);
  }

  buscarFormaCobroAbonoEntrada(cod_factura_venta: string)
  {
    return this.http.get(this.api + "buscarformacobroabonoentrada?cod_factura_venta=" + cod_factura_venta);
  }

}
