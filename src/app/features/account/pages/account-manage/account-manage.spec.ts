import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManage } from './account-manage';

describe('AccountManage', () => {
  let component: AccountManage;
  let fixture: ComponentFixture<AccountManage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountManage],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountManage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
