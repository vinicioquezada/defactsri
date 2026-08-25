import { Component, OnInit } from '@angular/core';
import { TarifaService } from 'src/app/almacen/services/tarifa.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;

@Component({
  selector: 'app-listado-tarifas',
  templateUrl: './listado-tarifas.component.html',
  styleUrls: ['./listado-tarifas.component.css']
})
export class ListadoTarifasComponent implements OnInit {
  datostarifas : any = [];
  descripcion : string = "";
  loadinglistado : boolean = false;

  constructor(private toastr: ToastrService, private error:ErrorService, private tarifaService: TarifaService) { }

  ngOnInit(): void {
  }

  listarTarifas(cod_producto: string, descripcion: string)
  {
    this.descripcion = descripcion;
    this.datostarifas = [];
    this.loadinglistado  = true;

    this.tarifaService.listarTarifasVisibles(cod_producto).subscribe( (data : any) =>
    {
      this.loadinglistado  = false;
      this.datostarifas = data;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado  = false;
      
    });
  }

  cerrarModal() {
    $("#mymodallistadotarifa").modal("hide");
  }

}