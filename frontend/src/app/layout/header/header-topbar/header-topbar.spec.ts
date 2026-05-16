import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderTopbar } from './header-topbar';

describe('HeaderTopbar', () => {
  let component: HeaderTopbar;
  let fixture: ComponentFixture<HeaderTopbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderTopbar],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderTopbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
