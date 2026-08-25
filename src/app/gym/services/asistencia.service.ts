import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';
@Injectable({
  providedIn: 'root'
})
export class AsistenciaService
{
  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/gym/asistencia/";
  }

  listarAsistencias(fechadesde: string, fechahasta: string, cod_sucursal : string)
  {
    return this.http.get(this.api + "listarasistencias?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal);
  }
}