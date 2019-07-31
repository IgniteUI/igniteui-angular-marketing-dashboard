
export const IGX_DATE_PICKER_COMPONENT = 'IgxDatePickerComponentToken';

export interface IDatePicker {
    value: Date;
    mask: string;
    inputMask: string;
    rawDateString: string;
    dateFormatParts: any[];
    invalidDate: string;
}


const enum FormatDesc {
  Numeric = 'numeric',
  TwoDigits = '2-digit'
}

const enum DateParts {
  Day = 'day',
  Month = 'month',
  Year = 'year'
}

export class DatePickerUtil {
  private static readonly PROMPT_CHAR = '_';

  public static maskToPromptChars(mask: string): string {
    const result = mask.replace(/0|L/g, DatePickerUtil.PROMPT_CHAR);
    return result;
  }
  public static trimUnderlines(value: string): string {
    const result = value.replace(/_/g, '');
    return result;
  }

  public static addPromptCharsEditMode(dateFormatParts: any[], date: Date, inputValue: string): string {
    const dateArray = Array.from(inputValue);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < dateFormatParts.length; i++) {
        if (dateFormatParts[i].formatType === FormatDesc.Numeric) {
            if ((dateFormatParts[i].type === DateParts.Day && date.getDate() < 10)
                || (dateFormatParts[i].type === DateParts.Month && date.getMonth() + 1 < 10)) {
                dateArray.splice(dateFormatParts[i].position[0], 0, DatePickerUtil.PROMPT_CHAR);
                dateArray.join('');
            }
        }
    }
    return dateArray.join('');
}
}
