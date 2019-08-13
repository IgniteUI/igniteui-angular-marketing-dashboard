import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { IRangeData } from '../models/range';
import { convertToInt } from '../utils';
import { generateTrendItem, ITrendItem } from '../models/trend-item';

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
          this.trendItems.push(generateTrendItem(item, data, true));
        } else {
          this.trendItems.push(generateTrendItem(item, data));
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
}
