import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SocioService } from 'src/app/gym/services/socio.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $:any;

@Component({
  selector: 'app-listado-socios',
  templateUrl: './listado-socios.component.html',
  styleUrls: ['./listado-socios.component.css']
})
export class ListadoSociosComponent implements OnInit {
  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();
  datossocios : any = [];
  loadingmodal : boolean = false;
  filterpostsocio = "";
  cantidad_registros_socio : number = 0;
  pagesocio = 1;
  countsocio = 0;
  pagesizesocio = 5;

  constructor(private socioservice : SocioService, private toastr: ToastrService, private error:ErrorService) { }

  ngOnInit(): void {
    this.listarSocios();
  }

  keyFiltradoSocio()
  {
    this.pagesocio = 1;
  }

  listarSocios()
  {
    this.datossocios = [];
    this.filterpostsocio = "";
    this.cantidad_registros_socio = 0;
    this.pagesocio = 1;

    this.loadingmodal = true;

    this.socioservice.listarUsuariosVenta().subscribe( (data : any) =>
    {
      this.loadingmodal = false;
      this.datossocios = data;
      this.cantidad_registros_socio = data.length;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingmodal = false;
    });
    
  }

  actualizarListadoCliente()
  {
    this.listarSocios();
    this.toastr.success("Listado de socios actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
  }

  agregar(codigo : String)
  {
    const resultado = this.datossocios.find( (valor : any) => valor.cod_cliente == codigo );
    this.datosenviar.emit(resultado);
  }

  handlePageChangeSocio(event: number): void {
    this.pagesocio = event;
  }

}
