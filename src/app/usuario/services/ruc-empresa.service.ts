import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class RucEmpresaService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/usuarios/rucempresa/";
  }

  listarRucGenerales()
  {
    return this.http.get(this.api + "listarrucgenerales");
  }

  listarRucActivos()
  {
    return this.http.get(this.api + "listarrucactivos");
  }

  listarRucEmpresas(cod_sucursal: string)
  {
    return this.http.get(this.api + "listarrucempresas?cod_sucursal=" + cod_sucursal);
  }

  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }

  actualizar(parametros: any){
    return this.http.post(this.api + "actualizar", parametros);
  }

  activarRuc(parametros: any){
    return this.http.post(this.api + "activarruc", parametros);
  }

  actualizarDatosFirma(parametros: any){
    return this.http.post(this.api + "actualizardatosfirma", parametros);
  }

  buscarRuc(cod_ruc: string)
  {
    return this.http.get(this.api + "buscarruc?cod_ruc=" + cod_ruc);
  }

  guardarAsignacion(parametros: any){
    return this.http.post(this.api + "guardarasignacion", parametros);
  }

  asignarRucFijo(parametros: any){
    return this.http.post(this.api + "asignarrucfijo", parametros);
  }

  eliminarAsignacion(parametros: any){
    return this.http.post(this.api + "eliminarasignacion", parametros);
  }

  listarSecuenciasFacturas(serieestab: string, ptoemi: string, cod_ruc: string)
  {
    return this.http.get(this.api + "listarsecuenciasfacturas?serieestab=" + serieestab + "&ptoemi=" + ptoemi + "&cod_ruc=" + cod_ruc);
  }

  actualizarSecuanciaFactura(parametros: any){
    return this.http.post(this.api + "actualizarsecuanciafactura", parametros);
  }

  generarSecuencias(parametros: any){
    return this.http.post(this.api + "generarsecuencias", parametros);
  }
}