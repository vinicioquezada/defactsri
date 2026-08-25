import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class AbonoReservaService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/hotel/abonoventareserva/";
  }

  guardarAbonoVentaReserva(parametros: any){
    return this.http.post(this.api + "guardarabonoventareserva", parametros);
  }

  actualizarAbonoVentaReserva(parametros: any){
    return this.http.post(this.api + "actualizarabonoventareserva", parametros);
  }

}