import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
    transform(total_seconds: number | null | undefined): string | null | undefined {
        if (total_seconds === null || total_seconds === undefined) return total_seconds;

        const minutes = Math.floor(total_seconds / 60).toString();
        const seconds = Math.floor(total_seconds % 60)
            .toString()
            .padStart(2, '0');
        return `${minutes}:${seconds}`;
    }
}
