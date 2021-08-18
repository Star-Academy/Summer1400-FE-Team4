import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

// https://stackoverflow.com/a/46444867
@Injectable()
export class SharedCommonService {
    currentSearchTerm = new ReplaySubject<string>();
    topBarDark = new ReplaySubject<boolean>();

    constructor() {
        this.topBarDark.next(false);
    }
}
