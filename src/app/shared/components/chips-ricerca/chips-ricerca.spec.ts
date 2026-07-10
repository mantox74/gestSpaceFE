import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipsRicerca } from './chips-ricerca';

describe('ChipsRicerca', () => {
  let component: ChipsRicerca;
  let fixture: ComponentFixture<ChipsRicerca>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipsRicerca],
    }).compileComponents();

    fixture = TestBed.createComponent(ChipsRicerca);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
