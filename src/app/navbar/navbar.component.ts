import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {dateRangeEqualize, getDays} from '../../app/utils';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public dateSelection: FormGroup;
  public today = new Date();
  public startRangeBegin: Date;
  public startRangeEnd: Date;
  public endRangeBegin: Date;
  public endRangeEnd: Date;

  constructor() {

    this.startRangeBegin = new Date(this.today.getFullYear() - 2 , this.today.getMonth(), this.today.getDate());
    this.startRangeEnd = new Date(this.today.getFullYear() - 1 , this.today.getMonth(), this.today.getDate());
    this.endRangeBegin = new Date(this.today.getFullYear() - 1 , this.today.getMonth(), this.today.getDate());
    this.endRangeEnd = this.today;

   }

  public text1 = 'select range';
  public text2 = 'range of days';

  public ranges = [
      {text: '1 week'},
      {text: '1 month'},
      {text: '3 months'},
      {text: '1 year'}];

  public updateDates(range: string ) {
    switch (range) {
      case '1 week':
          this.endRangeBegin = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 7);
          this.startRangeEnd = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 7);
          this.startRangeBegin = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 14);

          break;
      case '1 month':
          this.endRangeBegin = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - getDays(this.today, 1));
          this.startRangeEnd = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - getDays(this.today, 1));
          // tslint:disable-next-line: max-line-length
          this.startRangeBegin = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - getDays(this.today, 2));

          break;
      case '3 months':
          this.endRangeBegin = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - getDays(this.today, 3));
          this.startRangeEnd = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - getDays(this.today, 3));
          // tslint:disable-next-line: max-line-length
          this.startRangeBegin = new Date(this.today.getFullYear(), this.startRangeEnd.getMonth(), this.startRangeEnd.getDate() - getDays(this.startRangeEnd, 3));

          break;
      case '1 year':
          this.endRangeBegin = new Date(this.today.getFullYear() - 1, this.today.getMonth(), this.today.getDate());
          this.startRangeEnd = new Date(this.today.getFullYear() - 1 , this.today.getMonth(), this.today.getDate());
          this.startRangeBegin = new Date(this.today.getFullYear() - 2, this.today.getMonth(), this.today.getDate());
          break;
}
  }

  ngOnInit() {
  }

}
