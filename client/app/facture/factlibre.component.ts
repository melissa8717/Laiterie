/**
 * Created by cédric on 17/07/2017.
 */
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
    templateUrl: 'factlibre.component.html'
})

export class FactlibreComponent {

    currentUser: User;
    droitsuser: any = {};
    _id: any;
    data: any = {};

    nfact: any = {};
    pourcentage: number;
    id_facture: number;
    n_situation: number;
    fact: any = {};

    print: boolean = false;

    style: any [] = [];
    model: any = {};
    base: any [] = [];
    detail: any [] = [];


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
        this.loadAllNfact();
        this.loaddroituser();
        this.loadModif();
        this.loadBase();
        this.loadDetail();

    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

        });
    }

    loadAllFooter() {

        this.factureService.getAllFooter().subscribe(fact => {
            this.fact = fact[0];

        });
    }

    loadAllNfact() {

        this.factureService.getAllnfact().subscribe(data => {
            this.nfact = data[0];

        });
    }

    loadModif() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture'];
            this.n_situation = params['n_situation'];
            this.factureService.getByIdLibreModif(this.id_facture,this.n_situation).subscribe(
                data => {
                    this.model = data[0];
                    console.log(this.model)
                }
            )
        });
    }

    loadBase() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture'];
            this.n_situation = params['n_situation'];
            this.factureService.getByIdLibrebase(this.id_facture,this.n_situation).subscribe(
                data => {
                    this.base = data;
                }
            )
        });
    }

    loadDetail() {
        this.route.params.subscribe(params => {

            this.id_facture = params['id_facture'];
            this.n_situation = params['n_situation'];
            this.factureService.getByIdLibredetail(this.id_facture,this.n_situation).subscribe(
                data => {
                    this.detail = data;
                }
            )
        });
    }

    totaligne(bases: any) {
        if (bases.pourcent)
            return bases.qte_fact  * bases.prix_fact * (bases.pourcent/100);
        else return 0;
    }

    totaligndet(details: any) {
        if (details.pourcent)
            return details.qteprod  * details.prix_prod * (details.pourcent/100);
        else return 0;
    }

    totalbase(){
        let total = 0;

        for (let bases of this.base) {
            total += bases.qte_fact  * bases.prix_fact ;
        }
        return total;
    }

    totaldetail(){
        let total = 0;

        for (let details of this.detail) {
            total += details.qteprod  * details.prix_prod ;
        }
        return total;
    }


    counttotalbase(){
        let total = 0;

        for (let bases of this.base) {
            total += bases.qte_fact  * bases.prix_fact * (bases.pourcent/100);
        }
        return total;
    }

    counttotaldetail(){
        let total = 0;

        for (let details of this.detail) {
            total += details.qteprod  * details.prix_prod * (details.pourcent/100);
        }
        return total;
    }

    totalfacture(){
        return ((this.totalbase() ? this.totalbase() : 0) + (this.totaldetail() ? this.totaldetail() : 0 )) * (1-(this.model.remise ? (this.model.remise /100 ):1) );
    }

    countTotals() {
        return (this.counttotalbase() + this.counttotaldetail()) * (1-(this.model.remise ? (this.model.remise/100) : 1));
    }

    countRemise() {
        return this. countTotals() * ((this.model.remise ? (this.model.remise / 100) : 1) );
    }

    /*countTotalNet(){
        return this.countTotals();
    }*/

}