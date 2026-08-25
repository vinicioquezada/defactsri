import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscarProductoComponent } from './components/buscar-producto/buscar-producto.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { CodigoBarraComponent } from './components/codigo-barra/codigo-barra.component';
import { DenominacionComponent } from './components/denominacion/denominacion.component';
import { ExploradorIngresoMercaderiaComponent } from './components/explorador-ingreso-mercaderia/explorador-ingreso-mercaderia.component';
import { ExploradorMovimientoMercaderiaComponent } from './components/explorador-movimiento-mercaderia/explorador-movimiento-mercaderia.component';
import { ExploradorSalidaMercaderiaComponent } from './components/explorador-salida-mercaderia/explorador-salida-mercaderia.component';
import { IngresoMercaderiaComponent } from './components/ingreso-mercaderia/ingreso-mercaderia.component';
import { MarcaComponent } from './components/marca/marca.component';
import { MenuAlmacenComponent } from './components/menu-almacen/menu-almacen.component';
import { MovimientoMercaderiaComponent } from './components/movimiento-mercaderia/movimiento-mercaderia.component';
import { ProductoComponent } from './components/producto/producto.component';
import { ReporteIngresoMercaderiaComponent } from './components/reporte-ingreso-mercaderia/reporte-ingreso-mercaderia.component';
import { ReporteSalidaMercaderiaComponent } from './components/reporte-salida-mercaderia/reporte-salida-mercaderia.component';
import { ReporteStockProductoComponent } from './components/reporte-stock-producto/reporte-stock-producto.component';
import { SalidaMercaderiaComponent } from './components/salida-mercaderia/salida-mercaderia.component';
import { SubcategoriaComponent } from './components/subcategoria/subcategoria.component';
import { TipoIngresoMercaderiaComponent } from './components/tipo-ingreso-mercaderia/tipo-ingreso-mercaderia.component';
import { TipoSalidaMercaderiaComponent } from './components/tipo-salida-mercaderia/tipo-salida-mercaderia.component';
import { TipoTarifaComponent } from './components/tipo-tarifa/tipo-tarifa.component';
import { UnidadMedidaComponent } from './components/unidad-medida/unidad-medida.component';
import { CategoriaFormComponent } from './components/categoria/categoria-form/categoria-form.component';
import { SubcategoriaFormComponent } from './components/subcategoria/subcategoria-form/subcategoria-form.component';
import { MarcaFormComponent } from './components/marca/marca-form/marca-form.component';
import { DenominacionFormComponent } from './components/denominacion/denominacion-form/denominacion-form.component';
import { UnidadMedidaFormComponent } from './components/unidad-medida/unidad-medida-form/unidad-medida-form.component';
import { TipoTarifaFormComponent } from './components/tipo-tarifa/tipo-tarifa-form/tipo-tarifa-form.component';
import { TipoSalidaMercaderiaFormComponent } from './components/tipo-salida-mercaderia/tipo-salida-mercaderia-form/tipo-salida-mercaderia-form.component';
import { TipoIngresoMercaderiaFormComponent } from './components/tipo-ingreso-mercaderia/tipo-ingreso-mercaderia-form/tipo-ingreso-mercaderia-form.component';
import { VerificacionMovimientoMercaderiaComponent } from './components/verificacion-movimiento-mercaderia/verificacion-movimiento-mercaderia.component';
import { MovimientoMercaderiaVerificarComponent } from './components/movimiento-mercaderia-verificar/movimiento-mercaderia-verificar.component';
import { ReporteMovimientoMercaderiaComponent } from './components/reporte-movimiento-mercaderia/reporte-movimiento-mercaderia.component';
import { ProductoFormComponent } from './components/producto/producto-form/producto-form.component';
import { ProduccionComponent } from './components/produccion/produccion.component';
import { ExploradorProduccionComponent } from './components/explorador-produccion/explorador-produccion.component';
import { ReporteSalidaMercaderiaValoradasComponent } from './components/reporte-salida-mercaderia-valoradas/reporte-salida-mercaderia-valoradas.component';
import { ExistenciasComponent } from './components/producto/existencias/existencias.component';
import { TarifasComponent } from './components/producto/tarifas/tarifas.component';
import { PreciosProveedorComponent } from './components/producto/precios-proveedor/precios-proveedor.component';
import { FacturaProveedorComponent } from './components/producto/factura-proveedor/factura-proveedor.component';
import { EliminacionProductoComponent } from './components/eliminacion-producto/eliminacion-producto.component';



@NgModule({
  declarations: [
    BuscarProductoComponent,
    CategoriaComponent,
    CodigoBarraComponent,
    DenominacionComponent,
    ExploradorIngresoMercaderiaComponent,
    ExploradorMovimientoMercaderiaComponent,
    ExploradorSalidaMercaderiaComponent,
    IngresoMercaderiaComponent,
    MarcaComponent,
    MenuAlmacenComponent,
    MovimientoMercaderiaComponent,
    ProductoComponent,
    ReporteIngresoMercaderiaComponent,
    ReporteSalidaMercaderiaComponent,
    ReporteStockProductoComponent,
    SalidaMercaderiaComponent,
    SubcategoriaComponent,
    TipoIngresoMercaderiaComponent,
    TipoSalidaMercaderiaComponent,
    TipoTarifaComponent,
    UnidadMedidaComponent,
    CategoriaFormComponent,
    SubcategoriaFormComponent,
    MarcaFormComponent,
    DenominacionFormComponent,
    UnidadMedidaFormComponent,
    TipoTarifaFormComponent,
    TipoSalidaMercaderiaFormComponent,
    TipoIngresoMercaderiaFormComponent,
    VerificacionMovimientoMercaderiaComponent,
    MovimientoMercaderiaVerificarComponent,
    ReporteMovimientoMercaderiaComponent,
    ProductoFormComponent,
    ProduccionComponent,
    ExploradorProduccionComponent,
    ReporteSalidaMercaderiaValoradasComponent,
    ExistenciasComponent,
    TarifasComponent,
    PreciosProveedorComponent,
    FacturaProveedorComponent,
    EliminacionProductoComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AlmacenModule { }
