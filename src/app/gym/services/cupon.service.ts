import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class CuponService {
  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/gym/cupon/";
  }

  listarCupones()
  {
    return this.http.get(this.api + "listarcupones");
  }

  buscar(cupon: string)
  {
    return this.http.get(this.api + "buscar?cupon=" + cupon);
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

  fijarCupon(parametros: any){
    return this.http.post(this.api + "fijarcupon", parametros);
  }

  activarCupon(parametros: any){
    return this.http.post(this.api + "activarcupon", parametros);
  }

  buscarActivarCupon(cod_sucursal: string)
  {
    return this.http.get(this.api + "buscaractivarcupon?cod_sucursal=" + cod_sucursal);
  }
}