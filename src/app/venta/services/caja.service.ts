import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/ventas/caja/";
  }

  listarCajasSucursales(cod_sucursal : string)
  {
    return this.http.get(this.api + "listarcajassucursales?cod_sucursal=" + cod_sucursal);
  }

  apertura(cod_caja : string)
  {
    return this.http.get(this.api + "apertura?cod_caja=" + cod_caja);
  }

  cierre(cod_caja : string)
  {
    return this.http.get(this.api + "cierre?cod_caja=" + cod_caja);
  }

}