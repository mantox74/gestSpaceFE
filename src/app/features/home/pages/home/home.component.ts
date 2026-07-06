import { CommonModule } from '@angular/common';
import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { Component, computed, effect, inject } from '@angular/core';
import { SnackBarService } from '@app/core/services/snack-bar-service';
import { HomePreventivo, HomeSpazio } from '@app/features/home/model/home.model';
import * as env from '@env/environment';
import { PieChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsOption } from 'echarts/types/dist/option';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
echarts.use([
  PieChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
]);

@Component({
  selector: 'app-home.component',
  imports: [CommonModule, NgxEchartsDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [provideEchartsCore({ echarts })],
})
export class HomeComponent {
  private snackBar = inject(SnackBarService);
  preventivi = httpResource<HomePreventivo>(
    () => `${env.environment.apiUrl}/dashboard/preventivi-stato`,
  );
  preventiviChartOptions = computed<EChartsOption>(() => ({
    title: {
      text: 'Stato preventivi (totale: ' + (this.preventivi.value()?.totale || 0) + ')',
      subtext: 'Aggiornato oggi',
      left: 'center',
    },
    color: ['#785DB0', '#FF994D', '#4CAF50', '#F44336', '#9E9E9E'],
    tooltip: {
      trigger: 'item',
      formatter: '{a}<br/>{b}: {c} ({d}%)', // {a}=series, {b}=name, {c}=value, {d}=percent
    },
    series: [
      {
        name: 'Preventivi',
        type: 'pie',
        radius: [30, 110],
        label: {
          show: true,
          formatter: '{b} ({c})', // {a}=series, {b}=name, {c}=value, {d}=percent
          fontSize: 12,
          overflow: 'break', // 'truncate' | 'break' | 'breakAll'
        },
        emphasis: {
          scale: true, // espande la fetta al hover
          scaleSize: 20, // pixel di espansione
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
          label: {
            show: true,
          },
        },
        data: [
          { value: this.preventivi.value()?.bozza || 0, name: 'Bozza' },
          { value: this.preventivi.value()?.inviati || 0, name: 'Inviati' },
          { value: this.preventivi.value()?.accettati || 0, name: 'Accettati' },
          { value: this.preventivi.value()?.rifiutati || 0, name: 'Rifiutati' },
          { value: this.preventivi.value()?.annullati || 0, name: 'Annullati' },
        ],
      },
    ],
  }));
  spazi = httpResource<HomeSpazio>(() => `${env.environment.apiUrl}/dashboard/spazi`);
  spaziChartOptions = computed<EChartsOption>(() => ({
    title: {
      text: 'Stato occupazione spazi (totale: ' + (this.spazi.value()?.totale || 0) + ')',
      subtext: 'Aggiornato oggi',
      left: 'center',
    },
    // Legenda
    // legend: {
    //   orient: 'horizontal', // 'horizontal' | 'vertical'
    //   left: 'center', // 'left' | 'right' | 'center' | pixel
    //   top: '40px', // 'top' | 'bottom' | 'center' | pixel
    //   data: ['Spazi occupati', 'Spazi liberi'],
    // },
    color: ['#785DB0', '#FF994D'],
    tooltip: {
      trigger: 'item',
      formatter: '{a}<br/>{b}: {c} ({d}%)', // {a}=series, {b}=name, {c}=value, {d}=percent
      // formatter: (params) => `${params.name}: ${params.percent}%`,
    },
    series: [
      {
        roseType: 'area', // undefined | 'radius' | 'area'
        name: 'Spazi',
        type: 'pie',
        radius: [30, 110],
        label: {
          show: true, // true | false
          // position: 'outside', // 'outside' | 'inside' | 'center'
          formatter: '{b} ({c})', // {a}=series, {b}=name, {c}=value, {d}=percent
          // formatter: (params) => `${params.name}: ${params.percent}%`,
          fontSize: 12,
          // color: '#333',
          overflow: 'break', // 'truncate' | 'break' | 'breakAll'
        },
        // labelLine: {
        //   show: true,
        //   length: 15, // lunghezza primo segmento
        //   length2: 10, // lunghezza secondo segmento
        //   smooth: false,
        // },
        // === HOVER ===
        emphasis: {
          scale: true, // espande la fetta al hover
          scaleSize: 20, // pixel di espansione
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
          label: {
            show: true,
            //fontSize: 14, fontWeight: 'bold'
          },
        },
        data: [
          { value: this.spazi.value()?.occupati || 0, name: 'Occupati' },
          { value: this.spazi.value()?.liberi || 0, name: 'Liberi' },
        ],
      },
    ],
  }));

  constructor() {
    // gestione errori
    effect(() => {
      if (this.spazi.error()) {
        const errorObj = this.spazi.error() as HttpErrorResponse;
        this.snackBar.showError(
          errorObj.error.error || errorObj.message || 'Errore nel caricamento dei dati degli spazi',
        );
      }
    });
  }
}
