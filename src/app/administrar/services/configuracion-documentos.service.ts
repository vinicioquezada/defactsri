import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionDocumentosService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/usuarios/configuraciondocumentos/";
  }

  listarConfiguracionDocumentos()
  {
    return this.http.get(this.api + "listarconfiguraciondocumentos");
  }

  actualizar(parametros: any){
    return this.http.post(this.api + "actualizar", parametros);
  }

}
