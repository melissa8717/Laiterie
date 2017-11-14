import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService} from '../_services/index';
import {ChantierService} from "../_services/chantier.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";                      //


@Component({
    moduleId: module.id,
    templateUrl: 'photochantier.component.html'
})

export class PhotochantierComponent {
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};               //
    id_chantier: number;
    nom : any = {};

    constructor(private route: ActivatedRoute,
                private router: Router,
                private chantierService: ChantierService,
                private alertService: AlertService,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }


    ngOnInit() {

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";

        this.loadNom();
        this.loaddroituser();

    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    loadNom(){
        this.route.params.subscribe(Params => {
            this.id_chantier=Params['id_chantier'];
            console.log(this.id_chantier);
            this.chantierService.getByIdNom(this.id_chantier).subscribe(
                data=>{
                    this.nom=data[0];
                    console.log(data)
                }
            )
        });
    }
}