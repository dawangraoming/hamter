import {Component, OnInit, AfterViewInit, Renderer2, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-category-input',
  templateUrl: './category-input.component.html',
  styleUrls: ['./category-input.component.scss']
})
export class CategoryInputComponent implements OnInit, AfterViewInit {
  @Input() sourceName: String;
  @Input() termId: number;
  @Output() nameInputCompleted = new EventEmitter();
  name: String;

  constructor(public render: Renderer2) {
  }

  completed() {
    this.nameInputCompleted.emit({
      term_name: this.name,
      term_id: this.termId,
      hasChanged: this.name !== this.sourceName
    });
  }

  keyUpMethod(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.completed();
    }
  }

  ngAfterViewInit() {
    const inputEle = this.render.selectRootElement(`input`);
    inputEle.focus();
  }

  ngOnInit() {
    this.name = this.sourceName;
  }
}
