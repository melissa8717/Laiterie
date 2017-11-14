import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';
import {FactureService} from "../_services/facture.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {FormBuilder} from "@angular/forms";
import {RechercheavoirComponent} from "./rechercheavoir.component";

@Component({
    moduleId: module.id,
    templateUrl: 'listeavoir.component.html'
})

export class ListeavoirComponent {

    currentUser: User;
    droitsuser: any = {};
    _id: any;                   //
    data: any = {};
    avoir:any[]=[];

    list: any = [];

    @ViewChild('recherche')
    recherche: RechercheavoirComponent;


    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private factureService: FactureService,
                private builder: FormBuilder,
                private _sanitizer: DomSanitizer,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loaddroituser();
        this.loadAllAvoir();


    }


    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            //console.log(this.data);
            //console.log(this.currentUser._id);

        });
    }


    loadAllAvoir() {

        this.factureService.getAllListavoir().subscribe(avoir => {
            this.avoir = avoir;
            console.log(this.avoir);
            this.filtre(this.recherche.seek)
        });
    }


    filtre(test: any) {
        if (test.nom) {
            this.avoir =
                this.avoir.filter(function (el: any) {
                    return ((el.nom ? el.nom : "").toLowerCase().indexOf(test.nom.toLowerCase()) !== -1 );
                });
        }
        if (test.id_avoir) {
            this.avoir =
                this.avoir.filter(function (el) {
                    return (el.id_avoir === test.id_avoir );
                });
        }
        if (test.date_avoir) {
            this.avoir =
                this.avoir.filter(function (el) {
                    //console.log(new Date(el.dates).toDateString())
                    //console.log(new Date(test.dates).toDateString())
                    return (new Date(el.date_avoir).toDateString() === new Date(test.date_avoir).toDateString() );
                });
        }
        if (test.nfactclient) {
            this.avoir =
                this.avoir.filter(function (el) {
                    return (el.nfactclient === test.nfactclient );
                });
        }
        if (test.n_situation) {
            this.avoir =
                this.avoir.filter(function (el) {
                    return (el.n_situation === test.n_situation );
                });
        }
        if (test.raison_sociale) {
            this.avoir =
                this.avoir.filter(function (el: any) {
                    return ((el.raison_sociale ? el.raison_sociale : "").toLowerCase().indexOf(test.raison_sociale.toLowerCase()) !== -1 );
                });
        }

    }



}