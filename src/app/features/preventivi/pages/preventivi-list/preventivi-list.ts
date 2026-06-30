import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import * as env from '@env/environment';

@Component({
  selector: 'app-preventivi-list',
  imports: [CommonModule],
  templateUrl: './preventivi-list.html',
  styleUrl: './preventivi-list.scss',
})
export class PreventiviList {
  private http = inject(HttpClient);

  constructor() {
    this.getPrventiviList();
  }

  private getPrventiviList(): void {
    this.http.post(`${env.environment.apiUrl}/preventivi`, {}).subscribe((data) => {
      console.log(data);
    });
  }
}
