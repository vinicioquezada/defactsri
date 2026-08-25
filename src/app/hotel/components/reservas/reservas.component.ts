import { Component, OnInit, ViewChild } from '@angular/core';
import { ReservasService } from '../../services/reservas.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import { ListadoClienteComponent } from 'src/app/shared/components/listado-cliente/listado-cliente.component';
import { ClienteFormComponent } from 'src/app/venta/components/cliente/cliente-form/cliente-form.component';
import { Router, ActivatedRoute } from '@angular/router';
//import Swal from 'sweetalert2/dist/sweetalert2.js';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import interactionPlugin from '@fullcalendar/interaction';
import { SwalService } from 'src/app/shared/services/swal.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {

  @ViewChild(ListadoClienteComponent) childlistadocliente: any;
  @ViewChild(ClienteFormComponent) clienteformcomponent: any;

  cod_sucursal : string = "";
  datossucursal : any;

  cod_producto : string = "";

  loadinglistado : boolean = false;
  

  flagocultarboton : boolean = false;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    locale: esLocale,
    initialView: 'dayGridMonth',
    weekends: true,
    now: this.obtenerFechaOperativa(),
    eventClick: this.handleEventClick.bind(this),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay',
    },
    dateClick: this.handleDateClick.bind(this),
    datesSet: this.reaplicarReservas.bind(this)
  };

  titulo : string = "";

  cod_reserva : string = "";
  cod_cliente : string = "";
  cliente : string = "";
  numero_identificacion : string = "";
  celular : string = "";

  fecha_ingreso : string = "";
  hora_ingreso : string = "";
  hora_inicio_reserva : string = "12:00";
  fecha_fin_reserva : string = "";
  hora_fin_reserva : string = "12:00";
  fecha_salida : string = "";

  flagcliente : boolean = false;
  flagfechaingreso : boolean = false;
  flaghoraingreso : boolean = false;
  flagfechafinreserva : boolean = false;
  flaghorainicioreserva : boolean = false;
  flaghorafinreserva : boolean = false;

  tiemporestante: string = "";
  reservasMarcadas: string[] = [];

  constructor(private rutaActiva: ActivatedRoute, private router : Router, private toastr: ToastrService, private error:ErrorService, private reservasservice:ReservasService, private bodyStyleService: BodyStyleService, private usersession: UserSessionService, private swalservice: SwalService) {
    
   }

  ngOnInit(): void {
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.formularioNormal();
    this.bodyStyleService.resetBodyStyles();
  }

  async handleEventClick(clickInfo: EventClickArg) {
    const ok = await this.swalservice.alertInfo(`${clickInfo.event.title}`);
  }

  obtenerFechaOperativa(): string {
    const ahora = moment();
    const horaActual = ahora.hour();
    if (horaActual < 12) {
      return ahora.subtract(1, 'day').format('YYYY-MM-DD');
    } else {
      return ahora.format('YYYY-MM-DD');
    }
  }

  async handleDateClick(arg: any)
  {
    const cantidadDias = await this.swalservice.alertNumberConValorInicial({
      title: 'Asignar Dias de Reservas',
      text: 'Ingresa la cantidad de dias de reservas',
      valorInicial: '1',
      confirmText: 'Aceptar',
      cancelText: 'Cancelar'
    });

    if (cantidadDias == null) {
      return;
    }
        this.tiemporestante = "";
        this.fecha_ingreso = arg.dateStr;

       
        const fechaInicio = moment(this.fecha_ingreso);

        const fechaFinal = moment(fechaInicio).add(cantidadDias - 1, 'days');
        const fechaFinalISO = fechaFinal.format('YYYY-MM-DD');

        this.fecha_fin_reserva = fechaFinalISO;
        this.changeFechaFinReserva();

        this.limpiarSeleccion();

        // Marcar visualmente el rango de días
        for (let i = 0; i < cantidadDias; i++) {
          const fecha = moment(fechaInicio).add(i, 'days').format('YYYY-MM-DD');
          this.reservasMarcadas.push(fecha);
          const selector = `.fc-daygrid-day[data-date="${fecha}"]`;
          const celda = document.querySelector(selector);
          if (celda) celda.classList.add('fc-day-reserva');
        }
      
   
  }

  reaplicarReservas() {
    if (!this.reservasMarcadas || this.reservasMarcadas.length === 0) return;

    this.reservasMarcadas.forEach(fecha => {
      const selector = `.fc-daygrid-day[data-date="${fecha}"]`;
      const celda = document.querySelector(selector);
      if (celda) celda.classList.add('fc-day-reserva');
    });
  }

  limpiarSeleccion() {
    document.querySelectorAll('.fc-daygrid-day.fc-day-reserva').forEach(el => {
      el.classList.remove('fc-day-reserva');
    });
    this.reservasMarcadas = [];
  }

  changeFechaFinReserva()
  {
    let fecha_formateada1 = this.fecha_fin_reserva + " " + this.hora_fin_reserva;
    //alert(fecha_formateada1); 
    let fecha_aumentada = moment(fecha_formateada1).add(1, "days");
    this.fecha_salida = moment(fecha_aumentada).format("YYYY-MM-DD");
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  formularioNormal()
  {
    this.cod_producto = this.rutaActiva.snapshot.paramMap.get("cod_producto")!;
    let crud = this.rutaActiva.snapshot.paramMap.get("crud")!;
    this.listarReservasPorDepartamento();

    this.cod_cliente = "";
    this.cliente = "";
    this.numero_identificacion = "";
    this.celular = "";

    this.limpiarSeleccion();
    
    const horaActual = moment().hour();
    if (horaActual < 12) {
      this.fecha_ingreso = moment().subtract(1, 'day').format('YYYY-MM-DD');
      this.hora_ingreso = moment().format('HH:mm:ss');
      this.hora_inicio_reserva = "12:00";
      this.hora_fin_reserva = "12:00";
      this.fecha_fin_reserva = this.fecha_ingreso;
      let fecha_aumentada = moment(this.fecha_ingreso).add(1, "days");
      this.fecha_salida = moment(fecha_aumentada).format("YYYY-MM-DD");

      const finDia = moment(this.fecha_ingreso).add(1, 'day').hour(12).minute(0).second(0);
      const duracion = moment.duration(finDia.diff(moment()));
      this.tiemporestante = `Tiempo restante día operativo: ${duracion.hours()} horas ${duracion.minutes()} minutos`;
    } else {
      this.fecha_ingreso = moment().format('YYYY-MM-DD');
      this.hora_ingreso = moment().format('HH:mm:ss');
      this.hora_inicio_reserva = "12:00";
      this.hora_fin_reserva = "12:00";
      this.fecha_fin_reserva = moment().format('YYYY-MM-DD');
      this.fecha_salida = moment().add(1, "days").format('YYYY-MM-DD');

      const finDia = moment().add(1, 'day').hour(12).minute(0).second(0);
      const duracion = moment.duration(finDia.diff(moment()));
      this.tiemporestante = `Tiempo restante día operativo: ${duracion.hours()} horas ${duracion.minutes()} minutos`;
    }

    this.flagNormal();

    if(crud=="guardar")
    {
      this.titulo = "Nueva Reserva";
      this.cod_reserva = moment().unix().toString();
      this.flagocultarboton = false;
    }
    else
    {
      this.titulo = "Modificar Reserva";
      this.cod_reserva = this.rutaActiva.snapshot.paramMap.get("cod_reserva")!;
      this.tiemporestante = "";
      this.flagocultarboton = true;
      this.buscarReserva();
    }
  }

  listarReservasPorDepartamento()
  {    
    this.loadinglistado = true;
    

    this.reservasservice.listarReservasPorDepartamento(this.cod_producto, this.cod_sucursal).subscribe( (data : any) =>
    {
      this.calendarOptions = {
        events: data
      };
      //this.data = data;
      this.loadinglistado = false;
      
      this.childlistadocliente.listarClientes();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  clickNuevoCliente()
  {
    this.clienteformcomponent.nombreformulario="AGREGAR";
    this.clienteformcomponent.formularioNormal();
    $("#mymodalformcliente").modal("show");
  }

  clickListarCliente()
  {
    this.childlistadocliente.filterpost="";
    $("#mymodallistarclientes").modal("show");
  }

  recibirDatosCliente(datosrecibidoscliente: any)
  {
    this.cod_cliente = datosrecibidoscliente.cod_cliente;
    this.cliente = datosrecibidoscliente.apellido + " " + datosrecibidoscliente.nombre;
    this.numero_identificacion = datosrecibidoscliente.cedula;
    this.celular = datosrecibidoscliente.celular;
    $("#mymodallistarclientes").modal("hide");
  }

  recibirDatosNuevoCliente(datosrecibidoscliente: any)
  {
    this.cod_cliente = datosrecibidoscliente.cod_cliente;
    this.cliente = datosrecibidoscliente.apellido + " " + datosrecibidoscliente.nombre;
    this.numero_identificacion = datosrecibidoscliente.cedula;
    $("#mymodalformcliente").modal("hide");
  }

  clickGuardar()
  {
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      this.toastr.warning("Algunos campos no estan llenos, son obligatorios", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      let fecha1 = new Date(this.fecha_ingreso);
      let fecha2 = new Date(this.fecha_fin_reserva);
      if(fecha2>=fecha1)
      {
        this.buscar();
      }
      else
      {
        this.toastr.warning("La fecha de inicio no puede ser mayor a la fecha de salida", "INFORMACIÓN DEL SISTEMA");
      }
    }
  }

  clickActualizar()
  {
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      this.toastr.warning("Algunos campos no estan llenos, son obligatorios", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      let fecha1 = new Date(this.fecha_ingreso);
      let fecha2 = new Date(this.fecha_fin_reserva);
      if(fecha2>=fecha1)
      {
        this.buscarModificar();
      }
      else
      {
        this.toastr.warning("La fecha de inicio no puede ser mayor a la fecha de salida", "INFORMACIÓN DEL SISTEMA");
      }
    }
  }

  async clickAnular()
  {
    const ok = await this.swalservice.alertConfirmRequerido({
          title: "ANULAR RESERVA",
          text: "Desea anular la reserva",
          icon: "info",
          confirmText: "Si, Anular",
          cancelText: "No, Cerrar"
        });

        if (ok)
        {
          this.eliminar();
        }
  }

  async eliminar()
  {
    this.swalservice.iniciarLoading("Eliminando Reserva...");
    try
    {
    
      const parametros = {
        'cod_reserva' : this.cod_reserva,
        'estado' : 0,
      };

      let data: any = await lastValueFrom(this.reservasservice.eliminar(parametros));
    
      if (data.estado == true)
      {
        this.toastr.success("Registro anulado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        this.router.navigate(["/menuhotel/exploradordepartamentos"]);
      }
      else
      {
        const ok = await this.swalservice.alertError("Registro no se pudo anular, vuelva a intertarlo por favor");
      }
    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
      this.swalservice.close();
    }
  }

  verificarCampos()
  {
    let valor : Boolean = false;

    this.flagNormal();

    if(this.cod_cliente.length==0)
    {
      this.flagcliente=true;
      valor=true;
    }

    if(this.fecha_ingreso.length==0)
    {
      this.flagfechaingreso=true;
      valor=true;
    }

    if(this.hora_ingreso.length==0)
    {
      this.flaghoraingreso=true;
      valor=true;
    }

    if(this.fecha_fin_reserva.length==0)
    {
      this.flagfechafinreserva=true;
      valor=true;
    }

    if(this.hora_inicio_reserva.length==0)
    {
      this.flaghorainicioreserva=true;
      valor=true;
    }

    if(this.hora_fin_reserva.length==0)
    {
      this.flaghorafinreserva=true;
      valor=true;
    }

    return valor;
  }

  flagNormal()
  {
    this.flagcliente = false;
    this.flagfechaingreso = false;
    this.flaghoraingreso = false;
    this.flagfechafinreserva = false;
    this.flaghorainicioreserva = false;
    this.flaghorafinreserva = false;
  }

  async buscar()
  {
    this.swalservice.iniciarLoading("Buscando Disponibilidad...");
    try
    {
    
      let data: any = await lastValueFrom(this.reservasservice.buscar(this.fecha_ingreso, this.hora_ingreso, this.hora_inicio_reserva, this.fecha_fin_reserva, this.hora_fin_reserva, this.cod_sucursal, this.cod_producto));
    
      if (data.cod_reserva == false)//No existe
      {
        
        const ok = await this.swalservice.alertConfirmRequerido({
          title: "REGISTRAR RESERVA",
          text: "Desea guardar la reserva",
          icon: "info",
          confirmText: "Si, Guardar",
          cancelText: "No, Cerrar"
        });

        if (ok)
        {
          await this.guardar();
        }

      }
      else
      {
        const ok = await this.swalservice.alertAviso("La habitación ya está reservada en ese rango de fechas, revise bien para reservar"); 
      }
    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
      this.swalservice.close();
    }
  }
  
  async guardar()
  {
    this.swalservice.iniciarLoading("Almacenando Reserva...");
    try
      {
        const parametros = {
          'cod_reserva' : this.cod_reserva,
          'cod_cliente' :this.cod_cliente,
          'fecha_ingreso' : this.fecha_ingreso,
          'hora_ingreso' : this.hora_ingreso,
          'fecha_inicio_reserva' : this.fecha_ingreso,
          'hora_inicio_reserva' : this.hora_inicio_reserva,
          'fecha_fin_reserva' : this.fecha_salida,
          'hora_fin_reserva' : this.hora_fin_reserva,
          'cod_producto' : this.cod_producto,
          'cod_sucursal' : this.cod_sucursal
        };

        let data: any = await lastValueFrom(this.reservasservice.guardar(parametros));

        if (data.estado == true)
        {
          this.formularioNormal();
          this.toastr.success("Reserva almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        }
        else
        {
          const ok = await this.swalservice.alertError("Reserva no se pudo Almacenar, vuelva a intertarlo por favor");
        }
    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
      this.swalservice.close();
    }
  }

  async buscarReserva()
  {
    this.swalservice.iniciarLoading("Buscando Reserva...");
    try
    {
    
      let data: any = await lastValueFrom(this.reservasservice.buscarReserva(this.cod_reserva));

      if (data.cod_reserva == false)//No existe
      {
        this.toastr.warning("La habitación reservada no está registrada en la fecha, revise por favor", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
          this.cod_cliente = data.cod_cliente;
          this.cliente = data.persona;
          this.numero_identificacion = data.cedula;
          this.celular = data.celular;

          this.fecha_ingreso = moment(data.fecha_ingreso).format('YYYY-MM-DD');
          this.hora_ingreso = moment(data.fecha_ingreso).format('HH:mm:ss');
          let fecha_restada = "";
          if(this.fecha_ingreso==moment(data.fecha_fin_reserva).format('YYYY-MM-DD'))
          {
            fecha_restada = moment(data.fecha_fin_reserva).format('YYYY-MM-DD');
          }
          else
          {
            fecha_restada = moment(data.fecha_fin_reserva).subtract(1, 'd').format('YYYY-MM-DD');
          }
          this.hora_fin_reserva =  moment(data.fecha_fin_reserva).format('HH:mm:ss');
          this.fecha_fin_reserva = fecha_restada;
          this.fecha_salida = moment(data.fecha_fin_reserva).format('YYYY-MM-DD');
      }

    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
      this.swalservice.close();
    }
  }

  async buscarModificar()
  {
    this.swalservice.iniciarLoading("Buscando Disponibilidad...");
    try
    {
    
      let data: any = await lastValueFrom(this.reservasservice.buscarModificar(this.fecha_ingreso, this.hora_ingreso, this.hora_inicio_reserva, this.fecha_fin_reserva, this.hora_fin_reserva, this.cod_sucursal, this.cod_producto, this.cod_reserva));
    
      if (data.cod_reserva == false)//No existe
      {
        const ok = await this.swalservice.alertConfirmRequerido({
          title: "ACTUALIZAR RESERVA",
          text: "Desea actualizar la reserva",
          icon: "info",
          confirmText: "Si, Actualizar",
          cancelText: "No, Cerrar"
        });

        if (ok)
        {
          await this.actualizar();
        }
      }
      else
      {
        const ok = await this.swalservice.alertAviso("La habitación ya está reservada en ese rango de fechas, revise bien para reservar");
      }
    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
      this.swalservice.close();
    }
  }

  async actualizar()
  {
    this.swalservice.iniciarLoading("Actualizando Reserva...");
    try
    {
      const parametros = {
        'cod_reserva' : this.cod_reserva,
        'cod_cliente' :this.cod_cliente,
        'fecha_ingreso' : this.fecha_ingreso,
        'hora_ingreso' : this.hora_ingreso,
        'fecha_inicio_reserva' : this.fecha_ingreso,
        'hora_inicio_reserva' : this.hora_inicio_reserva,
        'fecha_fin_reserva' : this.fecha_salida,
        'hora_fin_reserva' : this.hora_fin_reserva,
        'cod_producto' : this.cod_producto,
        'cod_sucursal' : this.cod_sucursal
      };

      let data: any = await lastValueFrom(this.reservasservice.actualizar(parametros));

      if (data.estado == true)
      {
        this.listarReservasPorDepartamento();
        this.toastr.success("Reserva actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        const ok = await this.swalservice.alertError("Reserva no se pudo actualizar, vuelva a intertarlo por favor");
      }

    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
      this.swalservice.close();
    }
    
  }


}