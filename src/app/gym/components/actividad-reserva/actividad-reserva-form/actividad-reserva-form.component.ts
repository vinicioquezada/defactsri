import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { ActividadHorarioService } from 'src/app/gym/services/actividad-horario.service';
import { ActividadReservaService } from 'src/app/gym/services/actividad-reserva.service';

@Component({
  selector: 'app-actividad-reserva-form',
  templateUrl: './actividad-reserva-form.component.html',
  styleUrls: ['./actividad-reserva-form.component.css']
})
export class ActividadReservaFormComponent implements OnInit {
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  id_membresia: string = "";
  cod_actividad: string = "";
  dia: string = "";
  fecha_reserva: string = "";

  datos: any = [];
  constructor(private toastr: ToastrService, private error:ErrorService, private actividadhorarioservice : ActividadHorarioService, private swalservice: SwalService, private actividadreservaservice: ActividadReservaService) { }

  ngOnInit(): void {
  }

  async clickReservar(item: any)
  {
    const ok = await this.swalservice.alertConfirmRequerido({
          title: "Control del Sistema",
          text: "¿Desea reservar horario?",
          icon: "info",
          confirmText: "Si, Reservar",
          cancelText: "No, Cerrar"
        });

        if (ok)
        {
          this.guardar(item.cod_actividad_horario, item.cupo_maximo);
        }
  }

  listarActividadHorarioDia()
  {    
    this.swalservice.iniciarLoading("Cargando...");
    
    this.actividadhorarioservice.listarActividadHorarioDia(this.cod_actividad, this.fecha_reserva ,this.dia).subscribe( (data : any) =>
    {
      this.swalservice.close();
      this.datos = data;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
    });
  }

  guardar(cod_actividad_horario: string, cupo_maximo: number)
  {
    this.swalservice.iniciarLoading("Almacenando...");
    const parametros = {
      'cod_actividad_horario' : cod_actividad_horario,
      'id_membresia' :this.id_membresia,
      'fecha_reserva' : this.fecha_reserva,
      'cupo_maximo' : cupo_maximo,
    };

    this.actividadreservaservice.guardar(parametros).subscribe( (data : any) =>
    {
      this.swalservice.close();
      
      if (data.estado == true)
      {
        this.datosenvio.emit();
        this.toastr.success("Reserva Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Reserva no se pudo Almacenar debido a un error: " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
      
    });
  }

}
