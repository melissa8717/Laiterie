import {Component, Input, OnInit} from '@angular/core';


@Component({
    moduleId: module.id,
    selector: 'my-header',
    templateUrl: 'header.component.html'
})

export class HeaderComponent {

    @Input() title: string = 'NO TITLE';
    @Input() img: string = 'image/menu/gestion_grand_gris.png';

    constructor() {
    }

}