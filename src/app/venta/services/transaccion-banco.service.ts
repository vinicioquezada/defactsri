import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class TransaccionBancoService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/ventas/transaccionbanco/";
  }

  buscarNumeroTransaccion(numero_transaccion: string)
  {
    return this.http.get(this.api + "buscarnumerotransaccion?numero_transaccion=" + numero_transaccion);
  }

}
