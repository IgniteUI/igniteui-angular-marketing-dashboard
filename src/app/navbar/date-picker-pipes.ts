import { PipeTransform, Pipe, Inject } from '@angular/core';
import { DatePickerUtil,  IGX_DATE_PICKER_COMPONENT, IDatePicker } from './date-picker.utils';

@Pipe({
    name: 'displayValue'
})
export class DatePickerDisplayValuePipe implements PipeTransform {
    // tslint:disable-next-line: variable-name
    constructor(@Inject(IGX_DATE_PICKER_COMPONENT) private _datePicker: IDatePicker) { }
    transform(value: any, args?: any): any {
        if (value !== '') {
            if (value === DatePickerUtil.maskToPromptChars(this._datePicker.inputMask)) {
                return '';
            }
            this._datePicker.rawDateString = value;
            return DatePickerUtil.trimUnderlines(value);
        }
        return '';
    }
}

@Pipe({
    name: 'inputValue'
})
export class DatePickerInputValuePipe implements PipeTransform {
    // tslint:disable-next-line: variable-name
    constructor(@Inject(IGX_DATE_PICKER_COMPONENT) private _datePicker: IDatePicker) { }
    transform(value: any, args?: any): any {
        if (this._datePicker.invalidDate !== '') {
            return this._datePicker.invalidDate;
        } else {
            if (this._datePicker.value === null || this._datePicker.value === undefined) {
                return DatePickerUtil.maskToPromptChars(this._datePicker.inputMask);
            } else {
                return DatePickerUtil.addPromptCharsEditMode(this._datePicker.dateFormatParts, this._datePicker.value, value);
            }
        }
    }
}
