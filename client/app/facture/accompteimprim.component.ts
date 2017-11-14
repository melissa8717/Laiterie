/**
 * Created by cédric on 17/07/2017.
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';
import {FactureService} from "../_services/facture.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'accompteimprim.component.html'
})

export class AccompteimprimComponent {
    currentUser: User;
    droitsuser:any={};
    _id:any;
    data:any={};

    model: any = {};
    pourcentage: number;
    id_facture: number;
    n_situation: number;
    fact: any = {};
    situa: any[] = [];
    libelle: string;
    id_produit: number;
    totalsit: any = {};
    valeur: any = {};
    accompte_value: number;
    option: any[] = [];
    montant_ht: number;
    optsit: any = {};
    remise: number;
    print: boolean = false;
    showHide = true;
    style: any [] = [];
    accomp: any = {};
    acco: any = {};



    //print: boolean = false;


    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private factureService: FactureService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.loadAllFooter();
        this.loadModif();
        this.loadAcco();
        this.loadValeur();


    }
    loadAllFooter() {
        //console.log(this.recherche.seek)

        this.factureService.getAllFooter().subscribe(data => {
            this.fact = data[0];
            //console.log(this.fact);

        });
    }



    loadModif() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture']
            this.n_situation = params['n_situation']
            console.log(this.id_facture);
            this.factureService.getByIdModif(this.id_facture,this.n_situation).subscribe(
                data => {
                    this.model = data[0];
                    console.log(this.model)
                }
            )
        });
    }



    loadAcco() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture']
            this.n_situation = params['n_situation']
            console.log(this.id_facture, this.n_situation);
            this.factureService.getByIdAcopmte(this.id_facture, this.n_situation).subscribe(
                data => {
                    this.acco = data[0];
                    //console.log(this.acco);
                    //console.log(data);
                }
            )
        });
    }



    loadValeur() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture']
            //console.log(this.id_facture);
            this.factureService.getByIdValeur(this.id_facture).subscribe(
                data => {
                    this.valeur = data[0];
                    console.log(data)
                }
            )
        });
    }





    imprimer() {
        this.alertService.clear();
        var css = '@page ',
            pageFooter = document.getElementById('pageFooter');


        this.print = true;
        setTimeout(() => {

            window.print();
            this.print = false;
        }, 1000);
    }


}