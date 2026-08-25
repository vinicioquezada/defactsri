import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompraComponent } from './components/compra/compra.component';
import { ExploradorCompraComponent } from './components/explorador-compra/explorador-compra.component';
import { ExploradorNotaCreditoComprasComponent } from './components/explorador-nota-credito-compras/explorador-nota-credito-compras.component';
import { ExploradorProveedorComponent } from './components/explorador-proveedor/explorador-proveedor.component';
import { FijarPreciosProductosComponent } from './components/fijar-precios-productos/fijar-precios-productos.component';
import { MenuCompraComponent } from './components/menu-compra/menu-compra.component';
import { NotaCreditoComprasComponent } from './components/nota-credito-compras/nota-credito-compras.component';
import { ProveedorComponent } from './components/proveedor/proveedor.component';
import { ReporteCompraComponent } from './components/reporte-compra/reporte-compra.component';
import { ReporteCompraCreditoComponent } from './components/reporte-compra-credito/reporte-compra-credito.component';
import { ReporteCompraDetallesComponent } from './components/reporte-compra-detalles/reporte-compra-detalles.component';
import { ReporteNotaCreditoComprasComponent } from './components/reporte-nota-credito-compras/reporte-nota-credito-compras.component';
import { ReporteProveedorComponent } from './components/reporte-proveedor/reporte-proveedor.component';
import { ProveedorFormComponent } from './components/proveedor/proveedor-form/proveedor-form.component';
import { ListadoProductoEmparejarComponent } from './components/compra/listado-producto-emparejar/listado-producto-emparejar.component';
import { ProductosProveedorComponent } from './components/proveedor/productos-proveedor/productos-proveedor.component';



@NgModule({
  declarations: [
    CompraComponent,
    ExploradorCompraComponent,
    ExploradorNotaCreditoComprasComponent,
    ExploradorProveedorComponent,
    FijarPreciosProductosComponent,
    MenuCompraComponent,
    NotaCreditoComprasComponent,
    ProveedorComponent,
    ReporteCompraComponent,
    ReporteCompraCreditoComponent,
    ReporteCompraDetallesComponent,
    ReporteNotaCreditoComprasComponent,
    ReporteProveedorComponent,
    ProveedorFormComponent,
    ListadoProductoEmparejarComponent,
    ProductosProveedorComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CompraModule { }
