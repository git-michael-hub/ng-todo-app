import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'; // ✅ Import HttpClientModule
import { UpcomingComponent } from './upcoming.component';

describe('UpcomingComponent', () => {
  let component: UpcomingComponent;
  let fixture: ComponentFixture<UpcomingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [UpcomingComponent, HttpClientModule] // ✅ Add HttpClientModule
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
