import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TransportistaService } from 'src/app/venta/services/transportista.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;

@Component({
  selector: 'app-listado-transportista',
  templateUrl: './listado-transportista.component.html',
  styleUrls: ['./listado-transportista.component.css']
})
export class ListadoTransportistaComponent implements OnInit {
  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();

  datos : any;
  filterpost = "";

  cod_transportista_eliminar : string = "";
  transportista_eliminar : string = "";

  loadinglistado : boolean = false;
  

  cantidad_registros : number = 0;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private transportistaservice: TransportistaService, private toastr: ToastrService, private error:ErrorService) { 
  }

  ngOnInit(): void {

  }

  keyFiltrado()
  {
    this.page = 1;
  }

  actualizarLista()
  {
    this.listarTransportistas();
  }

  listarTransportistas()
  {
    this.loadinglistado = true;
    

    this.transportistaservice.listar().subscribe( (data : any) =>
    {
      this.datos = data;
      this.cantidad_registros = data.length;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    
  }

  agregar(codigo : String)
  {
      const resultado = this.datos.find( (valor : any) => valor.cod_transportista === codigo );
      this.datosenviar.emit(resultado);
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}