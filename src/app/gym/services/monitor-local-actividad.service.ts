import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MonitorLocalActividadService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrlLocalGym + "/";
  }

  buscarUsuarioActividadPorNumero(numero_usuario: string, cod_actividad: string)
  {
    return this.http.get(this.api + "buscarusuarioactividadpornumero?numero_usuario=" + numero_usuario + "&cod_actividad=" + cod_actividad);
  }

  guardarUsuarioActividades(parametros: any){
    return this.http.post(this.api + "guardarusuarioactividades", parametros);
  }

  buscarUsuarioActividadPorCodigo(cod_cliente: string, cod_actividad: string)
  {
    return this.http.get(this.api + "buscarusuarioactividadporcodigo?cod_cliente=" + cod_cliente + "&cod_actividad=" + cod_actividad);
  }

  guardarUsuarioActividad(parametros: any){
    return this.http.post(this.api + "guardarusuarioactividad", parametros);
  }
  
  actualizarFechaAcceso(parametros: any){
    return this.http.post(this.api + "actualizarfechaacceso", parametros);
  }

  actualizarUsuarioActividadesDispositivo(parametros: any){
    return this.http.post(this.api + "actualizarusuarioactividadesdispositivo", parametros);
  }

  actualizarFotoUsuarioActividadesDispositivo(parametros: any){
    return this.http.post(this.api + "actualizarfotousuarioactividadesdispositivo", parametros);
  }

  eliminarFotoUsuarioActividadesDispositivo(parametros: any){
    return this.http.post(this.api + "eliminarfotousuarioactividadesdispositivo", parametros);
  }

  abrirPuerta1()
  {
    return this.http.get(this.api + "abrirpuerta1");
  }

  abrirPuerta2()
  {
    return this.http.get(this.api + "abrirpuerta2");
  }

  abrirPuerta3()
  {
    return this.http.get(this.api + "abrirpuerta3");
  }

  mantenerPuertaSiempreCerrada1()
  {
    return this.http.get(this.api + "mantenerpuertasiemprecerrada1");
  }

  mantenerPuertaSiempreCerrada2()
  {
    return this.http.get(this.api + "mantenerpuertasiemprecerrada2");
  }

  mantenerPuertaSiempreCerrada3()
  {
    return this.http.get(this.api + "mantenerpuertasiemprecerrada3");
  }
}