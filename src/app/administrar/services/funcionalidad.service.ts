import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class FuncionalidadService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/usuarios/funcionalidad/";
  }

  listarFuncionalidades(cod_roles: string)
  {
    return this.http.get(this.api + "listarfuncionalidades?cod_roles=" + cod_roles);
  }

  guardar(parametros: any){
    return this.http.post(this.api + "guardarfuncionalidades", parametros);
  }
}