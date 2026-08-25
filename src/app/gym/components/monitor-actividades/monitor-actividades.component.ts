import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, timer } from 'rxjs';
import { MonitorService } from 'src/app/gym/services/monitor.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { MonitorLocalActividadService } from '../../services/monitor-local-actividad.service';
import { Socket1Service } from '../../services/socket1.service';
import { Socket2Service } from '../../services/socket2.service';
import { Socket3Service } from '../../services/socket3.service';

@Component({
  selector: 'app-monitor-actividades',
  templateUrl: './monitor-actividades.component.html',
  styleUrls: ['./monitor-actividades.component.css']
})
export class MonitorActividadesComponent implements OnInit {

  socketActivo1 = false;
  socketActivo2 = false;
  socketActivo3 = false;

  eventoSub1!: Subscription;
  estadoSub1!: Subscription;
  clearSub3!: Subscription;

  eventoSub2!: Subscription;
  estadoSub2!: Subscription;
  clearSub4!: Subscription;

  eventoSub3!: Subscription;
  estadoSub3!: Subscription;
  clearSub5!: Subscription;

  cod_sucursal: string = "";

  constructor(private monitorservice: MonitorService, private monitorlocalactividadservice: MonitorLocalActividadService, private usersession: UserSessionService, private toastr: ToastrService, private error:ErrorService, private socketService1: Socket1Service, private socketService2: Socket2Service, private socketService3: Socket3Service) { }

  ngOnInit(): void {
    this.mantenerPuertaSiempreCerrada1();
    this.mantenerPuertaSiempreCerrada2();
    this.mantenerPuertaSiempreCerrada3();
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
  }

  limpiarRecursosActividades()
  {
    if (this.eventoSub1)
    {
      this.eventoSub1.unsubscribe();
    }

    if (this.eventoSub2)
    {
      this.eventoSub2.unsubscribe();
    }

    if (this.eventoSub3)
    {
      this.eventoSub3.unsubscribe();
    }



    if (this.estadoSub1)
    {
      this.estadoSub1.unsubscribe();
    }

    if (this.estadoSub2)
    {
      this.estadoSub2.unsubscribe();
    }

    if (this.estadoSub3)
    {
      this.estadoSub3.unsubscribe();
    }

    this.socketService1.desconectar();
    this.socketService2.desconectar();
    this.socketService3.desconectar();
  }

  clickConectar1()
  {
    this.socketService1.conectar();

    this.estadoSub1 = this.socketService1
      .escucharEstadoConexion()
      .subscribe((estado) => {
        this.socketActivo1 = estado;
      });

    this.eventoSub1 = this.socketService1
      .escucharEventoRostro()
      .subscribe((data) => {
        
        this.buscarUsuarioActividadPorNumero(data.id, "1");        
        
      });
  }

  clickConectar2()
  {
    this.socketService2.conectar();

    this.estadoSub2 = this.socketService2
      .escucharEstadoConexion()
      .subscribe((estado) => {
        this.socketActivo2 = estado;
      });

    this.eventoSub2 = this.socketService2
      .escucharEventoRostro()
      .subscribe((data) => {

        this.buscarUsuarioActividadPorNumero(data.id, "2");        
        
      });
  }

  clickConectar3()
  {
    this.socketService3.conectar();

    this.estadoSub3 = this.socketService3
      .escucharEstadoConexion()
      .subscribe((estado) => {
        this.socketActivo3 = estado;
      });

    this.eventoSub3 = this.socketService3
      .escucharEventoRostro()
      .subscribe((data) => {

        this.buscarUsuarioActividadPorNumero(data.id, "3");        
        
      });
  }

  //El monitor Sauna llama a este método enviando el numero de usuario y este consulta la reserva en la nub
  buscarUsuarioActividadPorNumero(numero_usuario: string, cod_actividad: string)
  {
    this.monitorlocalactividadservice.buscarUsuarioActividadPorNumero(numero_usuario, cod_actividad).subscribe( (data : any) =>
    {
      this.consultarActividadReservada(data.cod_cliente, this.cod_sucursal, cod_actividad, data.id_usuario_actividad, data.cliente, data.actividad);
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }
  

  consultarActividadReservada(cod_cliente: string, cod_sucursal: string, cod_actividad: string, id_usuario_actividad: number, cliente: string, actividad: string)
  {
    this.monitorservice.consultarActividadReservada(cod_cliente, cod_sucursal, cod_actividad).subscribe( (data : any) =>
    {
      //Abre la puerta
     //console.log(data);
     if(cod_actividad=="1")
     {
      if(data.estado_valor)
      {
        this.toastr.success("EN HORARIO " + cliente + " EN " + actividad, "INFORMACIÓN DEL SISTEMA");
        this.abrirPuerta1();
        this.actualizarFechaAcceso(id_usuario_actividad, data.fecha_acceso);
      }
      else
      {
        this.toastr.error("FUERA DE HORARIO " + cliente + " EN " + actividad, "INFORMACIÓN DEL SISTEMA");
      }
     }

     if(cod_actividad=="2")
     {
      if(data.estado_valor)
      {
        this.toastr.success("EN HORARIO " + cliente + " EN " + actividad, "INFORMACIÓN DEL SISTEMA");
        this.abrirPuerta2();
        this.actualizarFechaAcceso(id_usuario_actividad, data.fecha_acceso);
      }
      else
      {
        this.toastr.error("FUERA DE HORARIO " + cliente + " EN " + actividad, "INFORMACIÓN DEL SISTEMA");
      }
     }

     if(cod_actividad=="3")
     {
      if(data.estado_valor)
      {
        this.toastr.success("EN HORARIO " + cliente + " EN " + actividad, "INFORMACIÓN DEL SISTEMA");
        this.abrirPuerta3();
        this.actualizarFechaAcceso(id_usuario_actividad, data.fecha_acceso);
      }
      else
      {
        this.toastr.error("FUERA DE HORARIO " + cliente + " EN " + actividad, "INFORMACIÓN DEL SISTEMA");
      }
     }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  ngOnDestroy(): void {
    this.limpiarRecursosActividades();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnload(event: Event) {
    this.limpiarRecursosActividades();
  }


  abrirPuerta1()
  {
    this.monitorlocalactividadservice.abrirPuerta1().subscribe( (data : any) =>
    {
      this.mantenerPuertaSiempreCerrada1();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    }); 
  }

  abrirPuerta2()
  {
    this.monitorlocalactividadservice.abrirPuerta2().subscribe( (data : any) =>
    {
      this.mantenerPuertaSiempreCerrada2();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    }); 
  }

  abrirPuerta3()
  {
    this.monitorlocalactividadservice.abrirPuerta3().subscribe( (data : any) =>
    {
      this.mantenerPuertaSiempreCerrada3();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    }); 
  }

  mantenerPuertaSiempreCerrada1()
  {
    this.monitorlocalactividadservice.mantenerPuertaSiempreCerrada1().subscribe( (data : any) =>
    {
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
    
  }

  mantenerPuertaSiempreCerrada2()
  {
    this.monitorlocalactividadservice.mantenerPuertaSiempreCerrada2().subscribe( (data : any) =>
    {
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
    
  }

  mantenerPuertaSiempreCerrada3()
  {
    this.monitorlocalactividadservice.mantenerPuertaSiempreCerrada3().subscribe( (data : any) =>
    {
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
    
  }

  actualizarFechaAcceso(id_usuario_actividad: number, fecha_acceso: string)
  {
    const parametros = {
      "id_usuario_actividad": id_usuario_actividad,
      "fecha_acceso": fecha_acceso
    }
    this.monitorlocalactividadservice.actualizarFechaAcceso(parametros).subscribe( (data : any) =>
    {

    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    }); 
  }


}
