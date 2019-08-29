import { Component, OnInit, Input } from '@angular/core';
import { setTitle } from '../utils';
import { LocalizationService } from '../localization.service';
@Component({
  selector: 'app-trend-item',
  templateUrl: './trend-item.component.html',
  styleUrls: ['./trend-item.component.scss']
})
export class TrendItemComponent {

  constructor() { }
  @Input()
  public end: string;

  @Input()
  public start: string;

  @Input()
  public percent: number;

  @Input()
  public direction: number;

  @Input()
  public name: string;

  @Input()
  public directionColor: string;

  @Input()
  public endRes: string;

  @Input()
  public prevString: string;

  @Input()
  public currentString: string;

}
