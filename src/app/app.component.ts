import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  viewChild,
} from '@angular/core';
import {
  outputToObservable,
  takeUntilDestroyed,
  toObservable,
} from '@angular/core/rxjs-interop';
import { merge, switchMap } from 'rxjs';
import { CirclePointRenderTargetDirective } from './circle-point-render-target/circle-point-render-target.directive';
import {
  CirclePointComponent,
  Coord,
} from './circle-point/circle-point.component';

const NUMBER_OF_COLUMN_ON_BOARD = 8;
const NUMBER_OF_ROW_ON_BOARD = 6;

const NUMBER_OF_CIRCLE_POINT_ON_BOARD =
  NUMBER_OF_COLUMN_ON_BOARD * NUMBER_OF_ROW_ON_BOARD;

type GamUser = {
  color: string;
  pointBoard: CirclePointComponent[];
};

const USER_GAMES: GamUser[] = [
  { color: 'green', pointBoard: [] },
  { color: 'red', pointBoard: [] },
];

@Component({
  standalone: true,
  imports: [
    CommonModule,
    CirclePointComponent,
    CirclePointRenderTargetDirective,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit {
  private readonly _circlePointRenderTarget = viewChild.required(
    CirclePointRenderTargetDirective
  );

  private readonly _circlePointsMatrix = signal<CirclePointComponent[][]>([]);

  private readonly _circlePoints = computed(() =>
    this._circlePointsMatrix().flat()
  );

  private readonly _selection$ = toObservable(this._circlePoints).pipe(
    switchMap((items) =>
      merge(...items.map((item) => outputToObservable(item.selection)))
    )
  );

  private userTruns = 0;

  constructor() {
    this._selection$.pipe(takeUntilDestroyed()).subscribe((item) => {
      item.userColor = USER_GAMES[this.userTruns].color;

      this._setNewAwaialableCirclePoint(item.coord!);

      this.userTruns = this.userTruns === 0 ? 1 : 0;
    });
  }

  private _setNewAwaialableCirclePoint(selectedItemCoord: Coord) {
    const nowAvialableOnCoordY = selectedItemCoord!.y - 1;

    const neww = this._circlePoints().find(
      ({ coord }) =>
        coord!.y === nowAvialableOnCoordY && coord?.x === selectedItemCoord?.x
    );
    neww!.state = 'AVAILABLE';
  }

  ngAfterViewInit(): void {
    this._renderBoard();
  }

  private _renderBoard() {
    const board: CirclePointComponent[][] = [];

    for (let row = 0; row < NUMBER_OF_ROW_ON_BOARD; ++row) {
      board[row] = [];

      for (let column = 0; column < NUMBER_OF_COLUMN_ON_BOARD; ++column) {
        const circlePoint =
          this._circlePointRenderTarget().viewContainerRef.createComponent<CirclePointComponent>(
            CirclePointComponent
          );

        circlePoint.instance.coord = { x: column, y: row };

        if (row === NUMBER_OF_ROW_ON_BOARD - 1) {
          circlePoint.instance.state = 'AVAILABLE';
        }

        board[row][column] = circlePoint.instance;
      }
    }

    this._circlePointsMatrix.set(board);
  }
}
