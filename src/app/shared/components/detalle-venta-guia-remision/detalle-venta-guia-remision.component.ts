import { Component, OnInit, ViewChild, EventEmitter, Output, ElementRef, Input } from '@angular/core';
import { TarifaService } from 'src/app/almacen/services/tarifa.service';
import { ErrorService } from '../../services/error.service';
import { ToastrService } from 'ngx-toastr';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { UserSessionService } from '../../services/user-session.service';
declare var $:any;

@Component({
  selector: 'app-detalle-venta-guia-remision',
  templateUrl: './detalle-venta-guia-remision.component.html',
  styleUrls: ['./detalle-venta-guia-remision.component.css']
})
export class DetalleVentaGuiaRemisionComponent implements OnInit {
  @Input() datosproducto = [];
  @Input() datostarifasproducto = [];

  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("scrolly") scrolly: ElementRef;
  enfocar : boolean = true;

  datosdetalles : any;
  datostarifa : any;

  descripcion_producto : string = "";
  porcentaje_iva : number = 0.00;
  precio_base : number = 0.00;
  precio_venta : number = 0.00;
  observacion : string = "";
  index_detalle : number = 0;

  disabledtabladetalles : boolean = false;

  loading : boolean = false;
  

  disabledtxtobservacion : boolean = true;
  disabledtxtdescuentogeneral : boolean = true;

  descuentogeneral : number = 0.00;

  subtotal12 : number = 0.00;
  subtotal0 : number = 0.00;
  totalsinimpuestos : number = 0.00;
  totaldescuento : number = 0.00;
  totalconice : number = 0.00;
  totalconimpuestos : number = 0.00;
  importetotal : number = 0.00;

  iva : number = 0.00;
  ivadiv : number = 0.00;

  tarifas : string = "0";

  descuentodirecto : string = "";

  
  opcionesprivilegios : any;

  constructor(private toastr: ToastrService, private Tarifaservice : TarifaService, private error:ErrorService, private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.iva = Number(this.usersession.getConfiguracion("iva"));
    this.ivadiv = (Number(this.usersession.getConfiguracion("iva"))/100) + 1;
    this.tarifas = this.usersession.getConfiguracion("tarifas");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
  }

  formularioNormal()
  {
    this.subtotal12 = 0.00;
    this.subtotal0 = 0.00;
    this.totalsinimpuestos = 0.00;
    this.descuentogeneral = 0.00;
    this.totaldescuento = 0.00;
    this.totalconice = 0.00;
    this.totalconimpuestos = 0.00;
    this.importetotal = 0.00;
    this.observacion = "";

    this.disabledtxtobservacion = true;
    this.disabledtxtdescuentogeneral = true;
  }

  ultimaFila(index : number)
  {
    if(this.enfocar==true)
    {
      if(index==4)
      {
        this.scrolly.nativeElement.style.height = "300px";
      }

      if(this.scrolly.nativeElement.scrollHeight>300)
      {
        this.scrolly.nativeElement.scrollTop=this.scrolly.nativeElement.scrollHeight;
        this.enfocar=false;
      }
      else
      {
      }
    }
    return "";
  }

  habilitarFormulario()
  {
    this.disabledtxtobservacion = false;
    this.disabledtxtdescuentogeneral = false;
  }

  borrar(index)
  {
      try
      {
        this.datosdetalles.splice(index, 1);

        if(this.datosdetalles.length==4)
        {
          this.scrolly.nativeElement.removeAttribute("style");
        }
      }
      catch(e)
      {
        console.log(e);
        this.toastr.error("Se a producido un error al borrar el items", "INFORMACIÓN DEL SISTEMA");
      }
  }














}