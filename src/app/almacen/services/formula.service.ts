import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';


@Injectable({
  providedIn: 'root'
})
export class FormulaService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/almacen/formula/";
  }

  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }

  actualizar(parametros: any){
    return this.http.post(this.api + "actualizar", parametros);
  }

  listarFormulas()
  {
    return this.http.get(this.api + "listarformulas");
  }

  buscar(cod_formula: string)
  {
    return this.http.get(this.api + "buscar?cod_formula=" + cod_formula);
  }

  buscarProductoFormula(cod_producto: string)
  {
    return this.http.get(this.api + "buscarproductoformula?cod_producto=" + cod_producto);
  }

  anularFormula(parametros: any)
  {
    return this.http.post(this.api + "anularformula", parametros);
  }
  /*
  listarFormulaReporte(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, cod_tipo_formula : string)
  {
    return this.http.get(this.api + "listaringresosreporte?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&cod_tipo_formula=" + cod_tipo_formula);
  }
  */
}