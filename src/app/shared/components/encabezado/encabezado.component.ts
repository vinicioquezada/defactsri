import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router'
import { ConfigService } from 'src/app/shared/services/config.service';
import { HeaderMenus } from '../../models/header-menus.dto';
import { AccessService } from '../../services/access.service';
import { UserSessionService } from '../../services/user-session.service';
declare var $:any;

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css']
})
export class EncabezadoComponent implements OnInit {
  color_encabezado : string = "";
  usuario : string = "";
  rrpp : string = "";
  titulo_pagina : String = "";
  urlfoto : string = "";

  constructor(private router: Router, private accessservice: AccessService, private usersession: UserSessionService, private configService: ConfigService) {
    this.usuario = this.usersession.getConfiguracion("usuario");
    this.rrpp = this.usersession.getConfiguracion("rrpp");
    this.titulo_pagina="";
    this.urlfoto = this.configService.settings.baseUrl + "/fotouser/" + this.usersession.getConfiguracion("foto");

    router.events.subscribe(e => {
      // obtener la url navegada con la propiedad url del router
      
      // los eventos de navegación son varios así que se filtra solo uno
      if(e instanceof NavigationEnd){
         this.registrar(this.router.url);
      }
     
    });
    
  }

  private registrar(url : string){
    let a = url.split("/");
    if(a.length>3)
    {
      let b = "/" + a[1] + "/" + a[2];
      url = b;
    }

    if(url=="/inicio")
    {
      this.titulo_pagina = "INICIO";
    }

    if(url=="/accesodenegado")
    {
      this.titulo_pagina = "ACCESO DENEGADO";
    }


    if(url=="/menuadministrar")
    {
      this.titulo_pagina = "MENÚ ADMINISTRAR CUENTAS";
    }

    if(url=="/menuadministrar/roles")
    {
      this.titulo_pagina = "ROLES";
    }

    if(url=="/menuadministrar/personal")
    {
      this.titulo_pagina = "PERSONAL";
    }

    if(url=="/menuadministrar/usuario")
    {
      this.titulo_pagina = "USUARIOS";
    }

    if(url=="/menuadministrar/ruc")
    {
      this.titulo_pagina = "RUC";
    }

    if(url=="/menuadministrar/rucform")
    {
      let tipoformulario = a[3];
      if(tipoformulario == "nuevoregistro")
      {
        this.titulo_pagina = "NUEVO RUC";
      }
      
      if(tipoformulario == "actualizarregistro")
      {
        this.titulo_pagina = "ACTUALIZAR RUC";
      }

      if(tipoformulario == "copiarregistro")
      {
        this.titulo_pagina = "COPIAR RUC";
      }
    }

    if(url=="/menuadministrar/sucursal")
    {
      this.titulo_pagina = "SUCURSAL";
    }

    if(url=="/menuadministrar/sucursalform")
    {
      let tipoformulario = a[3];
      if(tipoformulario == "nuevoregistro")
      {
        this.titulo_pagina = "NUEVA SUCURSAL";
      }
      
      if(tipoformulario == "actualizarregistro")
      {
        this.titulo_pagina = "ACTUALIZAR SUCURSAL";
      }

      if(tipoformulario == "copiarregistro")
      {
        this.titulo_pagina = "COPIAR SUCURSAL";
      }
    }
    
    


    if(url=="/menualmacen")
    {
      this.titulo_pagina = "MENÚ ALMACEN";
    }

    if(url=="/menualmacen/categoria")
    {
      this.titulo_pagina = "CATEGORIAS";
    }

    if(url=="/menualmacen/subcategoria")
    {
      this.titulo_pagina = "SUBCATEGORIAS";
    }

    if(url=="/menualmacen/marca")
    {
      this.titulo_pagina = "MARCAS";
    }

    if(url=="/menualmacen/unidadmedida")
    {
      this.titulo_pagina = "UNIDADES DE MEDIDA";
    }

    if(url=="/menualmacen/tipotarifa")
    {
      this.titulo_pagina = "TIPO TARIFA";
    }

    if(url=="/menualmacen/denominacion")
    {
      this.titulo_pagina = "DENOMINACIÓN";
    }

    if(url=="/menualmacen/producto")
    {
      this.titulo_pagina = "PRODUCTO";
    }

    if(url=="/menualmacen/exploradorproducto")
    {
      this.titulo_pagina = "EXPLORADOR PRODUCTO";
    }

    if(url=="/menualmacen/codigobarra")
    {
      this.titulo_pagina = "CODIGO DE BARRAS";
    }

    if(url=="/menualmacen/tipoingresomercaderia")
    {
      this.titulo_pagina = "TIPO INGRESO MERCADERÍA";
    }

    if(url=="/menualmacen/ingresomercaderia")
    {
      let tipoformulario = a[3];
      if(tipoformulario == "nuevoregistro")
      {
        this.titulo_pagina = "INGRESO MERCADERÍA";
      }
      
      if(tipoformulario == "actualizarregistro")
      {
        this.titulo_pagina = "ACTUALIZAR INGRESO MERCADERÍA";
      }

      if(tipoformulario == "visualizarregistro")
      {
        this.titulo_pagina = "VISUALIZAR INGRESO MERCADERÍA";
      }
    }

    if(url=="/menualmacen/exploradoringresomercaderia")
    {
      this.titulo_pagina = "EXPLORADOR DE INGRESOS DE MERCADERÍAS";
    }

    if(url=="/menualmacen/movimientomercaderia")
    {
      let tipoformulario = a[3];
      if(tipoformulario == "nuevoregistro")
      {
        this.titulo_pagina = "MOVIMIENTO MERCADERÍA";
      }
      
      if(tipoformulario == "actualizarregistro")
      {
        this.titulo_pagina = "ACTUALIZAR MOVIMIENTO MERCADERÍA";
      }

      if(tipoformulario == "visualizarregistro")
      {
        this.titulo_pagina = "VISUALIZAR MOVIMIENTO MERCADERÍA";
      }
    }

    if(url=="/menualmacen/exploradormovimientomercaderia")
    {
      this.titulo_pagina = "EXPLORADOR MOVIMIENTO MERCADERÍA";
    }

    if(url=="/menualmacen/tiposalidamercaderia")
    {
      this.titulo_pagina = "TIPO SALIDA MERCADERÍA";
    }

    if(url=="/menualmacen/salidamercaderia")
    {
      let tipoformulario = a[3];
      if(tipoformulario == "nuevoregistro")
      {
        this.titulo_pagina = "SALIDA MERCADERÍA";
      }
      
      if(tipoformulario == "actualizarregistro")
      {
        this.titulo_pagina = "ACTUALIZAR SALIDA MERCADERÍA";
      }

      if(tipoformulario == "visualizarregistro")
      {
        this.titulo_pagina = "VISUALIZAR SALIDA MERCADERÍA";
      }
    }
    
    if(url=="/menualmacen/exploradorsalidamercaderia")
    {
      this.titulo_pagina = "EXPLORADOR DE SALIDAS DE MERCADERÍAS";
    }
    if(url=="/menualmacen/reportestockproducto")
    {
      this.titulo_pagina = "REPORTE DE STOCK DE PRODUCTOS";
    }

    if(url=="/menualmacen/reporteingresomercaderia")
    {
      this.titulo_pagina = "REPORTE INGRESO MERCADERÍA";
    }

    if(url=="/menualmacen/reportesalidamercaderia")
    {
      this.titulo_pagina = "REPORTE SALIDA MERCADERÍA";
    }

    if(url=="/menualmacen/verificarmercaderia")
    {
      this.titulo_pagina = "VERIFICAR MERCADERÍA";
    }

    if(url=="/menualmacen/verificacionmovimientomercaderia")
    {
      this.titulo_pagina = "EXPLORADOR DE VERIFICACIÓN DE MERCADERÍA";
    }

    if(url=="/menualmacen/reportemovimientomercaderia")
    {
      this.titulo_pagina = "REPORTE MOVIMIENTO MERCADERÍA";
    }

    if(url=="/menualmacen/produccion")
    {
      this.titulo_pagina = "PRODUCCIÓN";
    }

    if(url=="/menualmacen/exploradorproduccion")
    {
      this.titulo_pagina = "EXPLORADOR PRODUCCIÓN";
    }

    if(url=="/menualmacen/eliminacionproducto")
    {
      this.titulo_pagina = "SOLICITUD ELIMINACION";
    }
    



    if(url=="/menuventa")
    {
      this.titulo_pagina = "MENÚ VENTA";
    }

    if(url=="/menuventa/cajero")
    {
      this.titulo_pagina = "CAJERO";
    }

    if(url=="/menuventa/exploradorcajero")
    {
      this.titulo_pagina = "EXPLORADOR CAJERO";
    }

    if(url=="/menuventa/tipocliente")
    {
      this.titulo_pagina = "TIPO CLIENTE";
    }

    if(url=="/menuventa/cliente")
    {
      this.titulo_pagina = "CLIENTE";
    }

    if(url=="/menuventa/preventa")
    {
      let tipoformulario = a[3];
      if(tipoformulario == "nuevoregistrorecaudar")
      {
        this.titulo_pagina = "CREAR FACTURA DE PRE VENTA";
      }
    }

    if(url=="/menuventa/pagonotacredito")
    {
      this.titulo_pagina = "PAGO NOTA CRÉDITO";
    }

    if(url=="/menuventa/aprobarpreventa")
    {
      this.titulo_pagina = "APROBAR FACTURA DE PRE VENTA";
    }

    if(url=="/menuventa/reporteventaconsolidadovendedor")
    {
      this.titulo_pagina = "REPORTE CONSOLIDADO DE VENDEDORES";
    }

    if(url=="/menuventa/venta")
    {
      let tipoformulario = a[3];
      if(tipoformulario == "nuevoregistro")
      {
        this.titulo_pagina = "CREAR FACTURA DE VENTA";
      }
      
      if(tipoformulario == "actualizarregistro")
      {
        this.titulo_pagina = "ACTUALIZAR FACTURA DE VENTA";
      }

      if(tipoformulario == "copiarregistro")
      {
        this.titulo_pagina = "COPIAR FACTURA DE VENTA";
      }

      if(tipoformulario == "finalizarpedidoreservado")
      {
        this.titulo_pagina = "FINALIZAR PEDIDO RESERVADO";
      }

      if(tipoformulario == "finalizarpedidoconsalida")
      {
        this.titulo_pagina = "FINALIZAR PEDIDO CON SALIDA";
      }

      if(tipoformulario == "finalizarpedidoacumulativo")
      {
        this.titulo_pagina = "FINALIZAR PEDIDO ACUMULATIVO";
      }

      if(tipoformulario == "finalizarpedidopanaderia")
      {
        this.titulo_pagina = "FINALIZAR PEDIDO PANADERÍA";
      }

      if(tipoformulario == "finalizarvariospedidosreservados")
      {
        this.titulo_pagina = "FINALIZAR VARIOS PEDIDOS RESERVADO";
      }

      if(tipoformulario == "finalizarvariospedidosconsalida")
      {
        this.titulo_pagina = "FINALIZAR VARIOS PEDIDOS CON SALIDA";
      }

      if(tipoformulario == "finalizarvariospedidosacumulativos")
      {
        this.titulo_pagina = "FINALIZAR VARIOS PEDIDOS ACUMULATIVO";
      }


      if(tipoformulario == "recaudar")
      {
        this.titulo_pagina = "RECAUDAR FACTURA DE VENTA";
      }
    }

    if(url=="/menuventa/reportesaldonotacredito")
    {
      this.titulo_pagina = "REPORTE DE SALDO NOTA DE CRÉDITO";
    }

    if(url=="/menuventa/ventadescuento")
    {
      let tipoformulario = a[3];
      if(tipoformulario == "copiarregistro")
      {
        this.titulo_pagina = "CREAR FACTURA DESCUENTO";
      }
    }

    if(url=="/menuventa/exploradorventarecaudacion")
    {
      this.titulo_pagina = "EXPLORADOR DE RECAUDACIÓN DE VENTAS";
    }

    if(url=="/menuventa/exploradorventa")
    {
      this.titulo_pagina = "EXPLORADOR DE VENTAS";
    }

    if(url=="/menuventa/pedido")
    {
      let tipoformulario = a[3];
      if(tipoformulario == "nuevoregistro")
      {
        this.titulo_pagina = "CREAR PEDIDO";
      }

      if(tipoformulario == "actualizarregistro")
      {
        this.titulo_pagina = "ACTUALIZAR PEDIDO";
      }
    }

    if(url=="/menuventa/exploradorpedidos")
    {
      this.titulo_pagina = "EXPLORADOR DE PEDIDOS";
    }

    if(url=="/menuventa/exploradorfactura")
    {
      this.titulo_pagina = "EXPLORADOR DE FACTURAS";
    }

    if(url=="/menuventa/notacredito")
    {
      let tipoformulario = a[3];
      if(tipoformulario == "nuevoregistro")
      {
        this.titulo_pagina = "CREAR NOTA DE CRÉDITO";
      }
      
      if(tipoformulario == "actualizarregistro")
      {
        this.titulo_pagina = "ACTUALIZAR NOTA DE CRÉDITO";
      }
    }

    if(url=="/menuventa/guiaremision")
    {
      this.titulo_pagina = "CREAR GUÍA DE REMISIÓN";
    }

    if(url=="/menuventa/exploradornotacredito")
    {
      this.titulo_pagina = "EXPLORADOR NOTA DE CRÉDITO";
    }

    if(url=="/menuventa/notacreditoactualizar")
    {
      this.titulo_pagina = "ACTUALIZAR NOTA DE CRÉDITO";
    }

    if(url=="/menuventa/transportista")
    {
      this.titulo_pagina = "TRANSPORTISTA";
    }

    if(url=="/menuventa/exploradorguiaremision")
    {
      this.titulo_pagina = "EXPLORADOR DE GUIA DE REMISIÓN";
    }

    if(url=="/menuventa/guiaremisionactualizar")
    {
      this.titulo_pagina = "ACTUALIZAR GUÍA DE REMISIÓN";
    }

    if(url=="/menuventa/reporteventa")
    {
      this.titulo_pagina = "REPORTE DE VENTAS";
    }

    if(url=="/menuventa/reporteventaformapago")
    {
      this.titulo_pagina = "REPORTE DE VENTAS CON FORMA DE PAGOS";
    }

    if(url=="/menuventa/reporteventadetalles")
    {
      this.titulo_pagina = "REPORTE DE DETALLES DE VENTAS";
    }

    if(url=="/menuventa/reportecliente")
    {
      this.titulo_pagina = "REPORTE DE CLIENTES";
    }
    
    if(url=="/menuventa/reporteventaporcategoria")
    {
      this.titulo_pagina = "REPORTE DE VENTA POR CATEGORÍA";
    }

    if(url=="/menuventa/reporteventaporproducto")
    {
      this.titulo_pagina = "REPORTE DE VENTA POR PRODUCTO";
    }

    if(url=="/menuventa/reporterotacionproducto")
    {
      this.titulo_pagina = "REPORTE DE ROTACIÓN DE PRODUCTO";
    }

    if(url=="/menuventa/reporteventascredito")
    {
      this.titulo_pagina = "REPORTE DE VENTA A CRÉDITO";
    }

    if(url=="/menuventa/reportenotacredito")
    {
      this.titulo_pagina = "REPORTE NOTA CRÉDITO";
    }

    if(url=="/menuventa/reporteguiaremision")
    {
      this.titulo_pagina = "REPORTE GUÍA REMISIÓN";
    }

    if(url=="/menuventa/reportecontrolventa")
    {
      this.titulo_pagina = "REPORTE CONTROL DE VENTAS";
    }

    if(url=="/menuventa/resumenventas")
    {
      this.titulo_pagina = "RESUMEN VENTAS";
    }

    if(url=="/menuventa/reporteconsolidadosaldopendientenotacredito")
    {
      this.titulo_pagina = "REPORTE CONSOLIDADO DE SALDO PENDIENTE DE NOTAS DE CRÉDITOS";
    }

    if(url=="/menuventa/reportepagonotacredito")
    {
      this.titulo_pagina = "REPORTE PAGO CON NOTA DE CRÉDITOS EN VENTAS";
    }

    if(url=="/menuventa/exploradorclientes")
    {
      this.titulo_pagina = "EXPLORADOR CLIENTES";
    }

    if(url.startsWith("/menuventa/visualizarlistadoventacliente"))
    {
      this.titulo_pagina = "VISUALIZADOR DE VENTAS DE CLIENTE";
    }

    if(url.startsWith("/menuventa/visualizarlistadopedidocliente"))
    {
      this.titulo_pagina = "VISUALIZADOR DE PEDIDOS DE CLIENTE";
    }

    if(url=="/menuventa/reportenotacreditodetalles")
    {
      this.titulo_pagina = "REPORTE DE NOTAS DE CRÉDITOS DETALLES";
    }




    if(url=="/menualmacen/registrokardex")
    {
      this.titulo_pagina = "KARDEX";
    }

    if(url=="/menualmacen/reportecostoproducto")
    {
      this.titulo_pagina = "REPORTE COSTO PRODUCTO";
    }

    if(url=="/menualmacen/reportemargenganancia")
    {
      this.titulo_pagina = "REPORTE MARGEN DE GANANCIA";
    }

    if(url=="/menualmacen/reporteingresosmanuales")
    {
      this.titulo_pagina = "REPORTE INGRESOS MANUALES";
    }

    if(url=="/menualmacen/reportesalidasmanuales")
    {
      this.titulo_pagina = "REPORTE SALIDAS MANUALES";
    }

    if(url=="/menualmacen/registrocaducidad")
    {
      this.titulo_pagina = "REGISTRO CADUCIDAD COMPRA";
    }

    if(url=="/menualmacen/registrocaducidadingreso")
      {
        this.titulo_pagina = "REGISTRO CADUCIDAD INGRESO";
      }

    if(url=="/menualmacen/reportecaducidad")
    {
      this.titulo_pagina = "REPORTE CADUCIDAD";
    }

    if(url=="/menualmacen/reportesalidamercaderiavaloradas")
    {
      this.titulo_pagina = "REPORTE SALIDAS MERCADERÍAS VALORADAS";
    }





    if(url=="/menucompra")
    {
      this.titulo_pagina = "MENÚ COMPRAS";
    }

    if(url=="/menucompra/proveedor")
    {
      this.titulo_pagina = "PROVEEDOR";
    }

    if(url=="/menucompra/exploradorproveedor")
    {
      this.titulo_pagina = "EXPLORADOR PROVEEDOR";
    }

    if(url=="/menucompra/compra")
    {
      this.titulo_pagina = "COMPRA";
    }

    if(url=="/menucompra/compragastos")
    {
      this.titulo_pagina = "COMPRA GASTOS";
    }

    if(url=="/menucompra/compraactualizar")
    {
      this.titulo_pagina = "ACTUALIZAR COMPRA";
    }

    if(url=="/menucompra/fijarpreciosproductos")
    {
      this.titulo_pagina = "FIJAR PRECIOS PRODUCTOS";
    }

    if(url=="/menucompra/exploradorcompra")
    {
      this.titulo_pagina = "EXPLORADOR DE COMPRAS";
    }

    if(url=="/menucompra/reporteproveedor")
    {
      this.titulo_pagina = "REPORTE PROVEEDOR";
    }

    if(url=="/menucompra/reportecompras")
    {
      this.titulo_pagina = "REPORTE COMPRAS";
    }

    if(url=="/menucompra/reportecompradetalle")
    {
      this.titulo_pagina = "REPORTE COMPRAS DETALLES";
    }

    if(url=="/menucompra/reportecompracredito")
    {
      this.titulo_pagina = "REPORTE COMPRA A CRÉDITO";
    }

    if(url=="/menucompra/reporteproveedor")
    {
      this.titulo_pagina = "REPORTE DE PROVEEDORES";
    }

    if(url=="/menucompra/notacreditocompras")
    {
      let tipoformulario = a[3];
      if(tipoformulario == "nuevoregistro")
      {
        this.titulo_pagina = "CREAR NOTA DE CRÉDITO COMPRAS";
      }
      
      if(tipoformulario == "actualizarregistro")
      {
        this.titulo_pagina = "ACTUALIZAR NOTA DE CRÉDITO COMPRAS";
      }
    }

    if(url=="/menucompra/exploradornotacreditocompras")
    {
      this.titulo_pagina = "EXPLORADOR NOTA DE CRÉDITO COMPRAS";
    }
    
    if(url=="/menucompra/reportenotacreditocompras")
    {
      this.titulo_pagina = "REPORTE NOTA CRÉDITO COMPRAS";
    }



    if(url=="/menuretencion")
    {
      this.titulo_pagina = "MENÚ RETENCIÓN";
    }

    if(url=="/menuretencion/codigoretencion")
    {
      this.titulo_pagina = "CÓDIGO RETENCIÓN";
    }

    if(url=="/menuretencion/retencion")
    {
      let tipoformulario = a[3];
      if(tipoformulario == "nuevoregistro")
      {
        this.titulo_pagina = "CREAR RETENCIÓN";
      }
      
      if(tipoformulario == "actualizarregistro")
      {
        this.titulo_pagina = "ACTUALIZAR RETENCIÓN";
      }
    }

    if(url=="/menuretencion/exploradorretencion")
    {
      this.titulo_pagina = "EXPLORADOR RETENCIÓN";
    }

    if(url=="/menuretencion/reporteretencion")
    {
      this.titulo_pagina = "REPORTE RETENCIÓN";
    }


    if(url=="/menucuentapc")
    {
      this.titulo_pagina = "MENÚ CUENTAS POR PAGAR Y COBRAR";
    }

    if(url=="/menucuentapc/credito")
    {
      this.titulo_pagina = "CRÉDITO";
    }

    if(url=="/menucuentapc/abonoventa")
    {
      this.titulo_pagina = "ABONO VENTA";
    }

    if(url=="/menucuentapc/abonocompra")
    {
      this.titulo_pagina = "ABONO COMPRA";
    }

    if(url=="/menucuentapc/reporteporcobrar")
    {
      this.titulo_pagina = "REPORTE POR COBRAR";
    }

    if(url=="/menucuentapc/reportecorteporcobrar")
    {
      this.titulo_pagina = "REPORTE CORTE POR COBRAR";
    }

    if(url=="/menucuentapc/reporteporpagar")
    {
      this.titulo_pagina = "REPORTE POR PAGAR";
    }

    if(url=="/menucuentapc/reporteabonoventa")
    {
      this.titulo_pagina = "REPORTE ABONO VENTA";
    }

    if(url=="/menucuentapc/reporteabonocompra")
    {
      this.titulo_pagina = "REPORTE ABONO COMPRA";
    }

    if(url=="/menucuentapc/reporteformapagovencimiento")
    {
      this.titulo_pagina = "REPORTE FORMA PAGO VENCIMIENTO";
    }

    if(url=="/menucuentapc/reportecuentaspagarconsolidado")
    {
      this.titulo_pagina = "REPORTE CONSOLIDADO DE CUENTAS POR PAGAR";
    }

    if(url=="/menucuentapc/reportecuentascobrarconsolidado")
    {
      this.titulo_pagina = "REPORTE CONSOLIDADO DE CUENTAS POR COBRAR";
    }





    if(url=="/menugastosingresos")
    {
      this.titulo_pagina = "MENÚ GASTOS E INGRESOS";
    }

    if(url=="/menugastosingresos/categoriaingresos")
    {
      this.titulo_pagina = "CATEGORÍA INGRESOS";
    }

    if(url=="/menugastosingresos/ingresos")
    {
      this.titulo_pagina = "INGRESOS";
    }

    if(url=="/menugastosingresos/categoriagastos")
    {
      this.titulo_pagina = "CATEGORÍA GASTOS";
    }

    if(url=="/menugastosingresos/gastos")
    {
      this.titulo_pagina = "GASTOS";
    }

    if(url=="/menugastosingresos/reporteingresos")
    {
      this.titulo_pagina = "REPORTE INGRESOS";
    }

    if(url=="/menugastosingresos/reportegastos")
    {
      this.titulo_pagina = "REPORTE GASTOS";
    }


    if(url=="/menuhotel")
    {
      this.titulo_pagina = "MENU HOTEL";
    }

    if(url=="/menuhotel/servicioshotel")
    {
      this.titulo_pagina = "SERVICIOS HOTEL";
    }

    if(url=="/menuhotel/exploradordepartamentos")
    {
      this.titulo_pagina = "EXPLORADOR DE DEPARTAMENTO";
    }

    if(url=="/menuhotel/reservas")
    {
      this.titulo_pagina = "RESERVAS";
    }

    if(url=="/menuhotel/asignacion")
    {
      this.titulo_pagina = "ASIGNACIÓN HABITACIÓN";
    }

    if(url=="/menuhotel/facturareserva")
    {
      let tipoformulario = a[3];
      if(tipoformulario == "nuevoregistro")
      {
        this.titulo_pagina = "CREAR FACTURA DE VENTA RESERVA";
      }
    }



    if(url=="/menugym")
    {
      this.titulo_pagina = "MENU GYM";
    }

    if(url=="/menugym/socios")
    {
      this.titulo_pagina = "SOCIOS";
    }

    if(url=="/menugym/planes")
    {
      this.titulo_pagina = "PLANES";
    }

    if(url=="/menugym/membresias")
    {
      this.titulo_pagina = "MEMBRESIAS";
    }

    if(url=="/menugym/facturaplan")
    {
      let tipoformulario = a[3];
      if(tipoformulario == "nuevoregistro")
      {
        this.titulo_pagina = "VENTA DE MEMBRESÍA";
      }
      
      if(tipoformulario == "actualizarregistro")
      {
        this.titulo_pagina = "ACTUALIZAR VENTA MEMBRESÍA";
      }

      if(tipoformulario == "nuevoregistrodiario")
      {
        this.titulo_pagina = "VENTA DIARIO";
      }
    }

    if(url=="/menugym/reporteasistencia")
    {
      this.titulo_pagina = "REPORTE DE ASISTENCIAS";
    }





    if(url=="/menugym/exploradorventamembresias")
    {
      this.titulo_pagina = "EXPLORADOR MEMBRESÍAS";
    }

    if(url=="/menugym/reportesocios")
    {
      this.titulo_pagina = "REPORTE SOCIOS";
    }

    if(url=="/menugym/reporteestadomembresia")
    {
      this.titulo_pagina = "REPORTE ESTADO MEMBRESÍAS";
    }

    if(url=="/menugym/reportepromocionalmes")
    {
      this.titulo_pagina = "REPORTE PROMOCIONAL MES";
    }

    if(url=="/menugym/monitor")
    {
      this.titulo_pagina = "MONITOR";
    }

    if(url=="/menugym/gestionsocios")
    {
      this.titulo_pagina = "GESTIÓN DE SOCIOS";
    }

    if(url=="/menugym/reporteventassocios")
    {
      this.titulo_pagina = "REPORTE DE VENTAS SOCIOS";
    }

    if(url=="/menugym/actividad")
    {
      this.titulo_pagina = "ACTIVIDAD";
    }

    if(url=="/menugym/actividadhorario")
    {
      this.titulo_pagina = "HORARIO DE ACTIVIDAD";
    }

    if(url=="/menugym/actividadreserva")
    {
      this.titulo_pagina = "RESERVA DE ACTIVIDAD";
    }

    if(url=="/menugym/horarioreservaactividad")
    {
      this.titulo_pagina = "HORARIO RESERVA ACTIVIDAD";
    }

    if(url=="/menugym/cupon")
    {
      this.titulo_pagina = "CUPON";
    }
  }

  cerrarsesion()
  {
    this.usersession.clear();
    localStorage.clear();
    const headerInfo: HeaderMenus = {
      estadologin: true,
      estadomenu: false,
    };
    this.accessservice.headerManagement.next(headerInfo);
    this.router.navigate(["/", ""]);

    if($(window).width() <= 991)
    {
      let parrafo = $("#appmenu");
      parrafo.removeClass("sidebar-open");
      parrafo.addClass('sidebar-closed sidebar-collapse');
    }

    localStorage.setItem('logout-event', Date.now().toString());
  }

  ngOnInit(): void {
  }

}