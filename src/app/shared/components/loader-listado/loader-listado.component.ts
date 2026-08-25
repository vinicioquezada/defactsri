import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loader-listado',
  templateUrl: './loader-listado.component.html',
  styleUrls: ['./loader-listado.component.css']
})
export class LoaderListadoComponent implements OnInit {
  @Input() loadinglistado: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
