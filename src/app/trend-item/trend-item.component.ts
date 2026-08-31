import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { IgxDividerComponent } from 'igniteui-angular/directives';
import { IgxIconComponent } from 'igniteui-angular/icon';
import { IgxCardComponent, IgxCardContentDirective } from 'igniteui-angular/card';
import { Numeric } from '../models/range';
import { TrendDirection } from '../models/trend-item';

@Component({
  selector: 'app-trend-item',
  templateUrl: './trend-item.component.html',
  styleUrl: './trend-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UpperCasePipe, IgxCardComponent, IgxCardContentDirective, IgxIconComponent, IgxDividerComponent]
})
export class TrendItemComponent {
  public readonly end = input<Numeric>('');
  public readonly start = input<Numeric>('');
  public readonly percent = input(0);
  public readonly direction = input<TrendDirection | ''>('');
  public readonly name = input('');
  public readonly directionColor = input('');
  public readonly endRes = input('');
  public readonly prevString = input('');
  public readonly currentString = input('');
}
