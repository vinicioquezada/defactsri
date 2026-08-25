import { Component, OnInit } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { NotaCreditoComprasService } from '../../services/nota-credito-compras.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-explorador-nota-credito-compras',
  templateUrl: './explorador-nota-credito-compras.component.html',
  styleUrls: ['./explorador-nota-credito-compras.component.css']
})
export class ExploradorNotaCreditoComprasComponent implements OnInit {
  multisucursal : string = "0";
  electronico : string = "0";
  kardex : string = "";
  datos : any;
  datossucursal : any;
  filterpost = "";

  cod_sucursal : string = "";
  sucursal : string = "";

  estado : string = "";
  estado_comprobante : string = "";

  fechadesde : string = "";
  fechahasta : string = "";
 
  cod_proyecto : string = "";
  claveacceso : string = "";

  numero_nota_credito_compra : string = "";
  proveedor : string = "";
  cod_nota_credito_compra : string = "";
  tipo_compra : string = "";
  ptoemi : string = "";
  correo : string = "";
  cod_factura_compra = "";

  serieestab : string = "";
  ruc : string = "";
  tipoambiente : string = "";
  razon_social : string = "";
  nombre_comercial : string = "";
  contabilidad : string = "";
  direccion_matriz : string = "";
  direccion_establecimiento : string = "";
  tipo_contribuyente : string = "";
  contribuyente : string = "";
  leyenda : string = "";

  loading : boolean = false;
  loadinglistado : boolean = false;
  loadingmodal : boolean = false;

  disabledbtneditar : boolean = false;
  disabledbtnenviarcorreo : boolean = false;
  disabledbtnenviarsri : boolean = false;
  disabledbtnanular : boolean = false;
  disabledbtndescargarride : boolean = false;
  disabledbtndescargarxml : boolean = false;
  disabledbtndescargardocumentos : boolean = false;
  disabledbtncomprobarsri : boolean = false;
  disabledbtncrearride : boolean = false;

  arr_nota_credito_compra : any;

  opcionesprivilegios : any;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private router : Router, private notacreditocompraservice:NotaCreditoComprasService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.electronico = this.usersession.getConfiguracion("electronico");
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    this.kardex = this.usersession.getConfiguracion("kardex");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.listarSucursales();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal= elemento;
    this.buscarSucursal();
  }

  buscarSucursal()
  {
    const resultado = this.datossucursal.find( (valor : any) => valor.cod_sucursal == this.cod_sucursal );
    this.serieestab = resultado.serieestab;
    this.ruc = resultado.ruc_sucursal;
    this.tipoambiente = resultado.tipo_ambiente;
    this.razon_social = resultado.razonsocial;
    this.nombre_comercial = resultado.nombrecomercial;
    this.contabilidad = resultado.contabilidad;
    this.direccion_matriz = resultado.direccion_matriz;
    this.direccion_establecimiento = resultado.direccion_establecimiento;
    this.tipo_contribuyente = resultado.tipo_contribuyente;
    this.contribuyente = resultado.contribuyente;
    this.leyenda = resultado.leyenda;
  }

  changeEstadoComprobante(event: any): void {
    const elemento = event.target.value;
    this.estado = elemento;
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  visualizar()
  {
        let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/compras/notacreditocompra?codnotacredito=" + this.cod_nota_credito_compra, "Nota de Credito", 'width=600,height=400,left=300,top=100');
        miVentana.focus();
  }

  editar()
  {
    this.mantenerEstados();
	  this.router.navigate(["/menucompra/notacreditocompras", "actualizarregistro", this.cod_nota_credito_compra, this.cod_factura_compra]);
  }

  clickBuscar()
  {
    if(this.datossucursal.length>0)
    {
      this.listarNotasCreditos(1);
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }

  opciones(cod_nota_credito_compra: string, numero_nota_credito_compra: string, estado: string, tipo_compra: string, proveedor : string, claveacceso : string, ptoemi : string, correo : string, cod_factura_compra : string)
  {
    this.cod_nota_credito_compra = cod_nota_credito_compra;
    this.numero_nota_credito_compra = numero_nota_credito_compra;
    this.tipo_compra = tipo_compra;
    this.proveedor = proveedor;
    this.claveacceso = claveacceso;
    this.ptoemi = ptoemi;
    this.correo = correo;
    this.cod_factura_compra = cod_factura_compra;
    this.arr_nota_credito_compra = {};
    this.estado_comprobante = estado;

    if(estado=="CREADA")
    {
      this.configurarBotones(false, true, true, false, true, true, true, true, true);
    }

    if(estado=="ANULADA")
    {
      this.configurarBotones(true, true, true, true, true, true, true, true, true);
    }
    
    $("#mymodalopciones").modal("show");
  }

  configurarBotones(disabledbtneditar: boolean, disabledbtnenviarcorreo: boolean, disabledbtnenviarsri: boolean, disabledbtnanular: boolean, disabledbtndescargarride: boolean, disabledbtndescargarxml: boolean, disabledbtndescargardocumentos: boolean, disabledbtncomprobarsri: boolean, disabledbtncrearride: boolean) {
    this.disabledbtneditar = disabledbtneditar;
    this.disabledbtnenviarcorreo = disabledbtnenviarcorreo;
    this.disabledbtnenviarsri = disabledbtnenviarsri;
    this.disabledbtnanular = disabledbtnanular
    this.disabledbtndescargarride = disabledbtndescargarride;
    this.disabledbtndescargarxml = disabledbtndescargarxml;
    this.disabledbtndescargardocumentos = disabledbtndescargardocumentos;
    this.disabledbtncomprobarsri = disabledbtncomprobarsri;
    this.disabledbtncrearride = disabledbtncrearride;
  }


  formularioNormal()
  {
    this.page = 1;
    this.filterpost="";

    this.tipo_compra = "";
    this.claveacceso = "";

    this.estado = "0";
    this.estado_comprobante = "";

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');
   
    this.numero_nota_credito_compra = "";
    this.cod_nota_credito_compra = "";

    this.datos = [];
    
    const savedtipoformulario = sessionStorage.getItem("tipo_formulario");//Restaurar datos
    const savedcodsucursal = sessionStorage.getItem("cod_sucursal");
    const savedestado = sessionStorage.getItem("estado");
    const savedpage = parseInt(sessionStorage.getItem("page"));
    const savedfechadesde = sessionStorage.getItem("fechadesde");
    const savedfechahasta = sessionStorage.getItem("fechahasta");
    if (savedtipoformulario=="explorador_nota_credito_compra") {
      this.cod_sucursal = savedcodsucursal;
      this.estado = savedestado;
      this.fechadesde = savedfechadesde;
      this.fechahasta = savedfechahasta;
      sessionStorage.removeItem("tipo_formulario");
      sessionStorage.removeItem("cod_sucursal");
      sessionStorage.removeItem("estado");
      sessionStorage.removeItem("page");
      sessionStorage.removeItem("fechadesde");
      sessionStorage.removeItem("fechahasta");
      this.listarNotasCreditos(savedpage);
    }
    else
    {
      sessionStorage.removeItem("tipo_formulario");
      sessionStorage.removeItem("cod_sucursal");
      sessionStorage.removeItem("estado");
      sessionStorage.removeItem("page");
      sessionStorage.removeItem("fechadesde");
      sessionStorage.removeItem("fechahasta");
    }
  }

  mantenerEstados()
  {
    sessionStorage.setItem("tipo_formulario", "explorador_nota_credito_compra");//Restaurar datos
    sessionStorage.setItem("cod_sucursal", this.cod_sucursal);
    sessionStorage.setItem("estado", this.estado);
    sessionStorage.setItem("page", String(this.page));
    sessionStorage.setItem("fechadesde", this.fechadesde);
    sessionStorage.setItem("fechahasta", this.fechahasta);
  }
 
  listarNotasCreditos(page: number)
  {
    this.page = page;
    this.filterpost="";
    
    let opcion = "explorador";
    this.loadinglistado = true;

    this.notacreditocompraservice.listarNotasCreditos(this.fechadesde, this.fechahasta, opcion, this.cod_sucursal, this.estado).subscribe( (data : any) =>
    {
      this.datos = data;
      this.loadinglistado = false;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
    });
    
  }

  clickAnular()
  {
    Swal.fire({
            title: 'ANULAR NOTA CRÉDITO Nº '  + this.numero_nota_credito_compra + " - " + this.proveedor,
            text: 'Confirmar para anular el registro seleccionado',
            icon: 'info',//'warning'
            showCancelButton: true,
            confirmButtonText: 'Si, Anular',
            cancelButtonText: 'No, Anular'
          }).then((result) => {
            if (result.value) {
              this.anularFacturaVenta();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              
            }
          });
  }

  listarSucursales()
  {    
    this.loading = true;

    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");

    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.loading = false;
      this.datossucursal = data;
      this.buscarSucursal();
      this.formularioNormal();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }
  
  //La anulación de nota de crédito se hace por via sri
  anularFacturaVenta = () =>{
    this.guardarAnulacionNotaCredito();
  }

  comprobarSriAnular(){
    let parametros = {
      'cod_proyecto' : this.cod_proyecto,
      'cod_factura_compra' : this.cod_factura_compra,
      'claveacceso' : this.claveacceso
    };
  
    this.loadingmodal = true;

    this.notacreditocompraservice.verificarComprobanteSri(parametros).subscribe( (data : any) =>
    {
        this.loadingmodal = false;
        if(data.estadomensaje=="0")
        {
            this.guardarAnulacionNotaCredito();
        }
        else
        {
          this.toastr.error("Se Origino un error " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
        }
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadingmodal = false;
    });
  }

  guardarAnulacionNotaCredito = () =>{

    this.loadingmodal = true;

    const parametros = {
      'cod_nota_credito_compra' : this.cod_nota_credito_compra,
      'cod_factura_compra' : this.cod_factura_compra,
      'claveacceso' : this.claveacceso,
      'kardex' : this.kardex,
    };

    this.notacreditocompraservice.anularNotaCredito(parametros).subscribe( (data : any) =>
    {
        this.loadingmodal = false;

        if (data.estado == true)
        {
          this.datos.find((x:any) => x.cod_nota_credito_compra === this.cod_nota_credito_compra).estado = 'ANULADA';
          this.toastr.success("Nota de Crédito Anulada Correctamente, se restablecieron valores del inventario", "INFORMACIÓN DEL SISTEMA");
          $("#mymodalopciones").modal("hide");
        }
        else
        {
         this.toastr.error("No se pudo anular Nota de Crédito, vuelva a intentar por favor", "INFORMACIÓN DEL SISTEMA");
        }
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadingmodal = false;
    });
  }

  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

}