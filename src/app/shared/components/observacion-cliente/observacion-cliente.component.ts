import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from 'src/app/venta/services/cliente.service';
import { ErrorService } from '../../services/error.service';
declare var $:any;

@Component({
  selector: 'app-observacion-cliente',
  templateUrl: './observacion-cliente.component.html',
  styleUrls: ['./observacion-cliente.component.css']
})
export class ObservacionClienteComponent implements OnInit {
  loadingobservacion : boolean = false;
  cod_cliente: string = "";
  cliente : string = "";
  observacion : string = "";
  opcion : string = "";

  constructor(private clienteservice:ClienteService, private toastr: ToastrService, private error:ErrorService) { }

  ngOnInit(): void {
  }

  verObservacion(cod_cliente: string, cliente: string)
  {
    this.cod_cliente = cod_cliente;
    this.cliente = cliente;
    $("#mymodalobservacion").modal("show");

    this.loadingobservacion = true;

    this.clienteservice.verObservacion(cod_cliente).subscribe( (data : any) =>
    {     
      
      this.observacion=data.observacion
      

      this.loadingobservacion = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingobservacion = false;
      
    });
  }

  eliminarObservacion()
  {
      this.loadingobservacion = true;
    
      const parametros = {
        'cod_cliente' : this.cod_cliente
      };

    this.clienteservice.eliminarObservacion(parametros).subscribe( (data : any) =>
    {
      this.loadingobservacion = false;

      if (data.estado == true)
      {
         
        $("#mymodalobservacion").modal("hide");

        this.toastr.success("Registro observación eliminado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Registro observación no se pudo eliminar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingobservacion = false;
        
    });
  }

}
