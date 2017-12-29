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
    templateUrl: 'diff_fournisseur.component.html'
})

export class Diff_fournisseurComponent {

    model: any = {};
    id_factfour:number;
    bdc : any []=[];
    print: boolean = false;
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;
    data:any={};
    my: Date = new Date();
    date: boolean = false;
    fact: any = [];
    loading = false;
    diff:any[]=[];
    imp:any=[]=[];
    list: any[] = [];
    id_contact:number;
    id_fournisseur:number;






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



        this.loaddroituser();
        this.my.setMonth(this.my.getMonth());
        this.loadDiffBDC();
        this.loadAllDiffFournisseurImp();


    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

        });
    }





    back() {
        this.my.setMonth(this.my.getMonth() - 1);
        this.loadDiffBDC();
        this.loadAllDiffFournisseurImp();

    }

    up() {
        this.my.setMonth(this.my.getMonth() + 1);
        this.loadDiffBDC();
        this.loadAllDiffFournisseurImp();
    }

    loadDiffBDC() {
        this.route.params.subscribe(params => {
            this.id_fournisseur = params['id_contact'];
            //console.log("load",this.my.getMonth() +1, this.my.getFullYear(),this.id_fournisseur);
            this.date = false;

            this.factureService.getAllDiffBDC(this.my.getMonth() +1, this.my.getFullYear(),this.id_fournisseur).subscribe(
                data => {
                    this.diff = data;

                    this.loading = false;
                    console.log(this.diff);
                },
                err => {
                    this.alertService.error("Impossible de charger les factures fournisseurs, veuillez réessayer ultérieurement");
                    this.loading = false;
                }
            );
        });
    }



    diffqte() {
        let total = 0;
        for (let diffs of this.diff) {
            total += (  diffs.qte - diffs.Qtelivre) * diffs.Prixreel ;
        }
        return total;
    }

    diffprix() {
        let total = 0;
        for (let diffs of this.diff) {
            total += (diffs.Prixreel - diffs.prix_prevu) * diffs.Qtelivre  ;
        }
        return total;
    }

    impprix(){
        let total =0;
        for(let imps of this.imp) {
            total += (imps.Prixreel * imps.Qtelivre);

        }
        return total;
    }

    totaldiff(){
        let total = 0;
        for (let diffs of this.diff){
            total += (this.diffqte() + this.diffprix() + this.impprix())
        }
        return total;
    }

    loadAllDiffFournisseurImp() {
        this.route.params.subscribe(params => {
            this.id_fournisseur = params['id_contact'];
            //console.log("load imp",this.my.getMonth() +1, this.my.getFullYear(),this.id_fournisseur);
            this.date = false;

            this.factureService.getAllDiffFournisseurImp(this.my.getMonth() +1, this.my.getFullYear(),this.id_fournisseur).subscribe(
                data => {
                    this.imp = data;

                    this.loading = false;
                    //console.log(this.imp)
                },
                err => {
                    this.alertService.error("ssssImpossible de charger les factures fournisseurs, veuillez réessayer ultérieurement");
                    this.loading = false;
                }
            );
        });
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
