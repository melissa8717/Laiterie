import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService} from '../_services/index';
import {ChantierService} from "../_services/chantier.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";





@Component({
    moduleId: module.id,
    templateUrl: 'analysetemps.component.html'
})

export class AnalysetempsComponent {

    model:any = [] = [];
    id_chantier:number;
    option:any = [] = [];

    nom : any = {};
    print: boolean = false;
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};               //


    constructor(private route: ActivatedRoute,
                private router: Router,
                private chantierService: ChantierService,
                private alertService: AlertService,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    }


    ngOnInit() {

        this.loaddroituser();

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";

        // get return url from route parameters or default to '/'
        this.loadDevis();
        this.loadOption();
        this.loadNom();

    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    loadDevis(){
        this.route.params.subscribe(params => {
            this.id_chantier=params['id_chantier']
            console.log(this.id_chantier);
            this.chantierService.getByIdAnalyse(this.id_chantier).subscribe(
                data=>{
                    this.model=data;
                    console.log(data)
                }
            )
        });
    }

    loadNom(){
        this.route.params.subscribe(Params => {
            this.id_chantier=Params['id_chantier'];
            console.log(this.id_chantier);
            this.chantierService.getByIdNom(this.id_chantier).subscribe(
                data=>{
                    this.nom=data[0];
                    console.log(data)
                }
            )
        });
    }

    loadOption(){
        this.route.params.subscribe(params => {
            this.id_chantier=params['id_chantier']
            console.log(this.id_chantier);
            this.chantierService.getByIdAnalyseoption(this.id_chantier).subscribe(
                data=>{
                    this.option=data;
                    console.log(data)
                }
            )
        });
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

    calctotal(prod:any): number {
        if (prod.quantite) //console.log(this.getMinutesFromTime(prods.quantite.toString()));
            return (prod.salaire_charge && this.getMinutesFromTime(prod.quantite.toString())) ?
                (prod.salaire_charge) *(prod.qte_devis) * this.getMinutesFromTime(prod.quantite.toString()) / 60 :
                0;
    }

    qtotal(prod:any): number {
        if (prod.quantite) //console.log(this.getMinutesFromTime(prods.quantite.toString()));
            return (this.getMinutesFromTime(prod.quantite.toString())) ?
                (prod.qte_devis) * this.getMinutesFromTime(prod.quantite.toString())  :
                0;
    }

    calctotalopt(prods:any): number {
        if (prods.quantite) //console.log(this.getMinutesFromTime(prods.quantite.toString()));
            return (prods.salaire_charge && this.getMinutesFromTime(prods.quantite.toString())) ?
                (prods.salaire_charge) *(prods.qte_devis) * this.getMinutesFromTime(prods.quantite.toString()) / 60 :
                0;
    }

    qtotalopt(prods:any): number {
        if (prods.quantite) //console.log(this.getMinutesFromTime(prods.quantite.toString()));
            return (this.getMinutesFromTime(prods.quantite.toString())) ?
                (prods.qte_devis) * this.getMinutesFromTime(prods.quantite.toString())  :
                0;
    }

    counttotalopt(prods:any) {
        let totalopt = 0;

        for (let prods of this.option) {
            if (prods.quantite) //console.log(this.getMinutesFromTime(prods.quantite.toString()));
                (this.getMinutesFromTime(prods.quantite.toString())) ?
                    totalopt += (prods.qte_devis) * this.getMinutesFromTime(prods.quantite.toString())  :
                    totalopt += 0;
        }
        return totalopt;
    }

    countqtotal(prod:any) {
        let qtotal = 0;

        for (let prod of this.model) {
            if (prod.quantite) //console.log(this.getMinutesFromTime(prods.quantite.toString()));
                (this.getMinutesFromTime(prod.quantite.toString())) ?
                    qtotal += (prod.qte_devis) * this.getMinutesFromTime(prod.quantite.toString())  :
                    qtotal += 0;
        }
        return qtotal;
    }

    countTotal(prods:any,prod:any){
        return this.counttotalopt(prods) + this.countqtotal(prod);
    }

    countcalctotalopt(prods:any) {
        let totaloption = 0;

        for (let prods of this.option) {
            if (prods.quantite) //console.log(this.getMinutesFromTime(prods.quantite.toString()));
                (prods.salaire_charge && this.getMinutesFromTime(prods.quantite.toString())) ?
                    totaloption+= (prods.salaire_charge) *(prods.qte_devis) * this.getMinutesFromTime(prods.quantite.toString()) / 60 :
                    totaloption+= 0;
        }
        return totaloption;
    }

    countcalctotal(prod:any) {
        let qtotale = 0;

        for (let prod of this.model) {
            if (prod.quantite) //console.log(this.getMinutesFromTime(prods.quantite.toString()));
                (prod.salaire_charge && this.getMinutesFromTime(prod.quantite.toString())) ?
                    qtotale +=(prod.salaire_charge) *(prod.qte_devis) * this.getMinutesFromTime(prod.quantite.toString()) / 60 :
                    qtotale +=0;
        }
        return qtotale;
    }

    countTotale(prods:any,prod:any){
        return this.countcalctotalopt(prods) + this. countcalctotal(prod);
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