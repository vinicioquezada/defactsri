import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class TarifaService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/almacen/tarifa/";
  }

  listarTarifas(cod_producto: string)
  {
    return this.http.get(this.api + "listartarifas?cod_producto=" + cod_producto);
  }

  listarTarifasVisibles(cod_producto: string)
  {
    return this.http.get(this.api + "listartarifasvisibles?cod_producto=" + cod_producto);
  }

  buscar(codigo: string)
  {
    return this.http.get(this.api + "buscar?codigo=" + codigo);
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

  activarTarifa(parametros: any){
    return this.http.post(this.api + "activartarifa", parametros);
  }
}