import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PuntoTransportistaService } from 'src/app/venta/services/punto-transportista.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $:any;

@Component({
  selector: 'app-nuevo-punto-transporte',
  templateUrl: './nuevo-punto-transporte.component.html',
  styleUrls: ['./nuevo-punto-transporte.component.css']
})
export class NuevoPuntoTransporteComponent implements OnInit {
  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();

  datos : any;

  cod_punto_transporte : string = "";
  punto_transporte : string = "";
  observacion : string = "";

  flagpuntotransporte : boolean = false;

  loading : boolean = false;
  

  constructor(private puntotransporteservice: PuntoTransportistaService, private toastr: ToastrService, private error:ErrorService) {
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

    this.flagpuntotransporte = false;

    if(this.punto_transporte.length==0)
    {
      this.flagpuntotransporte=true;
      valor=true;
    }

    return valor;
  }

  flagNormal()
  {
    this.flagpuntotransporte = false;
  }
  
  clickDeshacer()
  {
    this.formularioNormal();
  }
 
  buscar()
  {
    this.loading = true;
    this.puntotransporteservice.buscar(this.punto_transporte).subscribe( (data : any) =>
    {
      if (data.cod_punto_transporte == false)//No existe
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
      'cod_punto_transporte' : this.cod_punto_transporte,
      'punto_transporte' :this.punto_transporte,
      'observacion' : this.observacion
    };

    this.puntotransporteservice.guardar(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      if (data.estado == true)
      {
        const parametrosenviar = {
          'cod_punto_transporte' : this.cod_punto_transporte,
          'punto_transporte' :this.punto_transporte,
          'observacion' : this.observacion,
          'estado' : 1
        };
        this.datosenviar.emit(parametrosenviar);
        $("#mymodalPuntoTransporte").modal("hide");
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
    this.cod_punto_transporte=moment().unix().toString();
    this.punto_transporte="";
    this.observacion="";

    this.loading = false;
    

    this.flagNormal();
  }





}