import { Component, HostListener, OnInit } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription, timer } from 'rxjs';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { MonitorLocalService } from '../../services/monitor-local.service';
import { MonitorService } from '../../services/monitor.service';
import { CalcularMembresiaService } from '../../services/calcular-membresia.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MonitorLocalSecundarioService } from '../../services/monitor-local-secundario.service';
import { SocketSecundarioService } from '../../services/socket-secundario.service';

export interface EstadoPlan {
  activo: boolean;
  estado: 'ACTIVO' | 'POR CADUCAR' | 'CADUCADO' | 'POR INICIAR';
  dias: number;
}

export interface EstadoHorario {
  enHorario: boolean;
  estado: 'EN HORARIO' | 'FUERA DE HORARIO';
}

@Component({
  selector: 'app-monitor-secundario',
  templateUrl: './monitor-secundario.component.html',
  styleUrls: ['./monitor-secundario.component.css']
})
export class MonitorSecundarioComponent implements OnInit {
  
  loading : boolean = false;

  eventoSub!: Subscription;
  estadoSub!: Subscription;
  clearSub!: Subscription;

  ultimoEvento: any = null;
  socketActivo = false;

  monitordata: any = {
    cod_cliente: 0,
    numero_usuario: 0,
    tipo_usuario: '',
    identificacion: '',
    cliente: '',
    membresia: '',
    horario: '',
    vigencia: '',
    dias_restantes: '',
    estado_plan: '',
    estado_valor: false
  };

  cod_sucursal: string = "";
  onnline: boolean = true;
  asistencia_gimnasio: string = ""

  constructor(private socketsecundarioservice: SocketSecundarioService, private monitorlocalservice: MonitorLocalService, private monitorlocalsecundarioservice: MonitorLocalSecundarioService, private usersession: UserSessionService, private calcularmembresiaservice: CalcularMembresiaService, private monitorservice: MonitorService, private toastr: ToastrService, private error:ErrorService) {}


  ngOnInit(): void {
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.asistencia_gimnasio = this.usersession.getConfiguracion("asistencia_gimnasio");
    this.mantenerPuertaSiempreCerrada();
    this.conectar();
  }

  limpiarMonitor()
  {
    this.monitordata = {
      cod_cliente: 0,
      numero_usuario: 0,
      tipo_usuario: '',
      identificacion: '',
      cliente: '',
      membresia: '',
      horario: '',
      vigencia: '',
      dias_restantes: '',
      estado_plan: '',
      estado_valor: false
    };
  }

  conectar()
  {
    this.socketsecundarioservice.conectar();

    this.estadoSub = this.socketsecundarioservice
      .escucharEstadoConexion()
      .subscribe((estado) => {
        this.socketActivo = estado;
      });

    this.eventoSub = this.socketsecundarioservice
      .escucharEventoRostro()
      .subscribe((data) => {

        if (this.clearSub) {
          this.clearSub.unsubscribe();
        }

        if(this.onnline)
        {
          this.consultarUsuarioMembresiaOnnLine(data.id);
        }
        else
        {
          this.consultarUsuarioMembresiaOffLine(data.id);
        }



      });
  }

  ngOnDestroy(): void {
    this.limpiarRecursos();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnload(event: Event) {
    this.limpiarRecursos();
  }

  limpiarRecursos()
  {
    if (this.eventoSub)
    {
      this.eventoSub.unsubscribe();
    }

    if (this.estadoSub)
    {
      this.estadoSub.unsubscribe();
    }

    if (this.clearSub)
    {
      this.clearSub.unsubscribe();
    }

    this.socketsecundarioservice.desconectar();

    this.limpiarMonitor();
  }

  consultarUsuarioMembresiaOffLine(numero_usuario: string)
  {
    this.loading = true;
    
    this.monitorlocalservice.consultarUsuarioMembresia(numero_usuario).subscribe( (usuario : any) =>
    {
        if (usuario.estado == false)
        {
            this.monitordata = {
            cod_cliente: -1,
            numero_usuario: 0,
            tipo_usuario: 'No Aplica',
            identificacion: 'No Aplica',
            cliente: 'No Aplica',
            membresia: 'No Aplica',
            horario: 'No Aplica',
            vigencia: 'No Aplica',
            dias_restantes: 'No Aplica',
            estado_plan: 'Usuario no cuenta con una membresia registrada',
            estado_valor: false
          };
        }
        else
        {
          let fecha_inicio = usuario.fecha_inicio + " " + usuario.hora_inicio; 
          let fecha_fin = usuario.fecha_fin + " " + usuario.hora_fin;
          let estado_valor = false;
          let horario = this.calcularmembresiaservice.obtenerHorarioPlan(usuario.lunes, usuario.martes, usuario.miercoles, usuario.jueves, usuario.viernes, usuario.sabado, usuario.domingo);
                        
          
          let estadoplan = this.calcularmembresiaservice.verificarPlanActivo(fecha_inicio, fecha_fin);
          let mensajeestadohorario = "";
          let mensajecompartido = "";
          if(estadoplan.activo==true)
          {
              let estadohorario = this.calcularmembresiaservice.verificarHorarioPlan(usuario.lunes, usuario.martes, usuario.miercoles, usuario.jueves, usuario.viernes, usuario.sabado, usuario.domingo, usuario.hora_inicio, usuario.hora_fin);
              if (estadohorario.enHorario == true)
              {
                  mensajeestadohorario = estadohorario.estado;
                  //estado_valor = true;
                  if(usuario.compartido == 1)
                  {
                    mensajecompartido = "COMPARTIDA";
                    estado_valor = true;
                  }
                  else
                  {
                    mensajecompartido = "NO COMPARTIDA";
                    estado_valor = false;
                  }
              }
              else
              {
                  mensajeestadohorario = estadohorario.estado;
                  estado_valor = false;
              }
          }

          

          //Falta Control Estricto
          this.monitordata = {
            cod_cliente: usuario.cod_cliente,
            numero_usuario: usuario.id_cliente,
            tipo_usuario: usuario.tipo_usuario,
            identificacion: usuario.identificacion,
            cliente: usuario.cliente,
            membresia: usuario.plan,
            horario: horario,
            vigencia: "F.I: " + fecha_inicio + " - " + "F.F: " + fecha_fin,
            dias_restantes: estadoplan.dias + " dias",
            estado_plan: estadoplan.estado + " " + mensajeestadohorario + " " + mensajecompartido,
            estado_valor: estado_valor
          };

          if(estado_valor && usuario.compartido == 1)
          {
            this.abrirPuerta();
          }

        }


        this.clearSub = timer(10000).subscribe(() => {
          this.limpiarMonitor();
        });

        this.loading = false;
        
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loading = false;
    });
  }

  consultarUsuarioMembresiaOnnLine(numero_usuario: string)
  {
    this.loading = true;

    this.monitorservice.consultarUsuarioMembresia(this.cod_sucursal, numero_usuario, this.asistencia_gimnasio).subscribe( (usuario : any) =>
    {
        if (usuario.estado == false)
        {
            this.monitordata = {
            cod_cliente: -1,
            numero_usuario: 0,
            tipo_usuario: 'No Aplica',
            identificacion: 'No Aplica',
            cliente: 'No Aplica',
            membresia: 'No Aplica',
            horario: 'No Aplica',
            vigencia: 'No Aplica',
            dias_restantes: 'No Aplica',
            estado_plan: 'Usuario no cuenta con una membresia registrada',
            estado_valor: false
          };

        }
        else
        {
          //Falta Control Estricto
          let mensajecompartido = "";
          let estado_valor = false;
          if(usuario.compartido == 1)
          {
            mensajecompartido = "COMPARTIDA";
            estado_valor = true;
          }
          else
          {
            mensajecompartido = "NO COMPARTIDA";
            estado_valor = false;
          }

          this.monitordata = {
            cod_cliente: usuario.cod_cliente,
            numero_usuario: usuario.numero_usuario,
            tipo_usuario: usuario.tipo_usuario_gym,
            identificacion: usuario.cedula,
            cliente: usuario.nombre + " " + usuario.apellido,
            membresia: usuario.plan,
            horario: usuario.horario,
            vigencia: usuario.vigencia,
            dias_restantes: usuario.dias_restantes,
            estado_plan: mensajecompartido,
            estado_valor: estado_valor
          };

          if(estado_valor)
          {
            this.abrirPuerta();
          }

          this.buscarUsuarioLocal(usuario);

        }


        this.clearSub = timer(10000).subscribe(() => {
          this.limpiarMonitor();
        });

        this.loading = false;
        
      }, err => {
        this.loading = false;
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  buscarUsuarioLocal(usuario: any)
  {    
    this.monitorlocalservice.buscarUsuarioLocal(usuario.numero_usuario).subscribe( (data : any) =>
    {
      if(usuario.cod_factura_venta == data.cod_factura_venta)
      {
        if(usuario.compartido == data.compartido && usuario.plan == data.plan)
        {

        }
        else
        {
          this.actualizarMembresiaUsuario(usuario);
        }
        
      }
      else
      {
        this.actualizarMembresiaUsuario(usuario);
      }
    }, err => {
      
    });
  }

  actualizarMembresiaUsuario(usuario: any)
  {
    let parametros = {
      "cod_factura_venta": usuario.cod_factura_venta,
      "plan": usuario.plan,
      "lunes": usuario.lunes,
      "martes": usuario.martes,
      "miercoles": usuario.miercoles,
      "jueves": usuario.jueves,
      "viernes": usuario.viernes,
      "sabado": usuario.sabado,
      "domingo": usuario.domingo,
      "hora_inicio": usuario.hora_inicio,
      "hora_fin": usuario.hora_fin,
      "fecha_inicio": usuario.fecha_inicio,
      "fecha_fin": usuario.fecha_fin,
      "id_cliente": usuario.numero_usuario,
      "compartido": usuario.compartido
    };

    this.monitorlocalservice.actualizarMembresiaUsuario(parametros).subscribe( (data : any) =>
    {
      if (data.estado == true)
      {
        
      }
    }, err => {
      
    });
  }

  abrirPuerta()
  {
    this.monitorlocalsecundarioservice.abrirPuertaSecundario().subscribe( (data : any) =>
    {
      this.mantenerPuertaSiempreCerrada();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
    
  }

  mantenerPuertaSiempreCerrada()
  {
    this.monitorlocalsecundarioservice.mantenerPuertaSiempreCerradaSecundario().subscribe( (data : any) =>
    {
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
    
  }

  cambiarModoMonitor() {
    const proximoModo = this.onnline ? 'OFFLINE' : 'ONLINE';
    
    Swal.fire({
      title: `¿DESEA CAMBIAR A MODO ${proximoModo}?`,
      text: `El monitor pasará a trabajar en modo ${proximoModo.toLowerCase()}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Si, Cambiar a ${proximoModo}`,
      cancelButtonText: 'No, Mantener actual'
    }).then((result) => {
      if (result.isConfirmed) {
  
        this.onnline = !this.onnline;
  
        this.limpiarMonitor();
        
        if (this.clearSub) {
          this.clearSub.unsubscribe();
        }
      }
    });
  }

}