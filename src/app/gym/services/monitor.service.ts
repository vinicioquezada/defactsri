import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonitorService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/monitor/";
  }

  actualizarEstadoEmparejamiento(parametros: any){
    return this.http.post(this.api + "actualizarestadoemparejamiento", parametros);
  }

  consultarUsuarioMembresia(cod_sucursal: string, numero_usuario: string, asistencia_gimnasio: string)
  {
    return this.http.get(this.api + "consultarusuariomembresia?cod_sucursal=" + cod_sucursal + "&numero_usuario=" + numero_usuario + "&asistencia_gimnasio=" + asistencia_gimnasio);
  }

  subirImagenNube(datos:any):Observable<any>{
    return this.http.post(this.api + "subirimagennube", datos);
  }

  eliminarImagenNube(parametros: any){
    return this.http.post(this.api + "eliminarimagennube", parametros);
  }

  descargarImagenUsuario(imagen: string) {
    return this.http.get(this.api + "descargarimagenusuario?imagen=" + imagen, { responseType: 'blob' });
  }


  

  consultarActividadReservada(cod_cliente: string, cod_sucursal: string, cod_actividad: string)
  {
    return this.http.get(this.api + "consultaractividadreservada?cod_cliente=" + cod_cliente + "&cod_sucursal=" + cod_sucursal + "&cod_actividad=" + cod_actividad);
  }
}
