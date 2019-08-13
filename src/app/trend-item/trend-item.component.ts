import { Component, OnInit, Input } from '@angular/core';
import { setTitle } from '../utils';
@Component({
  selector: 'app-trend-item',
  templateUrl: './trend-item.component.html',
  styleUrls: ['./trend-item.component.scss']
})
export class TrendItemComponent implements OnInit {

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

  ngOnInit() {
    if (this.shouldSetTitle(this.name)) {
      this.name = setTitle(this.name);
    }
  }

  private shouldSetTitle(name: string): boolean {
    if (name) {
      const temp = name.match(/[A-Z]{1,}/g);
      if (temp) {
        return true;
      }
    }
    return false;
  }

}
