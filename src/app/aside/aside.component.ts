import { Component, OnInit } from '@angular/core';
import { AuthService } from '../common';

@Component({
    selector: 'app-aside',
    templateUrl: './aside.component.html',
    styleUrls: ['./aside.component.scss'],
})
export class AsideComponent implements OnInit {
    constructor(public auth: AuthService) {}

    ngOnInit(): void {}
}
