import {
  Component,
  HostBinding,
  HostListener,
  InjectionToken,
  output,
  OutputEmitterRef,
} from '@angular/core';

type State = 'SELECTED' | 'AVAILABLE' | 'UNAVAILABLE';
export type Coord = { x: number; y: number };

export type SelectableItem = {
  selection: OutputEmitterRef<SelectableItem>;
  coord: Coord | undefined;
};

export const SelectableCirclePoint = new InjectionToken<SelectableItem>('Sele');

@Component({
  selector: 'app-circle-point',
  standalone: true,
  imports: [],
  templateUrl: './circle-point.component.html',
  styleUrl: './circle-point.component.scss',
  providers: [
    {
      provide: SelectableCirclePoint,
      useExisting: CirclePointComponent,
    },
  ],
})
export class CirclePointComponent implements SelectableItem {
  readonly selection = output<this>();

  state: State = 'UNAVAILABLE';
  coord: Coord | undefined = undefined;
  userColor: string | undefined = undefined;

  @HostBinding('class.selected') get canSelected() {
    return this.state === 'SELECTED';
  }

  @HostBinding('style.backgroundColor') get canBackgroundColor() {
    if (this.state === 'UNAVAILABLE' || this.state === 'AVAILABLE') {
      return 'grey';
    }

    return this.userColor;
  }

  @HostBinding('class.available') get canAvailable() {
    return this.state === 'AVAILABLE';
  }

  @HostBinding('class.unavailable') get canUnavailable() {
    return this.state === 'UNAVAILABLE';
  }

  @HostBinding('attr.coords') get canCoords() {
    return `x:${this.coord?.x}, y:${this.coord?.y}`;
  }

  @HostListener('click') clickEventHandler() {
    this.state = 'SELECTED';

    this.selection.emit(this);
  }
}
