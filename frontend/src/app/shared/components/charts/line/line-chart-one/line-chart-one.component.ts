import { LocalizationService } from '../../../../services/localization.service';

import { computed, inject, Component } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexStroke,
  ApexFill,
  ApexMarkers,
  ApexGrid,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexLegend,
  NgApexchartsModule
} from 'ng-apexcharts';


@Component({
  selector: 'app-line-chart-one',
  imports: [
    NgApexchartsModule
],
  templateUrl: './line-chart-one.component.html',
  styles: ``
})
export class LineChartOneComponent {
  readonly localizedSeries = computed(() => this.series.map(series => ({ ...series, name: this.localization.text(series.name) })));
  readonly localizedXAxis = computed(() => ({ ...this.xaxis, categories: (this.xaxis.categories ?? []).map((label: string | number | (string | number)[]) => Array.isArray(label) ? label.map(value => typeof value === 'string' ? this.localization.text(value) : value) : typeof label === 'string' ? this.localization.text(label) : label) as ApexXAxis['categories'] }));
  readonly localization = inject(LocalizationService);

  public series: ApexAxisChartSeries = [
    {
      name: 'Sales',
      data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
    },
    {
      name: 'Revenue',
      data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
    },
  ];

  public chart: ApexChart = {
    fontFamily: 'Outfit, sans-serif',
    height: 310,
    type: 'area',
    toolbar: {
      show: false
    }
  };

  public colors: string[] = ['#465FFF', '#9CB9FF'];

  public stroke: ApexStroke = {
    curve: 'straight',
    width: [2, 2]
  };

  public fill: ApexFill = {
    type: 'gradient',
    gradient: {
      opacityFrom: 0.55,
      opacityTo: 0
    }
  };

  public markers: ApexMarkers = {
    size: 0,
    strokeColors: '#fff',
    strokeWidth: 2,
    hover: {
      size: 6
    }
  };

  public grid: ApexGrid = {
    xaxis: {
      lines: {
        show: false
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  };

  public dataLabels: ApexDataLabels = {
    enabled: false
  };

  public tooltip: ApexTooltip = {
    enabled: true,
    x: {
      format: 'dd MMM yyyy'
    }
  };

  public xaxis: ApexXAxis = {
    type: 'category',
    categories: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    tooltip: {
      enabled: false
    }
  };

  public yaxis: ApexYAxis = {
    labels: {
      style: {
        fontSize: '12px',
        colors: ['#6B7280']
      }
    },
    title: {
      text: '',
      style: {
        fontSize: '0px'
      }
    }
  };

  public legend: ApexLegend = {
    show: false,
    position: 'top',
    horizontalAlign: 'left'
  };
}
