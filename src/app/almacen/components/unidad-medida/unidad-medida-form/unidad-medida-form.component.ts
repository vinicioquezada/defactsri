import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { UnidadMedidaService } from 'src/app/almacen/services/unidad-medida.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-unidad-medida-form',
  templateUrl: './unidad-medida-form.component.html',
  styleUrls: ['./unidad-medida-form.component.css']
})
export class UnidadMedidaFormComponent implements OnInit {
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  @Input() tipoformulario: string = "";
  cod_unidad_medida : string = "";
  unidad_medida : string = "";
  observacion : string = "";

  flagocultarboton : boolean = false;

  flagunidadmedida : boolean = false;

  ban : number = 0;
  codigotemporal : string = "";

  loading : boolean = false;
  
  constructor(private unidadmedidaservice: UnidadMedidaService , private toastr: ToastrService, private error:ErrorService) { }

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
  
  clickActualizar()
  {
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      this.toastr.warning("Algunos campos no estan llenos, son obligatorios", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if(this.unidad_medida==this.codigotemporal)
      {
        this.actualizar();
      }
      else
      {
        this.buscar();
      }
    }
  }

  verificarCampos()
  {
    let valor : Boolean = false;

    this.flagunidadmedida = false;

    if(this.unidad_medida.length==0)
    {
      this.flagunidadmedida=true;
      valor=true;
    }

    return valor;
  }

  flagNormal()
  {
    this.flagunidadmedida = false;
  }

  buscar()
  {
    this.loading = true;
    

    this.unidadmedidaservice.buscar(this.unidad_medida).subscribe( (data : any) =>
    {
      if (data.cod_unidad_medida == false)//No existe
      {
          if (this.ban == 0)
          {
            this.guardar();
          }
          else
          {
            this.actualizar();         
          }
      }
      else
      {
          this.toastr.warning("Unidad Medida se encuentra registrado, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
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
      'cod_unidad_medida' : this.cod_unidad_medida,
      'unidad_medida' :this.unidad_medida,
      'observacion' : this.observacion
    };

    this.unidadmedidaservice.guardar(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.estado == true)
      {
        //this.datosenvio.emit();
        const parametrosenviar = {
          'cod_unidad_medida' : this.cod_unidad_medida,
          'unidad_medida' :this.unidad_medida,
          'observacion' : this.observacion,
          'estado' : 1
        };
        this.datosenvio.emit(parametrosenviar);
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
  
  actualizar = () =>{
    this.loading = true;
    

    const parametros = {
      'cod_unidad_medida' : this.cod_unidad_medida,
      'unidad_medida' :this.unidad_medida,
      'observacion' : this.observacion
    };

    this.unidadmedidaservice.actualizar(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.estado == true)
      {
        this.datosenvio.emit();
        this.toastr.success("Registro Actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Registro no se pudo Actualizar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
  });

  }

  formularioNormal()
  {
    this.cod_unidad_medida=moment().unix().toString();
    this.unidad_medida="";
    this.observacion="";

    this.loading = false;
    

    this.flagocultarboton = false;

    this.flagNormal();
  
    this.codigotemporal="";
    
    this.ban=0;
  }

}