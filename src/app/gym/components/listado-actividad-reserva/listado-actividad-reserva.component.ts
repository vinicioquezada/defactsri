import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { ActividadReservaService } from '../../services/actividad-reserva.service';

@Component({
  selector: 'app-listado-actividad-reserva',
  templateUrl: './listado-actividad-reserva.component.html',
  styleUrls: ['./listado-actividad-reserva.component.css']
})
export class ListadoActividadReservaComponent implements OnInit {
  datos: any = [];
  cod_actividad_horario: string ="";
  fecha_reserva: string = "";
  constructor(private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService, private actividadreserva: ActividadReservaService) { }

  ngOnInit(): void {
  }

  listarReservasClientes()
  {
   this.swalservice.iniciarLoading("Cargando...");

    this.actividadreserva.listarReservasClientes(this.cod_actividad_horario, this.fecha_reserva).subscribe( (data : any) =>
    {
      this.datos = data;
      this.swalservice.close();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
      
    });
  }

}
