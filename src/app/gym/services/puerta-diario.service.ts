import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class PuertaDiarioService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/monitorgym/puertadiario/";
  }

  listarPuertaDiario(cod_sucursal: string)
  {
    return this.http.get(this.api + "listarpuertadiario?cod_sucursal=" + cod_sucursal);
  }

  abrirPuerta(parametros: any)
  {
    return this.http.post(this.api + "abrirpuerta", parametros);
  }

}