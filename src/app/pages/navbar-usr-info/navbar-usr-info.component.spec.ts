import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarUsrInfoComponent } from './navbar-usr-info.component';

describe('NavbarUsrInfoComponent', () => {
  let component: NavbarUsrInfoComponent;
  let fixture: ComponentFixture<NavbarUsrInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarUsrInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarUsrInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
