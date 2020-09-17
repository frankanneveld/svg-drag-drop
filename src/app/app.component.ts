import { Component } from '@angular/core';
import { Observable, fromEvent, interval } from 'rxjs';
import { switchMap, takeUntil, debounce } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.svg',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public log: {[key: string]: number};

  private selectedElement: { [key: string]: any };
  private dragging: Observable<Event>;

  // TODO: Move all the logic to an Directive

/**
 * Wrap up listerners with RxJs operators
 */
  constructor() {
    const mouseDown: Observable<Event> = fromEvent(window, 'mousedown');
    const mouseUp: Observable<Event> = fromEvent(window, 'mouseup');
    const mouseMove: Observable<Event> = fromEvent(window, 'mousemove');
    this.dragging = mouseDown.pipe(switchMap(() => mouseMove.pipe(takeUntil(mouseUp))));
    mouseUp.subscribe( () => this.selectedElement = null );
  }

/**
 * Handle dragging events after the view is initialized
 */
  ngAfterViewInit(): void {
    this.dragging.pipe(debounce(() => interval(0))).subscribe((event: MouseEvent) => {
      const {offsetX, offsetY} = event;
      const cx = offsetX + this.selectedElement?.dcx;
      const cy = offsetY + this.selectedElement?.dcy;
      this.selectedElement?.target.setAttributeNS(null, 'cx', `${cx}`);
      this.selectedElement?.target.setAttributeNS(null, 'cy', `${cy}`);

      this.log = {cx, cy};
    });
  }

/**
 * @param evt The MouseEvent from the template
 */
  startDrag(evt: MouseEvent) {
    const target = evt.target as SVGAElement;
    const {offsetX, offsetY} = evt;
    const cx = Number(target.getAttributeNS(null, 'cx'));
    const cy = Number(target.getAttributeNS(null, 'cy'));
    this.selectedElement = {...this.selectedElement, target, dcx: cx - offsetX, dcy: cy - offsetY};

    this.log = {cx, cy};
  }
}
