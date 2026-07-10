import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaziSearchForm } from './spazi-search-form';

describe('SpaziSearchForm', () => {
  let component: SpaziSearchForm;
  let fixture: ComponentFixture<SpaziSearchForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpaziSearchForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SpaziSearchForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
