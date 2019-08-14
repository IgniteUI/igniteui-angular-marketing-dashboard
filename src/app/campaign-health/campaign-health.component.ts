import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../data.service';
import { IDoughnutColors, IDoughnutDataRecord } from '../models/doughnut-charts';
import { IRangeData } from '../models/range';
import { IgxDoughnutChartComponent} from 'igniteui-angular-charts/ES5/igx-doughnut-chart-component';
import { IgxRingSeriesComponent} from 'igniteui-angular-charts/ES5/igx-ring-series-component';
import { LabelsPosition } from 'igniteui-angular-charts/ES5/LabelsPosition';
import { IBulletGraph } from '../models/bullet-graph';
import {convertToInt} from '../utils';
import { FormatLinearGraphLabelEventArgs } from 'igniteui-angular-gauges/ES5/FormatLinearGraphLabelEventArgs';
import { AlignLinearGraphLabelEventArgs } from 'igniteui-angular-gauges/ES5/AlignLinearGraphLabelEventArgs';
import { ITrendItem, generateTrendItem } from '../models/trend-item';
@Component({
  selector: 'app-campaign-health',
  templateUrl: './campaign-health.component.html',
  styleUrls: ['./campaign-health.component.scss']
})
export class CampaignHealthComponent implements OnInit {

  public doughnutChartColors: IDoughnutColors;
  public doughnutData: IDoughnutDataRecord[];
  public bulletGraphs: IBulletGraph[] = [];
  private formatter;
  public trendItem: ITrendItem;

  constructor(private service: DataService) {

    this.doughnutChartColors = {
      ppc: {
        end: { value: '#ffbf00', bkg: '#5c432b', label: '#222' },
        start: { value: '#826100', bkg: '#402d32', label: '#ccc' }
      },
      email: {
        end: { value: '#ff6600', bkg: '#5c2c2b', label: '#ccc' },
        start: { value: '#732e00', bkg: '#402232', label: '#ccc' }
      },
      banners: {
        end: { value: '#4ba4aa', bkg: '#2f3c55', label: '#ccc' },
        start: { value: '#2d6165', bkg: '#2a2a47', label: '#ccc' }
      },
      thirdParty: {
        end: { value: '#f0f0f0', bkg: '#584f67', label: '#222' },
        start: { value: '#7f7f7f', bkg: '#3e334f', label: '#ccc' }
      }
    };
    this.trendItem = {
      name: undefined,
      end: undefined,
      start: undefined,
      percent: undefined,
      direction: undefined,
      directionColor: undefined,
      endRes: undefined
    };
    for (let index = 0; index < 8; index++) {
        this.bulletGraphs.push(
          {
          adModel: undefined,
          value: undefined,
          maximumValue: undefined,
          valueBrush: undefined,
          bkgBrush: undefined,
          labelBrush: undefined,
          target: undefined
         });
      }


    this.formatter = (context) => {
      if (!context.item.showLabel) { return ''; }
      return Math.round(context.percentValue) + '%';
    };
  }

  @ViewChild(IgxDoughnutChartComponent, {static: true})
  chart: IgxDoughnutChartComponent;

  @ViewChild('legend', {static: true})
  legend: TemplateRef<any>;

  public adModels = ['ppc', 'email', 'banners', 'thirdParty'];

  ngOnInit() {
    this.chart.sliceClick.subscribe( event => {
      event.args.i.dataContext.showLabel = event.args.i.slice.isSelected;
      this.chart.series.toArray().forEach(s => {
        s.formatLabel = this.formatter;
      });
    });

    this.service.onDataFetch.subscribe((data: IRangeData) => {
      this.trendItem = generateTrendItem('conversions', data);
      this.chart.series.clear();
      this.doughnutData = [
        { label: 'PPC', value: data.end.ppc , prev: data.start.ppc},
        { label: 'Banners', value: data.end.banners, prev: data.start.banners },
        { label: 'Email', value: data.end.email, prev: data.start.email },
        { label: '3rd Party', value: data.end.thirdParty, prev: data.start.thirdParty }
      ];

      this.renderDoughnutChart(this.chart, this.doughnutChartColors);
      this.renderBulletGraphs(data, this.doughnutChartColors);
    });
  }

  public renderDoughnutChart(chart: IgxDoughnutChartComponent, doughnutColors: IDoughnutColors) {
      chart.width = '120%';
      chart.height = '500px';
      chart.innerExtent = 20;
      chart.allowSliceSelection = true;
      chart.selectedSliceStrokeThickness = 7;
      const colors = [];
      const fadedColors = [];

      Object.keys(doughnutColors).forEach(key => {
        colors.push(doughnutColors[key].end.value);
        fadedColors.push(doughnutColors[key].start.value);
      });

      this.generateSeries('End', this.doughnutData, colors, fadedColors).forEach(s => {
        chart.series.add(s);
      });
  }

 public getbulletGraphModels(model) {
    return this.bulletGraphs.filter(g => {
      return g.adModel === model;
    });
  }

  public generateSeries(name: string, data: IDoughnutDataRecord[], colors: string[], fadedColors: string[]) {
    const series = [];

    for (let index = 0; index < 2; index++) {
      const ringSeries = new IgxRingSeriesComponent();
      if (index === 0 ) {
        ringSeries.i.name = `${name}2`;
        ringSeries.brushes = fadedColors;
        ringSeries.outlines = fadedColors;
        ringSeries.valueMemberPath = 'prev';
        ringSeries.radiusFactor = 0.8;

      } else {
        ringSeries.i.name = name;
        ringSeries.brushes = colors;
        ringSeries.outlines = colors;
        ringSeries.valueMemberPath = 'value';
        ringSeries.legend = this.legend;
      }

      ringSeries.labelsPosition = LabelsPosition.Center;
      ringSeries.dataSource = data;
      ringSeries.startAngle = -90;
      ringSeries.labelMemberPath = 'label';
      ringSeries.formatLabel = this.formatter;

      series.push(ringSeries);
    }

    return series;
  }

  public renderBulletGraphs(data: IRangeData, colors: IDoughnutColors) {
    const periods = ['start', 'end'];

    let graphIndex = 0;
    for (let index = 0; index < this.adModels.length; index++) {
      for (let i = 0; i < periods.length; i++) {
         this.bulletGraphs[graphIndex].adModel = this.adModels[index];
         this.bulletGraphs[graphIndex].value = data[periods[i]][this.adModels[index]];
         this.bulletGraphs[graphIndex].maximumValue = data[periods[i]].conversions;
         this.bulletGraphs[graphIndex].valueBrush = colors[this.adModels[index]][periods[i]].value;
         this.bulletGraphs[graphIndex].bkgBrush = colors[this.adModels[index]][periods[i]].bkg;
         this.bulletGraphs[graphIndex].labelBrush =  colors[this.adModels[index]][periods[i]].label;
         this.bulletGraphs[graphIndex].target = data[periods[i]][`${this.adModels[index]}Target`];

         graphIndex++;
      }
    }
  }

  public getMaxValue(value): number {
    return convertToInt(value);
  }

  public formatLabel(eventArgs: {sender: any; args: FormatLinearGraphLabelEventArgs}, graphModel: IBulletGraph) {
    eventArgs.args.label = ` ${eventArgs.args.label}`;
    if (eventArgs.args.value === 0) {
        if (graphModel.value >= 1000) {
          eventArgs.args.label = `${(graphModel.value / 1000).toFixed(1)}K`;
        } else {
          eventArgs.args.label = `${(graphModel.value / 1000)}`;
        }
    } else {
      eventArgs.args.label = `${Math.round((graphModel.value / eventArgs.args.value * 2) * 100)}%`;
    }
  }

  public alignLabel(eventArgs: {sender: any; args: AlignLinearGraphLabelEventArgs}) {
    eventArgs.args.height = 0;
    if (eventArgs.args.value === 0) {
      eventArgs.args.offsetX += 25;
    } else {
      eventArgs.args.offsetX -= 25;
    }
  }
}
