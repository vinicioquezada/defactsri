import { Component, OnInit } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { CategoriaIngresosService } from '../../services/categoria-ingresos.service';
import { IngresosService } from '../../services/ingresos.service';
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
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})
export class IngresosComponent implements OnInit {
  multisucursal : string = "0";

  datosingresos : any;
  datoscategoria_ingresos : any;

  filterpost = "";

  cod_ingresos : string = "";
  cod_categoria_ingresos : string = "0";
  categoria_ingresos : string = "";
  fecha_registro : string = "";
  ingresos : string = "";
  valor : string = "";
  observacion : string = "";

  datossucursal : any;
  cod_sucursal : string = "";

  cod_ingresos_eliminar : string = "";
  ingresos_eliminar : string = "";
  
  flagocultarboton : boolean = false;

  flagcategoria_ingresos : boolean = false;
  flagingresos : boolean = false;
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

  constructor(private sucursalesservice : SucursalesService, private ingresosservice:IngresosService, private categoriaingresosservice:CategoriaIngresosService, private toastr: ToastrService, private error:ErrorService, private formapagoservice : FormaPagoService, private location: Location, private cajeroservice: CajeroService, private usersession: UserSessionService, private configService: ConfigService) {
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
    this.listarIngresosPorMes();
  }

  clickConfigurarAnio()
  {
    $("#mymodalanio").modal("show");
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  changeCategoriaIngresos(event: any): void {
    const elemento = event.target.value;
    this.cod_categoria_ingresos = elemento;
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
      if(this.ingresos==this.codigotemporal)
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

    if(this.cod_categoria_ingresos=="0")
    {
      this.flagcategoria_ingresos=true;
      valor=true;
    }

    if(this.ingresos.length==0)
    {
      this.flagingresos = true;
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
  
  clickEliminar(cod_ingresos_eliminar: string, ingresos_eliminar: string)
  {
    this.cod_ingresos_eliminar = cod_ingresos_eliminar;
    this.ingresos_eliminar = ingresos_eliminar;
    
    Swal.fire({
      title: 'ELIMINAR REGISTRO '  + this.ingresos_eliminar,
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
      const resultado = this.datosingresos.find( (valor : any) => valor.cod_ingresos === codigo );
      this.cod_ingresos = resultado.cod_ingresos;
      this.cod_categoria_ingresos = resultado.cod_categoria_ingresos;
      this.categoria_ingresos = resultado.categoria_ingresos;
      this.fecha_registro = moment(resultado.fecha_registro).format('YYYY-MM-DD HH:mm:ss');
      this.ingresos = resultado.ingresos;
      this.valor = resultado.valor;
      this.id_forma_pago = resultado.id_forma_pago;
      this.observacion = resultado.observacion_ingresos;

      this.flagocultarboton = true;
      this.codigotemporal=this.ingresos;
      this.ban=1;
      this.flagNormal();
  }
 
  buscar()
  {
    /*this.loading = true;
    

    this.ingresosservice.buscar(this.ingresos).subscribe( (data : any) =>
    {
      if (data.cod_ingresos == false)//No existe
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
      'cod_ingresos' : this.cod_ingresos,
      'cod_categoria_ingresos' : this.cod_categoria_ingresos,
      'fecha_registro' : this.fecha_registro,
      'ingresos' : this.ingresos,
      'valor' :this.valor,
      'id_forma_pago' : this.id_forma_pago,
      'observacion' : this.observacion,
      'cod_sucursal' : this.cod_sucursal
    };

    this.ingresosservice.guardar(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.estado == true)
      {
        this.exportarPdf(this.cod_ingresos);
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
      'cod_ingresos' : this.cod_ingresos,
      'cod_categoria_ingresos' : this.cod_categoria_ingresos,
      'fecha_registro' : this.fecha_registro,
      'ingresos' : this.ingresos,
      'valor' :this.valor,
      'id_forma_pago' : this.id_forma_pago,
      'observacion' : this.observacion,
      'cod_sucursal' : this.cod_sucursal
    };

    this.ingresosservice.actualizar(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.estado == true)
      {
        this.exportarPdf(this.cod_ingresos);
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
      'cod_ingresos' : this.cod_ingresos_eliminar,
      'estado' : 0,
    };

    
    this.ingresosservice.eliminar(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.estado == true)
      {
        
          this.listarIngresosPorMes();
        

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
    this.cod_ingresos = moment().unix().toString();
    this.cod_categoria_ingresos = "0";
    this.categoria_ingresos = "";
    this.fecha_registro = moment().format('YYYY-MM-DD');
    this.cod_mes = moment().format('M');
    this.anio = moment().format('YYYY');
    this.ingresos="";
    this.valor = "";
    this.id_forma_pago = "01";
    this.observacion="";

    this.cod_ingresos_eliminar=""
    this.ingresos_eliminar="";

    this.loading = false;
    

    this.loadinglistado = false;
    

    this.flagocultarboton = false;

    this.flagNormal();
  
    this.listarIngresosPorMes();

    this.listarCategoriaIngresos();
  
    this.codigotemporal="";
    
    this.ban=0;
  }

  flagNormal()
  {
    this.flagcategoria_ingresos = false;
    this.flagingresos = false;
    this.flagvalor = false;
    this.flagformapago = false;
  }

  listarIngresosPorMes()
  {
    this.filterpost = "";
    this.page = 1;

    this.loadinglistado = true;
    

    this.ingresosservice.listarIngresosPorMes(this.cod_sucursal, this.anio, this.cod_mes, this.opcionesprivilegios.solomiscomprobantes).subscribe( (data : any) =>
    {
      this.datosingresos = data;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    
  }

  listarCategoriaIngresos()
  {    
    this.loading = true;
    

    this.categoriaingresosservice.listarCategoriaIngresos().subscribe( (data : any) =>
    {
      this.datoscategoria_ingresos = data;
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
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  exportarPdf(cod_ingresos : string)
  {
    let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/gastosingresos/ingreso?cod_ingresos=" + cod_ingresos, "", 'width=600,height=400,left=300,top=100');
    miVentana.focus();
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}