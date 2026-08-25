import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/compras/proveedor/";
  }

  listar()
  {
    return this.http.get(this.api + "listarproveedores");
  }

  validarRuc(tipo_documento: string, ruc: string)
  {
    return this.http.get(this.api + "validarruc?tipo_documento=" + tipo_documento + "&ruc=" + ruc);
  }

  buscar(ruc: string)
  {
    return this.http.get(this.api + "buscar?ruc=" + ruc);
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

  listarTipoProveedorsActivo()
  {
    return this.http.get(this.api + "listartipoproveedorsactivo");
  }
}