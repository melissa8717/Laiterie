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
    templateUrl: 'avoir.component.html'
})

export class AvoirComponent {

    currentUser: User;
    droitsuser: any = {};
    _id:any;                   //
    data:any={};

    model: any = {};

    fact: any = {};

    id_facture: number;
    n_situation: number;
    situa: any[] = [];
    situas:any = {};
    option: any[] = [];
    options:any = {};
    produitDevis: any[] = [];
    produitDevisopt: any[] = [];
    valeur: any = {};
    navoir: any = {};



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

        this.loadAllFooter();
        this.loadModif();
        this.loaddroituser();
        this.loadSituation();
        this.loadOption();
        this.loadValeur();
        this.loadAllAvoir();


    }


    ajouter() {
        let tmp: any = {};
        tmp.obj = this.situas.obj;
        tmp.qtefact = this.situas.qtefact;
        tmp.prixfact = this.situas.prixfact;
        tmp.num_version = this.situas.num_version;
        tmp.id_produit= this.situas.id_produit;


        var check = this.produitDevis.filter(obj => obj.ref == this.situas.obj.id_produit);

        if (check.length < 1) {
            if (tmp.obj.id_produit) {

                this.produitDevis.push(tmp);
                for(var i = 0 ; i <  this.produitDevis.length; i++){
                    console.log(this.produitDevis[i]);
                    let qtefact = this.produitDevis[i].qtefact;
                    let prixfact = this.produitDevis[i].prixfact;
                    this.produitDevis[i].qtefact = qtefact;
                    this.produitDevis[i].prixfact = prixfact;
                }

            }
            else{
                this.alertService.error("Veuillez ajouter un produit existant.");
            }
        }
        else {
            this.alertService.error("Le produit " + tmp.obj.libelle + " n'a pas pu être ajouté.");
        }




        this.situas.qtefact = null;
        this.situas.prixfact = null;
        this.situas = {};

        //console.log(this.produitDevis);
    }

    test() {

        console.log(this.situas)
        this.situas.qtefact =1;
        this.situas.prixfact = this.situas.obj.prixfact;
        this.situas.num_version = this.situas.obj.num_version;
        this.situas.id_produit = this.situas.obj.id_produit;
    }

    supprimer(situas: any) {
        this.produitDevis = this.produitDevis.filter(obj => obj !== situas);
    }

    ajouteropt() {
        let tmp: any = {};
        tmp.obj = this.options.obj;
        tmp.qtefact = this.options.qtefact;
        tmp.prixfact = this.options.prixfact;
        tmp.num_version = this.options.num_version;
        tmp.id_produit= this.options.id_produit;


        var check = this.produitDevisopt.filter(obj => obj.ref == this.options.obj.id_produit);

        if (check.length < 1) {
            if (tmp.obj.id_produit) {

                this.produitDevisopt.push(tmp);
                for(var i = 0 ; i <  this.produitDevisopt.length; i++){
                    console.log(this.produitDevisopt[i]);
                    let qtefact = this.produitDevisopt[i].qtefact;
                    let prixfact = this.produitDevisopt[i].prixfact;
                    this.produitDevisopt[i].qtefact = qtefact;
                    this.produitDevisopt[i].prixfact = prixfact;
                }

            }
            else{
                this.alertService.error("Veuillez ajouter un produit existant.");
            }
        }
        else {
            this.alertService.error("Le produit " + tmp.obj.libelle + " n'a pas pu être ajouté.");
        }


        this.options.qtefact = null;
        this.options.prixfact = null;
        this.options = {};

        //console.log(this.produitDevis);
    }

    testopt() {

        console.log(this.options)
        this.options.qtefact =1;
        this.options.prixfact = this.options.obj.prixfact;
        this.options.num_version = this.options.obj.num_version;
        this.options.id_produit = this.options.obj.id_produit;
    }

    supprimeropt(options: any) {
        this.produitDevisopt = this.produitDevisopt.filter(obj => obj !== options);
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            //console.log(this.data);
            //console.log(this.currentUser._id);

        });
    }

    loadAllFooter() {

        this.factureService.getAllFooter().subscribe(fact => {
            this.fact = fact[0];
            //console.log(this.fact);

        });
    }

    loadAllAvoir() {

        this.factureService.getAllNavoir().subscribe(avoir => {
            this.navoir = avoir[0];
            console.log(this.navoir);

        });
    }



    loadValeur() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture']
            //console.log(this.id_facture);
            this.factureService.getByIdValeur(this.id_facture).subscribe(
                data => {
                    this.valeur = data[0];
                    // console.log(data)
                }
            )
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
                    //console.log(this.model)
                }
            )
        });
    }

    loadSituation() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture']
            this.n_situation = params['n_situation']
            console.log(this.id_facture, this.n_situation);
            this.factureService.getByIdSituation(this.id_facture, this.n_situation).subscribe(
                data => {
                    this.situa = data;
                    //console.log("situa");
                    //console.log(data);
                }
            )
        });
    }

    loadOption() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture']
            this.n_situation = params['n_situation']
            console.log(this.id_facture, this.n_situation);
            this.factureService.getByIdSitoption(this.id_facture, this.n_situation).subscribe(
                data => {
                    this.option = data;
                    //console.log("option");
                    //console.log(data);
                }
            )
        });
    }

    autocompleListFormatterSitua = (data: any): SafeHtml => {
        let html = `<span>${data.libelle}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    autocompleListFormatterOption = (data: any): SafeHtml => {
        let html = `<span>${data.libelle}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };



    countTotalSit() {
        let total = 0;
        for (let situas of this.produitDevis) {
            total += situas.prixfact * situas.qtefact;
        }
        return total;
    }
    countTotalOpt() {
        let total = 0;
        for (let options of this.produitDevisopt) {
            total += options.prixfact * options.qtefact;
        }
        return total;
    }

    countTotal(){
        return (this.countTotalOpt() +  this.countTotalSit())*(-1);
    }

    countTva(){
        return (this.countTotal()) *(this.valeur.tva /100);
    }

    countTtc(){
        return this.countTotal() + this.countTva();
    }


    submit() {

        let avoirparams : any = {};
        avoirparams.model = this.model;
        avoirparams.valeur = this.valeur;
        avoirparams.navoir = this.navoir;
        avoirparams.produitDevis = this.produitDevis;
        avoirparams.produitDevisopt = this.produitDevisopt;

        console.log(avoirparams);
        this.factureService.addavoir(avoirparams).subscribe(
            data=>{
                this.router.navigate(["/listefacture"]);
                this.alertService.success("L'avoir a été créé avec succès.");
            });
    }



}