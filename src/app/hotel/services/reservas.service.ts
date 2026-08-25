import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/hotel/reservas/";
  }

  listarReservas(fechadesde : string, cod_sucursal : string, hora_actual : string)
  {
    return this.http.get(this.api + "listarreservas?fechadesde=" + fechadesde + "&cod_sucursal=" + cod_sucursal + "&hora_actual=" + hora_actual);
  }

  listarReservasPorDepartamento(cod_producto : string, cod_sucursal : string)
  {
    return this.http.get(this.api + "listarreservaspordepartamento?cod_producto=" + cod_producto + "&cod_sucursal=" + cod_sucursal);
  }

  buscar(fecha_inicio_reserva: string, hora_ingreso : string, hora_inicio_reserva: string, fecha_fin_reserva : string, hora_fin_reserva : string, cod_sucursal : string, cod_producto : string)
  {
    return this.http.get(this.api + "buscar?fecha_inicio_reserva=" + fecha_inicio_reserva + "&hora_ingreso=" + hora_ingreso + "&hora_inicio_reserva=" + hora_inicio_reserva + "&fecha_fin_reserva=" + fecha_fin_reserva + "&hora_fin_reserva=" + hora_fin_reserva + "&cod_sucursal=" + cod_sucursal + "&cod_producto=" + cod_producto);
  }

  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }

  buscarReserva(cod_reserva : string)
  {
    return this.http.get(this.api + "buscarreserva?cod_reserva=" + cod_reserva);
  }

  buscarModificar(fecha_inicio_reserva: string, hora_ingreso : string, hora_inicio_reserva: string, fecha_fin_reserva : string, hora_fin_reserva : string, cod_sucursal : string, cod_producto : string, cod_reserva : string)
  {
    return this.http.get(this.api + "buscarmodificar?fecha_inicio_reserva=" + fecha_inicio_reserva + "&hora_ingreso=" + hora_ingreso + "&hora_inicio_reserva=" + hora_inicio_reserva + "&fecha_fin_reserva=" + fecha_fin_reserva + "&hora_fin_reserva=" + hora_fin_reserva + "&cod_sucursal=" + cod_sucursal + "&cod_producto=" + cod_producto + "&cod_reserva=" + cod_reserva);
  }

  actualizar(parametros: any){
    return this.http.post(this.api + "actualizar", parametros);
  }

  eliminar(parametros: any){
    return this.http.post(this.api + "eliminar", parametros);
  }
  
}