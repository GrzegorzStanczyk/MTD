import {
  Component,
   OnInit,
   AfterViewInit,
   ElementRef,
   ViewChild,
   NgZone,
   OnDestroy,
   AnimationKeyframe } from '@angular/core';
import { EventListenerService } from '../shared/event-listener.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-angle',
  templateUrl: './angle.component.html',
  styleUrls: ['./angle.component.scss']
})
export class AngleComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('telemetryCanvas') telemetryCanvas;
  @ViewChild('accelerationCanvas') accelerationCanvas;
  // public angle$: Observable<number>;
  public angle: number;
  public acceleration$: Observable<any>;

  private telemetry: HTMLCanvasElement;
  private acceleration: HTMLCanvasElement;
  // private canvas: HTMLCanvasElement = this.telemetryCanvas.nativeElement;
  // private telemetryCTX: CanvasRenderingContext2D = this.telemetry.getContext('2d');
  private telemetryCTX: CanvasRenderingContext2D;
  private accelerationCTX: CanvasRenderingContext2D;
  private hostSize: {width: number, height: number};
  private leanAngleSize: {x: number, y: number};
  private radius: number;
  private grd: CanvasGradient;
  private startingPoint: number = -Math.PI / 2;
  private lineWidth: number = 50;
  private animationFrame: AnimationKeyframe;

  constructor(
    private eventListenerService: EventListenerService,
    private el: ElementRef,
    private ngZone: NgZone) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.setCanvasSize();
    this.drawGForce();
    this.setGradient();
    // this.angle$ = this.eventListenerService.angle$.map(val => Math.round(val));
    this.eventListenerService.angle$.subscribe(val => this.angle = Math.round(val));
    this.acceleration$ = this.eventListenerService.acceleration$.map(val => Math.round(val.x));
    this.ngZone.runOutsideAngular(() => this.loop());
  }

  setCanvasSize(): void {
    this.telemetry = this.telemetryCanvas.nativeElement;
    this.telemetryCTX = this.telemetry.getContext('2d');
    this.acceleration = this.accelerationCanvas.nativeElement;
    this.accelerationCTX = this.acceleration.getContext('2d');
    this.hostSize = {
      width: this.el.nativeElement.clientWidth,
      height: this.el.nativeElement.clientHeight
    };
    this.telemetry.width = this.hostSize.width;
    this.telemetry.height = this.hostSize.height;
    this.acceleration.width = this.hostSize.width;
    this.acceleration.height = this.hostSize.height;
    this.leanAngleSize = {
      x: this.hostSize.width / 2,
      y: this.hostSize.height / 2
    };
    this.radius = this.hostSize.width / 2 - this.lineWidth / 2;
  }

  setGradient(): void {
    this.grd = this.telemetryCTX.createLinearGradient(0, 0, this.hostSize.width, 0);
    this.grd.addColorStop(0, 'red');
    this.grd.addColorStop(0.2, 'orange');
    this.grd.addColorStop(0.4, 'green');
    this.grd.addColorStop(0.6, 'green');
    this.grd.addColorStop(0.8, 'orange');
    this.grd.addColorStop(1, 'red');
    this.telemetryCTX.strokeStyle = this.grd;
  }

  degreesToRadians (degrees): number {
    return degrees * (Math.PI / 180);
  }

  drawLeanAngle(): void {
    this.telemetryCTX.beginPath();
    if (this.angle > 0) {
      this.telemetryCTX.arc(this.leanAngleSize.x, this.leanAngleSize.y, this.radius,
        this.startingPoint, this.degreesToRadians(this.angle) + this.startingPoint, false);
    } else {
      this.telemetryCTX.arc(this.leanAngleSize.x, this.leanAngleSize.y, this.radius,
        this.startingPoint, this.degreesToRadians(this.angle) - Math.PI / 2, true);
    }
    this.telemetryCTX.lineWidth = this.lineWidth;
    this.telemetryCTX.stroke();
  }

  drawGForce() {
    this.accelerationCTX.beginPath();
    this.accelerationCTX.moveTo(this.lineWidth, this.acceleration.height / 2);
    this.accelerationCTX.lineTo(this.acceleration.width - this.lineWidth, this.acceleration.height / 2);
    this.accelerationCTX.stroke();

    this.accelerationCTX.beginPath();
    this.accelerationCTX.moveTo(this.acceleration.width / 2, this.lineWidth);
    this.accelerationCTX.lineTo(this.acceleration.width / 2, this.acceleration.height - this.lineWidth);
    this.accelerationCTX.stroke();

    this.accelerationCTX.beginPath();
    this.accelerationCTX.arc(this.acceleration.width / 2, this.acceleration.height / 2, ((this.acceleration.width / 2) -  this.lineWidth) * 1 / 3,
      0, Math.PI * 2, true);
    this.accelerationCTX.arc(this.acceleration.width / 2, this.acceleration.height / 2, ((this.acceleration.width / 2) -  this.lineWidth) * 2 / 3,
      0, Math.PI * 2, true);
    this.accelerationCTX.arc(this.acceleration.width / 2, this.acceleration.height / 2, (this.acceleration.width / 2) -  this.lineWidth,
      0, Math.PI * 2, true);
    this.accelerationCTX.stroke();
  }

  clearCanvas(): void {
    this.telemetryCTX.clearRect(0, 0, this.hostSize.width, this.hostSize.height);
  }

  loop(): void {
    this.clearCanvas();
    this.drawLeanAngle();
    this.animationFrame = requestAnimationFrame(() => this.loop());
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationFrame);
  }
}
