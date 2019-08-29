import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { generateTrendItem, ITrendItem } from '../models/trend-item';
import { IRangeData } from '../models/range';
import { LocalizationService } from '../localization.service';

@Component({
  selector: 'app-side-nav-indicators',
  templateUrl: './side-nav-indicators.component.html',
  styleUrls: ['./side-nav-indicators.component.scss']
})
export class SideNavIndicatorsComponent implements OnInit {

  constructor(private service: DataService, private localeService: LocalizationService) {
    this.resources = this.localeService.getLocale();

    this.trendItemData = [
      {valueP: 'referringDomains', labelP: 'Referring_Domains'},
      {valueP: 'brandedSearches', labelP: 'Branded_Searches'},
      {valueP: 'onlineSales',  labelP: 'Online_Sales'},
      {valueP:  'socialTrend',  labelP: 'Social_Trend'}];

  }
  public trendItemData = [];
  public trendItems: ITrendItem[] = [];
  public endKeywords: string[] = [];
  public startKeywords: string[] = [];
  public resources;

  ngOnInit() {
    this.localeService.languageLocalizer.subscribe( resources => {
      this.resources = resources;
    });

    this.service.onDataFetch.subscribe((data: IRangeData) => {
      this.trendItems = [];
      this.endKeywords = [];
      this.startKeywords = [];
      this.trendItemData.forEach(item => {
          this.trendItems.push(generateTrendItem(item.valueP, data, item.labelP));
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
