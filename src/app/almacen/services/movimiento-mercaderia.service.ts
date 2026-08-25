import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class MovimientoMercaderiaService {
  
  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/almacen/movimientomercaderia/";
  }

  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }

  actualizar(parametros: any){
    return this.http.post(this.api + "actualizar", parametros);
  }

  listarMovimientosMercaderias(cod_sucursal: string, fechadesde: string, fechahasta: string)
  {
    return this.http.get(this.api + "listarmovimientosmercaderia?cod_sucursal=" + cod_sucursal + "&fechadesde=" + fechadesde + "&fechahasta=" + fechahasta);
  }

  listarMovimientosMercaderiasPorSucursalUsuario(cod_sucursal: string, fechadesde: string, fechahasta: string)
  {
    return this.http.get(this.api + "listarmovimientosmercaderiaporsucursalusuario?cod_sucursal=" + cod_sucursal + "&fechadesde=" + fechadesde + "&fechahasta=" + fechahasta);
  }

  buscarMovimientoMercaderia(cod_movimiento_mercaderia: string)
  {
    return this.http.get(this.api + "buscarmovimientomercaderia?cod_movimiento_mercaderia=" + cod_movimiento_mercaderia);
  }

  anularMovimientoMercaderia(parametros: any)
  {
    return this.http.post(this.api + "anularmovimientomercaderia", parametros);
  }

  //Iniciar enlaces de reportes
  listarMovimientosReporte(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string)
  {
    return this.http.get(this.api + "listarmovimientosreporte?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario);
  }

  subirInventario(parametros: any){
    return this.http.post(this.api + "subirinventario", parametros);
  }
}