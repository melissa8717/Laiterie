/**
 * Created by cédric on 26/06/2017.
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';
import {AchatsService} from "../_services/achats.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'etatstock.component.html'
})

export class EtatstockComponent  {
    model: any = {};
    libelle:string;
    fournisseur:string;
    stock:number;
    stockmini:number;
    stockmaxi:number;
    id_produit:number;

    print: boolean = false;

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};



    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private achatsService:AchatsService,
        private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllStock();
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loaddroituser();

    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    loadAllStock() {

        //console.log(currentUser._id);
        this.achatsService.getAllStock().subscribe(stock => {

            this.stock = stock;
            console.log(this.stock);

        });
    }

    Stockclick(id_produit:number){
        this.id_produit = id_produit;
        console.log(this.id_produit);
        var test = +prompt("Entrez le stock réel :");
        if(test){
            this.achatsService.getStockclick(this.id_produit, test)
                .subscribe(
                    data => {
                        this.alertService.success('Bien modifié', true);
                        this.loadAllStock();

                    },
                    err => {
                        this.alertService.error(err._body);

                    });
        }


    }
    /*test(id_produit:number){
        this.id_produit = id_produit;
        console.log(this.id_produit);
    }*/

    imprimer(){
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            window.print();
            this.print = false;
        }, 1000);
    }
    }

