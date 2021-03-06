import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'no-cd-button',
  templateUrl: './no-cd-button.component.html',
  styleUrls: ['./no-cd-button.component.scss'],
})
export class NoCdButtonComponent implements OnInit, OnDestroy {
  @Input() emitInZone;
  @Output() noCdClick = new EventEmitter();

  @ViewChild('btn', { static: true }) button: ElementRef;

  private _subscription: Subscription;

  constructor(private _zone: NgZone) {}

  ngOnInit(): void {
    this._zone.runOutsideAngular(() => {
      this._subscription = fromEvent(this.button.nativeElement, 'click').subscribe(() => {
        if (this.emitInZone) {
          this._zone.run(() => {
            this.noCdClick.emit();
          });
        } else {
          this.noCdClick.emit();
        }
      });
    });
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
