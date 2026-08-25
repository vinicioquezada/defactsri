import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/ventas/cliente/";
  }

  listar()
  {
    return this.http.get(this.api + "listarclientes");
  }

  listarClientesBasico()
  {
    return this.http.get(this.api + "listarclientesbasico");
  }

  validarCedula(tipo_documento: string, cedula: string)
  {
    return this.http.get(this.api + "validarcedula?tipo_documento=" + tipo_documento + "&cedula=" + cedula);
  }

  buscar(cedula: string)
  {
    return this.http.get(this.api + "buscar?cedula=" + cedula);
  }

  buscarCompras(cod_cliente: string)
  {
    return this.http.get(this.api + "buscarcompras?cod_cliente=" + cod_cliente);
  }

  buscarClientePorCodigo(cod_cliente: string)
  {
    return this.http.get(this.api + "buscarclienteporcodigo?cod_cliente=" + cod_cliente);
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

  afiliarCliente(parametros: any){
    return this.http.post(this.api + "afiliarcliente", parametros);
  }

  suspenderCliente(parametros: any){
    return this.http.post(this.api + "suspendercliente", parametros);
  }

  verObservacion(cod_cliente: string)
  {
    return this.http.get(this.api + "verobservacion?cod_cliente=" + cod_cliente);
  }

  eliminarObservacion(parametros: any){
    return this.http.post(this.api + "eliminarobservacion", parametros);
  }
}