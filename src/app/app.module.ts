import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { EventListenerService } from './shared/event-listener.service';
import { GeolocationService } from './shared/geolocation.service';

import { AppComponent } from './app.component';
import { AngleComponent } from './angle/angle.component';
import { SpeedComponent } from './speed/speed.component';


@NgModule({
  declarations: [
    AppComponent,
    AngleComponent,
    SpeedComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [EventListenerService, GeolocationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
