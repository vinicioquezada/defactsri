import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { TransaccionBancoService } from 'src/app/venta/services/transaccion-banco.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-transacciones-banco',
  templateUrl: './transacciones-banco.component.html',
  styleUrls: ['./transacciones-banco.component.css']
})
export class TransaccionesBancoComponent implements OnInit {
  @Input() disabledtransaccionbanco : boolean = true;
  cod_factura_venta: string = "";
  numero_transaccion: string = "";
  datostransaccionbanco : any = [];
  loading : boolean = false;

  constructor(private transaccionbancoservice: TransaccionBancoService, private toastr : ToastrService, private error : ErrorService) { }

  ngOnInit(): void {
    //this.listarTransaccionesBanco();
  }

  buscarNumeroTransaccion(): void
  {
    if(this.numero_transaccion == "")
    {
      this.toastr.warning("Debe ingresar un número de transacción", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      this.loading = true;
      this.transaccionbancoservice.buscarNumeroTransaccion(this.numero_transaccion).subscribe( (data : any) =>
      {
        this.loading = false;
        if (data.cod_transaccion_banco == false)
        {
            let obj = {
              'numero_transaccion' :this.numero_transaccion
            };
  
           this.datostransaccionbanco.push(obj);
           this.numero_transaccion = "";
        }
        else
        {
            this.toastr.warning("Número de transacción se encuentra registrado en " + data.tipo_venta  + " Nº " + data.numero_factura + " con fecha " + data.fecha_hora, "INFORMACIÓN DEL SISTEMA");
        }
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loading = false;
        
      });
    }
  }

  borrar(index)
  {
      try
      {
        this.datostransaccionbanco.splice(index, 1);
      }
      catch(e)
      {
        console.log(e);
       this.toastr.error("Se a producido un error al borrar el items", "INFORMACIÓN DEL SISTEMA");
      }
  }
}
