import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// https://stackoverflow.com/a/46444867
@Injectable()
export class SharedCommonService {
    currentSearchTerm = new BehaviorSubject<string>('');
    topBarDark = new BehaviorSubject<boolean>(false);

    constructor() {
        this.topBarDark.next(false);
    }
}
