import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class CodigoRetencionService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/retencion/codigoretencion/";
  }

  listarCodigoRetencion() {
    return this.http.get(this.api + "listarcodigoretenciones");
  }

  buscar(codigo_retencion: string) {
    return this.http.get(this.api + "buscar?codigo_retencion=" + codigo_retencion);
  }

  guardar(parametros: any) {
    return this.http.post(this.api + "guardar", parametros);
  }

  actualizar(parametros: any) {
    return this.http.post(this.api + "actualizar", parametros);
  }

  eliminar(parametros: any) {
    return this.http.post(this.api + "eliminar", parametros);
  }

  listarCodigoRetencionesPorTipo(codigo_tipo_impuesto:string) {
    return this.http.get(this.api + "listarcodigoretencionesportipo?codigo_tipo_impuesto=" + codigo_tipo_impuesto);
  }

  /*
  listarSubCategoriasCategoria() {
    return this.http.get(this.api + "listarcodigo_retencionscategoria");
  }
  */
}