import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';
import {FactureService} from "../_services/facture.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {FormBuilder} from "@angular/forms";

@Component({
    moduleId: module.id,
    templateUrl: 'avoirimprim.component.html'
})

export class AvoirimprimComponent {

    currentUser: User;
    droitsuser: any = {};
    _id: any;                   //
    data: any = {};

    valeur:any = {};
    id_avoir:number;
    fact: any = {};
    produit:any[]=[];



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
        this.loadAvoir();
        this.loadAllFooter();
        this.loadProduit();

    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }

    loadAllFooter() {

        this.factureService.getAllFooter().subscribe(fact => {
            this.fact = fact[0];
            //console.log(this.fact);

        });
    }

    loadAvoir() {
        this.route.params.subscribe(params => {
            this.id_avoir = params['id_avoir']
            this.factureService.getByIdAvoir(this.id_avoir).subscribe(
                data => {
                    this.valeur = data[0];
                    //console.log(data)
                }
            )
        });
    }

    loadProduit() {
        this.route.params.subscribe(params => {
            this.id_avoir = params['id_avoir']
            this.factureService.getByIdPeodavoir(this.id_avoir).subscribe(
                data => {
                    this.produit = data;
                    //console.log(data)
                }
            )
        });
    }
    countTotalProduit() {
        let total = 0;
        for (let prod of this.produit) {
            total += prod.prixfact * prod.qtefact;
        }
        return total;
    }

    countTva(){
        return this.countTotalProduit() *(this.valeur.tva /100);
    }

    countTotalavoir(){
        return this.countTotalProduit() +this.countTva();
    }
}