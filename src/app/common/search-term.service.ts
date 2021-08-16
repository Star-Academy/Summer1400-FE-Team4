import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

// https://stackoverflow.com/a/46444867
@Injectable()
export class SearchTermService {
    current = new ReplaySubject<string>();
}
