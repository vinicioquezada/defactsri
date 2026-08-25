import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class CodigoProductoService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/almacen/codigoproducto/";
  }

  buscarCodigoProducto(codigo_producto: string)
  {
    return this.http.get(this.api + "buscarcodigoproducto?codigo_producto=" + codigo_producto);
  }

  /*
  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }
  */

}