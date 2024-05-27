import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstadoPatioPage } from './estado-patio.page';

describe('EstadoPatioPage', () => {
  let component: EstadoPatioPage;
  let fixture: ComponentFixture<EstadoPatioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoPatioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
