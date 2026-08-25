import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  cod_proyecto = this.configService.settings.cod_proyecto;

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/login/";
  }

  verificarPlan(urlproyecto: string)
  {
    return this.http.get(urlproyecto + "verificarplanactivo?cod_proyecto=" + this.cod_proyecto);
  }

  acceder(usuario: string, password: string, cod_sucursal : string)
  {
    return this.http.get(this.api + "acceder?usuario=" + usuario + "&password=" + password + "&cod_sucursal=" + cod_sucursal);
  }
}