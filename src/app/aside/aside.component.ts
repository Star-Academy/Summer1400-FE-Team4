import { Component } from '@angular/core';
import { AuthService } from '../common';

@Component({
    selector: 'app-aside',
    templateUrl: './aside.component.html',
    styleUrls: ['./aside.component.scss'],
})
export class AsideComponent {
    constructor(public auth: AuthService) {}
}
