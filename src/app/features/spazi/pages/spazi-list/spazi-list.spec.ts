import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaziList } from './spazi-list';

describe('SpaziList', () => {
  let component: SpaziList;
  let fixture: ComponentFixture<SpaziList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpaziList],
    }).compileComponents();

    fixture = TestBed.createComponent(SpaziList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
