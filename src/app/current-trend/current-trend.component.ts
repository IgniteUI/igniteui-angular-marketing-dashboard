import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { IgxIconComponent } from 'igniteui-angular/icon';
import { DataService } from '../data.service';
import { LocalizationService, ResourceKey } from '../localization.service';
import { TrendField } from '../models/range';
import { ITrendItem, generateTrendItem } from '../models/trend-item';
import { convertToInt } from '../utils';
import { TrendItemComponent } from '../trend-item/trend-item.component';

type TrendStatus = 'positive' | 'neutral' | 'negative';

interface ITrendDescriptor {
  valueP: TrendField;
  labelP: ResourceKey;
  /** Costs invert the styling: going up is bad news. */
  invert?: boolean;
}

const TREND_ITEMS: readonly ITrendDescriptor[] = [
  { valueP: 'sessions', labelP: 'Sessions' },
  { valueP: 'conversions', labelP: 'Conversions' },
  { valueP: 'spend', labelP: 'Spend', invert: true },
  { valueP: 'conversionCosts', labelP: 'Conversion_Costs', invert: true }
];

@Component({
  selector: 'app-current-trend',
  templateUrl: './current-trend.component.html',
  styleUrl: './current-trend.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UpperCasePipe, IgxIconComponent, TrendItemComponent]
})
export class CurrentTrendComponent {
  private readonly service = inject(DataService);

  public readonly resources = inject(LocalizationService).resources;

  public readonly trendItems = computed<ITrendItem[]>(() => {
    const data = this.service.summary();
    if (!data) {
      return [];
    }
    return TREND_ITEMS.map(item => generateTrendItem(item.valueP, data, item.labelP, item.invert));
  });

  public readonly status = computed<TrendStatus>(() => {
    const data = this.service.summary();
    if (!data) {
      return 'neutral';
    }

    const previousConversions = convertToInt(data.start.conversions);
    const currentConversions = convertToInt(data.end.conversions);
    const previousCosts = convertToInt(data.start.conversionCosts);
    const currentCosts = convertToInt(data.end.conversionCosts);

    if (currentConversions > previousConversions && currentCosts < previousCosts) {
      return 'positive';
    }
    if (currentConversions === previousConversions && currentCosts === previousCosts) {
      return 'neutral';
    }
    return 'negative';
  });

  public readonly statusIcon = computed(() => {
    switch (this.status()) {
      case 'positive':
        return 'sentiment_very_satisfied';
      case 'negative':
        return 'sentiment_very_dissatisfied';
      default:
        return 'sentiment_neutral';
    }
  });
}
