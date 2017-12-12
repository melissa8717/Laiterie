import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ChantierService, ParamsService} from "../_services/index";
import {User} from "../_models/user";


@Component({
    moduleId: module.id,
    templateUrl: 'gestionproj.component.html'
})

export class GestionprojComponent implements OnInit {

    private currentUser: User;
    private droitsuser: any = {};
    private model: any = {};
    private id_chantier: number;

    constructor(private route: ActivatedRoute,
                private chantierService: ChantierService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loaddroituser();

        this.route.params.subscribe(params => {
            this.id_chantier = params['id_chantier'];
            this.chantierService.getByIdTout(this.id_chantier).subscribe(data => {
                this.model = data[0];
            });
        });
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }
}












