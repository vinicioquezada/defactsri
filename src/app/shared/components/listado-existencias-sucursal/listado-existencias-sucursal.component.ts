import { Component, OnInit } from '@angular/core';
import { ExistenciasService } from 'src/app/almacen/services/existencias.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { UserSessionService } from '../../services/user-session.service';
declare var $:any;

@Component({
  selector: 'app-listado-existencias-sucursal',
  templateUrl: './listado-existencias-sucursal.component.html',
  styleUrls: ['./listado-existencias-sucursal.component.css']
})
export class ListadoExistenciasSucursalComponent implements OnInit {
  datosexistencias : any = [];
  descripcion : string = "";
  loadinglistado : boolean = false;
  cod_sucursal : string = "";

  constructor(private toastr: ToastrService, private error:ErrorService, private existenciasservice: ExistenciasService, private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
  }

  listarExistenciasProductoSucursales(cod_producto: string, descripcion: string)
  {
    this.descripcion = descripcion;
    this.datosexistencias = [];
    this.loadinglistado  = true;

    this.existenciasservice.listarExistenciasProductoGeneral(cod_producto).subscribe( (data : any) =>
    {
      this.loadinglistado  = false;
      this.datosexistencias = data.filter(producto => producto.cod_sucursal != this.cod_sucursal);
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado  = false;
      
    });
  }

  cerrarModal() {
    $("#mymodallistadoexistenciassucursales").modal("hide");
  }

}