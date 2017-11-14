
import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {FormBuilder, FormGroup} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {DevisService} from "../_services/devis.service";
import {VentesService} from "../_services/ventes.service";
import {ContactService} from "../_services/contact.service";
import {ChantierService} from "../_services/chantier.service";
import {FactureService} from "../_services/facture.service";
import {ParamsService} from "../_services/params.service";

const URL = 'http://' + location.hostname +':4000/ged/';


import {Observable} from "rxjs/Observable";
import {isUndefined} from "util";

@Component({
    moduleId: module.id,
    templateUrl: 'analysedevis.component.html'
})

export class AnalysedevisComponent implements OnInit {


    detail: any = [] = [];
    id_devis: number;
    num_version: number;
    qte_devis: number;
    prix_devis: number;
    prix_achat: number;
    option: any = [] = [];
    price:number;
    pricopt:number;
    margedeta:number;
    margeopti:number;
    devis:any ={};

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private contactService: ContactService,
                private chantierService: ChantierService,
                private devisService: DevisService,
                private venteService: VentesService,
                private factureService: FactureService,
                private paramsService: ParamsService,
                private builder: FormBuilder, private _sanitizer: DomSanitizer) {

    }

    ngOnInit() {

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loadDevis();
        this.loadOption();
        this.loadAnalyse();
    }

    customTrackBy(index: number, obj: any): any {
        return index;
    }

    loadDevis() {
        this.route.params.subscribe(params => {
            this.id_devis = params['id_devis']
            this.num_version = params['num_version']
            console.log(this.id_devis, this.num_version);
            this.devisService.getByIdAnalyse(this.id_devis, this.num_version).subscribe(
                data => {
                    this.detail = data;
                    console.log(data)
                }
            )
        });
    }


    pricedet(details:any){
        //console.log(details.margepc);
        if(details.margedev)
            details.prix_dev = ((details.margedev / 100)+1)*details.prix_achat;

        else  details.prix_dev = ((details.margepc / 100)+1)*details.prix_achat;

        return details.prix_dev;

    }

    countDetail(details:any){
        return this.pricedet(details)!=0 ? this.pricedet(details)*details.qte_devis :0;
    }

    margedet(details:any){
        this.margedeta = this.pricedet(details)-details.prix_achat;
        return this.margedeta;
    }

    countTotaldet(details:any) {

        let totaldet = 0;

        for (let details of this.detail) {
            if (details.prix_dev )
                totaldet += this.pricedet(details)!=0 ? this.pricedet(details)*details.qte_devis :0;
            else 0;
        }
        return totaldet;
    }



    loadOption() {
        this.route.params.subscribe(params => {
            this.id_devis = params['id_devis']
            this.num_version = params['num_version']
            console.log(this.id_devis, this.num_version);
            this.devisService.getByIdAnalyseopt(this.id_devis, this.num_version).subscribe(
                data => {
                    this.option = data;
                    console.log(data)
                }
            )
        });
    }

    priceopt(options:any){
        //console.log(options.margepc);
        if(options.margedev)
            options.prix_dev = ((options.margedev / 100)+1)*options.prix_achat;

        else  options.prix_dev = ((options.margepc / 100)+1)*options.prix_achat;

        return options.prix_dev;

    }

    countOption(options:any){
        return this.priceopt(options)!=0 ? this.priceopt(options)*options.qte_devis :0;
    }

    margeopt(options:any){
        this.margeopti = this.priceopt(options)-options.prix_achat;
        return this. margeopti;
    }

    countTotaloption(options:any) {

        let totaldet = 0;

        for (let options of this.option) {
            if (options.prix_dev )
                totaldet += this.priceopt(options)!=0 ? this.priceopt(options)*options.qte_devis :0;
            else 0;
        }
        return totaldet;
    }

    modify(devisparams:any) {

        console.log(devisparams)
        this.devisService.updateDevisdetail(devisparams).subscribe(
            data=>{

                console.log(devisparams)
                this.alertService.success("Les données ont bien été modifiées.");
            });

    }

    sommeTotal(options:any,details:any){
        return this.countTotaloption(options) + this. countTotaldet(details);
    }

    modifyopt(devisparams:any) {

        console.log(devisparams)
        this.devisService.updateDevisoption(devisparams).subscribe(
            data=>{

                console.log(devisparams)
                this.alertService.success("Les données ont bien été modifiées.");
            });

    }

    loadAnalyse() {
        this.route.params.subscribe(params => {
            this.id_devis = params['id_devis']
            this.num_version = params['num_version']
            console.log(this.id_devis, this.num_version);
            this.devisService.getByIdAnaldevis(this.id_devis, this.num_version).subscribe(
                data => {
                    this.devis = data[0];
                    console.log(data)
                }
            )
        });
    }


}

