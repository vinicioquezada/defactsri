import { Component, OnInit, ViewChild } from '@angular/core';
import { ReservasService } from '../../services/reservas.service';
import { AsignacionService } from '../../services/asignacion.service';
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
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import interactionPlugin from '@fullcalendar/interaction';
import { SwalService } from 'src/app/shared/services/swal.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.css']
})
export class AsignacionComponent implements OnInit {
  @ViewChild(ListadoClienteComponent) childlistadocliente: any;
  @ViewChild(ClienteFormComponent) clienteformcomponent: any;

  cod_sucursal : string = "";
  datossucursal : any;

  cod_producto : string = "";

  loadinglistado : boolean = false;
  

  persona : number = 0;

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
    //dayCellDidMount: this.highlightSelectedDate.bind(this)
    datesSet: this.reaplicarReservas.bind(this)
  };

  titulo : string = "";

  cod_reserva : string = "";
  cod_cliente1 : string = "";
  cliente1 : string = "";
  numero_identificacion1 : string = "";
  celular1 : string = "";

  cod_cliente2 : string = "";
  cliente2 : string = "";
  numero_identificacion2 : string = "";
  celular2 : string = "";

  cod_cliente3 : string = "";
  cliente3 : string = "";
  numero_identificacion3 : string = "";
  celular3 : string = "";

  observacion : string = "";
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

  ban : boolean = false;

  tiemporestante: string = "";
  reservasMarcadas: string[] = [];
  estado_pago: number = 0;

  constructor(private rutaActiva: ActivatedRoute, private router : Router, private toastr: ToastrService, private error:ErrorService, private reservasservice:ReservasService, private asignacionservice : AsignacionService, private bodyStyleService: BodyStyleService, private usersession: UserSessionService, private swalservice: SwalService) {
    
  }

  ngOnInit(): void {
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.formularioNormal();
    this.bodyStyleService.resetBodyStyles();
  }
  /*
  handleDateClick(arg: any) {
    // Quitar selección previa
    const prevSelected = document.querySelector('.fc-daygrid-day.fc-day-selected');
    if (prevSelected) {
      prevSelected.classList.remove('fc-day-selected');
    }
  
    const cell = arg.dayEl as HTMLElement;
    if (cell) {
      cell.classList.add('fc-day-selected');
    }
  }
  */

  /*
  highlightSelectedDate(info: any) {
    // Si hay una fecha seleccionada y coincide con la celda actual
    if (this.selectedDate && info.dateStr === this.selectedDate) {
      info.el.classList.add('fc-day-selected');
    } else {
      info.el.classList.remove('fc-day-selected');
    }
  }
  */

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

  async clickAnular()
  {
    const ok = await this.swalservice.alertConfirmRequerido({
          title: "ANULAR RESERVA",
          text: "Desea anular Asignación de Habitación",
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

  clickDeshacer()
  {
    this.formularioNormal();
  }

  formularioNormal()
  {
    this.cod_producto = this.rutaActiva.snapshot.paramMap.get("cod_producto")!;
    let crud = this.rutaActiva.snapshot.paramMap.get("crud")!;
    this.listarReservasPorDepartamento();

    this.cod_reserva = moment().unix().toString();
    this.cod_cliente1 = "";
    this.cliente1 = "";
    this.numero_identificacion1 = "";
    this.celular1 = "";

    this.cod_cliente2 = "";
    this.cliente2 = "";
    this.numero_identificacion2 = "";
    this.celular2 = "";

    this.cod_cliente3 = "";
    this.cliente3 = "";
    this.numero_identificacion3 = "";
    this.celular3 = "";

    this.observacion = "";

    //this.selectedDate = moment().format('YYYY-MM-DD');
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

    this.estado_pago = 0;
    this.flagNormal();

    if(crud=="guardar")
    {
      this.titulo = "Nueva Asignacion";
      this.cod_reserva = moment().unix().toString();
      this.flagocultarboton = false;
      this.buscarReserva();
    }
    else
    {
      if(crud=="buscarguardar")
      {
        this.titulo = "Nueva Asignacion";
        this.flagocultarboton = false;
        this.cod_reserva = this.rutaActiva.snapshot.paramMap.get("cod_reserva")!;
        this.buscarReserva();
      }
      else
      {
        this.titulo = "Modificar Asignacion";
        this.cod_reserva = this.rutaActiva.snapshot.paramMap.get("cod_reserva")!;
        this.tiemporestante = "";
        this.flagocultarboton = true;
        this.buscarAsignacion();
      }
    }
  }

  buscarReserva()
  {
    this.loadinglistado = true;
    

    this.reservasservice.buscarReserva(this.cod_reserva).subscribe( (data : any) =>
    {
      if (data.cod_reserva == false)//No existe
      {
        this.ban = false;
      }
      else
      {
          this.cod_cliente1 = data.cod_cliente;
          this.cliente1 = data.persona;
          this.numero_identificacion1 = data.cedula;
          this.celular1 = data.celular;
          this.estado_pago = data.estado_pago;

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
          this.ban = true;
      }

      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
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
    this.persona = 0;
    this.clienteformcomponent.nombreformulario="AGREGAR";
    this.clienteformcomponent.formularioNormal();
    $("#mymodalformcliente").modal("show");
  }

  clickListarCliente()
  {
    this.persona = 0;
    this.childlistadocliente.filterpost="";
    $("#mymodallistarclientes").modal("show");
  }

  clickNuevoCliente2()
  {
    this.persona = 1;
    this.clienteformcomponent.nombreformulario="AGREGAR";
    this.clienteformcomponent.formularioNormal();
    $("#mymodalformcliente").modal("show");
  }

  clickListarCliente2()
  {
    this.persona = 1;
    this.childlistadocliente.filterpost="";
    $("#mymodallistarclientes").modal("show");
  }

  clickNuevoCliente3()
  {
    this.persona = 2;
    this.clienteformcomponent.nombreformulario="AGREGAR";
    this.clienteformcomponent.formularioNormal();
    $("#mymodalformcliente").modal("show");
  }

  clickListarCliente3()
  {
    this.persona = 2;
    this.childlistadocliente.filterpost="";
    $("#mymodallistarclientes").modal("show");
  }

  recibirDatosCliente(datosrecibidoscliente: any)
  {
    if(this.persona==0)
    {
      this.cod_cliente1 = datosrecibidoscliente.cod_cliente;
      this.cliente1 = datosrecibidoscliente.apellido + " " + datosrecibidoscliente.nombre;
      this.numero_identificacion1 = datosrecibidoscliente.cedula;
      this.celular1 = datosrecibidoscliente.celular;
    }

    if(this.persona==1)
    {
      this.cod_cliente2 = datosrecibidoscliente.cod_cliente;
      this.cliente2 = datosrecibidoscliente.apellido + " " + datosrecibidoscliente.nombre;
      this.numero_identificacion2 = datosrecibidoscliente.cedula;
      this.celular2 = datosrecibidoscliente.celular;
    }

    if(this.persona==2)
    {
      this.cod_cliente3 = datosrecibidoscliente.cod_cliente;
      this.cliente3 = datosrecibidoscliente.apellido + " " + datosrecibidoscliente.nombre;
      this.numero_identificacion3 = datosrecibidoscliente.cedula;
      this.celular3 = datosrecibidoscliente.celular;
    }
    $("#mymodallistarclientes").modal("hide");
  }

  recibirDatosNuevoCliente(datosrecibidoscliente: any)
  {
    this.cod_cliente1 = datosrecibidoscliente.cod_cliente;
    this.cliente1 = datosrecibidoscliente.apellido + " " + datosrecibidoscliente.nombre;
    this.numero_identificacion1 = datosrecibidoscliente.cedula;
    $("#mymodalformcliente").modal("hide");
  }

  async clickGuardar()
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
        if(this.ban==true)
        {
          await this.buscarModificar2();
        }
        else
        {
          await this.buscar();
        }
        
      }
      else
      {
        this.toastr.warning("La fecha de inicio no puede ser mayor a la fecha de salida", "INFORMACIÓN DEL SISTEMA");
      }
    }
  }

  verificarCampos()
  {
    let valor : Boolean = false;

    this.flagNormal();

    if(this.cod_cliente1.length==0)
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
          title: "REGISTRAR ASIGNACIÓN",
          text: "Desea guardar la asignación de habitación",
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

  async buscarModificar2()
  {
    this.swalservice.iniciarLoading("Buscando Disponibilidad...");
    try
    {
      let data: any = await lastValueFrom(this.reservasservice.buscarModificar(this.fecha_ingreso, this.hora_ingreso, this.hora_inicio_reserva, this.fecha_fin_reserva, this.hora_fin_reserva, this.cod_sucursal, this.cod_producto, this.cod_reserva));

      if (data.cod_reserva == false)//No existe
      {
        const ok = await this.swalservice.alertConfirmRequerido({
          title: "REGISTRAR ASIGNACIÓN",
          text: "Desea guardar la asignación de habitación",
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
    this.swalservice.iniciarLoading("Almacenando Asignación...");
    try
    {
      const asignacionreservas = [];

      let asignacion1 = {
          "cod_cliente" : this.cod_cliente1,
          "cod_tipo_asignacion" : 0
      }
      asignacionreservas.push(asignacion1);

      if(this.cod_cliente2!="")
      {
        let asignacion2 = {
          "cod_cliente" : this.cod_cliente2,
          "cod_tipo_asignacion" : 1
        }
        asignacionreservas.push(asignacion2);
      }

      if(this.cod_cliente3!="")
      {
        let asignacion3 = {
          "cod_cliente" : this.cod_cliente3,
          "cod_tipo_asignacion" : 1
        }
        asignacionreservas.push(asignacion3);
      }

      const parametros = {
        "cod_reserva" : this.cod_reserva,
        "cod_cliente" :this.cod_cliente1,
        "fecha_ingreso" : this.fecha_ingreso,
        "hora_ingreso" : this.hora_ingreso,
        "fecha_inicio_reserva" : this.fecha_ingreso,
        "hora_inicio_reserva" : this.hora_inicio_reserva,
        "fecha_fin_reserva" : this.fecha_salida,
        "hora_fin_reserva" : this.hora_fin_reserva,
        "cod_producto" : this.cod_producto,
        "cod_sucursal" : this.cod_sucursal,
        "asignacionreservas" : asignacionreservas,
        "estado_pago" : this.estado_pago
      };

      let data: any = await lastValueFrom(this.asignacionservice.guardar(parametros));

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

  buscarAsignacion()
  {
    this.loadinglistado = true;
    

    this.asignacionservice.buscarAsignacion(this.cod_reserva).subscribe( (data : any) =>
    {
      if (data.cod_reserva == false)//No existe
      {
        this.toastr.warning("La habitación reservada no está registrada en la fecha, revise por favor", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
          this.cod_cliente1 = data[0].cod_cliente;
          this.cliente1 = data[0].persona;
          this.numero_identificacion1 = data[0].cedula;
          this.celular1 = data[0].celular;

          if(data.length > 1)
          {
            this.cod_cliente2 = data[1].cod_cliente;
            this.cliente2 = data[1].persona;
            this.numero_identificacion2 = data[1].cedula;
            this.celular2 = data[1].celular;
          }

          if(data.length > 2)
          {
            this.cod_cliente3 = data[2].cod_cliente;
            this.cliente3 = data[2].persona;
            this.numero_identificacion3 = data[2].cedula;
            this.celular3 = data[2].celular;
          }

          this.fecha_ingreso = moment(data[0].fecha_ingreso).format('YYYY-MM-DD');
          this.hora_ingreso = moment(data[0].fecha_ingreso).format('HH:mm:ss');
          let fecha_restada = "";
          if(this.fecha_ingreso==moment(data[0].fecha_fin_reserva).format('YYYY-MM-DD'))
          {
            fecha_restada = moment(data[0].fecha_fin_reserva).format('YYYY-MM-DD');
          }
          else
          {
            fecha_restada = moment(data[0].fecha_fin_reserva).subtract(1, 'd').format('YYYY-MM-DD');
          }
          
          this.fecha_fin_reserva = fecha_restada;
          this.fecha_salida = moment(data[0].fecha_fin_reserva).format('YYYY-MM-DD');
      }

      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
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

  async buscarModificar()
  {
    this.swalservice.iniciarLoading("Buscando Disponibilidad...");
    try
    {
    
      let data: any = await lastValueFrom(this.reservasservice.buscarModificar(this.fecha_ingreso, this.hora_ingreso, this.hora_inicio_reserva, this.fecha_fin_reserva, this.hora_fin_reserva, this.cod_sucursal, this.cod_producto, this.cod_reserva));
    
      if (data.cod_reserva == false)//No existe
      {

        const ok = await this.swalservice.alertConfirmRequerido({
          title: "ACTUALIZAR ASIGNACIÓN",
          text: "Desea actualizar la asignación de habitación",
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
    this.swalservice.iniciarLoading("Actualizando Asignacion...");
    try
    {
      const asignacionreservas = [];

      let asignacion1 = {
          "cod_cliente" : this.cod_cliente1,
          "cod_reserva" : this.cod_reserva,
          "cod_tipo_asignacion" : 0
      }
      asignacionreservas.push(asignacion1);

      if(this.cod_cliente2!="")
      {
        let asignacion2 = {
          "cod_cliente" : this.cod_cliente2,
          "cod_reserva" : this.cod_reserva,
          "cod_tipo_asignacion" : 1
        }
        asignacionreservas.push(asignacion2);
      }

      if(this.cod_cliente3!="")
      {
        let asignacion3 = {
          "cod_cliente" : this.cod_cliente3,
          "cod_reserva" : this.cod_reserva,
          "cod_tipo_asignacion" : 1
        }
        asignacionreservas.push(asignacion3);
      }

      const parametros = {
        "cod_reserva" : this.cod_reserva,
        "cod_cliente" :this.cod_cliente1,
        "fecha_ingreso" : this.fecha_ingreso,
        "hora_ingreso" : this.hora_ingreso,
        "fecha_inicio_reserva" : this.fecha_ingreso,
        "hora_inicio_reserva" : this.hora_inicio_reserva,
        "fecha_fin_reserva" : this.fecha_salida,
        "hora_fin_reserva" : this.hora_fin_reserva,
        "cod_producto" : this.cod_producto,
        "cod_sucursal" : this.cod_sucursal,
        "asignacionreservas" : asignacionreservas
      };

      let data: any = await lastValueFrom(this.asignacionservice.actualizar(parametros));

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

  deshacerPersona2()
  {
    this.cod_cliente2 = "";
    this.cliente2 = "";
    this.numero_identificacion2 = "";
    this.celular2 = "";
  }

  deshacerPersona3()
  {
    this.cod_cliente3 = "";
    this.cliente3 = "";
    this.numero_identificacion3 = "";
    this.celular3 = "";
  }

  async handleEventClick(clickInfo: EventClickArg)
  {
    const ok = await this.swalservice.alertInfo(`${clickInfo.event.title}`);
  }

}