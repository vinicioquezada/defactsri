import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormulaService } from '../../services/formula.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-explorador-produccion',
  templateUrl: './explorador-produccion.component.html',
  styleUrls: ['./explorador-produccion.component.css']
})
export class ExploradorProduccionComponent implements OnInit {
  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();
  datos : any;
  filterpost = "";
  loadinglistado : boolean = false;
  cantidad_registros : number = 0;
  cod_sucursal : string = "";
  cod_formula : string = "";
  cod_producto : string = "";
  descripcion: string = "";

  tipo_formulario: string = "";

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private formulaservice: FormulaService, private toastr: ToastrService, private error:ErrorService, private usersession: UserSessionService, private router : Router) { 
  }

  ngOnInit(): void {
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  listarFormulas(page: number)
  {
    this.page = page;
    this.filterpost = "";
    this.datos = [];
    this.cantidad_registros = 0;
    this.loadinglistado = true;
    this.formulaservice.listarFormulas().subscribe( (data : any) =>
    {
      this.datos = data;
      this.cantidad_registros = data.length;
      this.loadinglistado = false;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
    });
  }

  opciones(item: any)
  {
    this.cod_formula = item.cod_formula;
    this.cod_producto = item.cod_producto;
    this.descripcion = item.descripcion;
    $("#mymodalopciones").modal("show");
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  formularioNormal()
  {
    const savedtipoformulario = sessionStorage.getItem("tipo_formulario");//Restaurar datos
    const savedpage = parseInt(sessionStorage.getItem("page"));
   
    if (savedtipoformulario=="explorador_produccion") {
      sessionStorage.removeItem("page");
      this.listarFormulas(savedpage);
    }
    else
    {
      sessionStorage.removeItem("tipo_formulario");
      sessionStorage.removeItem("page");
      this.listarFormulas(1);
    }
  }

  editar()
  {
    this.mantenerEstados();
	  this.router.navigate(["/menualmacen/produccion/actualizarregistro", this.cod_formula]);
  }

  visualizar()
  {

  }

  clickAnular()
  {
    Swal.fire({
        title: 'ANULAR FORMULA '  + this.descripcion,
        text: 'Confirmar para anular el registro seleccionado',
        icon: 'info',//'warning'
        showCancelButton: true,
        confirmButtonText: 'Si, Anular',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.value) {
            this.anularFormula();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          
        }
      });
  }

  anularFormula()
  {
    this.loadinglistado = true;

    const parametros = {
      'cod_formula' : this.cod_formula,
      'cod_producto' : this.cod_producto,
    };

    this.formulaservice.anularFormula(parametros).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      
      if (data.estado == true)
      {
        this.formularioNormal();        
        this.toastr.success("Registro anulado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        $("#mymodalopciones").modal("hide");
      }
      else
      {
        this.toastr.error("Registro no se pudo anular Error: " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
  });
  }

  mantenerEstados()
  {
    sessionStorage.setItem("tipo_formulario", "explorador_produccion");//Restaurar datos
    sessionStorage.setItem("page", String(this.page));
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}