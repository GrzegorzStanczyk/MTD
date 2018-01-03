import { Component, OnInit } from '@angular/core';
import { GeolocationService } from '../shared/geolocation.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-speed',
  templateUrl: './speed.component.html',
  styleUrls: ['./speed.component.scss']
})
export class SpeedComponent implements OnInit {
  public speed$: Observable<number>;

  constructor(private geolocationService: GeolocationService) {}

  ngOnInit() {
    this.speed$ = this.geolocationService.speed$;
  }
}
