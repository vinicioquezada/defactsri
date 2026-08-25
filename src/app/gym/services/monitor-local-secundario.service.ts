import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class MonitorLocalSecundarioService {

  
  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrlLocalGym + "/";
  }
  
  registrarUsuarioDispositivoSecundario(id_usuario: string, nombres: string)
  {
    return this.http.get(this.api + "registrarusuariodispositivosecundario?id_usuario=" + id_usuario + "&nombres=" + nombres);
  }

  subirRostroUsuarioDispositivoSecundario(id_usuario: string, cod_cliente: string, nombres: string)
  {
    return this.http.get(this.api + "subirrostrousuariodispositivosecundario?id_usuario=" + id_usuario + "&cod_cliente=" + cod_cliente + "&nombres=" + nombres);
  }

  actualizarUsuarioDispositivoSecundario(id_usuario: string, nombres: string)
  {
    return this.http.get(this.api + "actualizarusuariodispositivosecundario?id_usuario=" + id_usuario + "&nombres=" + nombres);
  }

  eliminarRostroUsuarioDispositivoSecundario(id_usuario: string)
  {
    return this.http.get(this.api + "eliminarrostrousuariodispositivosecundario?id_usuario=" + id_usuario);
  }

  abrirPuertaSecundario()
  {
    return this.http.get(this.api + "abrirpuertasecundario");
  }

  mantenerPuertaSiempreCerradaSecundario()
  {
    return this.http.get(this.api + "mantenerpuertasiemprecerradasecundario");
  }

  buscarUsuarioDispositivoSecundario(id_usuario: string)
  {
    return this.http.get(this.api + "buscarusuariodispositivosecundario?id_usuario=" + id_usuario);
  }
}
