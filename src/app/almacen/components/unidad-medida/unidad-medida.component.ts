import { Component, OnInit, ViewChild } from '@angular/core';
import { UnidadMedidaService } from '../../services/unidad-medida.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { UnidadMedidaFormComponent } from './unidad-medida-form/unidad-medida-form.component';
declare var $:any;
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-unidad-medida',
  templateUrl: './unidad-medida.component.html',
  styleUrls: ['./unidad-medida.component.css']
})
export class UnidadMedidaComponent implements OnInit {
  @ViewChild(UnidadMedidaFormComponent) unidadmedidaFormComponent: any;
  datos : any;
  filterpost = "";

  cod_unidad_medida_eliminar : string = "";
  unidad_medida_eliminar : string = "";
  
  loadinglistado : boolean = false;
  
  tipoformulario: string = "normal";

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private unidadmedidaservice: UnidadMedidaService, private toastr: ToastrService, private error:ErrorService) {
  }

  ngOnInit(): void {
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  clickEliminar(cod_unidad_medida_eliminar: string, unidad_medida_eliminar: string)
  {
    this.cod_unidad_medida_eliminar = cod_unidad_medida_eliminar;
    this.unidad_medida_eliminar = unidad_medida_eliminar;
    
    Swal.fire({
          title: 'ELIMINAR REGISTRO '  + this.unidad_medida_eliminar,
          text: 'Confirmar para eliminar el registro seleccionado',
          icon: 'info',//'warning'
          showCancelButton: true,
          confirmButtonText: 'Si, Eliminar',
          cancelButtonText: 'No, Eliminar'
        }).then((result) => {
          if (result.value) {
            this.eliminar();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            
          }
      });
  }
  
  clickDeshacer()
  {
    this.formularioNormal();
    this.unidadmedidaFormComponent.formularioNormal();
  }

  agregar(codigo : String)
  {
      const resultado = this.datos.find( (valor : any) => valor.cod_unidad_medida === codigo );
      
      this.unidadmedidaFormComponent.cod_unidad_medida = resultado.cod_unidad_medida;
      this.unidadmedidaFormComponent.unidad_medida = resultado.unidad_medida;
      this.unidadmedidaFormComponent.observacion = resultado.observacion;

      this.unidadmedidaFormComponent.flagNormal();
      this.unidadmedidaFormComponent.flagocultarboton = true;
      this.unidadmedidaFormComponent.codigotemporal=this.unidadmedidaFormComponent.unidad_medida;
      this.unidadmedidaFormComponent.ban=1;
  }
 
  eliminar = () =>{
    this.loadinglistado = true;

    const parametros = {
      'cod_unidad_medida' : this.cod_unidad_medida_eliminar,
      'estado' : 0,
    };
    
    this.unidadmedidaservice.eliminar(parametros).subscribe( (data : any) =>
    {
      this.loadinglistado = false;

      if (data.estado == true)
      {
        this.formularioNormal();
        this.unidadmedidaFormComponent.formularioNormal();
        this.toastr.success("Registro eliminado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Registro no se pudo eliminar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
  });
  }
  
  formularioNormal()
  {
    this.cod_unidad_medida_eliminar=""
    this.unidad_medida_eliminar="";

    this.filterpost="";

    this.loadinglistado = false;
    
  
    this.listarUnidadesMedidas();
  }
  
  listarUnidadesMedidas()
  {
    this.page = 1;
    this.filterpost = "";
    this.loadinglistado = true;
    this.unidadmedidaservice.listarUnidadesMedidas().subscribe( (data : any) =>
    {
      this.datos = data;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
    });
  }

  recibirDatosUnidadMedida(): void {
    this.formularioNormal();
    this.unidadmedidaFormComponent.formularioNormal();
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}