import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class InicioService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/usuarios/inicio/";
  }

  cargarEscritorio(cod_sucursal: string, panel_usuario: string)
  {
    return this.http.get(this.api + "cargarescritorio?cod_sucursal=" + cod_sucursal + "&panel_usuario=" + panel_usuario);
  }
}
