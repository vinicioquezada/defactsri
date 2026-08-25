import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class WsService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrlSri + "/api/proyecto/proyecto/";
  }

  subirLogo(form: FormData){
    return this.http.post(this.api + "subirlogo", form);
  }

  subirFirma(form: FormData){
    return this.http.post(this.api + "subirfirma", form);
  }

  /*
  subirImagenPedido(form: FormData){
    return this.http.post(this.api + "subirimagenpedido", form);
  }

  eliminarImagenPedido(form: FormData){
    return this.http.post(this.api + "eliminarimagenpedido", form);
  }
  */
  
}
