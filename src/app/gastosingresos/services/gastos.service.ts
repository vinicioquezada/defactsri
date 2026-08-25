import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class GastosService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/gastosingresos/gastos/";
  }

  listarGastos(cod_sucursal: string)
  {
    return this.http.get(this.api + "listargastos?cod_sucursal=" + cod_sucursal);
  }

  /*
  buscar(categoria_gastos: string)
  {
    return this.http.get(this.api + "buscar?categoria_gastos=" + categoria_gastos);
  }
  */

  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }

  actualizar(parametros: any){
    return this.http.post(this.api + "actualizar", parametros);
  }

  eliminar(parametros: any){
    return this.http.post(this.api + "eliminar", parametros);
  }

  listarGastosPorMes(cod_sucursal : string, anio : string, mes : string, solo_usuario : string)
  {
    return this.http.get(this.api + "listargastospormes?cod_sucursal=" + cod_sucursal + "&anio=" + anio + "&mes=" + mes + "&solo_usuario=" + solo_usuario);
  }

  listarGastosPorFechas(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, id_forma_pago : string, cod_categoria_gastos: string)
  {
    return this.http.get(this.api + "listargastosporfechas?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&id_forma_pago=" + id_forma_pago + "&cod_categoria_gastos=" + cod_categoria_gastos);
  }
}
