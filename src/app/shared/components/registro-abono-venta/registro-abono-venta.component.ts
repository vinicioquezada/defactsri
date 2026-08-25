import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormaPagoService } from 'src/app/venta/services/forma-pago.service';
import { ErrorService } from '../../services/error.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { redondeardecimales } from '../../../shared/js/decimales.js';

@Component({
  selector: 'app-registro-abono-venta',
  templateUrl: './registro-abono-venta.component.html',
  styleUrls: ['./registro-abono-venta.component.css']
})
export class RegistroAbonoVentaComponent implements OnInit {
  datosformapago: any;
  loading: boolean = false;
  abono: number = 0;
  recibidoabono: string = "";
  id_forma_pago_abono: string = "01";

  @Input() importetotal : number = 0;
  @Output() sendAceptar: EventEmitter<any> = new EventEmitter<any>();

  constructor(private toastr : ToastrService, private error : ErrorService, private formapagoservice : FormaPagoService) { }

  ngOnInit(): void {
    this.listarFormaPagos();
  }

  formularioNormal()
  {
    this.abono = 0;
    this.id_forma_pago_abono = "01";
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

  changeFormaPagoAbono(event: any): void {
    const elemento = event.target.value;
    this.id_forma_pago_abono = elemento;
  }

  clickCambio()
  {
    Swal.fire({
      title: "Dar cambio",
      input: "text",
      text: "Ingresa el valor para dar el cambio",
      icon: "info",
      inputAttributes: {
        autocapitalize: "off"
      },
      confirmButtonText: "Aceptar",
      showLoaderOnConfirm: true,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      
      preConfirm: async (valorrecibido) => {
          return {
            "valorrecibido" : valorrecibido
          };
      },

    }).then((result) => {
      if (result.isConfirmed) {
        this.recibidoabono = result.value.valorrecibido;
        this.calcularRecibido();
      }
    });
  }

  calcularRecibido()
  {
    if(parseFloat(this.recibidoabono)>=this.abono)
    {
        let diferenciavalor = redondeardecimales((parseFloat(this.recibidoabono) - this.abono), 2);
        let diferencia = "Cambio: " + diferenciavalor;
       
        Swal.fire({
          title: diferencia,
          text: "Recibido: " + this.recibidoabono,
          confirmButtonText: 'OK'
        }).then( (result) => {
          if (result.value) {
            this.clickAceptar();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
           
          }
        });
    }
    else
    {
        this.toastr.warning("La cantidad recibida debe ser Mayor o Igual a la del Importe Total", "INFORMACIÓN DEL SISTEMA");
    }
  }

  clickAceptar() {

    if (this.importetotal == 0)
    {
      this.toastr.warning("No hay valor a facturar para realizar un abono", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if (this.abono > this.importetotal)
      {
        this.toastr.warning("El abono no puede superar ni puede ser igual al valor del importe total", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        let valor = {
          "recibidoabono" : this.abono,
          "id_forma_pago_abono" : this.id_forma_pago_abono
        }
        this.sendAceptar.emit(valor);
      }
    }
  }

}
