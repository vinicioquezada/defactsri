import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class TransaccionTarjetaService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/ventas/transacciontarjeta/";
  }

  listarTransaccionTarjeta()
  {
    return this.http.get(this.api + "listartransacciontarjeta");
  }

  listarTarifasRecargo()
  {
    return this.http.get(this.api + "listartarifasrecargo");
  }

}