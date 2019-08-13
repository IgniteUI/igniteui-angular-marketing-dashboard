import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { generateTrendItem, ITrendItem } from '../models/trend-item';
import { IRangeData } from '../models/range';

@Component({
  selector: 'app-side-nav-indicators',
  templateUrl: './side-nav-indicators.component.html',
  styleUrls: ['./side-nav-indicators.component.scss']
})
export class SideNavIndicatorsComponent implements OnInit {

  constructor(private service: DataService) { }
  public trendItems: ITrendItem[] = [];
  public endKeywords: string[] = [];
  public startKeywords: string[] = [];

  ngOnInit() {
    this.service.onDataFetch.subscribe((data: IRangeData) => {
      this.trendItems = [];
      this.endKeywords = [];
      this.startKeywords = [];
      ['referringDomains', 'brandedSearches', 'onlineSales', 'socialTrend'].forEach(item => {
          this.trendItems.push(generateTrendItem(item, data));
      });
      data.end.keywords.forEach(word => {
        this.endKeywords.push(word);
      });
      data.start.keywords.forEach(word => {
        this.startKeywords.push(word);
      });
    });
  }

}
