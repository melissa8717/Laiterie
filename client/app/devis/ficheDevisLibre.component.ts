import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService} from '../_services/index';
import {ChantierService} from "../_services/chantier.service";
import {ParamsService} from "../_services/params.service";
import {FactureService} from "../_services/facture.service";

import {User} from "../_models/user";
import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours,
    format,
} from 'date-fns';
import {DevisService} from "../_services/devis.service";




@Component({
    moduleId: module.id,
    templateUrl: 'ficheDevisLibre.component.html'
})

export class FicheDevisLibreComponent {
    id_chantier:number;
    fact:any={};
    devis:any={};
    nom : any = {};
    print: boolean = false;
    date:string;
    currentUser: User;
    droitsuser:any={};
    id_devis:number;
    num_version:number;
    data:any={};
    produit:any=[]=[];
    produitop:any=[]=[];
    prod:any;
    cgv: any = {};

    produitDevis: any[] = [];
    produitDevisOptions: any[] = [];





    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private chantierService: ChantierService,
                private devisService: DevisService,
                private factureService: FactureService,
                private alertService: AlertService,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    }

    ngOnInit() {


        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loadDevis();
        this.loadAllFooter();
        this.loaddroituser();
        this.produits();
        this.loadCat();
        this.produitsop();



    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

        });
    }

    loadAllFooter() {

        this.factureService.getAllFooter().subscribe(data => {
            this.fact = data[0];


        });
    }

    loadDevis(){
        this.route.params.subscribe(params => {
            this.id_devis=params['id_devis'];
            this.num_version=params['num_version'];
            this.devisService.getByIdLibre(this.id_devis, this.num_version).subscribe(
                data=>{
                    this.devis=data[0];

                }
            )
        });
    }

    produits(){
        this.route.params.subscribe(params => {
            this.id_devis=params['id_devis'];
            this.num_version=params['num_version'];
            this.devisService.getByIdLibreproduit(this.id_devis, this.num_version).subscribe(
                data=>{
                    this.produit=data;

                }
            )
        });
    }

    produitsop(){
        this.route.params.subscribe(params => {
            this.id_devis=params['id_devis'];
            this.num_version=params['num_version'];
            this.devisService.getByIdLibreproduitopt(this.id_devis, this.num_version).subscribe(
                data=>{
                    this.produitop=data;

                }
            )
        });
    }

    countTotaldet() {

        let totaldet = 0;

        for (let prod of this.produit) {
            if (prod.accepted != 0 )
                totaldet += prod.qte_devis  * prod.prix_devis ;
            else totaldet += 0;
        }
        return totaldet;
    }



    countTva(){
        return this.countTotaldet() *(this.devis.tva/100)*(this.devis.remise?(1-(this.devis.remise/100)):1);
    }

    countTtc(){
        return (this.countTotaldet()*(this.devis.remise?(1-(this.devis.remise/100)):1)) + this.countAllTVA() +this.countTva();
    }

    countTotalopt() {

        let totaldet = 0;

        for (let prode of this.produitop) {

                totaldet += prode.qte_devis  * prode.prix_devis ;

        }
        return totaldet;
    }

    countTvaopt(){
        return this.countTotalopt() *(this.devis.tva/100)*(this.devis.remise?(1-(this.devis.remise/100)):1);
    }

    countTtcopt(){
        return (this.countTotalopt()*(this.devis.remise?(1-(this.devis.remise/100)):1)) +  this.countAllTVAO() + this. countTvaopt();
    }

    acceptOfferLibre(prod: any) {
        this.devisService.offerlibre(prod).subscribe(
            data => {

            }
        );
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

    loadCat() {
        console.log(this.cgv)

        this.paramsService.getAllVente().subscribe(cgv => {

            this.cgv = cgv[0];

        });
    }

    countNTVAZ() {
        let total = 0;

        for (let prod of this.produit) {

            if (parseInt(prod.tva) == 0) {
                total +=  0;


            }
        }
        return total;

    }
    countNTVA() {
        let total = 0;

        for (let prod of this.produit) {

            if (parseInt(prod.tva) == 2.1) {
                total += (parseInt(prod.tva) /100 ) * prod.prix_devis * prod.qte_devis *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


            }
        }
        return total;

    }

    countNTVAC() {
        let total = 0;

        for (let prod of this.produit) {

            if (parseInt(prod.tva) == 5.5) {
                total += (parseInt(prod.tva) /100 ) * prod.prix_devis * prod.qte_devis *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


            }
        }
        return total;

    }

    countNTVAD() {
        let total = 0;

        for (let prod of this.produit) {

            if (parseInt(prod.tva) == 10) {
                total += (parseInt(prod.tva) /100 ) * prod.prix_devis * prod.qte_devis *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


            }
        }
        return total;

    }

    countNTVAs() {
        let total = 0;

        for (let prod of this.produit) {
            if (parseInt(prod.tva) == 20) {
                total += (parseInt(prod.tva) /100 ) * prod.prix_devis * prod.qte_devis *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


            }
        }
        return total;

    }


    countNTVAZO() {
        let total = 0;

        for (let prode of this.produitop) {

            if (parseInt(prode.tva) == 0) {
                total +=  0 ;


            }
        }
        return total;

    }
    countNTVAO() {
        let total = 0;

        for (let prode of this.produitop) {

            if (parseInt(prode.tva) == 2.1) {
                total += (parseInt(prode.tva) /100 ) * prode.prix_devis * prode.qte_devis *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


            }
        }
        return total;

    }

    countNTVACO() {
        let total = 0;

        for (let prode of this.produitop) {

            if (parseInt(prode.tva) == 5.5) {
                total += (parseInt(prode.tva) /100 ) * prode.prix_devis * prode.qte_devis *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


            }
        }
        return total;

    }

    countNTVADO() {
        let total = 0;

        for (let prode of this.produitop) {

            if (parseInt(prode.tva) == 10) {
                total += (parseInt(prode.tva) /100 ) * prode.prix_devis * prode.qte_devis *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


            }
        }
        return total;

    }

    countNTVAsO() {
        let total = 0;

        for (let prode of this.produitop) {

            if (parseInt(prode.tva) == 20) {
                total += (parseInt(prode.tva) /100 ) * prode.prix_devis * prode.qte_devis *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


            }
        }
        return total;

    }


    countAllTVA(){
        return ((this.countNTVA() ? this.countNTVA() : 0 ) + (this.countNTVAC() ? this.countNTVAC() : 0 )  + (this.countNTVAD() ? this.countNTVAD() : 0 )) + (this.countNTVAs() ? this.countNTVAs() : 0 );


    }

    countAllTVAO(){
        return ((this.countNTVAO() ? this.countNTVAO() : 0 ) + (this.countNTVACO() ? this.countNTVACO() : 0 ) + (this.countNTVADO() ? this.countNTVADO() : 0 )) + (this.countNTVAsO() ? this.countNTVAsO() : 0 );


    }
    totalvi(){
        return this.countNTVAs()  + this.countNTVAsO();
    }

    totaldi(){
        return this.countNTVADO()  + this.countNTVAD();
    }

    totalci(){
        return this.countNTVAC()  + this.countNTVACO();
    }

    totaldei(){
        return this.countNTVA()  + this.countNTVAO();
    }

    totalcountTTC(){
        return this.countTtcopt() + this.countTtc();
    }

    totalremiseoptet(){
        return this.countTotalopt() *(1-(this.devis.remise ? this.devis.remise/100 :0)) + this.countTotaldet() *(1-(this.devis.remise ? this.devis.remise/100 : 0));
    }

    totalHT(){
        return this.countTotalopt() + this.countTotaldet();
    }

}