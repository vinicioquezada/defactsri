import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class FirmaUsuarioService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/usuarios/firmausuario/";
  }

  buscarFirmaUsuarioSucursal(cod_sucursal: string)
  {
    return this.http.get(this.api + "buscarfirmausuariosucursal?cod_sucursal=" + cod_sucursal);
  }

  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }
}