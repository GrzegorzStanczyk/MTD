import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class GeolocationService implements OnDestroy {
  private speedSubject: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  public speed$: Observable<any> = this.speedSubject.asObservable();
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
      if (event.coords.speed !== null) {
        this.speedSubject.next(event.coords.speed);
      }
    }, err => {
      console.log(err);
    }, {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 20000
    });
  }

  ngOnDestroy() {
    navigator.geolocation.clearWatch(this.watcher);
  }
}
