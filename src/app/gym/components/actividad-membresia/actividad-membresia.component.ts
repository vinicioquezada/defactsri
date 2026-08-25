import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { PlanService } from '../../services/plan.service';

@Component({
  selector: 'app-actividad-membresia',
  templateUrl: './actividad-membresia.component.html',
  styleUrls: ['./actividad-membresia.component.css']
})
export class ActividadMembresiaComponent implements OnInit {
  cod_producto: string = "";
  plan: string = "";
  id_membresia: number = 0;
  cod_cliente: string = "";
  cliente: string = "";
  fecha_inicio: string = "";
  fecha_fin: string = "";

  datos: any = [];
  constructor(private router : Router, private toastr: ToastrService, private error:ErrorService, private planservice : PlanService, private swalservice: SwalService) { }

  ngOnInit(): void {
  }

  clickReservar(item: any)
  {
    this.router.navigate(["/menugym/actividadreserva", this.cod_cliente, this.cliente, item.cod_actividad, item.actividad, this.id_membresia, this.fecha_inicio, this.fecha_fin]);
  }

  listarPlanActividad()
  {    
    this.swalservice.iniciarLoading("Cargando...");
    
    this.planservice.listarPlanActividad(this.cod_producto).subscribe( (data : any) =>
    {
      this.swalservice.close();
      this.datos = data;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
    });
    
  }

}
