import { Component, OnInit } from '@angular/core';
import { CodigoRetencionService } from '../../services/codigo-retencion.service';
import { TipoImpuestoService } from '../../services/tipo-impuesto.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-codigo-retencion',
  templateUrl: './codigo-retencion.component.html',
  styleUrls: ['./codigo-retencion.component.css']
})
export class CodigoRetencionComponent implements OnInit {
  datostipoimpuesto : any;

  datos : any;
  filterpost = "";

  codigo_tipo_impuesto : string = "";
  cod_codigo_retencion : string = "";
  codigo_retencion : string = "";
  descripcion : string = "";
  porcentaje : string = "";

  cod_codigo_retencion_eliminar : string = "";
  codigo_retencion_eliminar : string = "";
  
  flagocultarboton : boolean = false;

  flagtipoimpuesto : boolean = false;
  flagcodigoretencion : boolean = false;
  flagdescripcion : boolean = false;
  flagporcentaje : boolean = false;

  ban : number = 0;
  codigotemporal : string = "";

  loading : boolean = false;
  

  loadinglistado : boolean = false;
  

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private codigoretencionservice:CodigoRetencionService, private toastr: ToastrService, private error:ErrorService, private tipoimpuestoservice:TipoImpuestoService) {
  }


  ngOnInit(): void {
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  onChangeTipoImpuesto(event: any): void {
    const elemento = event.target.value;
    this.codigo_tipo_impuesto = elemento;
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
      if(this.codigo_retencion==this.codigotemporal)
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

    this.flagcodigoretencion = false;
    this.flagtipoimpuesto = false;

    if(this.codigo_tipo_impuesto=="0")
    {
      this.flagtipoimpuesto=true;
      valor=true;
    }

    if(this.codigo_retencion.length==0)
    {
      this.flagcodigoretencion=true;
      valor=true;
    }

    if(this.porcentaje.length==0)
    {
      this.flagporcentaje=true;
      valor=true;
    }

    if(this.descripcion.length==0)
    {
      this.flagdescripcion=true;
      valor=true;
    }

    

    return valor;
  }

  flagNormal()
  {
    this.flagtipoimpuesto = false;
    this.flagcodigoretencion = false;
    this.flagdescripcion = false;
    this.flagporcentaje = false;
  }

  clickEliminar(cod_codigo_retencion_eliminar: string, codigo_retencion_eliminar: string)
  {
    this.cod_codigo_retencion_eliminar = cod_codigo_retencion_eliminar;
    this.codigo_retencion_eliminar = codigo_retencion_eliminar;
    
    Swal.fire({
      title: 'ELIMINAR REGISTRO '  + this.codigo_retencion_eliminar,
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
  }

  agregar(codigo : String)
  {
      const resultado = this.datos.find( (valor : any) => valor.cod_codigo_retencion === codigo );
      this.cod_codigo_retencion = resultado.cod_codigo_retencion;
      this.codigo_tipo_impuesto = resultado.codigo_tipo_impuesto;
      this.codigo_retencion = resultado.codigo_retencion;
      this.descripcion = resultado.descripcion;
      this.porcentaje = resultado.porcentaje;

      this.flagNormal();
      this.flagocultarboton = true;
      this.codigotemporal=this.codigo_retencion;
      this.ban=1;
  }
 
  buscar()
  {
    this.loading = true;
    

    this.codigoretencionservice.buscar(this.codigo_retencion).subscribe( (data : any) =>
    {
      if (data.cod_codigo_retencion == false)//No existe
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
          this.toastr.warning("Subtipo_impuesto se encuentra registrado, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }

      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
  });
  }
  
  guardar = () =>{

    this.loading = true;
    

    const parametros = {
      'cod_codigo_retencion' : this.cod_codigo_retencion,
      'codigo_tipo_impuesto' : this.codigo_tipo_impuesto,
      'codigo_retencion' :this.codigo_retencion,
      'descripcion' : this.descripcion,
      'porcentaje' : this.porcentaje
    };

    this.codigoretencionservice.guardar(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.estado == true)
      {
        this.formularioNormal();
        this.toastr.success("Registro Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Registro no se pudo Almacenar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
  });
  }
  
  actualizar = () =>{
    this.loading = true;
    

    const parametros = {
      'cod_codigo_retencion' : this.cod_codigo_retencion,
      'codigo_tipo_impuesto' : this.codigo_tipo_impuesto,
      'codigo_retencion' : this.codigo_retencion,
      'descripcion' : this.descripcion,
      'porcentaje' : this.porcentaje
    };

    this.codigoretencionservice.actualizar(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.estado == true)
      {
        this.formularioNormal();
        this.toastr.success("Registro Actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Registro no se pudo Actualizar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
  });

  }



  eliminar = () =>{

    this.loading = true;

    
    
   
    
    const parametros = {
      'cod_codigo_retencion' : this.cod_codigo_retencion_eliminar,
      'estado' : 0,
    };

    
    this.codigoretencionservice.eliminar(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.estado == true)
      {
        
        this.formularioNormal();

        this.toastr.success("Registro eliminado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Registro no se pudo eliminar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
  });
  }
  
  formularioNormal()
  {
    this.cod_codigo_retencion=moment().unix().toString();
    this.codigo_tipo_impuesto = "0";
    this.codigo_retencion="";
    this.descripcion="";
    this.porcentaje="";

    this.cod_codigo_retencion_eliminar=""
    this.codigo_retencion_eliminar="";

    this.filterpost="";

    this.loading = false;
    

    this.loadinglistado = false;
    

    this.flagocultarboton = false;

    this.flagNormal();
  
    this.listarCodigoRetencion();

    this.listarTipoImpuestos();
  
    this.codigotemporal="";
    
    this.ban=0;
  }
  
  listarCodigoRetencion()
  {    
    this.loadinglistado = true;
    

    this.codigoretencionservice.listarCodigoRetencion().subscribe( (data : any) =>
    {
      this.datos = data;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  listarTipoImpuestos()
  {
    this.loading = true;
    
    this.tipoimpuestoservice.listarTipoImpuestos().subscribe( (data : any) =>
    {
      this.datostipoimpuesto = data;
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }

  handlePageChange(event: number): void {
    this.page = event;
  }


}