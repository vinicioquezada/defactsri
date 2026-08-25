import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { RutaService } from 'src/app/venta/services/ruta.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $:any;

@Component({
  selector: 'app-nueva-ruta',
  templateUrl: './nueva-ruta.component.html',
  styleUrls: ['./nueva-ruta.component.css']
})
export class NuevaRutaComponent implements OnInit {
  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();

  datos : any;

  cod_ruta : string = "";
  ruta : string = "";
  observacion : string = "";

  flagruta : boolean = false;

  loading : boolean = false;
  

  constructor(private rutaservice: RutaService, private toastr: ToastrService, private error:ErrorService) {
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

    this.flagruta = false;

    if(this.ruta.length==0)
    {
      this.flagruta=true;
      valor=true;
    }

    return valor;
  }

  flagNormal()
  {
    this.flagruta = false;
  }
  
  clickDeshacer()
  {
    this.formularioNormal();
  }
 
  buscar()
  {
    this.loading = true;
    this.rutaservice.buscar(this.ruta).subscribe( (data : any) =>
    {
      if (data.cod_ruta == false)//No existe
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
      'cod_ruta' : this.cod_ruta,
      'ruta' :this.ruta,
      'observacion' : this.observacion
    };

    this.rutaservice.guardar(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      if (data.estado == true)
      {
        const parametrosenviar = {
          'cod_ruta' : this.cod_ruta,
          'ruta' :this.ruta,
          'observacion' : this.observacion,
          'estado' : 1
        };
        this.datosenviar.emit(parametrosenviar);
        $("#mymodalRuta").modal("hide");
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
    this.cod_ruta=moment().unix().toString();
    this.ruta="";
    this.observacion="";

    this.loading = false;
    

    this.flagNormal();
  }





}