import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'persianNumeral' })
export class PersianNumeralPipe implements PipeTransform {
    private equ: { [key: string]: string } = {
        '0': '۰',
        '1': '۱',
        '2': '۲',
        '3': '۳',
        '4': '۴',
        '5': '۵',
        '6': '۶',
        '7': '۷',
        '8': '۸',
        '9': '۹',
    };

    transform(value: number | string | null | undefined): string | null | undefined {
        if (value === null || value === undefined) return value;

        if (typeof value === 'number') value = value.toString();

        return value.replace(/[0-9]/g, (match) => this.equ[match]);
    }
}
