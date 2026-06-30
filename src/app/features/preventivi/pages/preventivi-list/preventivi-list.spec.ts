import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventiviList } from './preventivi-list';

describe('PreventiviList', () => {
  let component: PreventiviList;
  let fixture: ComponentFixture<PreventiviList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreventiviList],
    }).compileComponents();

    fixture = TestBed.createComponent(PreventiviList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
