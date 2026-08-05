import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventiviSearchForm } from './preventivi-search-form';

describe('PreventiviSearchForm', () => {
  let component: PreventiviSearchForm;
  let fixture: ComponentFixture<PreventiviSearchForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreventiviSearchForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PreventiviSearchForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
