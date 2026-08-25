import { Component, OnInit, ViewChild } from '@angular/core';
import { SocioService } from '../../services/socio.service';
import { VentaService } from 'src/app/venta/services/venta.service';
import { MembresiaService } from '../../services/membresia.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { ListadoSociosComponent } from 'src/app/shared/components/listado-socios/listado-socios.component';
import { ActividadMembresiaComponent } from '../actividad-membresia/actividad-membresia.component';
import { SocioFormComponent } from '../socio/socio-form/socio-form.component';
import { FotoFormComponent } from '../socio/foto-form/foto-form.component';
import { SwalService } from 'src/app/shared/services/swal.service';

@Component({
  selector: 'app-membresia',
  templateUrl: './membresia.component.html',
  styleUrls: ['./membresia.component.css']
})
export class MembresiaComponent implements OnInit {
  @ViewChild(ListadoSociosComponent) childlistadosocio!: ListadoSociosComponent;
  @ViewChild(ActividadMembresiaComponent) childactividadmembresia!: ActividadMembresiaComponent;
  @ViewChild(SocioFormComponent) childsocioform: SocioFormComponent;
  @ViewChild(FotoFormComponent) childfotoform: FotoFormComponent;
  opcionesprivilegios : any;
  cod_cliente : string = "";
  cedula : string = "";
  cliente : string = "";

  apellido : string = "";
  nombre : string = "";
  tipo_usuario : string = "";
  cod_usuario_gym : string = "";
  estado_emparejamiento : string = "1";

  cod_factura_venta : string = "";

  btnfacturar : boolean = true;
  
  
  datosmembresia : any = [];

  loading : boolean = false;
  loadinglistado : boolean = false;


  

  filterpostmembresia = "";
  cantidad_registros_membresia : number = 0;
  pagemembresia = 1;
  countmembresia = 0;
  pagesizemembresia = 5;

  cod_factura_venta_select : string = "";
  id_membresia : string = "";

  membresia : string = "";
  vigencia : string = "";
  cod_subcategoria : number = 0;
  cantidad_unidad : number = 0;
  fecha_inicio_plan : string = "";
  fecha_fin_plan : string = "";

  cod_cliente_select : string = "";
  cedula_select : string = "";
  cliente_select : string = "";
  ban : boolean = true;

  infomembresia : boolean = false;
  infoestadoplan : string = "";
  infoplan : string = "";
  infofechainicio : string = "";
  infofechafin : string = "";

  disabledbtnregalar : boolean = true;

  monitor_actividades: string = "";

  itemcliente: any;

  constructor(private router : Router, private socioservice : SocioService, private toastr: ToastrService, private error:ErrorService, private ventaservice: VentaService, private membresiaservice : MembresiaService, private usersession: UserSessionService, private swalservice: SwalService) { }

  ngOnInit(): void {
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.monitor_actividades = this.usersession.getConfiguracion("monitor_actividades");
    this.formularionormal();
  }

  changeFechaInicioPlan(event: any): void {
    const elemento = event.target.value;

    this.fecha_inicio_plan = elemento;

    if(this.cod_subcategoria == 111)//1 Dias
    {
      this.calcularFechasPlanDiario(this.cantidad_unidad);
    }
    else
    {
      this.calcularFechasPlanMensual(this.cantidad_unidad);
    }
  }

  calcularFechasPlanDiario(cantidad_dias : number) {
    this.swalservice.iniciarLoading("Calculando...");
    this.membresiaservice.calcularFechasDiarios(this.fecha_inicio_plan, cantidad_dias).subscribe( (data : any) =>
    {
      this.swalservice.close();
      this.fecha_inicio_plan = data.fecha_inicio_plan;
      this.fecha_fin_plan = data.fecha_fin_plan;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
    });
  }

  calcularFechasPlanMensual(cantidad_meses : number) {
    this.swalservice.iniciarLoading("Calculando...");
    this.membresiaservice.calcularFechasMensuales(this.fecha_inicio_plan, cantidad_meses).subscribe( (data : any) =>
    {
      this.swalservice.close();
      this.fecha_inicio_plan = data.fecha_inicio_plan;
      this.fecha_fin_plan = data.fecha_fin_plan;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
    });
  }

  keyFiltradoMembresia()
  {
    this.pagemembresia = 1;
  }

  formularionormal() {
    this.cod_cliente = "";
    this.cedula = "";
    this.cliente = "";
    this.apellido = "";
    this.nombre = "";
    this.tipo_usuario = "";
    this.cod_usuario_gym = "";
    this.estado_emparejamiento = "1";

    this.cod_factura_venta = "";

    this.btnfacturar = true;
    
    this.datosmembresia = [];

    this.loading = false;
    this.loadinglistado = false;

    this.filterpostmembresia = "";
    this.cantidad_registros_membresia = 0;
    this.pagemembresia = 1;
    this.countmembresia = 0;
    this.pagesizemembresia = 5;

    this.cod_factura_venta_select = "";
    this.membresia = "";
    this.vigencia = "";
    this.cod_subcategoria = 0;
    this.cantidad_unidad = 0;
    this.fecha_inicio_plan = "";
    this.fecha_fin_plan = "";

    this.cod_cliente_select = "";
    this.cedula_select = "";
    this.cliente_select = "";
    this.ban = true;

    this.infomembresia= false;
    this.infoestadoplan = "";
    this.infoplan = "";
    this.infofechainicio = "";
    this.infofechafin = "";

    this.disabledbtnregalar = true;

    const savedmembresia = sessionStorage.getItem("savedmembresia");
    if (savedmembresia)
    {
      const datos = JSON.parse(savedmembresia);
      
        this.cod_cliente = datos.cod_cliente;
        this.cedula = datos.identificacion;
        this.cliente = datos.usuario;
        this.apellido = datos.apellido;
        this.nombre = datos.nombre;
        this.tipo_usuario = datos.tipo_usuario;
        this.cod_usuario_gym = datos.cod_usuario_gym;
        this.estado_emparejamiento = datos.estado_emparejamiento;
        this.listarMembresiasUsuario();
      
        sessionStorage.removeItem("savedmembresia");
    }
  }

  buscarUsuarioGym() {
    this.loading = true;
    this.cliente = "";
    this.socioservice.buscarUsuarioGym(this.cedula).subscribe( (data : any) =>
    {
      this.loading = false;
      if (data.cod_cliente == false)
      {
        this.toastr.warning("Socio no se encuentra registrado", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.cod_cliente = data.cod_cliente;
        this.cliente = data.nombre + " " + data.apellido;
        this.apellido = data.apellido;
        this.nombre = data.nombre;
        this.tipo_usuario = data.tipo_usuario_gym;
        this.cod_usuario_gym = data.cod_usuario_gym;
        this.estado_emparejamiento = data.estado_emparejamiento
        this.listarMembresiasUsuario();
        this.verificarRegistro();
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }

  listarMembresiasUsuario() {
    
    this.pagemembresia = 1;
    this.filterpostmembresia = "";
    this.loadinglistado = true;

    this.socioservice.listarMembresiasUsuario(this.cod_cliente).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.datosmembresia = data;
      this.cantidad_registros_membresia = data.length;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
    });
    
  }

  clickListarSocios(ban : boolean)
  {
    this.ban = ban;
    this.childlistadosocio.pagesocio = 1;
    this.childlistadosocio.filterpostsocio="";
    $("#mymodallistarsocios").modal("show");
  }

  recibirDatosSocio(datosrecibidossocio: any)
  {
    if(this.ban) {
      this.cod_cliente = datosrecibidossocio.cod_cliente;
      this.cedula = datosrecibidossocio.cedula;
      this.cliente = datosrecibidossocio.nombre + " " + datosrecibidossocio.apellido;
      this.apellido = datosrecibidossocio.apellido;
      this.nombre = datosrecibidossocio.nombre;
      this.tipo_usuario = datosrecibidossocio.tipo_usuario_gym;
      this.cod_usuario_gym = datosrecibidossocio.cod_usuario_gym;
      this.estado_emparejamiento = datosrecibidossocio.estado_emparejamiento;
      this.listarMembresiasUsuario();
      this.verificarRegistro();
    } else {
      this.cod_cliente_select = datosrecibidossocio.cod_cliente;
      this.cedula_select = datosrecibidossocio.cedula;
      this.cliente_select = datosrecibidossocio.nombre + " " + datosrecibidossocio.apellido;
      this.buscarUltimoPlan();
    }
    $("#mymodallistarsocios").modal("hide");
  }

  verificarRegistro()
  {
    this.loading = true;

    this.ventaservice.verificarRegistro().subscribe( (data : any) =>
    {
      this.loading = false;
      if(data == null)
      {
        this.toastr.error("Error al generar codigo de acceso, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.cod_factura_venta = data.codigo;
        this.btnfacturar = false;
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }

  facturar()
  {
    this.mantenerEstados();
    this.router.navigate(["/menugym/facturaplan", "nuevoregistro", this.cod_cliente, this.cod_factura_venta, 1]);
  }

  mantenerEstados()
  {
    const savedmembresia = {
      cod_cliente: this.cod_cliente,
      identificacion: this.cedula,
      usuario: this.cliente,
      apellido : this.apellido,
      nombre : this.nombre,
      tipo_usuario : this.tipo_usuario,
      cod_usuario_gym : this.cod_usuario_gym,
      estado_emparejamiento : this.estado_emparejamiento
    };

    sessionStorage.setItem("savedmembresia", JSON.stringify(savedmembresia));
  }

  clickRegalar(id_membresia: string, membresia: string) {
    this.cod_cliente_select = "";
    this.cedula_select = "";
    this.cliente_select = "";
    this.id_membresia = id_membresia;
    this.membresia = membresia;
    $("#mymodalregalar").modal("show");
  }

  clickCongelar(id_membresia: string, membresia: string) {
    this.id_membresia = id_membresia;
    this.membresia = membresia;
    $("#mymodalcongelarmembresia").modal("show");
  }

  clickDescongelar(id_membresia: string, membresia: string, fecha_inicio: string, fecha_fin: string, fecha_congelamiento: string) {
    this.id_membresia = id_membresia;
    this.membresia = membresia;
    $("#mymodaldescongelarmembresia").modal("show");
    this.calcularFechaDescongelamientoMembresia(fecha_inicio, fecha_fin, fecha_congelamiento);
  }

  clickCambiarFechas(id_membresia: string, membresia: string, vigencia: string, fecha_inicio: string, cod_subcategoria : number, cantidad_unidad : number) {
    this.id_membresia = id_membresia;
    this.membresia = membresia;
    this.vigencia = vigencia;
    this.cod_subcategoria = cod_subcategoria;
    this.cantidad_unidad = cantidad_unidad;
    this.fecha_inicio_plan = moment(fecha_inicio).format('YYYY-MM-DD');
    $("#mymodalcambiarfechas").modal("show");
  }

  congelarMembresiaUsuario() {
    this.swalservice.iniciarLoading("Congelando...");

    const parametros = {
      'id_membresia' : this.id_membresia,
    };

    this.socioservice.congelarMembresiaUsuario(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();
      if (data.estado)
      {
        this.toastr.success("Membresia congelada al Usuario Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        this.listarMembresiasUsuario();
        $("#mymodalcongelarmembresia").modal("hide");
      }
      else
      {
        this.toastr.error("Membresia no se pudo congelar al Usuario, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
    });
  }

  calcularFechaDescongelamientoMembresia(fecha_inicio: string, fecha_fin: string, fecha_congelamiento: string) {
    this.swalservice.iniciarLoading("Calculando...");
    this.membresiaservice.calcularFechadesCongelamientoMembresia(fecha_inicio, fecha_fin, fecha_congelamiento).subscribe( (data : any) =>
    {
      this.swalservice.close();
      this.fecha_inicio_plan = data.fecha_inicio_plan;
      this.fecha_fin_plan = data.fecha_fin_plan;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
    });
  }

  descongelarMembresiaUsuario() {
    this.swalservice.iniciarLoading("Descongelar...");
    const parametros = {
      'id_membresia' : this.id_membresia,
      'fecha_inicio_completa' : this.fecha_inicio_plan,
      'fecha_fin_completa' : this.fecha_fin_plan
    };
    this.socioservice.descongelarMembresiaUsuario(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();
      if (data.estado == true)
      {
        this.toastr.success("Membresia descongelada al Usuario Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        $("#mymodaldescongelarmembresia").modal("hide");
        this.listarMembresiasUsuario();
      }
      else
      {
        this.toastr.error("Membresia no se pudo descongelar al Usuario, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
    });
  }

  buscarUltimoPlan() {
    this.swalservice.iniciarLoading("Buscando ultimo plan...");
    this.membresiaservice.buscarultimoplan(this.cod_cliente_select).subscribe( (data : any) =>
    {
      this.swalservice.close();
      if(data.estado == true)
      {
        this.infomembresia = true;
        this.infoestadoplan = data.estado_plan;
        this.infoplan = data.plan;
        this.infofechainicio = data.fecha_inicio;
        this.infofechafin = data.fecha_fin;
        this.disabledbtnregalar = true;
      }
      else
      {
        this.infomembresia = false;
        this.infoestadoplan = "";
        this.infoplan = "";
        this.infofechainicio = "";
        this.infofechafin = "";
        this.disabledbtnregalar = false;
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
    });
  }

  regalarMembresiaUsuario() {
    this.swalservice.iniciarLoading("Tranfiriendo...");
    const parametros = {
      'cod_cliente' : this.cod_cliente,
      'cod_cliente_select' : this.cod_cliente_select,
      'id_membresia' : this.id_membresia
    };
    this.socioservice.regalarMembresiaUsuario(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();
      if (data.estado == true)
      {
        this.toastr.success("Membresia transferida al Usuario Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        $("#mymodalregalar").modal("hide");
        this.listarMembresiasUsuario();
      }
      else
      {
        this.toastr.error("Membresia no se pudo transferir al Usuario, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
    });
  }

  clickActualizarFechas() {
    if(this.fecha_fin_plan.length>0) {
      this.actualizarFechas();
    } else {
      this.toastr.info("Debe seleccionar una fecha para actualizar", "INFORMACIÓN DEL SISTEMA");
    }
  }

  actualizarFechas() {
    this.swalservice.iniciarLoading("Actualizando...");
    const parametros = {	
      'id_membresia' : this.id_membresia,
      'fecha_inicio' : this.fecha_inicio_plan,
      'fecha_fin' : this.fecha_fin_plan
    };
    this.socioservice.actualizarMembresia(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();
      if (data.estado == true)
      {
        this.toastr.success("Fechas de membresia actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        $("#mymodalcambiarfechas").modal("hide");
        this.listarMembresiasUsuario();
      }
      else
      {
        this.toastr.error("Fechas de membresia no se pudo actualizar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
    });
  }

  clickAnularMembresia(id_membresia: string, membresia: string) {
    this.id_membresia = id_membresia;
    this.membresia = membresia;
    Swal.fire({
            title: 'ANULAR MEMBRESÍA '  + this.membresia,
            text: 'Confirmar para anular el registro seleccionado',
            icon: 'info',//'warning'
            showCancelButton: true,
            confirmButtonText: 'Si, Anular',
            cancelButtonText: 'No, Anular'
          }).then((result) => {
            if (result.value) {
              this.anularMembresia();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              
            }
          });
  }

  anularMembresia() {
    this.swalservice.iniciarLoading("Anulando...");
    const parametros = {
      'id_membresia' : this.id_membresia,
      'monitor_actividades': this.monitor_actividades
    };
    this.socioservice.anularMembresia(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();
      if (data.estado == true)
      {
        this.toastr.success("Membresia anulada Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        this.listarMembresiasUsuario();
      }
      else
      {
        this.toastr.error("Membresia no se pudo anular, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
    });
  }

  clickMostrarActividades(item: any)
  {
    this.childactividadmembresia.cod_producto = item.cod_producto;
    this.childactividadmembresia.plan = item.plan;
    this.childactividadmembresia.id_membresia = item.id_membresia;
    this.childactividadmembresia.cod_cliente = this.cod_cliente;
    this.childactividadmembresia.cliente = this.cliente;
    this.childactividadmembresia.fecha_inicio = item.fecha_inicio;
    this.childactividadmembresia.fecha_fin = item.fecha_fin;
    this.childactividadmembresia.listarPlanActividad();
    $("#mymodalactividadmembresia").modal("show");
  }

  handlePageChangeMembresia(event: number): void {
    this.pagemembresia = event;
  }

  clickNuevoSocio()
  {
    this.childsocioform.nombreformulario = "NUEVO";
    this.childsocioform.formularioNormal();
    $("#mymodalnuevosocio").modal("show");
  }

  recibirDatosSocioForm(datossocioform): void
  {
    this.childsocioform.formularioNormal();
    this.cedula = datossocioform.cedula;
    this.buscarUsuarioGym();
    $("#mymodalnuevosocio").modal("hide");
  }

  clickEmparejar()
  {
    const parametros = {
      "cod_cliente" : this.cod_cliente,
      "apellido" : this.apellido,
      "nombre" : this.nombre,
      "identificacion" : this.cedula,
      "tipo_usuario" : this.tipo_usuario,
      "cod_usuario_gym" : this.cod_usuario_gym
    }
    this.childfotoform.clickEmparejar(parametros);
  }

  recibirDatosFotoForm(datosrecibidosfotoform: any)
  {
    
  }

}