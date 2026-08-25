import { Component, OnInit } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { CompraService } from '../../services/compra.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';
import { Router } from '@angular/router';
import { NotaCreditoComprasService } from '../../services/nota-credito-compras.service';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import { KardexService } from 'src/app/kardex/services/kardex.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-explorador-compra',
  templateUrl: './explorador-compra.component.html',
  styleUrls: ['./explorador-compra.component.css']
})
export class ExploradorCompraComponent implements OnInit {
  
  opcionesmenu : any;
  multisucursal : string = "0";
  kardex : string = "";
  datos : any;
  datossucursal : any;
  filterpost = "";

  cod_sucursal : string = "";

  fechadesde : string = "";
  fechahasta : string = "";

  numero_factura : string = "";
  proveedor : string = "";
  cod_factura_compra : string = "";

  loadinglistado : boolean = false;

  disabledbtneditar : boolean = false;
  disabledbtnanular : boolean = false;
  disabledbtnfijarprecios : boolean = false;
  disabledbtnnotacredito : boolean = false;

  opcionesprivilegios : any;

  inventario: number = 1;

  page = 1;
  count = 0;
  pagesize = 5;
  
  constructor(private router : Router, private compraservice:CompraService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private Notacreditocomprasservice: NotaCreditoComprasService, private kardexservice: KardexService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.opcionesmenu = this.usersession.getAllMenu();
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
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
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  visualizar()
  {
    let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/compras/facturacompra?codfacturacompra=" + this.cod_factura_compra, "", 'width=600,height=400,left=300,top=100');
     miVentana.focus();
  }

  editar()
  {
    if(this.inventario==1)
    {
      if(this.kardex == "1") {
        this.verificarNotaCreditoCompra();
      } else {
        this.mantenerEstados();
        this.router.navigate(["/menucompra/compra", "actualizarregistro", this.cod_factura_compra]);
      }
    }
    else
    {
      this.mantenerEstados();
      this.router.navigate(["/menucompra/compra", "actualizarregistrogastos", this.cod_factura_compra]);
    }

    
  }

  clickFijarPrecios()
  {
    this.mantenerEstados();
    this.router.navigate(["/menucompra/fijarpreciosproductos", this.cod_factura_compra]);
  }

  clickRegistroCaducidad()
  {
    this.mantenerEstados();
    this.router.navigate(["/menualmacen/registrocaducidad", this.cod_factura_compra]);
  }

  clickBuscar()
  {
    if(this.datossucursal.length>0)
    {
      this.listarFacturas(1);
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }

  opciones(item: any)
  {
    this.inventario = item.inventario;
    this.cod_factura_compra = item.cod_factura_compra;
    this.numero_factura = item.numero_factura;
    this.proveedor = item.proveedor;
    if(item.estado=="CREADA")
    {
      this.disabledbtneditar = false;
      this.disabledbtnanular = false;
      this.disabledbtnfijarprecios = false;
      this.disabledbtnnotacredito = false;
    }

    if(item.estado=="ANULADA")
    {
      this.disabledbtneditar = true; 
      this.disabledbtnanular = true
      this.disabledbtnfijarprecios = true;
      this.disabledbtnnotacredito = true;
    }
    $("#mymodalopciones").modal("show");
  }

  crearNotaCredito()
  {
    this.mantenerEstados();
	  this.router.navigate(["/menucompra/notacreditocompras", "nuevoregistro", this.cod_factura_compra]);
  }

  formularioNormal()
  {
    this.filterpost="";
    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');
    this.numero_factura = "";
    this.cod_factura_compra = "";
    this.datos = [];

    const savedtipoformulario = sessionStorage.getItem("tipo_formulario");//Restaurar datos
    const savedcodsucursal = sessionStorage.getItem("cod_sucursal");
    const savedpage = parseInt(sessionStorage.getItem("page"));
    const savedfechadesde = sessionStorage.getItem("fechadesde");
    const savedfechahasta = sessionStorage.getItem("fechahasta");
    if (savedtipoformulario=="explorador_compra") {
      this.cod_sucursal = savedcodsucursal;
      this.fechadesde = savedfechadesde;
      this.fechahasta = savedfechahasta;
      sessionStorage.removeItem("tipo_formulario");
      sessionStorage.removeItem("cod_sucursal");
      sessionStorage.removeItem("estado");
      sessionStorage.removeItem("page");
      sessionStorage.removeItem("fechadesde");
      sessionStorage.removeItem("fechahasta");
      this.listarFacturas(savedpage);
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
    sessionStorage.setItem("tipo_formulario", "explorador_compra");//Restaurar datos
    sessionStorage.setItem("cod_sucursal", this.cod_sucursal);
    sessionStorage.setItem("page", String(this.page));
    sessionStorage.setItem("fechadesde", this.fechadesde);
    sessionStorage.setItem("fechahasta", this.fechahasta);
  }
 
  listarFacturas(page: number)
  {
    this.page = page;
    this.filterpost="";
    this.loadinglistado = true;
    this.compraservice.listarFacturas(this.fechadesde, this.fechahasta, this.cod_sucursal).subscribe( (data : any) =>
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
    if(this.kardex == "1") {
      this.verificarNotaCreditoCompraAnular();
    }
    else
    {
      this.confirmarAnulacionCompra();
    }
  }

  confirmarAnulacionCompra()
  {
    Swal.fire({
        title: 'ANULAR FACTURA Nº'  + this.numero_factura + ' - ' + this.proveedor,
        text: 'Confirmar para anular el registro seleccionado',
        icon: 'info',//'warning'
        showCancelButton: true,
        confirmButtonText: 'Si, Anular',
        cancelButtonText: 'No, Anular'
      }).then((result) => {
        if (result.value) {
          if(this.kardex=="1")
          {
            this.verificarSalidasKardex();
          }
          else
          {
            this.anularFacturaCompra();
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          
        }
    });
  }

  listarSucursales()
  {
    this.datossucursal = [];
    this.loadinglistado = true;
    
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.datossucursal = data;
      this.loadinglistado = false;
      
      this.formularioNormal();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  verificarSalidasKardex()
  {
    this.loadinglistado = true;

    this.kardexservice.verificarSalidasKardex(this.cod_factura_compra, "COMPRA", 0).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      
      if (data.estado == true)
      {
        if(data.diferencias == 0)
        {
          this.anularFacturaCompra();
        }
        else
        {
          this.toastr.error("No es posible anular el ingreso de mercadería porque ya existen movimientos de salida, en ese caso debe modificar unicamente el registro de ingreso del producto o ajustar el kardex", "INFORMACIÓN DEL SISTEMA");
        }
      }
      else
      {
        this.toastr.error("No se pudo consultar en el kardex el movimiento, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  anularFacturaCompra()
  {

    this.loadinglistado = true;

    const parametros = {
      'cod_factura_compra' : this.cod_factura_compra,
      'kardex' : this.kardex,
      'inventario' : 1//1 Si inventario y 0 Compras Retención
    };

    this.compraservice.anularFacturaCompra(parametros).subscribe( (data : any) =>
    {
        this.loadinglistado = false;
        

        if (data.estado == true)
        {
          this.datos.find((x:any) => x.cod_factura_compra === this.cod_factura_compra).estado = 'ANULADA';
          this.toastr.success("Factura de compra anulada correctamente, se restablecieron valores del inventario", "INFORMACIÓN DEL SISTEMA");
          $("#mymodalopciones").modal("hide");
        }
        else
        {
          this.toastr.error("Registro no se pudo anular Error: " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
        }
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadinglistado = false;
        
    });
  }

  verificarNotaCreditoCompra()
  {
    this.loadinglistado = true;
    this.Notacreditocomprasservice.verificarNotaCreditoCompra(this.cod_factura_compra).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
        if(data.cod_nota_credito_compra == false) {
          this.mantenerEstados();
          this.router.navigate(["/menucompra/compra", "actualizarregistro", this.cod_factura_compra]);
        } else {
          this.toastr.warning("La compra no se puede editar porque se a originado una nota de crédito de compra, debe hacer la modificación o devolución en la nota de crédito", "INFORMACIÓN DEL SISTEMA");
        }
    }, err => {
      this.loadinglistado = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  verificarNotaCreditoCompraAnular()
  {
    this.loadinglistado = true;
    this.Notacreditocomprasservice.verificarNotaCreditoCompra(this.cod_factura_compra).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
        if(data.cod_nota_credito_compra == false) {
         this.confirmarAnulacionCompra();
        } else {
          this.toastr.warning("La compra no se puede anular porque se a originado una nota de crédito de compra, debe hacer la devolución total en la nota de crédito", "INFORMACIÓN DEL SISTEMA");
        }
    }, err => {
      this.loadinglistado = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
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