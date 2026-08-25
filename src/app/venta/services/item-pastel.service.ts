import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ItemPastelService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/ventas/itempastel/";
  }

  listarItemPastel()
  {
    return this.http.get(this.api + "listaritempastel");
  }

  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }

}