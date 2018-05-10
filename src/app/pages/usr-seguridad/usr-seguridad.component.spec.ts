import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsrSeguridadComponent } from './usr-seguridad.component';

describe('UsrSeguridadComponent', () => {
  let component: UsrSeguridadComponent;
  let fixture: ComponentFixture<UsrSeguridadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsrSeguridadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsrSeguridadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
