import { Component, OnInit, Input } from '@angular/core';
import { ErrorService } from '../../services/error.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'src/app/shared/services/config.service';
declare var $:any;
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { SaldoNotaCreditoService } from 'src/app/venta/services/saldo-nota-credito.service';
import { FormaPagoService } from 'src/app/venta/services/forma-pago.service';

@Component({
  selector: 'app-compensacion',
  templateUrl: './compensacion.component.html',
  styleUrls: ['./compensacion.component.css']
})
export class CompensacionComponent implements OnInit {
  @Input() disabledformapago : boolean = true;
  @Input() chkcontado : boolean = true;
  loading : boolean = false;
  loadinglistado : boolean = false;
  datospagarnotacredito : any = [];
  chkpagarnotacredito : boolean = false;
  //disabledchkpagarnotacredito : boolean = false;
  cod_nota_credito: string = "";
  numero_nota_credito: string = "";
  saldo_favor: string = "";
  importetotalnotacredito: string = "";
  valor_compensacion : number = 0;
  observacion: string = "";
  pagenotacredito = 1;
  countnotacredito = 0;
  pagesizenotacredito = 5;
  cod_cliente : string = "1";
  datosnotascredito: any = [];
  filterpost = "";
  detalle : string = "";
  fecha_hora : string = "";
  termino_saldo : number = 0;//0 Sin deudas y 1 Con deudas
  colormensaje : string;
  textomensaje : string;
  importetotal : number = 0;

  id_forma_pago: string = "01";
  datosformapago : any = [];
  forma_pago: string = "SIN UTILIZACION DEL SISTEMA FINANCIERO";

  constructor(private toastr : ToastrService, private error : ErrorService, private saldonotacreditoservice: SaldoNotaCreditoService, private formapagoservice : FormaPagoService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.listarFormaPagos();
  }

  agregarValorImporteFormaPago(importetotal: number)
  {
    this.importetotal = importetotal;
  }

  formularioNormal()
  {
    this.cod_nota_credito = "";
    this.numero_nota_credito = "";
    this.importetotalnotacredito = "";
    this.saldo_favor = "";
    this.observacion = "";
    this.colormensaje = "";
    this.textomensaje = "";
    this.valor_compensacion = null;
    this.fecha_hora = "";
    this.datospagarnotacredito = [];
    this.chkpagarnotacredito = false;
    this.id_forma_pago = "01";
    this.forma_pago = "SIN UTILIZACION DEL SISTEMA FINANCIERO";
  }

  changeFormaPago(event: any): void {
    const elemento = event.target.value;
    let id_forma_pago = elemento;
    this.forma_pago = this.datosformapago.find( (valor : any) => valor.id_forma_pago == id_forma_pago ).forma_pago;
  }

  listarFormaPagos()
  {    
    this.loading = true;
    this.formapagoservice.listarFormaPagos().subscribe( (data : any) =>
    {
      this.datosformapago = data;
      this.loading = false;      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  changeChkPagarConNotasCredito()
  {
    if(this.chkpagarnotacredito==true){
      this.chkpagarnotacredito = false;
      this.formularioNormal();
    }else{
      this.chkpagarnotacredito = true;
    }
  }

  nuevaCompensacion()
  {
    this.cod_nota_credito = "";
    this.numero_nota_credito = "";
    this.importetotalnotacredito = "";
    this.saldo_favor = "";
    this.observacion = "";
    this.colormensaje = "";
    this.textomensaje = "";
    this.valor_compensacion = null;
    this.fecha_hora = "";
    $("#mymodalregistrocompensacion").modal("show");
  }

  listarNotaCreditosPorCliente()
  {
    $("#mymodallistarnotascredito").modal("show");
    this.listarNotasCreditosClienteVenta();
  }

  listarNotasCreditosClienteVenta()
  {
    this.pagenotacredito = 1;
    this.filterpost="";
    this.datosnotascredito = [];
    this.loadinglistado = true;
    this.saldonotacreditoservice.listarNotasCreditosClienteVenta(this.cod_cliente).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.datosnotascredito = data;
    }, err => {
      this.loadinglistado = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  agregarNotaCredito(item: any)
  {
    /*
    let itemencontrado = this.datospagarnotacredito.some( (valor : any) => valor.cod_nota_credito == item.cod_nota_credito );
    if(itemencontrado)
    {
      this.toastr.warning("Nota de crédito ya fue agregada, seleccione una diferente o borre la nota de credito agregada en la tabla de compensación", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
    */
      this.cod_nota_credito = item.cod_nota_credito;
      this.numero_nota_credito = item.numero_nota_credito;
      this.importetotalnotacredito = item.importetotal;
      this.saldo_favor = item.saldo_favor;
      this.fecha_hora = item.fecha_hora;
      $("#mymodallistarnotascredito").modal("hide");
    //}
  }

  calcularCompensacion()
  {
    //alert(this.id_forma_pago);
    if(this.valor_compensacion==null)
    {
      this.toastr.info("Ingrese una cantidad para compensación", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      //try
      //{
        //let itemformapago = this.datosformapagoseleccion.find( (valor : any) => valor.id_forma_pago == "01" );
        if(this.valor_compensacion > this.importetotal)
        {
          //this.toastr.info("Ingrese una cantidad menor al valor de Sin Utilización del Sistema Financiero, solo con este tipo de forma de pago se puede hacer la compensación de notas de créditos", "INFORMACIÓN DEL SISTEMA");
          this.toastr.info("Ingrese una cantidad menor al total de la venta", "INFORMACIÓN DEL SISTEMA");
        }
        else
        {
          if(this.valor_compensacion>=parseFloat(this.saldo_favor))
          {
            this.termino_saldo = 1;//Saldo Finalizada
            this.colormensaje = "#0000FF";
            this.textomensaje = "Saldo finalizada";
            this.valor_compensacion = parseFloat(this.saldo_favor);
          }
          else
          {
              let deuda_total = parseFloat(this.saldo_favor) - this.valor_compensacion;
              this.termino_saldo = 0;//Saldo Continua
              this.colormensaje = "#FF0000";
              this.textomensaje = "Saldo Pendiente : " + redondeardecimales(deuda_total, 2);
          }
        }
      /*
      }
      catch(e)
      {
        this.toastr.info("Debe tener seleccionado el método de Sin utilización del sistema financiero para realizar la compensación con notas de créditos", "INFORMACIÓN DEL SISTEMA");
      }
      */
    }
  }

  agregarCompensacion()
  {
    if(Number(this.valor_compensacion) > 0)
    {
      /*
      const saldoocupado = this.datospagarnotacredito.reduce((total, item) => {
      return total + (parseFloat(item.saldo_ocupado) || 0);
      }, 0);
      */

      const { saldo_ocupado, saldo_ocupado_formapago } = this.datospagarnotacredito.reduce(
        (acc, item) => {
          const saldo = parseFloat(item.saldo_ocupado) || 0;
          acc.saldo_ocupado += saldo;
          if (item.cod_nota_credito == this.cod_nota_credito) {
            acc.saldo_ocupado_formapago += saldo;
          }
          return acc;
        },
        { saldo_ocupado: 0, saldo_ocupado_formapago: 0 }
      );

      const totalsaldoocupado = saldo_ocupado + Number(this.valor_compensacion);

      if(totalsaldoocupado > this.importetotal)
      {
        this.toastr.warning("El total de saldo ocupado no puede exceder al total de la factura", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        /*
        let totalsaldoocupadoformapago = saldo_ocupado_formapago + Number(this.valor_compensacion);
        if(totalsaldoocupadoformapago > "Aqui va el valor de la forma de pago del componnet de Forma de Pago")
        {
          this.toastr.warning("El total de saldo ocupado no puede exceder al total de la nota de crédito aplicada", "INFORMACIÓN DEL SISTEMA");
        }
        else
        {
        */
          let objcompensacion = {
            "cod_nota_credito" : this.cod_nota_credito,
            "numero_nota_credito" : this.numero_nota_credito,
            "fecha_hora" : this.fecha_hora,
            "saldo_favor" : this.saldo_favor,
            "saldo_ocupado" : this.valor_compensacion,
            "termino_saldo" : this.termino_saldo,
            "id_forma_pago" : this.id_forma_pago,
            "forma_pago" : this.forma_pago,
            "observacion" : this.observacion
          };
          this.datospagarnotacredito.push(objcompensacion);
          $("#mymodalregistrocompensacion").modal("hide");
        /*}*/
      }
    }
    else
    {
      this.toastr.warning("El valor de la compensación debe ser mayor a 0", "INFORMACIÓN DEL SISTEMA");
    }
  }

  borrarNotaCreditoCalculada(item: any)
  {
    const indice = this.datospagarnotacredito.findIndex(valor => valor.cod_nota_credito === item.cod_nota_credito);
    if (indice !== -1) {
      this.datospagarnotacredito.splice(indice, 1);
    }
  }

  keyFiltrado()
  {
    this.pagenotacredito = 1;
  }

  handlePageChange(event: number): void {
    this.pagenotacredito = event;
  }

  revisarDetalles(detalle : string)
  {
    this.detalle = detalle;
    $("#mymodalrevisardetalles").modal("show");
  }

  visualizar(cod_nota_credito : string, tipo_venta : string)
    {
      if(tipo_venta=="FACTURA" || tipo_venta=="ELECTRONICA")
        {
          let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/notacredito?codnotacredito=" + cod_nota_credito, "Devolución Venta", 'width=600,height=400,left=300,top=100');
          miVentana.focus();
        }
        
       if(tipo_venta=="RECIBO")
       {
         let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/devolucionrecibo?codnotacredito=" + cod_nota_credito, "Devolución Nota de Venta", 'width=600,height=400,left=300,top=100');
         miVentana.focus();
       }
    }

}
