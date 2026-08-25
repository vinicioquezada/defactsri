import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/usuarios/empleado/";
  }

  listar()
  {
    return this.http.get(this.api + "listarempleados");
  }

  listarEmpleadosUsuarios()
  {
    return this.http.get(this.api + "listarempleadosusuarios");
  }

  listarEmpleadosVendedores()
  {
    return this.http.get(this.api + "listarempleadosvendedores");
  }

  validarCedula(tipo_documento: string, cedula: string)
  {
    return this.http.get(this.api + "validarcedula?tipo_documento=" + tipo_documento + "&cedula=" + cedula);
  }

  buscar(cedula: string)
  {
    return this.http.get(this.api + "buscar?cedula=" + cedula);
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

  actualizarDatosPerfil(parametros: any){
    return this.http.post(this.api + "actualizardatosperfil", parametros);
  }
}