import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoMercaderiaService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/almacen/ingresomercaderia/";
  }

  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }

  actualizar(parametros: any){
    return this.http.post(this.api + "actualizar", parametros);
  }

  actualizarEncabezado(parametros: any){
    return this.http.post(this.api + "actualizarencabezado", parametros);
  }

  listarIngresosMercaderias(cod_sucursal: string, fechadesde: string, fechahasta: string)
  {
    return this.http.get(this.api + "listaringresosmercaderia?cod_sucursal=" + cod_sucursal + "&fechadesde=" + fechadesde + "&fechahasta=" + fechahasta);
  }

  buscarIngresoMercaderia(cod_ingreso_mercaderia: string)
  {
    return this.http.get(this.api + "buscaringresomercaderia?cod_ingreso_mercaderia=" + cod_ingreso_mercaderia);
  }

  anularIngresoMercaderia(parametros: any)
  {
    return this.http.post(this.api + "anularingresomercaderia", parametros);
  }

  //Iniciar enlaces de reportes
  listarIngresosReporte(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, cod_tipo_ingreso_mercaderia : string)
  {
    return this.http.get(this.api + "listaringresosreporte?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&cod_tipo_ingreso_mercaderia=" + cod_tipo_ingreso_mercaderia);
  }

  eliminarIngresoKardex(parametros: any)
  {
    return this.http.post(this.api + "eliminaringresokardex", parametros);
  }

  actualizarCostoIngresoMercaderiaKardex(parametros: any)
  {
    return this.http.post(this.api + "actualizarcostoingresomercaderiakardex", parametros);
  }

  actualizarStockIngresoMercaderiaKardex(parametros: any)
  {
    return this.http.post(this.api + "actualizarstockingresomercaderiakardex", parametros);
  }
}
