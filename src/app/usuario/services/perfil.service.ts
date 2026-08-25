import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/usuarios/usuario/";
  }

  subirImagen(datos:any):Observable<any>{
    return this.http.post(this.api + "subirimagen", datos);
  }

  buscarDatosUsuario()
  {
    return this.http.get(this.api + "buscardatosusuario");
  }

  actualizarPassword(parametros: any){
    return this.http.post(this.api + "actualizarpassword", parametros);
  }
}