import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { IRangeData } from '../models/range';
import { convertToInt } from '../utils';

class TrendIndicator {
  sessions: any;
  conversions: any;
  spend: any;
  conversionCosts: any;
  constructor() {
    this.sessions = undefined;
    this.conversions = undefined;
    this.spend = undefined;
    this.conversionCosts = undefined;
  }
}

interface ITrendItem {
  name: string;
  end: string;
  start: string;
  percent: number;
  direction: string;
  directionColor: string;
  endRes: string;
}

@Component({
  selector: 'app-current-trend',
  templateUrl: './current-trend.component.html',
  styleUrls: ['./current-trend.component.scss']
})
export class CurrentTrendComponent implements OnInit {

  status: string;
  public trendItems: ITrendItem[] = [];
  constructor(private service: DataService) {

  }
  public trendIndicators = [
    { period: 'start', indicator: new TrendIndicator() },
    { period: 'end', indicator: new TrendIndicator() }];

  ngOnInit() {
    this.service.onDataFetch.subscribe((data: IRangeData) => {
      this.trendItems = [];
      this.initTrendIndicators(data);
      ['sessions', 'conversions', 'spend', 'conversionCosts'].forEach(item => {
        if (item === 'spend' || item === 'conversionCosts') {
          this.generateTrendItems(item, data, true);
        } else {
          this.generateTrendItems(item, data);
        }
      });
      this.setStatus();
    });
    console.log(this.trendItems);
  }

  private setStatus(): void {
    const previous = this.trendIndicators[0].indicator;
    const current = this.trendIndicators[1].indicator;

    if (current.conversions > previous.conversions &&
      current.conversionCosts < previous.conversionCosts) {
      this.status = 'positive';
    } else if (current.conversions === previous.conversions &&
      current.conversionCosts === previous.conversionCosts) {
      this.status = 'neutral';
    } else {
      this.status = 'negative';
    }
  }

  private initTrendIndicators(data: IRangeData) {
    this.trendIndicators.forEach(item => {
      Object.keys(item.indicator).forEach(key => {
        item.indicator[key] = parseInt(data[item.period][key].replace(/,/g, ''));
      });
    });
  }

  private generateTrendItems(inditicatorName: string, data: IRangeData, invertStyleRule?: boolean) {
    const endString = data.end[inditicatorName];
    const end = convertToInt(endString);
    const startString = data.start[inditicatorName];
    const start = convertToInt(startString);
    const change = end - start;
    const isPositiveChange = change >= 0;
    const dec = change / start;
    const percent = Math.abs(Math.round(dec * 100));


    let direction = 'down';
    let endRes = 'danger';

    if (isPositiveChange) {
      direction = 'up';
      endRes = 'success';
    }

    if (percent === 0) {
      direction = '';
      endRes = '';
    }


    if (invertStyleRule) {
      endRes = (endRes === 'success') ? 'danger' : 'success';
    }

    let directionColor = 'success';
    if (direction === 'up') {
      directionColor = 'success';
    } else {
      directionColor = 'danger';
    }

    if (invertStyleRule) {
      if (direction === 'up') {
        directionColor = 'danger';
      } else {
        directionColor = 'success';
      }
    }

    this.trendItems.push({
      name: inditicatorName,
      end: endString,
      start: startString,
      percent: percent,
      direction: direction,
      directionColor: directionColor,
      endRes: endRes
    });
  }

}
