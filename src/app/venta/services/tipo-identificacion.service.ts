import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class TipoIdentificacionService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/ventas/tipoidentificacion/";
  }

  listar()
  {
    return this.http.get(this.api + "listartipoidentificacion");
  }

  listarTipoIdentificacionRuc()
  {
    return this.http.get(this.api + "listartipoidentificacionruc");
  }

}
