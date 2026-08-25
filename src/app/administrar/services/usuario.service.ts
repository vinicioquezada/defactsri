import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/usuarios/usuario/";
  }

  listarUsuarios()
  {
    return this.http.get(this.api + "listarusuarios");
  }

  activarUsuario(parametros: any){
    return this.http.post(this.api + "activarusuario", parametros);
  }

  listarSucursalesUsuario(cod_usuario: Number)
  {
    return this.http.get(this.api + "listarsucursalesusuario?cod_usuario=" + cod_usuario);
  }

  guardarSucursalUsuario(parametros: any){
    return this.http.post(this.api + "guardarsucursalusuario", parametros);
  }

  eliminarSucursalUsuario(parametros: any){
    return this.http.post(this.api + "eliminarsucursalusuario", parametros);
  }

  actualizarUsuario(parametros: any){
    return this.http.post(this.api + "actualizarusuario", parametros);
  }

  crearCuentaUsuario(parametros: any){
    return this.http.post(this.api + "crearcuentausuario", parametros);
  }

  verificarAdministrador(parametros: any){
    return this.http.post(this.api + "verificaradministrador", parametros);
  }

  revisarPasswordSupervisor(password_supervisor: string)
  {
    return this.http.get(this.api + "revisarpasswordsupervisor?password_supervisor=" + password_supervisor);
  }

  /*
  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }

  actualizar(parametros: any){
    return this.http.post(this.api + "actualizar", parametros);
  }

  eliminar(parametros: any){
    return this.http.post(this.api + "eliminar", parametros);
  }
  */
}