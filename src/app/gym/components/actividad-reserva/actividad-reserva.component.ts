import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ActividadHorarioService } from '../../services/actividad-horario.service';
import { ActividadHorarioFormComponent } from '../actividad-horario/actividad-horario-form/actividad-horario-form.component';
import { SwalService } from 'src/app/shared/services/swal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import interactionPlugin from '@fullcalendar/interaction';
import { ActividadReservaService } from '../../services/actividad-reserva.service';
import { ActividadReservaFormComponent } from './actividad-reserva-form/actividad-reserva-form.component';
import { ListadoActividadReservaComponent } from '../listado-actividad-reserva/listado-actividad-reserva.component';
import { lastValueFrom } from 'rxjs';
import { MonitorLocalActividadService } from '../../services/monitor-local-actividad.service';
import { MonitorService } from '../../services/monitor.service';

@Component({
  selector: 'app-actividad-reserva',
  templateUrl: './actividad-reserva.component.html',
  styleUrls: ['./actividad-reserva.component.css']
})
export class ActividadReservaComponent implements OnInit {
  @ViewChild(ActividadReservaFormComponent) childactividadreservaform!: ActividadReservaFormComponent;
  @ViewChild(ListadoActividadReservaComponent) childlistadoactividadreserva!: ListadoActividadReservaComponent;
  datos : any;
  datosdiashorario: any;

  cod_actividad : string = "";
  actividad : string = "";
  id_membresia: string = "";
  cod_cliente: string = "";
  cliente: string = "";
  fecha_inicio: string = "";
  fecha_fin: string = "";

  asociado: boolean = true;
  
  tipoformulario: string = "normal";

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    locale: esLocale,
    initialView: 'dayGridMonth',
    weekends: true,
    eventClick: this.handleEventClick.bind(this),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay',
    },
    dateClick: this.handleDateClick.bind(this)
  };

  fecha_actual: string = "";

  constructor(private actividadhorarioservice: ActividadHorarioService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService, private rutaActiva: ActivatedRoute, private bodyStyleService: BodyStyleService, private actividadreserva: ActividadReservaService, private monitorlocalactividadservice: MonitorLocalActividadService) {
  }

  ngOnInit(): void
  {
    this.cod_actividad = this.rutaActiva.snapshot.paramMap.get("cod_actividad")!;
    this.actividad = this.rutaActiva.snapshot.paramMap.get("actividad")!;
    this.id_membresia = this.rutaActiva.snapshot.paramMap.get("id_membresia")!;
    this.cod_cliente = this.rutaActiva.snapshot.paramMap.get("cod_cliente")!;
    this.cliente = this.rutaActiva.snapshot.paramMap.get("cliente")!;
    this.fecha_inicio = this.rutaActiva.snapshot.paramMap.get("fecha_inicio")!;
    this.fecha_fin = this.rutaActiva.snapshot.paramMap.get("fecha_fin")!;

    this.calendarOptions.validRange = {
      start: this.fecha_inicio,
      end: this.fecha_fin
    };

    this.formularioNormal();
    this.bodyStyleService.resetBodyStyles();

  }

  async handleEventClick(arg: any)
  {

    const fechaseleccionada = moment(arg.event.start).format('YYYY-MM-DD');

    let ban = 0 ;
    let mensajeboton = "Eliminar Reserva";
    if (moment(fechaseleccionada).isBefore(moment(), 'day'))
    {
      ban=1;
      mensajeboton = "Ok";
    }

    const id_actividad_reserva = arg.event.extendedProps.id_actividad_reserva;
    if(id_actividad_reserva!=0)
    {
      const ok = await this.swalservice.alertConfirmRequerido({
        title: "Horario " + arg.event.title,
        text: moment(arg.event.start).format('HH:mm:ss') + " - " + moment(arg.event.end).format('HH:mm:ss'),
        icon: "info",
        confirmText: mensajeboton,
        cancelText: "Cerrar"
      });

      if (ok) {

        if(ban==0)
        {
          const ok = await this.swalservice.alertConfirmRequerido({
            title: "ELIMINAR REGISTRO",
            text: 'Confirmar para eliminar el registro seleccionado',
            icon: "info",
            confirmText: "Si, Eliminar",
            cancelText: "No, Cerrar"
          });

          if (ok)
          {
            this.eliminar(id_actividad_reserva);
          }
        }
      }
    }
    else
    {
      this.childlistadoactividadreserva.cod_actividad_horario = arg.event.extendedProps.cod_actividad_horario;
      this.childlistadoactividadreserva.fecha_reserva = fechaseleccionada;
      this.childlistadoactividadreserva.listarReservasClientes();
      $("#mymodallistadoactividadreserva").modal("show");
    }
  }

  async handleDateClick(arg: any)
  {
    const fechaseleccionada = arg.dateStr;

    if (moment(fechaseleccionada).isBefore(moment(), 'day'))
    {
      await this.swalservice.alertOkRequerido({
        title: "Control del Sistema",
        text: "No se pueden registrar reservas en fechas pasadas.",
        icon: "warning"
      });
      return;
    }

    const fecha = arg.date;
    const dias = [
      'DOMINGO',
      'LUNES',
      'MARTES',
      'MIERCOLES',
      'JUEVES',
      'VIERNES',
      'SABADO'
    ];

    const nombredia = dias[fecha.getDay()];

    const existe = this.datosdiashorario.some((item: any) => item.dia == nombredia);

    if (!existe) {
      const ok = await this.swalservice.alertOkRequerido({
          title: "Control del Sistema",
          text: 'El día ' + nombredia + ' no está registrado para asignar reservas',
          icon: 'warning'
        });
      return;
    }

    this.childactividadreservaform.cod_actividad = this.cod_actividad;
    this.childactividadreservaform.dia = nombredia;
    this.childactividadreservaform.id_membresia = this.id_membresia;
    this.childactividadreservaform.fecha_reserva = fechaseleccionada;
    this.childactividadreservaform.listarActividadHorarioDia();
    $("#mymodalactividadreservaform").modal("show");
  }

  clickDeshacer()
  {
    this.formularioNormal();
    //this.childactividadreserva.formularioNormal();
  }
  
  async formularioNormal()
  {
    this.swalservice.iniciarLoading("Cargando...");
    await this.extraerFechaActualServidor();
    await this.listarDiasActividadHorario();
    await this.listarActividadReserva();
    await this.buscarUsuarioActividadPorCodigo(this.cod_cliente, this.cod_actividad);
    //buscar fecha del servidor
    this.swalservice.close();
    if(this.asociado==false)
    {
      const ok = await this.swalservice.alertConfirmRequerido({
        title: "Información del Sistema",
        text: 'El cliente no esta asociado con el dispositivo para ' + this.actividad,
        icon: "info",
        confirmText: "Sí, Asociar",
        cancelText: "No, Cerrar"
      });

      if (ok) {
        this.guardarUsuarioActividad();
      }
    }
  }

  async extraerFechaActualServidor()
  {
    try
    {
    const data: any = await lastValueFrom(this.actividadreserva.extraerFechaActualServidor());
    this.calendarOptions = {
        now: data.fecha_actual
      };
    } catch (err: any) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.calendarOptions = {
        now: moment().format('YYYY-MM-DD')
      };
      this.fecha_actual = moment().format('YYYY-MM-DD');
    }
  }

  async listarDiasActividadHorario()
  {
    try
    {
    const data: any = await lastValueFrom(this.actividadhorarioservice.listarDiasActividadHorario(this.cod_actividad));
    this.datosdiashorario = data;
    } catch (err: any) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    }
  }

  async listarActividadReserva()
  {
    try
    {
      const data: any = await lastValueFrom(this.actividadreserva.listarActividadReserva(this.id_membresia, this.cod_actividad));
      this.calendarOptions = {
        events: data
      };
    } catch (err: any) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    }
  }

  async buscarUsuarioActividadPorCodigo(cod_cliente: string, cod_actividad: string)
  {
    try
    {
    const data: any = await lastValueFrom(this.monitorlocalactividadservice.buscarUsuarioActividadPorCodigo(cod_cliente, cod_actividad));
      if(data.id_usuario_actividad==false)
      {
        this.asociado = false;
      }
    } catch (err: any) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    }
  }

  recibirDatosActividadReservaform(): void
  {
      this.formularioNormal();
      $("#mymodalactividadreservaform").modal("hide");
  }

  eliminar(id_actividad_reserva: number)
  {
    this.swalservice.iniciarLoading("Eliminando...");

    const parametros = {
      'id_actividad_reserva' : id_actividad_reserva
    };
    
    this.actividadreserva.eliminar(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();
      if (data.estado == true)
      {
        this.formularioNormal();
        this.toastr.success("Registro eliminado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Registro no se pudo eliminar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
    });
  }

  guardarUsuarioActividad()
  {
    this.swalservice.iniciarLoading("Asociando con el dispositivo...");
    const parametros = {
        "cod_actividad": this.cod_actividad,
        "cod_cliente": this.cod_cliente,
        "nombres": this.cliente,
        "fecha_acceso": this.fecha_actual
    }
    this.monitorlocalactividadservice.guardarUsuarioActividad(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();
      if (data.estado == true)
      {
        this.asociado = true;
        this.toastr.success("Cliente Asociado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.asociado = false;
        this.toastr.error("Cliente no se pudo asociar con el dispositivo, intente nuevamente", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.swalservice.close();
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }
}