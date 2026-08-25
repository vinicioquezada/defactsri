import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class TipoIngresoMercaderiaService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/almacen/tipoingresomercaderia/";
  }

  listarTipoIngresoMercaderias()
  {
    return this.http.get(this.api + "listartipoingresomercaderias");
  }

  buscar(tipo_ingreso_mercaderia: string)
  {
    return this.http.get(this.api + "buscar?tipo_ingreso_mercaderia=" + tipo_ingreso_mercaderia);
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
}