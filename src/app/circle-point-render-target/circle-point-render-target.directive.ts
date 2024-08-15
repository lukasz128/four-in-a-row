import { Directive, inject, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appCirclePointRenderTarget]',
  standalone: true,
})
export class CirclePointRenderTargetDirective {
  readonly viewContainerRef = inject(ViewContainerRef);
}
