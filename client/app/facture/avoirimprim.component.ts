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
    libre:any[]=[];



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
        this.loadlibre();

    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }

    loadAllFooter() {

        this.factureService.getAllFooter().subscribe(fact => {
            this.fact = fact[0];

        });
    }

    loadAvoir() {
        this.route.params.subscribe(params => {
            this.id_avoir = params['id_avoir']
            this.factureService.getByIdAvoir(this.id_avoir).subscribe(
                data => {
                    this.valeur = data[0];
                    console.log(data);
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

    loadlibre() {
        this.route.params.subscribe(params => {
            this.id_avoir = params['id_avoir']
            this.factureService.getByIdPeodavlibre(this.id_avoir).subscribe(
                data => {
                    this.libre = data;
                    console.log(data)
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

    countTotallibre() {
        let total = 0;
        for (let prod of this.libre) {
            total += prod.prix * prod.qte;
        }
        return total;
    }

    countTotallibreremise() {
        let total = 0;
        for (let prod of this.libre) {
            total += prod.prix * prod.qte* (this.valeur.remise ? (1-(this.valeur.remise/100)) :1);
        }
        return total;
    }
    countTva(){
        return this.countTotalProduit() *(this.valeur.tva /100);
    }


    TVAV()
    {
        let total = 0;

        for (let produit of this.libre) {

            if (produit.tva == 20){
                total += (produit.prix * produit.qte *  (this.valeur.remise ? (1-(this.valeur.remise / 100)) : 1) )* (produit.tva /100);
            }

        }
        return total;
    }

    TVAD()
    {
        let total = 0;

        for (let produit of this.libre) {

            if (produit.tva == 10){
                total += (produit.prix * produit.qte *  (this.valeur.remise ? (1-(this.valeur.remise / 100)) : 1) )* (produit.tva /100);
            }

        }
        return total;
    }
    TVAC()
    {
        let total = 0;

        for (let produit of this.libre) {

            if (produit.tva == 5.5){
                total += (produit.prix * produit.qte *  (this.valeur.remise ? (1-(this.valeur.remise / 100)) : 1) )* (produit.tva /100);
            }

        }
        return total;
    }

    TVADU()
    {
        let total = 0;

        for (let produit of this.libre) {

            if (produit.tva == 2.1){
                total += (produit.prix * produit.qte *  (this.valeur.remise ? (1-(this.valeur.remise / 100)) : 1) )* (produit.tva /100);
            }

        }
        return total;
    }
    TVAZ()
    {
        let total = 0;

        for (let produit of this.libre) {

            if (produit.tva == 0){
                total += (produit.prix * produit.qte *  (this.valeur.remise ? (1-(this.valeur.remise / 100)) : 1) );
            }

        }
        return total;
    }

    countTotalavoir(){
        return this.countTotalProduit() + this.countTotallibreremise() +this.countTva()+ this. TVAV() +this.TVAD() + this.TVAC() +this.TVADU() +this.TVAZ();
    }
}