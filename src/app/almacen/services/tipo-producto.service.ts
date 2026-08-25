import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class TipoProductoService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/almacen/tipoproducto/";
  }

  listarTiposProductos()
  {
    return this.http.get(this.api + "listartiposproductos");
  }
}