/**
 * Created by cédric on 10/07/2017.
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';
import {FactureService} from "../_services/facture.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'balance_generale.component.html'
})

export class Balance_generaleComponent implements OnInit{


    date: boolean = false;
    loading = false;
    my: Date = new Date();
    fact: any []=[];
    devis:any={};
    achat: any []=[];
    option: any []=[];
    prev: any []=[];
    moreel: any []=[];
    bdc: any []=[];
    bdclib: any []=[];
    frais: any []=[];

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
        this.loadFactAnnee();
        this.loadTotaldevis();
        this.loadDevisachat();
        this.loadOptionachat();
        this.loadGprev();
        this.loadMoreel();
        this.loadBdc();
        this.loadFraisreel();
        this.loaddroituser();
        this.loadBdclibre();

    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];



        });
    }


    back(){
        this.my.setFullYear(this.my.getFullYear()-1);
         this.loadFactAnnee();
         this.loadTotaldevis();
         this.loadDevisachat();
         this.loadOptionachat();
         this.loadGprev();
         this.loadMoreel();
         this.loadBdc();
         this.loadFraisreel();
         this.loadBdclibre();
    }

    up() {
        this.my.setFullYear(this.my.getFullYear() + 1);
        //console.log(this.my);
         this.loadFactAnnee();
         this.loadTotaldevis();
         this.loadDevisachat();
         this.loadOptionachat();
         this.loadGprev();
         this.loadMoreel();
         this.loadBdc();
         this.loadFraisreel();
         this.loadBdclibre();
    }

    customTrackBy(index: number, obj: any): any {
        return index;
    }

    getMinutesFromTime(timer: string): number {
        if (timer) {
            var t = timer.split(':');
            //console.log(parseInt(t[0]) * 60 + parseInt(t[1]));
            return parseInt(t[0]) * 60 + parseInt(t[1]);
        }
        return 0;
    }
    /*-------------------facture-------------------------------*/
    loadFactAnnee() {

        this.date = false;
        this.factureService.getAlltotalfact( this.my.getFullYear()).subscribe(
            data => {
                this.fact = data;
                this.loading= false;
                //console.log(this.fact)
            },
            err =>{
                this.alertService.error("Impossible de charger la balance générale, veuillez réessayer ultérieurement");
                this.loading= false;
            }
        );
    }

    countTotalfact() {
        let total = 0;

        for (let facts of this.fact) {
                total += facts.montant_ht;
        }
        return total;
    }
/*-------------------------------------------total devis--------------------------------------------*/
    loadTotaldevis() {

        this.date = false;
        this.factureService.getAlltotaldevis( this.my.getFullYear()).subscribe(
            data => {
                this.devis = data[0];
                this.loading= false;
                console.log(this.devis)
            },
            err =>{
                this.alertService.error("Impossible de charger la balance générale, veuillez réessayer ultérieurement");
                this.loading= false;
            }
        );
    }

    /*----------------------------------------devis detaille achat------------------------------*/

    loadDevisachat() {

        this.date = false;
        this.factureService.getAlldevisachat( this.my.getFullYear()).subscribe(
            data => {
                this.achat = data;
                this.loading= false;
                //console.log(this.achat)
            },
            err =>{
                this.alertService.error("Impossible de charger la balance générale, veuillez réessayer ultérieurement");
                this.loading= false;
            }
        );
    }

    countTotalmo(achats:any) {

        let totalmo = 0;

        for (let achats of this.achat) {
            if (achats.salaire_charge>0)
                (achats.salaire_charge && this.getMinutesFromTime(achats.quantite.toString())) ?
                    totalmo += (achats.salaire_charge) *(achats.qte_devis) * this.getMinutesFromTime(achats.quantite.toString()) / 60:
                    totalmo +=0;

        }
        return totalmo;
    }

    countTotalmoh(achats:any) {

        let totalmo = 0;

        for (let achats of this.achat) {
            if (achats.salaire_charge>0)
                (achats.salaire_charge && this.getMinutesFromTime(achats.quantite.toString())) ?
                    totalmo += (achats.qte_devis) * this.getMinutesFromTime(achats.quantite.toString()) / 60:
                    totalmo +=0;

        }
        return totalmo;
    }
    countTotalpro(achats:any) {

        let totalmo = 0;

        for (let achats of this.achat) {
            if (achats.prix_achat>0)
            //console.log(this.getMinutesFromTime(prods.quantite.toString()));
                    totalmo += (achats.prix_achat) *(achats.qte_devis) * parseInt(achats.quantite);
                   else totalmo +=0;
            //console.log(totalmo);

        }
        return totalmo;
    }
    /*----------------------------------------devis option achat------------------------------*/

    loadOptionachat() {

        this.date = false;
        this.factureService.getAllOptionachat( this.my.getFullYear()).subscribe(
            data => {
                this.option = data;
                this.loading= false;
                console.log(this.option)
            },
            err =>{
                this.alertService.error("Impossible de charger la balance générale, veuillez réessayer ultérieurement");
                this.loading= false;
            }
        );
    }

    countTotalomo(options:any) {

        let totalmo = 0;

        for (let options of this.option) {
            if (options.salaire_charge>0)
                (options.salaire_charge && this.getMinutesFromTime(options.quantite.toString())) ?
                    totalmo += (options.salaire_charge) *(options.qte_devis) * this.getMinutesFromTime(options.quantite.toString()) / 60:
                    totalmo +=0;

        }
        return totalmo;
    }

    countTotalomoh(options:any) {

        let totalmo = 0;

        for (let options of this.option) {
            if (options.salaire_charge>0)
                (options.salaire_charge && this.getMinutesFromTime(options.quantite.toString())) ?
                    totalmo += (options.qte_devis) * this.getMinutesFromTime(options.quantite.toString()) / 60:
                    totalmo +=0;

        }
        return totalmo;
    }
    countTotalopro(options:any) {

        let totalmo = 0;

        for (let options of this.option) {
            if (options.prix_achat>0)
            //console.log(this.getMinutesFromTime(prods.quantite.toString()));
                totalmo += (options.prix_achat) *(options.qte_devis) * parseInt(options.quantite);
            else totalmo +=0;
            //console.log(totalmo);

        }
        return totalmo;
    }



    countTotalconso(options:any,achats:any){
        return this.countTotalopro(options)+this.countTotalpro(achats);
    }
    countTotalmain(options:any,achats:any){
        return  this.countTotalomo(options)+ this.countTotalmo(achats);
    }
    /*-----------------frais généraux prévisionnels année-------------------*/

    loadGprev() {

        this.date = false;
        this.factureService.getAllFraisan( this.my.getFullYear()).subscribe(
            data => {
                this.prev = data;
                this.loading= false;
                console.log(this.prev)
            },
            err =>{
                this.alertService.error("Impossible de charger la balance générale, veuillez réessayer ultérieurement");
                this.loading= false;
            }
        );
    }

    countTotalGprev(prevs:any) {

        let totalmo = 0;

        for (let prevs of this.prev) {

                totalmo += (prevs.montantprev) ;
        }
        return totalmo;
    }
    /*---------------------total previsionnel----------------------------------*/
    countTotalPrev(prevs:any,achats:any,options:any){
        return this.countTotalGprev(prevs) + this.countTotalconso(options,achats) +this. countTotalmain(options,achats);
    }

    /*------------------------------------Main oeuvre réel--------------------------------*/

    loadMoreel() {

        this.date = false;
        this.factureService.getAllMoan( this.my.getFullYear()).subscribe(
            data => {
                this.moreel = data;
                this.loading= false;
                console.log(this.moreel)
            },
            err =>{
                this.alertService.error("Impossible de charger la balance générale, veuillez réessayer ultérieurement");
                this.loading= false;
            }
        );
    }


    countTotalmoreeli(moreels:any) {

        let totalmo:number = 0;

        for (let moreels of this.moreel) {
            if (moreels.type_contrat === "Intérimaire")
                (this.getMinutesFromTime(moreels.nb_heure.toString())) ?
                    totalmo += (+(moreels.tauxsurcharge)) * (+this.getMinutesFromTime(moreels.nb_heure.toString())) / 60:
                    totalmo +=0;

        }
        return totalmo;
    }

    countTotalmoreelhi(moreels:any) {

        let totalmo:number = 0;

        for (let moreels of this.moreel) {
            //console.log(moreels.type)
            if (moreels.type_contrat === "Intérimaire")
                (this.getMinutesFromTime(moreels.nb_heure.toString())) ?
                    totalmo += +this.getMinutesFromTime(moreels.nb_heure.toString()) / 60:
                    totalmo +=0;
            //console.log(totalmo)

        }
        return totalmo;
    }
    countTotalmoreel(moreels:any) {

        let totalmo:number = 0;

        for (let moreels of this.moreel) {
            if (moreels.type_contrat != "Intérimaire")
                (this.getMinutesFromTime(moreels.nb_heure.toString())) ?
                    totalmo += +(moreels.tauxsurcharge) * +this.getMinutesFromTime(moreels.nb_heure.toString()) / 60:
                    totalmo +=0;

        }
        return totalmo;
    }

    countTotalmoreelh(moreels:any) {

        let totalmo:number = 0;

        for (let moreels of this.moreel) {
            if (moreels.type_contrat != "Intérimaire")
                (this.getMinutesFromTime(moreels.nb_heure.toString())) ?
                    totalmo += +this.getMinutesFromTime(moreels.nb_heure.toString()) / 60:
                    totalmo +=0;
            //console.log(totalmo)

        }
        return totalmo;
    }

    countTotalmaindoeuvre(moreels:any){
        return this.countTotalmoreeli(moreels)+this. countTotalmoreel(moreels);
    }
    countTotalmaindoeuvrei(moreels:any){
        return this.countTotalmoreelhi(moreels)+this. countTotalmoreelh(moreels);
    }

    /*---------------------------bon de commande validé ---------------------------------------*/

    loadBdc() {

        this.date = false;
        this.factureService.getAllBdcreel( this.my.getFullYear()).subscribe(
            data => {
                this.bdc = data;
                this.loading= false;
            },
            err =>{
                this.alertService.error("Impossible de charger la balance générale, veuillez réessayer ultérieurement");
                this.loading= false;
            }
        );
    }

    loadBdclibre() {

        this.date = false;
        this.factureService.getAllBdcreelibre( this.my.getFullYear()).subscribe(
            data => {
                this.bdclib = data;
                this.loading= false;
                console.log(this.bdclib)
            },
            err =>{
                this.alertService.error("Impossible de charger la balance générale, veuillez réessayer ultérieurement");
                this.loading= false;
            }
        );
    }

    countTotalbdc(bdcs:any) {

        let totalmo:number = 0;

        for (let bdcs of this.bdc) {

                    totalmo += bdcs.somme;

        }
        return totalmo;
    }

    countTotalbdclib(bdcs:any) {

        let totalmo:number = 0;

        for (let bdcs of this.bdclib) {

            totalmo += bdcs.somme;

        }
        return totalmo;
    }
    sommebdc(bdcs:any){
        return this.countTotalbdc(bdcs) + this.countTotalbdclib(bdcs);
    }
/*-------------------------------------------frais generaux réel------------------------------------------*/
    loadFraisreel() {

        this.date = false;
        this.factureService.getAllAnnefrais( this.my.getFullYear()).subscribe(
            data => {
                this.frais = data;
                this.loading= false;
                console.log(this.frais)
            },
            err =>{
                this.alertService.error("Impossible de charger la balance générale, veuillez réessayer ultérieurement");
                this.loading= false;
            }
        );
    }

    countTFrais(fraiss:any) {

        let totalmo:number = 0;

        for (let fraiss of this.frais) {

            totalmo += fraiss.somme;

        }
        return totalmo;
    }

    countTotalDepense(fraiss:any,moreels:any,bdcs:any){
        return this.countTFrais(fraiss)+ this.sommebdc(bdcs)+this.countTotalmaindoeuvre(moreels);
    }

    Margedepense(fraiss:any,moreels:any,bdcs:any){
        return this.countTotalfact() - this.countTotalDepense(fraiss,moreels,bdcs);
    }

    MargeTotal(fraiss:any,moreels:any,bdcs:any){
        return ((this.countTotalfact() / this.countTotalDepense(fraiss,moreels,bdcs)-1)*100);
    }

}
