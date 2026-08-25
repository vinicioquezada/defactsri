import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ExistenciasService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/almacen/existencias/";
  }

  actualizar(parametros: any){
    return this.http.post(this.api + "actualizar", parametros);
  }

  listarExistenciasProducto(cod_producto: string)
  {
    return this.http.get(this.api + "listarexistenciasproducto?cod_producto=" + cod_producto);
  }

  listarExistenciasProductoGeneral(cod_producto: string)
  {
    return this.http.get(this.api + "listarexistenciasproductogeneral?cod_producto=" + cod_producto);
  }
}