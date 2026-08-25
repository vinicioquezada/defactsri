import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class DetallePedidoPastelService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/ventas/detallepedidopastel/";
  }

  buscarDetallePedidoPastel(cod_factura_venta: string)
  {
    return this.http.get(this.api + "buscardetallepedidopastel?cod_factura_venta=" + cod_factura_venta);
  }

}