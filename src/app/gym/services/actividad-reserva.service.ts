import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ActividadReservaService {

 constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/gym/actividadreserva/";
  }
  
  listarActividadReserva(id_membresia: string, cod_actividad: string)
  {
    return this.http.get(this.api + "listaractividadreserva?id_membresia=" + id_membresia + "&cod_actividad=" + cod_actividad);
  }

  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }

  eliminar(parametros: any){
    return this.http.post(this.api + "eliminar", parametros);
  }

  listarReservasClientes(cod_actividad_horario: string, fecha_reserva: string)
  {
    return this.http.get(this.api + "listarreservasclientes?cod_actividad_horario=" + cod_actividad_horario + "&fecha_reserva=" + fecha_reserva);
  }

  extraerFechaActualServidor()
  {
    return this.http.get(this.api + "extraerfechaactualservidor");
  }

}
