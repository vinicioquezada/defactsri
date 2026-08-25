import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormaPagoService } from 'src/app/venta/services/forma-pago.service';
import { ErrorService } from '../../services/error.service';
import { TarjetaTarifaService } from 'src/app/venta/services/tarjeta-tarifa.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
declare var $:any;
import { redondeardecimales } from '../../../shared/js/decimales.js';


@Component({
  selector: 'app-forma-pago',
  templateUrl: './forma-pago.component.html',
  styleUrls: ['./forma-pago.component.css']
})
export class FormaPagoComponent implements OnInit {
  @Input() disabledformapago : boolean = true;
  @Input() chkcontado : boolean = true;
  id_forma_pago: string = "01";
  itemformapago : any = {};
  itemformapagoactualizar : any = {};
  datosformapago : any = [];

  loading : boolean = false;
  loadinglistado : boolean = false;

  valorbase: string = "";
  valorimpuesto: string = "";
  plazo: number = 0;
  tiempo: string = "dias";

  flagplazo : boolean = false;
  flagtiempo : boolean = false;

  datosformapagoseleccion : any = [];

  importetotal : number = 0;

  ban: number = 0;

  @Output() sendChangeFormaPago: EventEmitter<any> = new EventEmitter<any>();

  constructor(private tarjetatarifaservice : TarjetaTarifaService, private toastr : ToastrService, private error : ErrorService, private formapagoservice : FormaPagoService) { }

  ngOnInit(): void {
    this.listarFormaPagos();
  }

  formularioNormal()
  {
    this.id_forma_pago = "01";
    this.itemformapago = {};
    //this.datosformapago = [];

    this.valorbase = "";
    this.valorimpuesto = "";
    this.plazo = 0;
    this.tiempo = "dias";
    this.importetotal = 0;

    this.datosformapagoseleccion = [];
    const resultado = this.datosformapago.find( (valor : any) => valor.id_forma_pago == this.id_forma_pago );
    const itemCopia = {
      ...resultado,
      valor: this.importetotal,
      plazo: this.plazo,
      tiempo: this.tiempo
    };
    this.datosformapagoseleccion.push(itemCopia);

    this.ban = 0;
  }

  ubicarFormaPagoDeudor(): void
  {
    this.id_forma_pago = "01";
    this.itemformapago = {};
    //this.datosformapago = [];

    this.valorbase = "";
    this.valorimpuesto = "";
    this.plazo = 0;
    this.tiempo = "dias";

    this.datosformapagoseleccion = [];
    const resultado = this.datosformapago.find( (valor : any) => valor.id_forma_pago == this.id_forma_pago );
    const itemCopia = {
      ...resultado,
      valor: this.importetotal,
      plazo: this.plazo,
      tiempo: this.tiempo
    };
    this.datosformapagoseleccion.push(itemCopia);
  }

  changeFormaPago(event: any): void {
    const elemento = event.target.value;
    let id_forma_pago = elemento;
    this.itemformapago = this.datosformapago.find( (valor : any) => valor.id_forma_pago == id_forma_pago );
  }

  agregarValorImporteFormaPago(importetotal: number)
  {
    this.importetotal = importetotal;
    if(this.datosformapagoseleccion.length>0)
    {
      this.datosformapagoseleccion[0].valor = importetotal;
    }
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

  /*
  agregarFormaPorDefecto() : void
  {
    const resultado = this.datosformapago.find( (valor : any) => valor.id_forma_pago == this.id_forma_pago );
      const itemCopia = {
        ...resultado,
        valor: this.importetotal,
        plazo: this.plazo,
        tiempo: this.tiempo
      };
      this.datosformapagoseleccion.push(itemCopia);
  }
  */

  agregarFormaPago() : void
  {
    if(this.valorimpuesto == "" || this.valorimpuesto == "0")
    {
      this.mensajeAlert("El método de pago debe tener un valor para agregar");
    }
    else
    {
      if((!this.plazo && this.plazo<0) || !this.tiempo)
      {
        this.mensajeAlert("El plazo y el tiempo no puede estar vacío");
      }
      else
      {
        let importesumado = this.datosformapagoseleccion.reduce((suma, item) => suma + item.valor, 0);
        if(this.ban==0)
        {
          let existe = false;
          for (const item of this.datosformapagoseleccion) {
            if (item.id_forma_pago == this.itemformapago.id_forma_pago) {
              existe = true;
              break;
            }
          }

          if(existe)
          {
            this.mensajeAlert("Forma de pago ya existe seleccione otra forma de pago");
          }
          else
          {
            let sumado = redondeardecimales(parseFloat(this.valorimpuesto) + parseFloat(importesumado), 2);
  
            if(sumado > this.importetotal)
            {
              this.mensajeAlert("El valor de forma de pago excede al valor del importe total de la factura");
            }
            else
            {
              const itemCopia = {
                ...this.itemformapago,
                valor: parseFloat(this.valorimpuesto),
                plazo: this.plazo,
                tiempo: this.tiempo
              };
              this.datosformapagoseleccion.push(itemCopia);
              $("#mymodalformapago").modal("hide");
              
              
              this.sendChangeFormaPago.emit();
              
            }
          }
        }
        else
        {
          let existe = false;
          for (const item of this.datosformapagoseleccion) {
            if (item.id_forma_pago == this.itemformapago.id_forma_pago && item.id_forma_pago != this.id_forma_pago) {
              existe = true;
              break;
            }
          }

          if(existe)
          {
            this.mensajeAlert("Forma de pago ya existe seleccione otra");
          }
          else
          {
            let sumado = redondeardecimales(parseFloat(this.valorimpuesto) + parseFloat(importesumado), 2);
            if(parseFloat(this.valorimpuesto)>sumado)
            {
              this.mensajeAlert("El valor de forma de pago a editar no puede ser mayor al importe total de la factura");
            }
            else
            {
              this.actualizarValor(this.itemformapagoactualizar.id_forma_pago, parseFloat(this.valorimpuesto), this.plazo, this.tiempo);
            }
          } 
        }
      } 
    }
  }

  actualizarValor(id_forma_pago_buscar: string, valor: number, plazo: number, tiempo: string): void {
    const item = this.datosformapagoseleccion.find(item => item.id_forma_pago == id_forma_pago_buscar);
    if (item) {
      item.id_forma_pago = this.itemformapago.id_forma_pago;
      item.forma_pago = this.itemformapago.forma_pago;
      item.valor = valor;
      item.plazo = plazo;
      item.tiempo = tiempo;
      $("#mymodalformapago").modal("hide");

      this.sendChangeFormaPago.emit();

    } else {
      this.mensajeAlert("No se encontró forma de pago");
    }
  }

  clickMasFormas()
  {
    if(this.chkcontado==true)
    {
      let importesumado = this.datosformapagoseleccion.reduce((suma, item) => suma + parseFloat(item.valor), 0);
      //console.log(importesumado);
      //console.log(this.importetotal);
      if(importesumado >= this.importetotal)
      {
        this.mensajeAlert("No se puede agregar más método de pago debe primro modificar el valor de la actual forma de pago");
      }
      else
      {
        let restante = this.importetotal - importesumado;
        this.ban = 0;
        this.id_forma_pago = "01";
        this.plazo = 0;
        this.tiempo = "dias";
        this.itemformapago = this.datosformapago.find( (valor : any) => valor.id_forma_pago == this.id_forma_pago );
        //console.log(this.datosformapago);
        //console.log(this.itemformapago);
        this.valorimpuesto = redondeardecimales(restante, 2);
        $("#mymodalformapago").modal("show");
      }
    }
    else
    {
      this.mensajeAlert("No puede agregar más metodo de pago si la venta está adeudada");
    }
  }

  clickEditarForma(item: any)
  {
    if(!this.disabledformapago)
    {
      this.ban = 1;
      this.id_forma_pago = item.id_forma_pago;
      this.itemformapago = item;
      this.itemformapagoactualizar = item;
      this.valorimpuesto = item.valor;
      this.plazo = item.plazo;
      this.tiempo = item.tiempo;
      $("#mymodalformapago").modal("show");
    }
  }

  quitarFormaPago()
  {
    const indice = this.datosformapagoseleccion.findIndex(item => item.id_forma_pago === this.itemformapago.id_forma_pago);

    if (indice !== -1) {
      this.datosformapagoseleccion.splice(indice, 1);
    }
  }

  mensajeAlert(mensaje: string) : void
  {
    Swal.fire({
      title: 'Control del Sistema',
      text: mensaje,
      icon: 'warning',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.value) {
        
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }
}