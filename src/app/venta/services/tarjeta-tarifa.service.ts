import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class TarjetaTarifaService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/ventas/tarjetatarifa/";
  }

  listarTipotarjetasTarifa(cod_tipo_tarjeta: string)
  {
    return this.http.get(this.api + "listartipotarjetastarifa?cod_tipo_tarjeta=" + cod_tipo_tarjeta);
  }

}