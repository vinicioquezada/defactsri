import { Component, OnInit} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { CodigoProductoService } from 'src/app/almacen/services/codigo-producto.service';

@Component({
  selector: 'app-codigo-producto',
  templateUrl: './codigo-producto.component.html',
  styleUrls: ['./codigo-producto.component.css']
})
export class CodigoProductoComponent implements OnInit {
  //@Input() disabledtransaccionbanco : boolean = true;
  cod_factura_venta: string = "";
  codigo_producto: string = "";
  datoscodigoproducto : any = [];
  loading : boolean = false;

  constructor(private codigoproductoservice: CodigoProductoService, private toastr : ToastrService, private error : ErrorService) { }

  ngOnInit(): void {
    //this.listarTransaccionesBanco();
  }

  buscarNumeroTransaccion(): void
  {
    if(this.codigo_producto == "")
    {
      this.toastr.warning("Debe ingresar un código de producto", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      this.loading = true;
      this.codigoproductoservice.buscarCodigoProducto(this.codigo_producto).subscribe( (data : any) =>
      {
        this.loading = false;
        if (data.cod_codigo_producto == false)
        {
            let obj = {
              'codigo_producto' :this.codigo_producto
            };
  
           this.datoscodigoproducto.push(obj);
           this.codigo_producto = "";
        }
        else
        {
            this.toastr.warning("Código de producto se encuentra registrado", "INFORMACIÓN DEL SISTEMA");
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
        this.datoscodigoproducto.splice(index, 1);
      }
      catch(e)
      {
        console.log(e);
       this.toastr.error("Se a producido un error al borrar el items", "INFORMACIÓN DEL SISTEMA");
      }
  }
}