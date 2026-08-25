import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class EliminacionProductoService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/almacen/eliminacionproducto/";
  }

  emitirSolicitudEliminacion(parametros: any){
    return this.http.post(this.api + "emitirsolicitudeliminacion", parametros);
  }

  verificarSolicitudEliminacion(cod_producto: string, codigo: string, proceso: string){
    return this.http.get(this.api + "verificarsolicitudeliminacion?cod_producto=" + cod_producto + "&codigo=" + codigo + "&proceso=" + proceso);
  }

  listarSolicitudesEliminacion(fechadesde: string, fechahasta: string, cod_sucursal : string)
  {
    return this.http.get(this.api + "listarsolicitudeseliminacion?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal);
  }
}
