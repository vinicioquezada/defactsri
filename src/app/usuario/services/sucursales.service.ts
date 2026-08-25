import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class SucursalesService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/usuarios/sucursales/";
  }

  revisarConfiguracion()
  {
    return this.http.get(this.configService.settings.baseUrl + "/api/revisarconfiguracion");
  }
  
  listarsucursaleslogin()
  {
    return this.http.get(this.configService.settings.baseUrl + "/api/sucursaleslogin");
  }

  listarSucursales()
  {
    return this.http.get(this.api + "listarsucursales");
  }

  buscarSucursal(cod_sucursal: string)
  {
    return this.http.get(this.api + "buscarsucursal?cod_sucursal=" + cod_sucursal);
  }

  listarUsuarioSucursales()
  {
    return this.http.get(this.api + "listarusuariosucursales");
  }

  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }

  actualizar(parametros: any){
    return this.http.post(this.api + "actualizar", parametros);
  }

  activarSucursal(parametros: any){
    return this.http.post(this.api + "activarsucursal", parametros);
  }

  listarSucursalesGenerales()
  {
    return this.http.get(this.api + "listarsucursalesgenerales");
  }

  subirLogo(form: FormData){
    return this.http.post(this.api + "subirlogo", form);
  }

  subirLogoPrincipal(form: FormData){
    return this.http.post(this.api + "subirlogoprincipal", form);
  }

  buscarConfiguracion(){
    return this.http.get(this.api + "buscarconfiguracion");
  }

  actualizarConfiguracion(parametros: any){
    return this.http.post(this.api + "actualizarconfiguracion", parametros);
  }
}