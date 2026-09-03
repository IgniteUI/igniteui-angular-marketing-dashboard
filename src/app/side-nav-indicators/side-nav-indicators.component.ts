import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { IgxButtonDirective, IgxIconButtonDirective } from 'igniteui-angular/directives';
import { IgxIconComponent } from 'igniteui-angular/icon';
import { IGX_LIST_DIRECTIVES } from 'igniteui-angular/list';
import { IGX_CARD_DIRECTIVES } from 'igniteui-angular/card';
import { IgxDialogComponent } from 'igniteui-angular/dialog';
import { DataService } from '../data.service';
import { LocalizationService, ResourceKey } from '../localization.service';
import { TrendField } from '../models/range';
import { ITrendItem, generateTrendItem } from '../models/trend-item';
import { TrendItemComponent } from '../trend-item/trend-item.component';

const TREND_ITEMS: readonly { valueP: TrendField; labelP: ResourceKey }[] = [
  { valueP: 'referringDomains', labelP: 'Referring_Domains' },
  { valueP: 'brandedSearches', labelP: 'Branded_Searches' },
  { valueP: 'onlineSales', labelP: 'Online_Sales' },
  { valueP: 'socialTrend', labelP: 'Social_Trend' }
];

@Component({
  selector: 'app-side-nav-indicators',
  templateUrl: './side-nav-indicators.component.html',
  styleUrl: './side-nav-indicators.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UpperCasePipe,
    TrendItemComponent,
    IgxButtonDirective,
    IgxIconButtonDirective,
    IgxIconComponent,
    IgxDialogComponent,
    IGX_LIST_DIRECTIVES,
    IGX_CARD_DIRECTIVES
  ]
})
export class SideNavIndicatorsComponent {
  private readonly service = inject(DataService);

  public readonly resources = inject(LocalizationService).resources;

  /** Drives the info dialog declaratively so it stays correct without zone.js. */
  public readonly infoOpen = signal(false);

  public readonly trendItems = computed<ITrendItem[]>(() => {
    const data = this.service.summary();
    if (!data) {
      return [];
    }
    return TREND_ITEMS.map(item => generateTrendItem(item.valueP, data, item.labelP));
  });

  /** Current-period keywords paired with the matching previous-period keyword. */
  public readonly keywords = computed(() => {
    const data = this.service.summary();
    if (!data) {
      return [];
    }
    return data.end.keywords.map((end, index) => ({
      end,
      start: data.start.keywords[index] ?? ''
    }));
  });
}
