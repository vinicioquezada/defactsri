import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/usuarios/roles/";
  }

  listarroles()
  {
    return this.http.get(this.api + "listarroles");
  }

  buscar(roles: string)
  {
    return this.http.get(this.api + "buscar?roles=" + roles);
  }

  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }

  actualizar(parametros: any){
    return this.http.post(this.api + "actualizar", parametros);
  }

  eliminar(parametros: any){
    return this.http.post(this.api + "eliminar", parametros);
  }
}