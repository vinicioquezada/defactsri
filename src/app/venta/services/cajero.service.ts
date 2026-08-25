import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class CajeroService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/ventas/cajero/";
  }
  
  /*
  listarCajeros()
  {
    return this.http.get(this.api + "listarcajeros");
  }
  */

  aperturar(parametros: any){
    return this.http.post(this.api + "aperturar", parametros);
  }

  cerrar(parametros: any){
    return this.http.post(this.api + "cerrar", parametros);
  }

  eliminar(parametros: any){
    return this.http.post(this.api + "eliminar", parametros);
  }

  iniciarAperturaCaja()
  {
    return this.http.get(this.api + "iniciaraperturacaja");
  }

  iniciarCierreCaja(cod_caja : string)
  {
    return this.http.get(this.api + "iniciarcierrecaja?cod_caja=" + cod_caja);
  }

  calcularCierreCaja(cod_usuario : string, fecha_apertura : string, cod_sucursal : string, proceso : string)
  {
    return this.http.get(this.api + "calcularcierrecaja?cod_usuario=" + cod_usuario + "&fecha_apertura=" + fecha_apertura + "&cod_sucursal=" + cod_sucursal + "&proceso=" + proceso);
  }

  listarCierresCajas(fechadesde : string, fechahasta : string, cod_sucursal : string)
  {
    return this.http.get(this.api + "listarcierrescajas?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal);
  }

  verificarCajaAbiertaUsuario(cod_sucursal : string)
  {
    return this.http.get(this.api + "verificarcajaabiertausuario?cod_sucursal=" + cod_sucursal);
  }

  verificarCajaAbiertaUsuarioRecaudador(cod_sucursal : string)
  {
    return this.http.get(this.api + "verificarcajaabiertausuariorecaudador?cod_sucursal=" + cod_sucursal);
  }

}