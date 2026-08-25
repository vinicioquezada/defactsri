import { Component, OnInit } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { CategoriaGastosService } from '../../services/categoria-gastos.service';
import { GastosService } from '../../services/gastos.service';
import { FormaPagoService } from 'src/app/venta/services/forma-pago.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CajeroService } from 'src/app/venta/services/cajero.service';
import { Location } from '@angular/common';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css']
})
export class GastosComponent implements OnInit {
  multisucursal : string = "0";

  datosgastos : any;
  datoscategoria_gastos : any;

  filterpost = "";

  cod_gastos : string = "";
  cod_categoria_gastos : string = "0";
  categoria_gastos : string = "";
  fecha_registro : string = "";
  gastos : string = "";
  valor : string = "";
  observacion : string = "";

  datossucursal : any;
  cod_sucursal : string = "";

  cod_gastos_eliminar : string = "";
  gastos_eliminar : string = "";
  
  flagocultarboton : boolean = false;

  flagcategoria_gastos : boolean = false;
  flaggastos : boolean = false;
  flagvalor : boolean = false;
  
  datosformapago : any;
  id_forma_pago : string = "";
  flagformapago : boolean = false;

  ban : number = 0;
  codigotemporal : string = "";

  loading : boolean = false;

  loadinglistado : boolean = false;
  
  
  opcionesprivilegios : any;

  anio: string = "";
  cod_mes : string = "";
  meses : any = [
    {
      "cod_mes" : 1,
      "mes" : "ENERO"
    },
    {
      "cod_mes" : 2,
      "mes" : "FEBRERO"
    },
    {
      "cod_mes" : 3,
      "mes" : "MARZO"
    },
    {
      "cod_mes" : 4,
      "mes" : "ABRIL"
    },
    {
      "cod_mes" : 5,
      "mes" : "MAYO"
    },
    {
      "cod_mes" : 6,
      "mes" : "JUNIO"
    },
    {
      "cod_mes" : 7,
      "mes" : "JULIO"
    },
    {
      "cod_mes" : 8,
      "mes" : "AGOSTO"
    },
    {
      "cod_mes" : 9,
      "mes" : "SEPTIEMBRE"
    },
    {
      "cod_mes" : 10,
      "mes" : "OCTUBRE"
    },
    {
      "cod_mes" : 11,
      "mes" : "NOVIEMBRE"
    },
    {
      "cod_mes" : 12,
      "mes" : "DICIEMBRE"
    }
  ];

  sucursal: string = "";
  control_estricto_cajero : string = "";
  recaudador: string = "";

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private sucursalesservice : SucursalesService, private gastosservice:GastosService, private categoriagastosservice:CategoriaGastosService, private toastr: ToastrService, private error:ErrorService, private formapagoservice : FormaPagoService, private location: Location, private cajeroservice: CajeroService, private usersession: UserSessionService, private configService: ConfigService) {
  }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.datossucursal = [];
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.control_estricto_cajero = this.opcionesprivilegios["controlestrictocajero"];
    this.recaudador = this.usersession.getConfiguracion("recaudador");

    if(this.control_estricto_cajero == "1")
    {
      if(this.recaudador == "1")
      {
        this.verificarCajaAbiertaUsuarioRecaudador();
      }
      else
      {
        this.verificarCajaAbiertaUsuario();
      }
      
    }
    else
    {
      this.listarSucursales();
    }
  }

  verificarCajaAbiertaUsuario()
  {
    this.loading = true;
    this.cajeroservice.verificarCajaAbiertaUsuario(this.cod_sucursal).subscribe( (data : any) =>
    {
      this.loading = false;
      if(data.cod_cajero==false)
      {
        Swal.fire({
          title: "Control del Sistema",
          text: "Debe aperturar caja primero antes de realizar venta",
          icon: "info",
          confirmButtonText: 'OK'
        }).then( (result) => {
          if (result.value) {
            this.location.back();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            
          }
        });
      }
      else
      {
        this.listarSucursales();
      }
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  verificarCajaAbiertaUsuarioRecaudador()
  {
    this.loading = true;
    this.cajeroservice.verificarCajaAbiertaUsuarioRecaudador(this.cod_sucursal).subscribe( (data : any) =>
    {
      this.loading = false;
      if(data.cod_cajero==false)
      {
        Swal.fire({
          title: "Control del Sistema",
          text: "Debe aperturar caja primero antes de realizar venta",
          icon: "info",
          confirmButtonText: 'OK'
        }).then( (result) => {
          if (result.value) {
            this.location.back();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            
          }
        });
      }
      else
      {
        this.listarSucursales();
      }
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  onChangeMeses(event: any): void {
    const elemento = event.target.value;
    this.cod_mes = elemento;
  }

  clickBuscar()
  {
    this.listarGastosPorMes();
  }

  clickConfigurarAnio()
  {
    $("#mymodalanio").modal("show");
  }

  keyFiltrado()
  {
    this.page = 1;
  }
  
  changeCategoriaGastos(event: any): void {
    const elemento = event.target.value;
    this.cod_categoria_gastos = elemento;
  }

  changeFormaPago(event: any): void {
    const elemento = event.target.value;
    this.id_forma_pago = elemento;
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
      if(this.gastos==this.codigotemporal)
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

    this.flagNormal();

    if(this.cod_categoria_gastos=="0")
    {
      this.flagcategoria_gastos=true;
      valor=true;
    }

    if(this.gastos.length==0)
    {
      this.flaggastos = true;
      valor=true;
    }

    if(this.id_forma_pago=="0")
    {
      this.flagformapago = true;
      valor=true;
    }

    if(this.valor.length==0)
    {
      this.flagvalor = true;
      valor=true;
    }

    return valor;
  }
  
  clickEliminar(cod_gastos_eliminar: string, gastos_eliminar: string)
  {
    this.cod_gastos_eliminar = cod_gastos_eliminar;
    this.gastos_eliminar = gastos_eliminar;
    
    Swal.fire({
        title: 'ELIMINAR REGISTRO '  + this.gastos_eliminar,
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
      const resultado = this.datosgastos.find( (valor : any) => valor.cod_gastos === codigo );
      this.cod_gastos = resultado.cod_gastos;
      this.cod_categoria_gastos = resultado.cod_categoria_gastos;
      this.categoria_gastos = resultado.categoria_gastos;
      this.fecha_registro = moment(resultado.fecha_registro).format('YYYY-MM-DD HH:mm:ss');
      this.gastos = resultado.gastos;
      this.valor = resultado.valor;
      this.id_forma_pago = resultado.id_forma_pago;
      this.observacion = resultado.observacion_gastos;

      this.flagocultarboton = true;
      this.codigotemporal=this.gastos;
      this.ban=1;
      this.flagNormal();
  }
 
  buscar()
  {
    /*this.loading = true;
    

    this.gastosservice.buscar(this.gastos).subscribe( (data : any) =>
    {
      if (data.cod_gastos == false)//No existe
      {*/
          if (this.ban == 0)
          {
            this.guardar();
          }
          else
          {
            this.actualizar();         
          }
      /*}
      else
      {
          this.toastr.warning("Cuenta se encuentra registrado, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }

      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
  });*/
  }
  
  guardar = () =>{

    this.loading = true;
    

    const parametros = {
      'cod_gastos' : this.cod_gastos,
      'cod_categoria_gastos' : this.cod_categoria_gastos,
      'fecha_registro' : this.fecha_registro,
      'gastos' : this.gastos,
      'valor' : this.valor,
      'id_forma_pago' : this.id_forma_pago,
      'observacion' : this.observacion,
      'cod_sucursal' : this.cod_sucursal
    };

    this.gastosservice.guardar(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.estado == true)
      {
        this.exportarPdf(this.cod_gastos);
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
      'cod_gastos' : this.cod_gastos,
      'cod_categoria_gastos' : this.cod_categoria_gastos,
      'fecha_registro' : this.fecha_registro,
      'gastos' : this.gastos,
      'valor' :this.valor,
      'id_forma_pago' : this.id_forma_pago,
      'observacion' : this.observacion,
      'cod_sucursal' : this.cod_sucursal
    };

    this.gastosservice.actualizar(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.estado == true)
      {
        this.exportarPdf(this.cod_gastos);
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
      'cod_gastos' : this.cod_gastos_eliminar,
      'estado' : 0,
    };

    
    this.gastosservice.eliminar(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.estado == true)
      {
        
          this.listarGastosPorMes();
        

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
    this.cod_gastos = moment().unix().toString();
    this.cod_categoria_gastos = "0";
    this.categoria_gastos = "";
    this.fecha_registro = moment().format('YYYY-MM-DD');
    this.cod_mes = moment().format('M');
    this.anio = moment().format('YYYY');
    this.gastos="";
    this.valor = "";
    this.id_forma_pago = "01";
    this.observacion="";

    this.cod_gastos_eliminar=""
    this.gastos_eliminar="";

    this.loading = false;
    

    this.loadinglistado = false;
    

    this.flagocultarboton = false;

    this.flagNormal();
  
    this.listarGastosPorMes();

    this.listarCategoriaGastos();
  
    this.codigotemporal="";
    
    this.ban=0;
  }

  flagNormal()
  {
    this.flagcategoria_gastos = false;
    this.flaggastos = false;
    this.flagvalor = false;
    this.flagformapago = false;
  }

  listarGastosPorMes()
  {
    this.filterpost = "";
    this.page = 1;
    this.loadinglistado = true;
    this.gastosservice.listarGastosPorMes(this.cod_sucursal, this.anio, this.cod_mes, this.opcionesprivilegios.solomiscomprobantes).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.datosgastos = data;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
    });
  }

  listarCategoriaGastos()
  {    
    this.loading = true;
    

    this.categoriagastosservice.listarCategoriaGastos().subscribe( (data : any) =>
    {
      this.datoscategoria_gastos = data;
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
    
  }

  listarFormaPagos()
  {    
    this.loading = true;
    

    this.formapagoservice.listarFormaPagos().subscribe( (data : any) =>
    {
      this.datosformapago = data;
      this.loading = false;
      
      this.formularioNormal();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  listarSucursales()
  {    
    this.loading = true;
    

    this.sucursalesservice.listarUsuarioSucursales().subscribe( (data : any) =>
    {
      this.loading = false;
      this.datossucursal = data;
      const resultado = this.datossucursal.find( (valor : any) => valor.cod_sucursal == this.cod_sucursal );
      this.sucursal = resultado.sucursal;
      this.listarFormaPagos();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  exportarPdf(cod_gastos : string)
  {
    let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/gastosingresos/gasto?cod_gastos=" + cod_gastos, "", 'width=600,height=400,left=300,top=100');
    miVentana.focus();
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}