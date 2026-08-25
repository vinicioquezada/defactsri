import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SwalService } from 'src/app/shared/services/swal.service';
import { Sucursal } from 'src/app/administrar/interfaces/sucursal.interface';
import { ToastrService } from 'ngx-toastr';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-sucursal-form',
  templateUrl: './sucursal-form.component.html',
  styleUrls: ['./sucursal-form.component.css']
})
export class SucursalFormComponent implements OnInit {
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  nombreformulario: string = "";
  sucursal: Sucursal = {
    cod_sucursal: 0,
    sucursal: '',
    estado: 1,
    cod_proyecto: 0,
    resumen_stock_caja: false,
    electronico: true,
    defecto_venta: 'RECIBO',
    numeracion_automatica: true,
    precios_completos: false,
    codigo_automatico_producto: false,
    comision_venta: false,
    tarifas: false,
    tarifasenlista: true,
    cargartarifasconfigurables: false,
    kardex: false,
    codigo_iva: 4,
    iva: 15,
    afiliacion_cliente: false,
    control_estricto_inventario: true,
    control_estricto_movimiento: false,
    recaudador: false,
    modificacion_supervisor: false,
    firmasruc: false,
    codigosproducto: false,
    ruc_usuario: false,
    compartido_extension: false,
    monitor_actividades: false,
    asistencia_gimnasio: false,
    log_producto: false
  };

  datostipoventa : any = [];

  flagsucursal: boolean = false;
  flagcodproyecto: boolean = false;
  flagcodigoiva: boolean = false;
  flagiva: boolean = false;

  flagocultarboton : boolean = false;

  cod_sucursal: string = "";


  ban : number = 0;

  loadingform : boolean = false;

  constructor(private swalservice: SwalService, private toastr: ToastrService, private sucursalesservice:SucursalesService, private error:ErrorService, private rutaActiva: ActivatedRoute) { }

  ngOnInit(): void {
      let tipoventa = {
        "cod_tipo_venta" : "ELECTRONICA",
        "tipo_venta" : "ELECTRONICA"
      };
      this.datostipoventa.push(tipoventa);

      tipoventa = {
        "cod_tipo_venta" : "FACTURA",
        "tipo_venta" : "FACTURA"
      };
      this.datostipoventa.push(tipoventa);
      
      tipoventa = {
        "cod_tipo_venta" : "RECIBO",
        "tipo_venta" : "RECIBO"
      };
      this.datostipoventa.push(tipoventa);

      this.formularioNormal();
  }

  changeTipoVenta(event: any): void {
    const elemento = event.target.value;
    this.sucursal.defecto_venta = elemento;
  }

  changeChkResumenStockCaja()
  {
    if(this.sucursal.resumen_stock_caja==true){
      this.sucursal.resumen_stock_caja = false;
    }else{
      this.sucursal.resumen_stock_caja = true;
    }
  }

  changeChkElectronico()
  {
    if(this.sucursal.electronico==true){
      this.sucursal.electronico = false;
    }else{
      this.sucursal.electronico = true;
    }
  }

  changeChkNumeracionAutomatica()
  {
    if(this.sucursal.numeracion_automatica==true){
      this.sucursal.numeracion_automatica = false;
    }else{
      this.sucursal.numeracion_automatica = true;
    }
  }

  changeChkPreciosCompletos()
  {
    if(this.sucursal.precios_completos==true){
      this.sucursal.precios_completos = false;
    }else{
      this.sucursal.precios_completos = true;
    }
  }

  changeChkCodigoAutomaticoProducto()
  {
    if(this.sucursal.codigo_automatico_producto==true){
      this.sucursal.codigo_automatico_producto = false;
    }else{
      this.sucursal.codigo_automatico_producto = true;
    }
  }

  changeChkComisionVenta()
  {
    if(this.sucursal.comision_venta==true){
      this.sucursal.comision_venta = false;
    }else{
      this.sucursal.comision_venta = true;
    }
  }

  changeChkTarifas()
  {
    if(this.sucursal.tarifas==true){
      this.sucursal.tarifas = false;
    }else{
      this.sucursal.tarifas = true;
    }
  }

  changeChkTarifasEnLista()
  {
    if(this.sucursal.tarifasenlista==true){
      this.sucursal.tarifasenlista = false;
    }else{
      this.sucursal.tarifasenlista = true;
    }
  }

  changeChkCargarTarifasConfigurables()
  {
    if(this.sucursal.cargartarifasconfigurables==true){
      this.sucursal.cargartarifasconfigurables = false;
    }else{
      this.sucursal.cargartarifasconfigurables = true;
    }
  }

  changeChkKardex()
  {
    if(this.sucursal.kardex==true){
      this.sucursal.kardex = false;
    }else{
      this.sucursal.kardex = true;
    }
  }

  changeChkAfiliacionCliente()
  {
    if(this.sucursal.afiliacion_cliente==true){
      this.sucursal.afiliacion_cliente = false;
    }else{
      this.sucursal.afiliacion_cliente = true;
    }
  }


  changeChkControlEstrictoInventario()
  {
    if(this.sucursal.control_estricto_inventario==true){
      this.sucursal.control_estricto_inventario = false;
    }else{
      this.sucursal.control_estricto_inventario = true;
    }
  }


  changeChkControlEstrictoMovimiento()
  {
    if(this.sucursal.control_estricto_movimiento==true){
      this.sucursal.control_estricto_movimiento = false;
    }else{
      this.sucursal.control_estricto_movimiento = true;
    }
  }


  changeChkRecaudador()
  {
    if(this.sucursal.recaudador==true){
      this.sucursal.recaudador = false;
    }else{
      this.sucursal.recaudador = true;
    }
  }


  changeChkModificacionSupervisor()
  {
    if(this.sucursal.modificacion_supervisor==true){
      this.sucursal.modificacion_supervisor = false;
    }else{
      this.sucursal.modificacion_supervisor = true;
    }
  }

  changeChkFirmasRuc()
  {
    if(this.sucursal.firmasruc==true){
      this.sucursal.firmasruc = false;
    }else{
      this.sucursal.firmasruc = true;
    }
  }

  changeChkCodigosProducto()
  {
    if(this.sucursal.codigosproducto==true){
      this.sucursal.codigosproducto = false;
    }else{
      this.sucursal.codigosproducto = true;
    }
  }

  changeChkRucUsuario()
  {
    if(this.sucursal.ruc_usuario==true){
      this.sucursal.ruc_usuario = false;
    }else{
      this.sucursal.ruc_usuario = true;
    }
  }

  changeChkCompartidoExtension()
  {
    if(this.sucursal.compartido_extension==true){
      this.sucursal.compartido_extension = false;
    }else{
      this.sucursal.compartido_extension = true;
    }
  }

  changeChkDispositivosAreas()
  {
    if(this.sucursal.monitor_actividades==true){
      this.sucursal.monitor_actividades = false;
    }else{
      this.sucursal.monitor_actividades = true;
    }
  }

  changeChkAsistencia()
  {
    if(this.sucursal.asistencia_gimnasio==true){
      this.sucursal.asistencia_gimnasio = false;
    }else{
      this.sucursal.asistencia_gimnasio = true;
    }
  }

  changeChkLogProducto()
  {
    if(this.sucursal.log_producto==true){
      this.sucursal.log_producto = false;
    }else{
      this.sucursal.log_producto = true;
    }
  }


  formularioNormal(): void
  {
      this.flagNormal();

      this.sucursal = {
        cod_sucursal: 0,
        sucursal: '',
        estado: 1,
        cod_proyecto: 0,
        resumen_stock_caja: false,
        electronico: true,
        defecto_venta: 'RECIBO',
        numeracion_automatica: true,
        precios_completos: false,
        codigo_automatico_producto: false,
        comision_venta: false,
        tarifas: false,
        tarifasenlista: true,
        cargartarifasconfigurables: false,
        kardex: false,
        codigo_iva: 4,
        iva: 15,
        afiliacion_cliente: false,
        control_estricto_inventario: true,
        control_estricto_movimiento: false,
        recaudador: false,
        modificacion_supervisor: false,
        firmasruc: false,
        codigosproducto: false,
        ruc_usuario: false,
        compartido_extension: false,
        monitor_actividades: false,
        asistencia_gimnasio: false,
        log_producto: false
      };

      this.ban = 0;
      this.flagocultarboton = false;
  }

  clickDeshacer()
  {
    this.formularioNormal();
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
      this.guardar();
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
      this.actualizar();
    }
  }

  verificarCampos()
  {
    let valor : Boolean = false;

    this.flagNormal();

    if(this.sucursal.sucursal.length==0)
    {
      this.flagsucursal=true;
      valor=true;
    }
    
    if(this.sucursal.cod_proyecto==0)
    {
      this.flagcodproyecto=true;
      valor=true;
    }

    if(this.sucursal.codigo_iva==0)
    {
      this.flagcodigoiva=true;
      valor=true;
    }

    if(this.sucursal.iva==0)
    {
      this.flagiva=true;
      valor=true;
    }

    return valor;
  }

  flagNormal()
  {
    this.flagsucursal = false;
    this.flagcodproyecto = false;
    this.flagcodigoiva = false;
    this.flagiva = false;
  }

  guardar()
  {
    this.swalservice.iniciarLoading("Almacenando...");
    
    this.sucursalesservice.guardar(this.sucursal).subscribe( (data : any) =>
    {
      if (data.estado == true)
      {
        this.toastr.success("Registro Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        this.datosenvio.emit();
      }
      else
      {
        this.toastr.error("Registro no se pudo Almacenar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      this.swalservice.close();
    }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.swalservice.close(); 
    });
  }

  actualizar()
  {
    this.swalservice.iniciarLoading("Actualizando...");
    
    this.sucursalesservice.actualizar(this.sucursal).subscribe( (data : any) =>
    {
      if (data.estado == true)
      {
        this.toastr.success("Registro Actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        this.datosenvio.emit();
      }
      else
      {
        this.toastr.error("Registro no se pudo Actualizar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      this.swalservice.close();
    }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.swalservice.close(); 
    });
  }

  async buscarSucursal()
  {
    try
    {
      this.ban=1;
      this.loadingform = true;
      let data: any = await lastValueFrom(this.sucursalesservice.buscarSucursal(this.cod_sucursal));
      this.loadingform = false;
      this.sucursal = data;
    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
      this.loadingform = false;
    }
  }

}
