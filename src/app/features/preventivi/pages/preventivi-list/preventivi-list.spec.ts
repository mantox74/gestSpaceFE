import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventiviList } from './preventivi-list';

describe('PreventiviList', () => {
  let component: PreventiviList;
  let fixture: ComponentFixture<PreventiviList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreventiviList],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(PreventiviList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
