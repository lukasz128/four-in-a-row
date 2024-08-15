import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CirclePointComponent } from './circle-point.component';

describe('CirclePointComponent', () => {
  let component: CirclePointComponent;
  let fixture: ComponentFixture<CirclePointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CirclePointComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CirclePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
