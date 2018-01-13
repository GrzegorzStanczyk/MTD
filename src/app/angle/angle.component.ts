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
  // public angle$: Observable<number>;
  public angle: number;
  public acceleration$: Observable<any>;

  private canvas: HTMLCanvasElement;
  // private canvas: HTMLCanvasElement = this.telemetryCanvas.nativeElement;
  // private ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
  private ctx: CanvasRenderingContext2D;
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
    this.setGradient();
    // this.angle$ = this.eventListenerService.angle$.map(val => Math.round(val));
    this.eventListenerService.angle$.subscribe(val => this.angle = Math.round(val));
    this.acceleration$ = this.eventListenerService.acceleration$.map(val => Math.round(val.x));
    this.ngZone.runOutsideAngular(() => this.loop());
  }

  setCanvasSize(): void {
    this.canvas = this.telemetryCanvas.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    this.hostSize = {
      width: this.el.nativeElement.clientWidth,
      height: this.el.nativeElement.clientHeight
    };
    this.canvas.width = this.hostSize.width;
    this.canvas.height = this.hostSize.height;
    this.leanAngleSize = {
      x: this.hostSize.width / 2,
      y: this.hostSize.height / 2
    };
    this.radius = this.hostSize.width / 2 - this.lineWidth / 2;
  }

  setGradient(): void {
    this.grd = this.ctx.createLinearGradient(0, 0, this.hostSize.width, 0);
    this.grd.addColorStop(0, 'red');
    this.grd.addColorStop(0.2, 'orange');
    this.grd.addColorStop(0.4, 'green');
    this.grd.addColorStop(0.6, 'green');
    this.grd.addColorStop(0.8, 'orange');
    this.grd.addColorStop(1, 'red');
    this.ctx.strokeStyle = this.grd;
  }

  degreesToRadians (degrees): number {
    return degrees * (Math.PI / 180);
  }

  drawLeanAngle(): void {
    this.ctx.beginPath();
    if (this.angle > 0) {
      this.ctx.arc(this.leanAngleSize.x, this.leanAngleSize.y, this.radius,
        this.startingPoint, this.degreesToRadians(this.angle) + this.startingPoint, false);
    } else {
      this.ctx.arc(this.leanAngleSize.x, this.leanAngleSize.y, this.radius,
        this.startingPoint, this.degreesToRadians(this.angle) - Math.PI / 2, true);
    }
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.stroke();
  }

  clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.hostSize.width, this.hostSize.height);
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
