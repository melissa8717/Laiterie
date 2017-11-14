/**
 * Created by cédric on 10/07/2017.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';
import {FactureService} from "../_services/facture.service";
import { RecherchefacturationComponent} from "./recherchefact.component";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'listefacture.component.html'
})

export class ListefactureComponent {
    model: any = {};
    fact: any[] = [];
    contact: number;
    nom: string;
    facture: number;
    devis: number;
    eche: string;
    montant: number;
    dates: string;
    statut: string;
    n_situation:number;
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};

    list: any = [];

    @ViewChild('recherche')
    recherche: RecherchefacturationComponent;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private factureService: FactureService,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loaddroituser();
        this.loadAllFacture();
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    loadAllFacture() {
        console.log(this.fact)
        this.factureService.getAllFacture().subscribe(fact => {

            this.fact = fact;
            console.log(this.fact);
            this.filtre(this.recherche.seek)

        });
    }

    filtre(test: any) {
        if (test.nom) {
            this.fact =
                this.fact.filter(function (el: any) {
                    return ((el.nom ? el.nom : "").toLowerCase().indexOf(test.nom.toLowerCase()) !== -1 );
                });
        }
        if (test.contact) {
            this.fact =
                this.fact.filter(function (el) {
                    return (el.contact === test.contact );
                });
        }
        if (test.dates) {
            this.fact =
                this.fact.filter(function (el) {
                    console.log(new Date(el.dates).toDateString())
                    console.log(new Date(test.dates).toDateString())
                    return (new Date(el.dates).toDateString() === new Date(test.dates).toDateString() );
                });
        }
        if (test.eche) {
            this.fact =
                this.fact.filter(function (el) {
                    console.log(new Date(el.eche).toDateString())
                    console.log(new Date(test.eche).toDateString())
                    return (new Date(el.eche).toDateString() === new Date(test.eche).toDateString() );
                });
        }
        if (test.facture) {
            this.fact =
                this.fact.filter(function (el) {
                    return (el.facture === test.facture );
                });
        }
        if (test.devis) {
            this.fact =
                this.fact.filter(function (el) {
                    return (el.devis === test.devis );
                });
        }
        if (test.statut) {
            this.fact =
                this.fact.filter(function (el: any) {
                    return ((el.statut ? el.statut : "").toLowerCase().indexOf(test.statut.toLowerCase()) !== -1 );
                });
        }


    }
}
