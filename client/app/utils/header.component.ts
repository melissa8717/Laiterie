import {Component, Input} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'my-header',
    templateUrl: 'header.component.html'
})

export class HeaderComponent {

    @Input() title: string;
    @Input() img: string;

    constructor() {
    }

}