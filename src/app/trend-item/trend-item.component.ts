import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-trend-item',
  templateUrl: './trend-item.component.html',
  styleUrls: ['./trend-item.component.scss']
})
export class TrendItemComponent implements OnInit {

  constructor() { }
  @Input()
  public end: number;

  @Input()
  public start: number;

  @Input()
  public percent: number;

  @Input()
  public direction: number;

  @Input()
  public name: number;

  @Input()
  public directionColor: string;

  @Input()
  public endRes: string;

  ngOnInit() {

  }

}
