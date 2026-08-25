import { Component, OnInit } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { CategoriaService } from '../../services/categoria.service';
import { SubcategoriaService } from '../../services/subcategoria.service';
import { ProductoService } from '../../services/producto.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';

@Component({
  selector: 'app-codigo-barra',
  templateUrl: './codigo-barra.component.html',
  styleUrls: ['./codigo-barra.component.css']
})
export class CodigoBarraComponent implements OnInit {
  cantidad_registros : number = 0;
  datosexistencias : any;
  datos : any;
  datossucursal : any;
  datossubcategoria : any;
  datoscategoria : any;
  datostarifa : any;
  filterpost = "";

  cod_sucursal : string = "";
  sucursal : string = "";
  cod_categoria : string = "";
  categoria : string = "";
  cod_subcategoria : string = "";

  cod_producto : string = "";
  codigo : string = "";
  descripcion : string = "";
  ruta_imagen : string = "";
  ruta_alternativa : string  = "";
  cantidadcodigosbarra : string = "";

  loadinglistado : boolean = false;
  

  flagocultarboton : boolean = false;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private productoservice:ProductoService, private toastr: ToastrService, private error:ErrorService, private categoriaservice:CategoriaService, private subcategoriaservice:SubcategoriaService, private sucursalesservice:SucursalesService, private configService: ConfigService) { }

  ngOnInit(): void {
    //alert(this.configService.settings.baseUrlRecursos + "recursos/codigobarra/codigo_barra.png");
    this.formularioNormal();
  }
  
  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal= elemento;
  }

  onchangecategoria(event: any): void {
    const elemento = event.target.value;
    this.cod_categoria = elemento;
    this.listarSubCategorias();
  }

  formularioNormal()
  {
    this.filterpost="";

    this.cod_sucursal = "";
    this.sucursal = "";

    this.cod_categoria = "";
    this.categoria = "";

    this.cod_subcategoria = "";

    //this.ruta_alternativa = this.configService.settings.baseUrl + "/codigobarra/codigo_barra.png";

    this.listarSucursales();
    this.listarCategorias();
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  visualizarcodigo(cod_producto: string, descripcion: string, codigo: string)
  {
    this.cod_producto = cod_producto;
    this.codigo = codigo;
    this.descripcion = descripcion;
    //this.ruta_imagen = this.configService.settings.baseUrl + "/codigobarra/codigo_barra.png";
    this.ruta_imagen = this.configService.settings.baseUrl + "/codigobarra/" + this.codigo + ".png";
    $("#mymodalcodigobarra").modal("show");
  }

  exportarcodigos()
  {
    let arreglo = [];
	  arreglo.push({"codigo": this.codigo, "descripcion":this.descripcion, "cantidad":this.cantidadcodigosbarra});
	  let codigos = JSON.stringify(arreglo);
	  window.open(this.configService.settings.baseUrl + "/reportes/almacen/codigosbarra?titulo=" + this.descripcion + "&codigos=" + codigos, "width=800, height=500");
  }


  generarcodigobarra()
  {
    this.loadinglistado = true;
    

    this.productoservice.generarCodigoBarra(this.codigo).subscribe( (data : any) =>
    {     
      if (data.estado == true)
      {
        this.loadinglistado = false;
        
        this.ruta_imagen = this.configService.settings.baseUrl + "/codigobarra/" + this.codigo + ".png";
        this.toastr.success("Código de barra creado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Código de barra no se pudo Almacenar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  buscarproductos()
  {
    this.page = 1;
    if(this.cod_subcategoria==null)
    {
      this.cod_subcategoria="";
    }
   
    this.listarproductosexplorador();
  }
  
  listarproductosexplorador()
  {
    /*
    this.loadinglistado = true;
    

    this.productoservice.listarProductosExplorador(this.cod_categoria, this.cod_subcategoria).subscribe( (data : any) =>
    {
      this.datos = data;
      this.loadinglistado = false;
      
      this.cantidad_registros = data.length;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    */
    
  }

  listarSucursales()
  {    
    this.loadinglistado = true;
    

    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.datossucursal = data;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    
  }
  
  listarCategorias()
  {    
    this.loadinglistado = true;
    

    this.categoriaservice.listarCategorias().subscribe( (data : any) =>
    {
      this.datoscategoria = data;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  listarSubCategorias()
  {    
    this.loadinglistado = true;
    

    this.subcategoriaservice.listarSubCategoriasPorCategoria(this.cod_categoria).subscribe( (data : any) =>
    {
      this.datossubcategoria = data;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

}