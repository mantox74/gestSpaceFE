import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { PreventivoDTO } from '@app/features/preventivi/model/preventivi';
import * as env from '@env/environment';

@Component({
  selector: 'app-preventivi-list',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './preventivi-list.html',
  styleUrl: './preventivi-list.scss',
})
export class PreventiviList {
  private http = inject(HttpClient);
  displayedColumns: string[] = ['id', 'cliente_nome', 'spazio_nome', 'totale_preventivo'];
  preventiviList: WritableSignal<PreventivoDTO[]> = signal<PreventivoDTO[]>([]);

  constructor() {
    this.getPrventiviList();
  }

  private getPrventiviList(): void {
    this.http
      .post<PreventivoDTO[]>(`${env.environment.apiUrl}/preventivi`, {})
      .subscribe((data) => {
        this.preventiviList.set(data);
      });
  }
}
