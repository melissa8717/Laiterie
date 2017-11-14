import {Component} from "@angular/core";
import {ParamsService} from "../_services/params.service";
import {ChantierService} from "../_services/chantier.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    selector: "menu-chantier",
    templateUrl: 'menuchantier.component.html'
})

export class MenuchantierComponent {

    currentUser: User;
    droitsuser: any = {};
    id_chantier: number;
    model: any = {};


    constructor(private route: ActivatedRoute,
                private chantierService: ChantierService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });

        this.route.url.subscribe(url => {
            let interval = setInterval(() => {
                let elem = document.getElementById(url[0].path);
                if (elem) {
                    elem.setAttribute("class", "active");
                    clearInterval(interval);
                }
            }, 250);
        });

        this.route.params.subscribe(params => {
            this.id_chantier = params['id_chantier'];
            this.chantierService.getByIdTout(this.id_chantier).subscribe(
                data => {
                    this.model = data[0];
                }
            )
        })
    }
}