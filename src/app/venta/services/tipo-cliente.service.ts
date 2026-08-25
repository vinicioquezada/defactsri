import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class TipoClienteService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/ventas/tipocliente/";
  }
  
  listar()
  {
    return this.http.get(this.api + "listartipoclientes");
  }

  buscar(tipo_cliente: string)
  {
    return this.http.get(this.api + "buscar?tipo_cliente=" + tipo_cliente);
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

  listartipoclientesactivo()
  {
    return this.http.get(this.api + "listartipoclientesactivo");
  }

}