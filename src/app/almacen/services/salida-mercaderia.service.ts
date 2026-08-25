import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class SalidaMercaderiaService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/almacen/salidamercaderia/";
  }

  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }

  actualizar(parametros: any){
    return this.http.post(this.api + "actualizar", parametros);
  }

  listarSalidasMercaderias(cod_sucursal: string, fechadesde: string, fechahasta: string)
  {
    return this.http.get(this.api + "listarsalidasmercaderia?cod_sucursal=" + cod_sucursal + "&fechadesde=" + fechadesde + "&fechahasta=" + fechahasta);
  }

  buscarSalidaMercaderia(cod_salida_mercaderia: string)
  {
    return this.http.get(this.api + "buscarsalidamercaderia?cod_salida_mercaderia=" + cod_salida_mercaderia);
  }

  anularSalidaMercaderia(parametros: any)
  {
    return this.http.post(this.api + "anularsalidamercaderia", parametros);
  }

  //Iniciar enlaces de reportes
  listarSalidasReporte(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, cod_tipo_salida_mercaderia : string)
  {
    return this.http.get(this.api + "listarsalidasreporte?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&cod_tipo_salida_mercaderia=" + cod_tipo_salida_mercaderia);
  }

  listarSalidasValoradas(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, cod_tipo_salida_mercaderia : string)
  {
    return this.http.get(this.api + "listarsalidasvaloradas?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&cod_tipo_salida_mercaderia=" + cod_tipo_salida_mercaderia);
  }
}