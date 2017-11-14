/**
 * Created by cédric on 14/08/2017.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';
import {FactureService} from "../_services/facture.service";
import { RecherchefournisseurComponent} from "./rechercherfournisseur.component";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'listefacturefournisseur.component.html'
})

export class ListefacturefournisseurComponent {

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};

    fact: any = [];
    date: boolean = false;

    list: any = [];

    loading = false;
    my: Date = new Date();
    datefourn: string;
    print: boolean = false;


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


    @ViewChild('recherche')
    recherche: RecherchefournisseurComponent;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private factureService: FactureService,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.my.setMonth(this.my.getMonth());
        this.loadMois();
        this.loaddroituser();

    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    back() {
        this.my.setMonth(this.my.getMonth() - 1);
        this.loadMois();
    }

    up() {
        this.my.setMonth(this.my.getMonth() + 1);
        //console.log(this.my);
        this.loadMois();
    }


    loadMois() {

        this.date = false;
        this.factureService.getAllMois(this.my.getMonth() + 1, this.my.getFullYear()).subscribe(
            data => {
                this.fact = data;
                this.filtre(this.recherche.seek);
                this.loading = false;
                console.log(this.fact)
            },
            err => {
                this.alertService.error("Impossible de charger les factures fournisseurs, veuillez réessayer ultérieurement");
                this.loading = false;
            }
        );
    }

    filtre(test: any) {
        if (test.nom) {
            this.fact =
                this.fact.filter(function (el: any) {
                    return ((el.nom ? el.nom : "").toLowerCase().indexOf(test.nom.toLowerCase()) !== -1 );
                });
        }


        if (test.datefourn) {
                this.fact =
                    this.fact.filter(function (el:any) {
                        console.log(new Date(el.datefourn).toDateString())
                        console.log(new Date(test.datefourn).toDateString())
                        return (new Date(el.datefourn).toDateString() === new Date(test.datefourn).toDateString() );
                    });
            }

            if (test.n_facture) {
                this.fact =
                    this.fact.filter(function (el: any) {
                        return ((el.n_facture ? el.n_facture : "").toLowerCase().indexOf(test.n_facture.toLowerCase()) !== -1 );
                    });

            }

        }

    imprimer(){
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            window.print();
            this.print = false;
        }, 1000);
    }
}

