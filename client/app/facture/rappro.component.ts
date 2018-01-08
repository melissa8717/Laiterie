/**
 * Created by cédric on 15/08/2017.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';
import {FactureService} from "../_services/facture.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";



@Component({
    moduleId: module.id,
    templateUrl: 'rappro.component.html'
})

export class RapproComponent {

    model: any = {};
    id_factfour:number;
    bdc : any []=[];
    print: boolean = false;
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};
    my: Date = new Date();
    date: boolean = false;
    fact: any = [] = [];
    loading = false;
    id_fournisseur:number;
    list : any = []=[];


    monthArray: string[] = [

        "Janvier",
        "Fevrier",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Aout",
        "Septembre",
        "Octobre",
        "Novembre",
        "Decembre",
    ];




    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private factureService: FactureService,
                private _sanitizer: DomSanitizer,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.loadAllFournisseur();
        this.loaddroituser();

    }

    back() {
        this.my.setMonth(this.my.getMonth() - 1);
        this.loadAllFournisseur();
    }

    up() {
        this.my.setMonth(this.my.getMonth() + 1);
        this.loadAllFournisseur();
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    loadAllFournisseur() {

        console.log("load imp",this.my.getMonth() +1, this.my.getFullYear());
        this.date = false;

        this.factureService.getAllDiffFournisseur(this.my.getMonth() +1, this.my.getFullYear()).subscribe(
            data => {
                this.list = data;

                this.loading = false;
                console.log("TSS"+this.list);
            },
            err => {
                this.alertService.error("ssssImpossible de charger les factures fournisseurs, veuillez réessayer ultérieurement");
                this.loading = false;
            }
        );
    };




    imprimer(){
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            window.print();
            this.print = false;
        }, 1000);
    }




}