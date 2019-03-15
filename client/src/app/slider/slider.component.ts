import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent {
  @Input() value: number;
  @Input() min = 0;
  @Input() max = 100;

  @Output() valueChange = new EventEmitter<number>();

  onInput($event: Event) {
    const value = parseInt(($event.target as HTMLInputElement).value);
    this.valueChange.emit(value);
  }
}
