import { Component, OnInit, AfterViewInit } from '@angular/core';
import { EventListenerService } from '../shared/event-listener.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-angle',
  templateUrl: './angle.component.html',
  styleUrls: ['./angle.component.scss']
})
export class AngleComponent implements OnInit, AfterViewInit {
  public angle$: Observable<number>;

  constructor(private els: EventListenerService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.angle$ = this.els.angle$.map(val => Math.round(val));
  }

}
