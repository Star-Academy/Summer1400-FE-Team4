import { DurationPipe } from './duration.pipe';

describe('DurationPipe', () => {
    let durationPipe;

    it('should return minutes and seconds', function () {
        durationPipe = new DurationPipe();
        expect(durationPipe.transform(1800)).toEqual('30:00');
    });
});
