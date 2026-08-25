import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import * as moment from 'moment';
import { ActividadHorarioService } from '../../services/actividad-horario.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { ActivatedRoute  } from '@angular/router';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import interactionPlugin from '@fullcalendar/interaction';
import { ActividadReservaService } from '../../services/actividad-reserva.service';
import { ListadoActividadReservaComponent } from '../listado-actividad-reserva/listado-actividad-reserva.component';

@Component({
  selector: 'app-horario-reserva-actividad',
  templateUrl: './horario-reserva-actividad.component.html',
  styleUrls: ['./horario-reserva-actividad.component.css']
})
export class HorarioReservaActividadComponent implements OnInit {
  @ViewChild(ListadoActividadReservaComponent) childlistadoactividadreserva!: ListadoActividadReservaComponent;
  datos : any;
  datosdiashorario: any;

  cod_actividad : string = "";
  actividad : string = "";

  fecha_inicio: string = "";
  fecha_fin: string = "";
  
  tipoformulario: string = "normal";

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    locale: esLocale,
    initialView: 'dayGridMonth',
    weekends: true,
    now: moment().format('YYYY-MM-DD'),

    

    eventClick: this.handleEventClick.bind(this),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay',
    }
  };

  loadinglistado : boolean = false;

  constructor(private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService, private rutaActiva: ActivatedRoute, private bodyStyleService: BodyStyleService, private actividadreserva: ActividadReservaService) {
  }

  ngOnInit(): void
  {
    this.cod_actividad = this.rutaActiva.snapshot.paramMap.get("cod_actividad")!;
    this.actividad = this.rutaActiva.snapshot.paramMap.get("actividad")!;

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

    const id_actividad_reserva = arg.event.extendedProps.id_actividad_reserva;
    if(id_actividad_reserva!=0)
    {
      
    }
    else
    {
      this.childlistadoactividadreserva.cod_actividad_horario = arg.event.extendedProps.cod_actividad_horario;
      this.childlistadoactividadreserva.fecha_reserva = fechaseleccionada;
      this.childlistadoactividadreserva.listarReservasClientes();
      $("#mymodallistadoactividadreserva").modal("show");
    }
  }

  listarActividadReserva()
  {
   this.loadinglistado = true;

    this.actividadreserva.listarActividadReserva("0", this.cod_actividad).subscribe( (data : any) =>
    {
      this.calendarOptions = {
        events: data
      };
      //this.data = data;
      this.loadinglistado = false;
      
      //this.childlistadocliente.listarClientes();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false; 
    });
  }
  
  clickDeshacer()
  {
    this.formularioNormal();
  }
  
  formularioNormal()
  {
    this.listarActividadReserva();
  }

}