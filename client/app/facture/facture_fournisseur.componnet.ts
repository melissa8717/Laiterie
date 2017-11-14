/**
 * Created by cédric on 11/08/2017.
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';
import {FactureService} from "../_services/facture.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'facture_fournisseur.component.html'
})

export class Facture_fournisseurComponent {

    fact: {}[]=[];
    bdcdet:{}[]=[];
    model:{};
    list: any[] = [];
    bon: any ;
    nom:any;
    datefourn:string;
    n_facture:string;
    montantfact:number;
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};               //



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
        this.loadAllBdc();
        this.loaddroituser();

    }
    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

     private loadAllFournisseur() {

        this.factureService.getAllFournisseur().subscribe(fact => {
            this.fact = fact;
            console.log(this.fact);

        });
    }

    private loadAllBdc() {

        this.factureService.getAllBdcdetail().subscribe(bdcdet => {
            this.bdcdet = bdcdet;
            console.log(this.bdcdet);

        });
    }

    autocompleListFormattercontact = (data: any): SafeHtml => {
        let html = `<span>${data.nom} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    autocompleListFormatterBdc = (data: any): SafeHtml => {
        let html = `<span>${data.id_bdc} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    ajouter(){

        console.log(this.bon);
        let tmp : any = {} ;
        tmp.id_bdc =  this.bon.id_bdc;
        tmp.sumbdc =  this.bon.sumbdc;

        var test = this.list.filter(obj => obj.id_bdc == tmp.id_bdc).length < 1;

        if(test){
            this.list.push(tmp);
            this.alertService.success("Le bon de commande n° "+ tmp.id_bdc + " a été ajouté. ");

        }
        else{
            this.alertService.error("Le bon de commande n° "+ tmp.id_bdc+" n'a pas pu être ajouté. ");
        }

        this.bon = {};

    }

    supprimer(bon: any){
        this.list = this.list.filter(obj => obj !== bon);
    }

    countTotal() {
        let total = 0;
        for (let bon of this.list) {
            total += bon.sumbdc;
        }
        return total;
    }

    add() {

        let factureparams : any = {};
        console.log(this.bon)
        console.log(this.bdcdet)
        factureparams.list = this.list;
        factureparams.fournisseur =this.nom;
        factureparams.bdcdet ={
            datefourn:this.datefourn,
            n_facture:this.n_facture,
        montantfact:this.montantfact,

        };





        console.log(factureparams);
        this.factureService.createfacturefournisseur(factureparams).subscribe(
            data=>{
             //   this.router.navigate(["/listefacture"]);
                this.alertService.success("La rapprochement a été créé avec succès.");
            });
    }
}