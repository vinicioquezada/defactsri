import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class SocioService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/gym/usuariogym/";
  }

  listarUsuariosGym()
  {
    return this.http.get(this.api + "listarusuariosgym");
  }
  
  listarUsuariosGymRegistrados(cod_sucursal: string)
  {
    return this.http.get(this.api + "listarusuariosgymregistrados?cod_sucursal=" + cod_sucursal);
  }

  buscarUsuarioGymCodigoSucursal(cod_cliente: string, cod_sucursal: string)
  {
    return this.http.get(this.api + "buscarusuariogymcodigosucursal?cod_cliente=" + cod_cliente + "&cod_sucursal=" + cod_sucursal);
  }
  

  guardar(parametros: any){
    return this.http.post(this.api + "guardarusuariogym", parametros);
  }

  actualizar(parametros: any){
    return this.http.post(this.api + "actualizarusuariogym", parametros);
  }

  emparejar(parametros: any){
    return this.http.post(this.api + "emparejar", parametros);
  }

  comprobarEmparejamiento(cod_cliente: string)
  {
    return this.http.get(this.api + "comprobaremparejamiento?cod_cliente=" + cod_cliente);
  }

  eliminar(parametros: any){
    return this.http.post(this.api + "eliminarusuariosgym", parametros);
  }

  buscarUsuarioGym(cedula: string)
  {
    return this.http.get(this.api + "buscarusuariogym?cedula=" + cedula);
  }

  listarUsuariosVenta()
  {
    return this.http.get(this.api + "listarusuariosventa");
  }

  listarMembresiasUsuario(cod_cliente: string)
  {
    return this.http.get(this.api + "listarmembresiasusuario?cod_cliente=" + cod_cliente);
  }

  congelarMembresiaUsuario(parametros: any){
    return this.http.post(this.api + "congelarmembresiausuario", parametros);
  }

  descongelarMembresiaUsuario(parametros: any){
    return this.http.post(this.api + "descongelarmembresiausuario", parametros);
  }

  regalarMembresiaUsuario(parametros: any){
    return this.http.post(this.api + "regalarmembresiausuario", parametros);
  }

  actualizarMembresia(parametros: any){
    return this.http.post(this.api + "actualizarmembresia", parametros);
  }

  anularMembresia(parametros: any){
    return this.http.post(this.api + "anularmembresia", parametros);
  }

  listarSocios(cod_sucursal : string, cod_tipo_usuario_gym: string)
  {
    return this.http.get(this.api + "listarsocios?cod_sucursal=" + cod_sucursal + "&cod_tipo_usuario_gym=" + cod_tipo_usuario_gym);
  }

  listarUsuarioMesCumpleanios(cod_sucursal : string, mes: string)
  {
    return this.http.get(this.api + "listarusuariomescumpleanios?cod_sucursal=" + cod_sucursal + "&mes=" + mes);
  }
}