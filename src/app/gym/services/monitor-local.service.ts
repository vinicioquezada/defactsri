import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonitorLocalService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrlLocalGym + "/";
  }

  guardarUsuarioLocal(parametros: any){
    return this.http.post(this.api + "guardarusuariolocal", parametros);
  }

  actualizarUsuarioLocal(parametros: any){
    return this.http.post(this.api + "actualizarusuariolocal", parametros);
  }

  buscarUsuarioLocal(id_cliente: string)
  {
    return this.http.get(this.api + "buscarusuariolocal?id_cliente=" + id_cliente);
  }

  actualizarMembresiaUsuario(parametros: any){
    return this.http.post(this.api + "actualizarmembresiausuario", parametros);
  }

  registrarUsuarioDispositivo(id_usuario: string, nombres: string)
  {
    return this.http.get(this.api + "registrarusuariodispositivo?id_usuario=" + id_usuario + "&nombres=" + nombres);
  }

  subirImagen(datos:any):Observable<any>{
    return this.http.post(this.api + "subirimagen", datos);
  }

  eliminarImagen(datos:any):Observable<any>{
    return this.http.post(this.api + "eliminarimagen", datos);
  }

  subirRostroUsuarioDispositivo(id_usuario: string, cod_cliente: string, nombres: string)
  {
    return this.http.get(this.api + "subirrostrousuariodispositivo?id_usuario=" + id_usuario + "&cod_cliente=" + cod_cliente + "&nombres=" + nombres);
  }

  actualizarUsuarioDispositivo(id_usuario: string, nombres: string)
  {
    return this.http.get(this.api + "actualizarusuariodispositivo?id_usuario=" + id_usuario + "&nombres=" + nombres);
  }

  eliminarRostroUsuarioDispositivo(id_usuario: string)
  {
    return this.http.get(this.api + "eliminarrostrousuariodispositivo?id_usuario=" + id_usuario);
  }

  abrirPuerta()
  {
    return this.http.get(this.api + "abrirpuerta");
  }

  mantenerPuertaSiempreCerrada()
  {
    return this.http.get(this.api + "mantenerpuertasiemprecerrada");
  }

  consultarUsuarioMembresia(id_cliente: string)
  {
    return this.http.get(this.api + "consultarusuariomembresia?id_cliente=" + id_cliente);
  }

  buscarUsuarioLocalPorCodigo(cod_cliente: string)
  {
    return this.http.get(this.api + "buscarusuariolocalporcodigo?cod_cliente=" + cod_cliente);
  }

  buscarUsuarioDispositivo(id_usuario: string)
  {
    return this.http.get(this.api + "buscarusuariodispositivo?id_usuario=" + id_usuario);
  }
}
