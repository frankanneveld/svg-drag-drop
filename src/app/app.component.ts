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
  // public xpos = 100;
  // public ypos = 100;

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
      const {clientX, screenY} = event;
      const cx = clientX + this.selectedElement?.dcx;
      const cy = screenY + this.selectedElement?.dcy;
      // this.selectedElement?.target.setAttributeNS(null, 'cx', `${cx}`);
      // this.selectedElement?.target.setAttributeNS(null, 'cy', `${cy}`);
      // const transform = "matrix(1,0,0,1,"+cx+","+cy+")";
      const transform = "translate("+cx+","+cy+")";
      this.selectedElement?.target.setAttribute("transform", transform);


      // this.xpos = cx;
      // this.ypos = cy;
      this.log = {cx, cy};
    });
  }

/**
 * @param evt The MouseEvent from the template
 */
  public startDrag(evt: MouseEvent): void {

    const target = evt.target as SVGElement;
    console.log(target.getAttribute('transform'));

    // console.log(target.getAttributeNode('transform'));
    // console.log(target.getClientRects());
    console.log(target.viewportElement.clientTop);

    // console.log(target.getAttributeNode('transform'));
    const {clientX, clientY} = evt;
    const cx = evt.offsetX;
    const cy = evt.offsetY
    this.selectedElement = {...this.selectedElement, target, dcx: clientX - cx, dcy: clientY - cy };
    // this.selectedElement = {...this.selectedElement, target, dcx: cx, dcy: cy };
    this.log = {cx, cy};
  }
}
