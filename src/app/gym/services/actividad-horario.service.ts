import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ActividadHorarioService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/gym/actividadhorario/";
  }

  listarActividadHorarios(cod_actividad: string)
  {
    return this.http.get(this.api + "listaractividadhorarios?cod_actividad=" + cod_actividad);
  }

  buscar(cod_actividad: string, dia: string, hora_inicio: string, hora_fin: string)
  {
    return this.http.get(this.api + "buscar?cod_actividad=" + cod_actividad + "&dia=" + dia + "&hora_inicio=" + hora_inicio + "&hora_fin=" + hora_fin);
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

  listarDiasActividadHorario(cod_actividad: string)
  {
    return this.http.get(this.api + "listardiasactividadhorario?cod_actividad=" + cod_actividad);
  }

  listarActividadHorarioDia(cod_actividad: string, fecha_reserva: string, dia: string)
  {
    return this.http.get(this.api + "listaractividadhorariodia?cod_actividad=" + cod_actividad + "&fecha_reserva=" + fecha_reserva + "&dia=" + dia);
  }
}