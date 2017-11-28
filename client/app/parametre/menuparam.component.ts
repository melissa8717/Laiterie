import {Component} from "@angular/core";
import {User} from '../_models/user';
import {ActivatedRoute} from '@angular/router';


@Component({
    moduleId: module.id,
    selector: "menu-param",
    templateUrl: 'menuparam.component.html'
})

export class MenuparamComponent {

    currentUser:User;

    constructor(private route: ActivatedRoute) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.route.url.subscribe(url => {
            let interval = setInterval(() => {
                let elem = document.getElementById(url[0].path);
                if (elem) {
                    elem.setAttribute("class", "active");
                    clearInterval(interval);
                }
            }, 250);
        });
    }
}