import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ActividadService } from 'src/app/gym/services/actividad.service';
import { SwalService } from 'src/app/shared/services/swal.service';

@Component({
  selector: 'app-actividad-form',
  templateUrl: './actividad-form.component.html',
  styleUrls: ['./actividad-form.component.css']
})
export class ActividadFormComponent implements OnInit {
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  tipoformulario: string = "";
  cod_actividad : string = "";
  actividad : string = "";
  observacion : string = "";

  flagocultarboton : boolean = false;
  flagactividad : boolean = false;

  ban : number = 0;
  codigotemporal : string = "";
  
  constructor(private actividadservice: ActividadService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService) { }

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
      if(this.actividad==this.codigotemporal)
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

    this.flagactividad = false;

    if(this.actividad.length==0)
    {
      this.flagactividad=true;
      valor=true;
    }

    return valor;
  }

  flagNormal()
  {
    this.flagactividad = false;
  }

  buscar()
  {
    this.swalservice.iniciarLoading("Buscando...");
    

    this.actividadservice.buscar(this.actividad).subscribe( (data : any) =>
    {
      if (data.cod_actividad == false)//No existe
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
          this.toastr.warning("Categoría se encuentra registrado, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }

      this.swalservice.close();
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
      
  });
  }
  
  guardar()
  {
    this.swalservice.iniciarLoading("Almacenando...");
    const parametros = {
      'cod_actividad' : this.cod_actividad,
      'actividad' :this.actividad,
      'observacion' : this.observacion
    };

    this.actividadservice.guardar(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();
      

      if (data.estado == true)
      {
        //this.datosenvio.emit();
        const parametrosenviar = {
          'cod_actividad' : this.cod_actividad,
          'actividad' : this.actividad,
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
      this.swalservice.close();
      
    });
  }
  
  actualizar()
  {
    this.swalservice.iniciarLoading("Actualizando...");
    
    const parametros = {
      'cod_actividad' : this.cod_actividad,
      'actividad' :this.actividad,
      'observacion' : this.observacion
    };

    this.actividadservice.actualizar(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();
      

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
      this.swalservice.close();
      
    });
  }

  editar(item :any)
  {      
      this.cod_actividad = item.cod_actividad;
      this.actividad = item.actividad;
      this.observacion = item.observacion;

      this.flagNormal();
      this.flagocultarboton = true;
      this.codigotemporal=this.actividad;
      this.ban=1;
  }

  formularioNormal()
  {
    this.cod_actividad=moment().unix().toString();
    this.actividad="";
    this.observacion="";

    this.swalservice.close();
    

    this.flagocultarboton = false;

    this.flagNormal();
  
    this.codigotemporal="";
    
    this.ban=0;
  }

}