import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AlertService, ChantierService, ParamsService} from '../_services/index';
import {User} from "../_models/user";


@Component({
    moduleId: module.id,
    templateUrl: 'devischantier.component.html'
})

export class DevischantierComponent implements OnInit {
    id_chantier: number;
    chant: any = [] = [];
    nom: any = {};
    print: boolean = false;
    date: string;
    currentUser: User;
    droitsuser: any = {};
    _id: any;
    data: any = {};


    constructor(private route: ActivatedRoute,
                private chantierService: ChantierService,
                private alertService: AlertService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }


    ngOnInit() {
        this.loaddroituser();

        this.route.params.subscribe(Params => {
            this.id_chantier = Params['id_chantier'];

            this.loadNom();
            this.loadDevis();
        });

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }

    loadNom() {
        this.chantierService.getByIdNom(this.id_chantier).subscribe(data => {
            this.nom = data[0];
        })
    }

    loadDevis() {
        this.chantierService.getByIdDevischantier(this.id_chantier).subscribe(data => {
            this.chant = data;
        })
    }

    modify(chantierparams: any) {
        this.chantierService.updateDevischantier(chantierparams).subscribe(() => {
            this.alertService.success("Les données ont bien été modifiées.");
        });
    }

    imprimer() {
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            window.print();
            this.print = false;
        }, 1000);
    }
}