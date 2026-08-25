import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { VehiculoService } from 'src/app/venta/services/vehiculo.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $:any;

@Component({
  selector: 'app-nuevo-vehiculo',
  templateUrl: './nuevo-vehiculo.component.html',
  styleUrls: ['./nuevo-vehiculo.component.css']
})
export class NuevoVehiculoComponent implements OnInit {
  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();

  datos : any;

  cod_vehiculo : string = "";
  placa : string = "";
  descripcion : string = "";

  flagplaca : boolean = false;

  loading : boolean = false;
  

  constructor(private vehiculoservice: VehiculoService, private toastr: ToastrService, private error:ErrorService) {
  }


  ngOnInit(): void {
    this.formularioNormal();
  }

  clickGuardar()
  {
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      this.toastr.warning("Algunos campos no estan llenos, son obligatorios", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      this.buscar(); 
    }
  }
  
  
  verificarCampos()
  {
    let valor : Boolean = false;

    this.flagplaca = false;

    if(this.placa.length==0)
    {
      this.flagplaca=true;
      valor=true;
    }

    return valor;
  }

  flagNormal()
  {
    this.flagplaca = false;
  }
  
  clickDeshacer()
  {
    this.formularioNormal();
  }
 
  buscar()
  {
    this.loading = true;
    this.vehiculoservice.buscar(this.placa).subscribe( (data : any) =>
    {
      if (data.cod_vehiculo == false)//No existe
      {
          this.guardar();
      }
      else
      {
          this.toastr.warning("Marca se encuentra registrado, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      this.loading = false;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false; 
    });
  }
  
  guardar = () =>{

    this.loading = true;
    

    const parametros = {
      'cod_vehiculo' : this.cod_vehiculo,
      'placa' :this.placa,
      'descripcion' : this.descripcion
    };

    this.vehiculoservice.guardar(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      if (data.estado == true)
      {
        const parametrosenviar = {
          'cod_vehiculo' : this.cod_vehiculo,
          'placa' :this.placa,
          'descripcion' : this.descripcion,
          'estado' : 1
        };
        this.datosenviar.emit(parametrosenviar);
        $("#mymodalVehiculo").modal("hide");
        this.toastr.success("Registro Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Registro no se pudo Almacenar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
  });
  }
  
  formularioNormal()
  {
    this.cod_vehiculo=moment().unix().toString();
    this.placa="";
    this.descripcion="";

    this.loading = false;
    

    this.flagNormal();
  }





}