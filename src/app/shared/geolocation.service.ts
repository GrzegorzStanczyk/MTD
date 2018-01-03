import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class GeolocationService implements OnDestroy {
  private speedSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public speed$: Observable<number> = this.speedSubject.asObservable();
  private watcher;

  constructor() {
    this.checkSupport();
    this.getSpeed();
  }

  checkSupport() {
    if(!navigator.geolocation) return;
  }

  getSpeed() {
    this.watcher = navigator.geolocation.watchPosition(event => {
      this.speedSubject.next(event.coords.latitude);
    });
  }

  ngOnDestroy() {
    navigator.geolocation.clearWatch(this.watcher);
  }
}
