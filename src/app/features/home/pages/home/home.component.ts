import { CommonModule } from '@angular/common';
import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { Component, computed, effect, inject } from '@angular/core';
import { SnackBarService } from '@app/core/services/snack-bar-service';
import {
  HomeFatturato,
  HomeFattureStato,
  HomePreventivo,
  HomeSpazio,
} from '@app/features/home/model/home.model';
import * as env from '@env/environment';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
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
  BarChart,
  LineChart,
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
  fatturato = httpResource<HomeFatturato>(() => `${env.environment.apiUrl}/dashboard/fatturato`);
  fatturatoChartOptions = computed<EChartsOption>(() => {
    const dati = this.fatturato.value();
    if (!dati) return {} as EChartsOption;

    const etichette = dati.periodi.map((p) => p.etichetta) || [];
    const netto = dati.periodi.map((p) => p.totale_netto);
    const iva = dati.periodi.map((p) => p.totale_iva);
    const fatture = dati.periodi.map((p) => p.numero_fatture);

    const isTrimestrale = dati.raggruppamento === 'trimestrale';

    return {
      title: {
        text: `Fatturato ${dati.anno}`,
        subtext: isTrimestrale ? 'Vista trimestrale' : 'Vista mensile',
        left: 'center',
      },

      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const list = Array.isArray(params) ? params : [params];
          const periodo = list[0].axisValue;
          let html = `<strong>${periodo}</strong><br/>`;
          list.forEach((p: any) => {
            if (p.seriesName === 'N° fatture') {
              html += `${p.marker} ${p.seriesName}: <strong>${p.value}</strong><br/>`;
            } else {
              html += `${p.marker} ${p.seriesName}: <strong>€ ${p.value.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</strong><br/>`;
            }
          });
          return html;
        },
      },

      legend: {
        bottom: 0,
        data: ['Imponibile', 'IVA', 'N° fatture'],
      },

      grid: {
        top: 80,
        bottom: 50,
        left: 16,
        right: 60,
        containLabel: true,
      },

      xAxis: {
        type: 'category',
        data: etichette,
        axisTick: { alignWithLabel: true },
      },

      yAxis: [
        {
          // Asse sx — importi in €
          type: 'value',
          name: '€',
          nameLocation: 'end',
          axisLabel: {
            formatter: (val: number) =>
              val >= 1000 ? `€ ${(val / 1000).toFixed(0)}k` : `€ ${val}`,
          },
        },
        {
          // Asse dx — numero fatture
          type: 'value',
          name: 'Fatture',
          nameLocation: 'end',
          splitLine: { show: false }, // evita doppie griglie
          axisLabel: {
            formatter: (val: number) => `${val}`,
          },
        },
      ],

      color: ['#2191FB', '#90CAF9', '#4CAF50'],

      series: [
        {
          name: 'Imponibile',
          type: 'bar',
          stack: 'fatturato', // ← barre impilate
          yAxisIndex: 0,
          data: netto,
          itemStyle: { borderRadius: [0, 0, 0, 0] },
          emphasis: { focus: 'series' },
        },
        {
          name: 'IVA',
          type: 'bar',
          stack: 'fatturato', // ← stesso stack = si impilano
          yAxisIndex: 0,
          data: iva,
          itemStyle: { borderRadius: [4, 4, 0, 0] }, // angoli arrotondati solo in cima
          emphasis: { focus: 'series' },
        },
        {
          name: 'N° fatture',
          type: 'line',
          yAxisIndex: 1, // ← asse secondario
          data: fatture,
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: { width: 2 },
          emphasis: { focus: 'series' },
        },
      ],
    };
  });

  fattureStato = httpResource<HomeFattureStato>(
    () => `${env.environment.apiUrl}/dashboard/fatture-stato`,
  );
  fattureStatoChartOptions = computed<EChartsOption>(() => ({
    title: {
      text: 'Stato fatture (totale: ' + (this.fattureStato.value()?.totale || 0) + ')',
      subtext: 'Aggiornato oggi',
      left: 'center',
    },
    color: ['#FF8B12', '#53C058', '#BA274A'],
    tooltip: {
      trigger: 'item',
      formatter: '{a}<br/>{b}: {c} ({d}%)', // {a}=series, {b}=name, {c}=value, {d}=percent
    },
    series: [
      {
        name: 'Fatture',
        type: 'pie',
        radius: [30, 110],
        roseType: 'radius', // undefined | 'radius' | 'area'
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
          { value: this.fattureStato.value()?.in_attesa || 0, name: 'In attesa' },
          { value: this.fattureStato.value()?.pagate || 0, name: 'Pagate' },
          { value: this.fattureStato.value()?.scadute || 0, name: 'Scadute' },
        ],
      },
    ],
  }));

  preventivi = httpResource<HomePreventivo>(
    () => `${env.environment.apiUrl}/dashboard/preventivi-stato`,
  );
  preventiviChartOptions = computed<EChartsOption>(() => ({
    title: {
      text: 'Stato preventivi (totale: ' + (this.preventivi.value()?.totale || 0) + ')',
      subtext: 'Aggiornato oggi',
      left: 'center',
    },
    color: ['#FF7F11', '#BA274A', '#4CAF50', '#2191FB', '#48435C'],
    tooltip: {
      trigger: 'item',
      formatter: '{a}<br/>{b}: {c} ({d}%)', // {a}=series, {b}=name, {c}=value, {d}=percent
    },
    series: [
      {
        name: 'Preventivi',
        type: 'pie',
        radius: [30, 110],
        roseType: 'radius', // undefined | 'radius' | 'area'
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
    color: ['#348EE4', '#FF7F11'],
    tooltip: {
      trigger: 'item',
      formatter: '{a}<br/>{b}: {c} ({d}%)', // {a}=series, {b}=name, {c}=value, {d}=percent
      // formatter: (params) => `${params.name}: ${params.percent}%`,
    },
    series: [
      {
        roseType: 'radius', // undefined | 'radius' | 'area'
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
