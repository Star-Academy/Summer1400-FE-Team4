import { PersianNumeralPipe } from './persian-numeral.pipe';

describe('PersianNumeralPipe', () => {
    let persianNumeralPipe = new PersianNumeralPipe();
    it('should convert english numbers to persian numbers', () => {
        expect(persianNumeralPipe.transform(5)).toEqual('۵');
    });
});
