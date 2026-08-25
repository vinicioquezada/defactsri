import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SwalService } from 'src/app/shared/services/swal.service';
import { ActividadHorarioService } from 'src/app/gym/services/actividad-horario.service';

@Component({
  selector: 'app-actividad-horario-form',
  templateUrl: './actividad-horario-form.component.html',
  styleUrls: ['./actividad-horario-form.component.css']
})
export class ActividadHorarioFormComponent implements OnInit {
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  @Input() tipoformulario: string = "";
  cod_actividad_horario : string = "";
  cod_actividad : string = "";
  cod_dia : string = "";
  datosdia : any[] = [
    {
      "cod_dia" : "",
      "dia" : "SELECCIONE DÍA"
    },
    {
      "cod_dia" : "LUNES",
      "dia" : "LUNES"
    },
    {
      "cod_dia" : "MARTES",
      "dia" : "MARTES"
    },
    {
      "cod_dia" : "MIERCOLES",
      "dia" : "MIERCOLES"
    },
    {
      "cod_dia" : "JUEVES",
      "dia" : "JUEVES"
    },
    {
      "cod_dia" : "VIERNES",
      "dia" : "VIERNES"
    },
    {
      "cod_dia" : "SABADO",
      "dia" : "SABADO"
    },
    {
      "cod_dia" : "DOMINGO",
      "dia" : "DOMINGO"
    }
  ];
  hora_inicio : string = "";
  hora_fin : string = "";
  cupo_maximo : string = "";

  flagocultarboton : boolean = false;
  flagdia : boolean = false;
  flaghorainicio : boolean = false;
  flaghorafin : boolean = false;
  flagcupomaximo : boolean = false;

  ban : number = 0;
  codigotemporal : string = "";
  
  constructor(private actividadhorarioservice: ActividadHorarioService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService) { }

  ngOnInit(): void {
    this.formularioNormal();
  }

  changeDia(event: any): void {
    const elemento = event.target.value;
    this.cod_dia = elemento;
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
      if(this.cod_dia==this.codigotemporal)
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

    this.flagdia = false;

    if(this.cod_dia.length==0)
    {
      this.flagdia=true;
      valor=true;
    }

    if(this.hora_inicio.length==0)
    {
      this.flaghorainicio=true;
      valor=true;
    }

    if(this.hora_fin.length==0)
    {
      this.flaghorafin=true;
      valor=true;
    }

    if(this.cupo_maximo.length==0)
    {
      this.flagcupomaximo=true;
      valor=true;
    }

    return valor;
  }

  flagNormal()
  {
    this.flagdia = false;
    this.flaghorainicio = false;
    this.flaghorafin = false;
    this.flagcupomaximo = false;
  }

  buscar()
  {
    this.swalservice.iniciarLoading("Buscando...");
    

    this.actividadhorarioservice.buscar(this.cod_actividad, this.cod_dia, this.hora_inicio, this.hora_fin).subscribe( (data : any) =>
    {
      if (data.cod_actividad_horario == false)//No existe
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
          this.toastr.warning("Sesión de horario se encuentra registrado, existen cruces de tiempos", "INFORMACIÓN DEL SISTEMA");
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
      'cod_actividad_horario' : this.cod_actividad_horario,
      'cod_actividad' : this.cod_actividad,
      'dia' :this.cod_dia,
      'hora_inicio' :this.hora_inicio,
      'hora_fin' :this.hora_fin,
      'cupo_maximo' : this.cupo_maximo
    };

    this.actividadhorarioservice.guardar(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();
      

      if (data.estado == true)
      {
        //this.datosenvio.emit();
        const parametrosenviar = {
          'cod_actividad_horario' : this.cod_actividad_horario,
          'cod_actividad' : this.cod_actividad,
          'dia' : this.cod_dia,
          'hora_inicio' :this.hora_inicio,
          'hora_fin' :this.hora_fin,
          'cupo_maximo' : this.cupo_maximo,
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
      'cod_actividad_horario' : this.cod_actividad_horario,
      'cod_actividad' : this.cod_actividad,
      'dia' :this.cod_dia,
      'hora_inicio' :this.hora_inicio,
      'hora_fin' :this.hora_fin,
      'cupo_maximo' : this.cupo_maximo
    };

    this.actividadhorarioservice.actualizar(parametros).subscribe( (data : any) =>
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
      this.cod_actividad_horario = item.cod_actividad_horario;
      this.cod_actividad = item.cod_actividad;
      this.cod_dia = item.dia;
      this.hora_inicio = item.hora_inicio;
      this.hora_fin = item.hora_fin;
      this.cupo_maximo = item.cupo_maximo;

      this.flagNormal();
      this.flagocultarboton = true;
      this.codigotemporal=this.cod_dia;
      this.ban=1;
  }

  formularioNormal()
  {
    this.cod_actividad_horario=moment().unix().toString();
    this.cod_dia="";
    this.hora_inicio = "00:00";
    this.hora_fin = "23:59";
    this.cupo_maximo="";

    this.swalservice.close();
    

    this.flagocultarboton = false;

    this.flagNormal();
  
    this.codigotemporal="";
    
    this.ban=0;
  }

}