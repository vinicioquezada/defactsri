import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class TipoImpuestoService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/retencion/tipoimpuesto/";
  }

  listarTipoImpuestos()
  {
    return this.http.get(this.api + "listartipoimpuestos");
  }
}