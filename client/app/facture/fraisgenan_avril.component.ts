/**
 * Created by cédric on 15/08/2017.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';
import {FactureService} from "../_services/facture.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";


@Component({
    moduleId: module.id,
    templateUrl: 'fraisgenan_avril.component.html'
})

export class Fraisgenan_avrilComponent {

    date: boolean = false;
    loading = false;
    my: Date = new Date();
    chant: any []=[];
    prev : any []=[];
    print: boolean = false;

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};



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
        this.loadAnnee();
        this.loadYprev();
        this.loaddroituser();

    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    back(){
        this.my.setFullYear(this.my.getFullYear()-1);
        this.loadAnnee();
        this.loadYprev();
    }

    up(){
        this.my.setFullYear(this.my.getFullYear()+1);
        //console.log(this.my);
        this.loadAnnee();
        this.loadYprev();
    }

    loadAnnee() {

        this.date = false;
        this.factureService.getAllAnnee( this.my.getFullYear()).subscribe(
            data => {
                this.chant = data;
                this.loading= false;
                console.log(this.chant)
            },
            err =>{
                this.alertService.error("Impossible de charger les frais généraux, veuillez réessayer ultérieurement");
                this.loading= false;
            }
        );
    }

    loadYprev() {

        this.date = false;
        this.factureService.getAllYprev( this.my.getFullYear()).subscribe(
            data => {
                this.prev = data;
                this.loading= false;
                console.log(this.prev)
            },
            err =>{
                this.alertService.error("Impossible de charger les frais généraux, veuillez réessayer ultérieurement");
                this.loading= false;
            }
        );
    }

    countTotal(mois:number) {
        let total = 0;

        for (let chants of this.chant) {
            if (chants.mois == mois) {
                //console.log(chants.sum)
                total += chants.sum;

            }
        }
        return total;
    }

    countPrev(mois:number) {
        let total = 0;

        for (let prevs of this.prev) {
            if (prevs.mois == mois) {
                //console.log(prevs.montantprev)
                total += prevs.montantprev;

            }
        }
        return total;
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