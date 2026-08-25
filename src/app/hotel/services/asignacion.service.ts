import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/hotel/asignacionreserva/";
  }

  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }

  buscarAsignacion(cod_reserva : string)
  {
    return this.http.get(this.api + "buscarasignacion?cod_reserva=" + cod_reserva);
  }

  actualizar(parametros: any){
    return this.http.post(this.api + "actualizar", parametros);
  }
}