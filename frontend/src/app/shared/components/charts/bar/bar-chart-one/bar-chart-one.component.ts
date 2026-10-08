import { LocalizationService } from '../../../../services/localization.service';
import { computed, inject, Component } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  ApexFill,
  ApexTooltip
} from 'ng-apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';



@Component({
  selector: 'app-bar-chart-one',
  imports: [
    NgApexchartsModule
],
  templateUrl: './bar-chart-one.component.html',
  styles: ``
})
export class BarChartOneComponent {
  readonly localizedSeries = computed(() => this.series.map(series => ({ ...series, name: this.localization.text(series.name) })));
  readonly localizedXAxis = computed(() => ({ ...this.xaxis, categories: (this.xaxis.categories ?? []).map((label: string | number | (string | number)[]) => Array.isArray(label) ? label.map(value => typeof value === 'string' ? this.localization.text(value) : value) : typeof label === 'string' ? this.localization.text(label) : label) as ApexXAxis['categories'] }));
  readonly localization = inject(LocalizationService);

  public series: ApexAxisChartSeries = [
    {
      name: 'Sales',
      data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
    },
  ];

  public chart: ApexChart = {
    fontFamily: 'Outfit, sans-serif',
    type: 'bar',
    height: 180,
    toolbar: {
      show: false,
    },
  };

  public colors: string[] = ['#465fff'];

  public plotOptions: ApexPlotOptions = {
    bar: {
      horizontal: false,
      columnWidth: '39%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
    },
  };

  public dataLabels: ApexDataLabels = {
    enabled: false,
  };

  public stroke: ApexStroke = {
    show: true,
    width: 4,
    colors: ['transparent'],
  };

  public xaxis: ApexXAxis = {
    categories: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  };

  public yaxis: ApexYAxis = {
    title: {
      text: undefined,
    },
  };

  public legend: ApexLegend = {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Outfit',
  };

  public grid: ApexGrid = {
    yaxis: {
      lines: {
        show: true,
      },
    },
  };

  public fill: ApexFill = {
    opacity: 1,
  };

  public tooltip: ApexTooltip = {
    x: {
      show: false,
    },
    y: {
      formatter: (val: number) => `${val}`,
    },
  };
}
