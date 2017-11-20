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
    summe: any = {};


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
        this.loadSum();

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

    loadSum(){
        this.route.params.subscribe(params => {

            this.id_facture = params['id_facture'];
            this.factureService.getByIdLibresum(this.id_facture).subscribe(
                data => {
                    this.summe = data[0];
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
            return details.qteprod  * details.prix_prod * (details.pourcentf/100);
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
            total += details.qteprod  * details.prix_prod * (details.pourcentf/100);
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

    countTotalNet(){
        return this.countTotals();
    }

    CountTotalsituation(){
         this.model.situation = this.countTotalNet() - (this.summe.somme);
         return this.model.situation;
    }

    /**********************************TVA**************************************************************************************/

    TVAVO()
    {
        let total = 0;

        for (let details of this.detail) {

            if (details.tva == 20){
                total += ( details.prix_prod * details.qteprod *  (this.model.remise ? (1-(this.model.remise / 100)) : 1) ) * (details.pourcentf/100)* (details.tva /100) ;

            }
        }
        return total;
    }

    TVAV()
    {
        let total = 0;

        for (let bases of this.base) {

            if (bases.tva == 20){
                total += (bases.prix_fact * bases.qte_fact *  (this.model.remise ? (1-(this.model.remise / 100)) : 1) ) * (bases.pourcent ? bases.pourcent / 100 : 1)* (bases.tva /100);
            }

        }
        return total;
    }

    TVATVt()
    {
        let total = 0;

        for (let bases of this.base) {

            if (bases.tva == 20){
                total += bases.totaltva *  (this.model.remise ? (1-(this.model.remise / 100)) : 1) ;
            }

        }
        return total;
    }

    TVATVOt()
    {
        let total = 0;
        for (let details of this.detail) {

            if (details.tva == 20){
                total += details.totaltva * (this.model.remise ? (1-(this.model.remise / 100)) : 1);
            }
        }
        return total;
    }

    SumTvaV(){
        return this.TVAV()  + this.TVAVO()  - this.TVATVOt() -this.TVATVt() ;
    }

    TVADO()
    {
        let total = 0;

        for (let details of this.detail) {

            if (details.tva == 10){
                total += ( details.prix_prod * details.qteprod *  (this.model.remise ? (1-(this.model.remise / 100)) : 1) ) * (details.pourcentf/100)* (details.tva /100) ;

            }
        }
        return total;
    }

    TVAD()
    {
        let total = 0;

        for (let bases of this.base) {

            if (bases.tva == 10){
                total += (bases.prix_fact * bases.qte_fact *  (this.model.remise ? (1-(this.model.remise / 100)) : 1) ) * (bases.pourcent ? bases.pourcent / 100 : 1)* (bases.tva /100);
            }

        }
        return total;
    }

    TVADt()
    {
        let total = 0;

        for (let bases of this.base) {

            if (bases.tva == 10){
                total += bases.totaltva *  (this.model.remise ? (1-(this.model.remise / 100)) : 1) ;
            }

        }
        return total;
    }

    TVADOt()
    {
        let total = 0;
        for (let details of this.detail) {

            if (details.tva == 10){
                total += details.totaltva * (this.model.remise ? (1-(this.model.remise / 100)) : 1);
            }
        }
        return total;
    }

    SummTvaD(){
        return this.TVAD() + this.TVADO() - this.TVADt() - this.TVADOt();
    }

    TVACO()
    {
        let total = 0;

        for (let details of this.detail) {

            if (details.tva == 5.5){
                total += ( details.prix_prod * details.qteprod *  (this.model.remise ? (1-(this.model.remise / 100)) : 1) ) * (details.pourcentf/100)* (details.tva /100) ;

            }
        }
        return total;
    }

    TVAC()
    {
        let total = 0;

        for (let bases of this.base) {

            if (bases.tva == 5.5){
                total += (bases.prix_fact * bases.qte_fact *  (this.model.remise ? (1-(this.model.remise / 100)) : 1) ) * (bases.pourcent ? bases.pourcent / 100 : 1)* (bases.tva /100);
            }

        }
        return total;
    }

    TVACt()
    {
        let total = 0;

        for (let bases of this.base) {

            if (bases.tva == 5.5){
                total += bases.totaltva *  (this.model.remise ? (1-(this.model.remise / 100)) : 1) ;
            }

        }
        return total;
    }

    TVACOt()
    {
        let total = 0;
        for (let details of this.detail) {

            if (details.tva == 5.5){
                total += details.totaltva * (this.model.remise ? (1-(this.model.remise / 100)) : 1);
            }
        }
        return total;
    }



    SummTvaC(){
        return this.TVAC() + this.TVACO() - this.TVACt() - this.TVACOt();
    }

    TVADUO()
    {
        let total = 0;

        for (let details of this.detail) {

            if (details.tva == 2.1){
                total += ( details.prix_prod * details.qteprod *  (this.model.remise ? (1-(this.model.remise / 100)) : 1) ) * (details.pourcentf/100)* (details.tva /100) ;
            }
        }
        return total;
    }

    TVADU()
    {
        let total = 0;

        for (let bases of this.base) {

            if (bases.tva == 2.1){
                total += (bases.prix_fact * bases.qte_fact *  (this.model.remise ? (1-(this.model.remise / 100)) : 1) ) * (bases.pourcent ? bases.pourcent / 100 : 1)* (bases.tva /100);
            }
        }
        return total;
    }

    TvaDUOt()
    {
        let total = 0;

        for (let details of this.detail) {

            if (details.tva == 2.1){
                total += details.totaltva * (this.model.remise ? (1-(this.model.remise / 100)) : 1);
            }
        }
        return total;
    }

    TvaDUt()
    {
        let total = 0;

        for (let bases of this.base) {

            if (bases.tva == 2.1){
                total += bases.totaltva * (this.model.remise ? (1-(this.model.remise / 100)) : 1);
            }
        }
        return total;
    }

    SummTvaDU(){
        return this.TVADU() + this.TVADUO()- this.TvaDUt() -  this.TvaDUOt();
    }

    TVAZO()
    {
        let total = 0;

        for (let details of this.detail) {
            if (details.tva  == 0){
                total += 0;
            }
        }
        return total;
    }

    TVAZ()
    {
        let total = 0;

        for (let bases of this.base) {
            if (bases.tva == 0){
                total +=0;
            }
        }
        return total;
    }

    SummTvaZ(){
        return this.TVAZ() + this.TVAZO();
    }

    TotalTva(){
        return this.SummTvaZ() +this.SummTvaDU() + this.SummTvaC() + this.SummTvaD() + this.SumTvaV();
    }

    countTotalttc(){
        return this.TotalTva() +  this. CountTotalsituation();
    }


    submit() {

        let factureparams: any = {};
        factureparams.detail = this.detail;
        factureparams.base = this.base;
        factureparams.model = this.model;
        factureparams.nfact =this.nfact;

        var test = +confirm ("Etes vous sür de vouloir enregitrer votre facture :");
        //console.log(factureparams);
        if(test) {
            console.log(factureparams);
            this.factureService.createSituationlibre(factureparams, this.id_facture).subscribe(
                data => {
                    this.router.navigate(["/listefacture"]);
                    this.alertService.success("La nouvelle situation de la facture a été créée avec succès.");
                });
        }
    }


}