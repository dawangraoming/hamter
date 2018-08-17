import {Directive, Input, HostListener, ElementRef} from '@angular/core';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective {

  @Input()
  appDraggableOnUp: () => any;

  constructor(private el: ElementRef) {
  }

  @HostListener('mousedown', ['$event'])
  onDown() {
    // this.appDraggableOnUp();
  }

}
