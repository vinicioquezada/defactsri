import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monitor-compartido',
  templateUrl: './monitor-compartido.component.html',
  styleUrls: ['./monitor-compartido.component.css']
})
export class MonitorCompartidoComponent implements OnInit {
  loading : boolean = false;
  data: any = {
    cod_cliente: 0,
    numero_usuario: 0,
    tipo_usuario: '',
    identificacion: '',
    cliente: '',
    membresia: '',
    horario: '',
    vigencia: '',
    dias_restantes: '',
    estado_plan: '',
    estado_valor: false
  };
  
  constructor() { }

  ngOnInit(): void {
    const inicial = localStorage.getItem('monitor_data');
    if (inicial) {
      this.data = JSON.parse(inicial);
    }

    // escuchar cambios
    window.addEventListener('storage', (event: StorageEvent) => {

      if (event.key == 'monitor_data' && event.newValue) {
        this.data = JSON.parse(event.newValue);
      }

      if (event.key === 'monitor_loading' && event.newValue) {
        this.loading = event.newValue == 'true';
      }

    });
  }

}