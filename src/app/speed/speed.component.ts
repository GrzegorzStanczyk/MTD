import { Component, OnInit } from '@angular/core';
import { GeolocationService } from '../shared/geolocation.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-speed',
  templateUrl: './speed.component.html',
  styleUrls: ['./speed.component.scss']
})
export class SpeedComponent implements OnInit {
  public speed$: Observable<any>;
  private velocityUnits: number = 3.6;

  constructor(private geolocationService: GeolocationService) {}

  ngOnInit() {
    // this.speed$ = this.geolocationService.speed$.map(v => Math.round(v));
    this.speed$ = this.geolocationService.speed$.map(v =>  Math.round(v * this.velocityUnits));
  }
}
