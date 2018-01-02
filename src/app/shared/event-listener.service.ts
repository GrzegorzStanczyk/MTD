import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EventListenerService {
  private angleSubject: Subject<number> = new Subject<number>();
  public angle$: Observable<number> = this.angleSubject.asObservable();

  constructor(private eventManager: EventManager) {
    this.eventManager.addGlobalEventListener('window', 'deviceorientation', (event) => {
      this.angleSubject.next(event.gamma);
    });
  }

}
