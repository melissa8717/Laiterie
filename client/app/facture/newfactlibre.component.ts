/**
 * Created by cédric on 23/10/2017.
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';
import {FactureService} from "../_services/facture.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";
import {VentesService} from "../_services/ventes.service";
import {ContactService} from "../_services/contact.service";
import {Tva} from "../_models/index";
import {AchatsService} from "../_services/achats.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {FormBuilder} from "@angular/forms";

@Component({
    moduleId: module.id,
    templateUrl: 'newfactlibre.component.html'
})

export class NewfactlibreComponent {
    fact: any = {};
    nfact: any = {};
    montant_ht: number;
    currentUser: User;         //
    droitsuser: any = {};         //
    _id: any;                   //
    data: any = {};
    produits: {}[] = [];
    clients: {}[] = [];

    tva_choisi: number;
    tvas:any=[] = [];

    devis: any = {};
    address = false;
    tvataux:any=[] = [];
    print: boolean = false;

    produitDevis: any[] = [];
    produitDevisOptions: any[] = [];
    produitDevisOptionsf: any[] = [];
    produit: any = {};
    produitf: any = {};


    produitFact: any[] = [];




    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private factureService: FactureService,
                private contactService:ContactService,
                private venteService: VentesService,
                private achatsService: AchatsService,
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
        this.loadAllNfact();
        this.loaddroituser();
        this.loadAllClients();
        this.loadAllProduits();
        this.getTVA();
        this.loadTva();

    }

    loadAllFooter() {
        //console.log(this.recherche.seek)

        this.factureService.getAllFooter().subscribe(data => {
            this.fact = data[0];
            //console.log(this.fact);

        });
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }


    loadAllProduits() {
        this.venteService.getAll().subscribe(
            data => {
                this.produits = data;
                console.log(this.produits);
            }
        )
    }

    ajouter() {
        let tmp: any = {};
        tmp.obj = this.produit.obj;
        tmp.qte = this.produit.qte;
        tmp.prix = this.produit.prix;
        tmp.unite = this.produit.unite;
        tmp.pourcent = this.produit.pourcent;
        tmp.taux = this.produit.taux;
        tmp.option = this.produit.option;
        tmp.commentaire = this.produit.commentaire;
        tmp.ref = this.produit.ref;


        var check = this.produitDevis.filter(obj => obj.ref == this.produit.obj.id_prc);

        if (check.length < 1) {
            if (tmp.obj.id_prc) {
                if(tmp.option){
                    this.produitDevisOptions.push(tmp);
                }
                else{
                    this.produitDevis.push(tmp);
                    for(var i = 0 ; i <  this.produitDevis.length; i++){
                        console.log(this.produitDevis[i]);
                        let qte = this.produitDevis[i].qte;
                        let prix = this.produitDevis[i].prix;
                        this.produitDevis[i].qte = qte;
                        this.produitDevis[i].prix = prix;
                    }
                }

            }
            else{
                this.alertService.error("Veuillez ajouter un produit existant.");
            }
        }
        else {
            this.alertService.error("Le produit " + tmp.obj.libelle + " n'a pas pu être ajouté.");
        }

        this.produit.qte = null;
        this.produit.prix = null;
        this.produit = {};
        this.accomptepercent();
        //console.log(this.produitDevis);
    }

    test() {
        console.log(this.devis)
        console.log(this.produit)
        this.produit.qte = 1;
        this.produit.prix = this.produit.obj.prix_vente;
        this.produit.unite = this.produit.obj.unite;
        this.produit.pourcent = this.produit.obj.pourcent;
        this.produit.taux = this.produit.obj.taux;
        this.produit.ref = this.produit.obj.id_prc;
    }

    private loadAllClients() {
        // console.log("on envoie la requette");
        this.contactService.getAllClients().subscribe(clients => {
            this.clients = clients;
            console.log(this.clients);
        });
    }
    loadAllNfact() {

        this.factureService.getAllnfact().subscribe(data => {
            this.nfact = data[0];
            console.log(this.nfact);

        });
    }

    getTVA() {
        this.achatsService.getAllTva().subscribe(
            tvas => {
                this.tvas = tvas;

            }
        );
    }

    autocompleListFormatterProducts = (data: any): SafeHtml => {
        let html = `<span>${data.libelle} : ${data.prix_vente ? data.prix_vente + "€" : "Prix non défini"}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    autocompleListFormatterContactValue = (data: any): SafeHtml => {
        let html = `${data.raison_sociale ? data.raison_sociale : data.nom +" " +data.prenom}`;
        return html;
    };

    autocompleListFormatterContact = (data: any): SafeHtml => {
        let html = `<span>${data.raison_sociale ? data.raison_sociale : data.nom +" " +data.prenom}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    customTrackBy(index: number, obj: any): any {
        return index;
    }



    supprimer(produit: any) {
        this.produitDevis = this.produitDevis.filter(obj => obj !== produit);
    }

    accompteeuro(){
        this.devis.accomptepercentage = (this.devis.accompteeuros / this.countTotalTVA() *100).toFixed(2);
    }
    accomptepercent(){
        this.devis.accompteeuros = (this.devis.accomptepercentage * this.countTotalTVA() /100).toFixed(2);
    }

    loadTva(){

        this.paramsService.getAllTVA().subscribe(tvataux => {

            this.tvataux = tvataux;
            console.log(this.tvataux);

        });
    }


    getAddress(id:any){

        if(id!=null){
            this.contactService.getAddress(id).subscribe(
                data=>{
                    if(data[0]){
                        this.devis.address = data[0].adresse;
                        this.devis.cp = data[0].code_postal;
                        this.devis.ville = data[0].ville;
                        this.address = false
                    }
                    else{
                        this.devis.address = "";
                        this.devis.cp = "";
                        this.devis.ville = "";
                        this.address = true;
                    }
                }
            )
        }
        else{
            this.address = false;
        }
    }




    countTotal() {
        let total = 0;
        for (let produit of this.produitDevis) {
            total += produit.prix * produit.qte * (produit.pourcent ? produit.pourcent /100 : 1);
        }
        return total;
    }

    countTotalRemise() {
        return this.countTotal() - (this.countTotal() * this.devis.remise / 100);
    }



    totalRemiseTVA() {
        return this.totalTVA() - (this.totalTVA() * this.devis.remise / 100);
    }

    countTVA() {

        return (this.countTotalRemise() > 0 ? this.countTotalRemise() *  ((this.devis.taux ? this.devis.taux : 0) / 100): this.countTotal() *  ((this.devis.taux ? this.devis.taux : 0) / 100)) + (this.countTotalRemisei() > 0 ? this.countTotalRemisei() *  ((this.devis.taux ? this.devis.taux : 0) / 100): this.countTotali() *  ((this.devis.taux ? this.devis.taux : 0) / 100));

    }


    countTotalTVA() {

        return (this.countTotalRemise() > 0 ? this.countTotalRemise() : this.countTotal()) + (this.SumTvaV() ? this.SumTvaV() : 0) + (this.SummTvaD() ? this.SummTvaD() : 0) + (this.SummTvaC() ? this.SummTvaC() : 0) + (this.SummTvaDU() ? this.SummTvaDU() : 0) + (this.SummTvaZ() ? this.SummTvaZ() : 0) ;

    }



    total() {
        return this.countTotal();
    }

    totalremise(){
        return  this.countTotalRemise() + this.countTotalRemisei();
    }



    totalTVA() {
        return this.totalremise()>0 ? (this.totalremise()* (1 + ((this.devis.taux ? this.devis.taux : 0) /100))) : (this.countTotal() );
    }




    ajouterfact() {
        let tmps: any = {};
        tmps.produit = this.produitf.objf;
        tmps.qte_devis = this.produitf.qtef;
        tmps.prix_devis = this.produitf.prixf;
        tmps.unitef = this.produitf.unitef;
        tmps.pourcentf = this .produitf.pourcentf;
        tmps.tauxf = this.produitf.tauxf;
        tmps.optionf = this.produitf.optionf;
        tmps.commentairef = this.produitf.commentairef;

        var check = this.produitFact.filter(objf => objf.refi == this.produitf.objf);

        if (check.length < 1) {
            if(tmps.optionf){
                this.produitDevisOptionsf.push(tmps);
            }
            else{
                this.produitFact.push(tmps);
                for(var i = 0 ; i <  this.produitFact.length; i++){
                    //console.log('TEST TS AJOUTER : '+this.produitDevis[i].prix);
                    let qtef = this.produitFact[i].qte_devis;
                    let prixf = this.produitFact[i].prix_devis;
                    let unitef = this.produitFact[i].unitef;
                    let pourcentf = this.produitFact[i].pourcentf;
                    let tauxf = this.produitFact[i].tauxf;
                    this.produitFact[i].qte_devis = qtef;
                    this.produitFact[i].prix_devis = prixf;
                    this.produitFact[i].unitef = unitef;
                    this.produitFact[i].pourcentf = pourcentf;
                    this.produitFact[i].tauxf = tauxf;

                }
            }
        }
        else {
            this.alertService.error("Le produit " + tmps.objf + " n'a pas pu être ajouté.");
        }
        this.produitf.qtef = null;
        this.produitf.prixf = null;
        this.produitf.unitef = null;

        this.produitf = {};
        this.accomptepercent();
        //console.log('TEST TS AJOUTER : '+this.produitDevis);
    }


    supprimerfact(produit: any) {
        this.produitFact = this.produitFact.filter(obj => obj !== produit);
    }



    testfact() {
        //console.log(this.devis);
        console.log(this.produitf.libelle);
        this.produitf.qtef = 1;
        this.produitf.prixf = this.produitf.objf.prix_vente;
        this.produitf.unitef = this.produitf.objf.unitef;

    }

    countTotali() {
        let total = 0;

        for (let produitf of this.produitFact) {

            total += produitf.prix_devis * produitf.qte_devis * (produitf.pourcentf ? produitf.pourcentf / 100 : 1);
        }
        return total;
    }

    countTotalRemisei() {
        return this.countTotali() - (this.countTotali() * this.devis.remise / 100);
    }

    countTotalHT(){
        this.devis.montant = this.countTotal() + this.countTotali();
        return this.devis.montant;
    }


    countTotalHTremise(){
        this.devis.montant_ht = this.countTotalRemise() + this.countTotalRemisei();
        return this.devis.montant_ht;
    }

    TVAVO()
    {
        let total = 0;

        for (let produitf of this.produitFact) {
            console.log(produitf.tauxf);
            console.log(produitf.prix_devis);
            if (produitf.tauxf == 20){
            total += ( produitf.prix_devis * produitf.qte_devis *  (this.devis.remise ? (1-(this.devis.remise / 100)) : 1) ) * (produitf.pourcentf/100 )* (parseInt(produitf.tauxf) /100) ;

        }
    }
        return total;
    }

    TVAV()
    {
        let total = 0;

        for (let produit of this.produitDevis) {

            if (produit.taux == 20){
                total += (produit.prix * produit.qte *  (this.devis.remise ? (1-(this.devis.remise / 100)) : 1) ) * (produit.pourcent ? produit.pourcent / 100 : 1)* (parseInt(produit.taux) /100);
            }

        }
        return total;
    }

   SumTvaV(){
        return (this.TVAV() ? this.TVAV() :0) + this.TVAVO() ;
    }

    TVADO()
    {
        let total = 0;

        for (let produitf of this.produitFact) {
            if (produitf.tauxf == 10){
                total += (produitf.prix_devis * produitf.qte_devis *  (this.devis.remise ? (1-(this.devis.remise / 100)) : 1) ) * (produitf.pourcentf ? produitf.pourcentf / 100 : 1)* (parseInt(produitf.tauxf) /100);
            }
        }
        return total;
    }

    TVAD()
    {
        let total = 0;

        for (let produit of this.produitDevis) {
            if (produit.taux == 10){
                total +=( produit.prix * produit.qte *  (this.devis.remise ? (1-(this.devis.remise / 100)) : 1) ) * (produit.pourcent ? produit.pourcent / 100 : 1)* (parseInt(produit.taux) /100);
            }
        }
        return total;
    }

    SummTvaD(){
        return this.TVAD() + this.TVADO();
    }

    TVACO()
    {
        let total = 0;

        for (let produitf of this.produitFact) {
            if (produitf.tauxf == 5.5){
                total += (produitf.prix_devis * produitf.qte_devis *  (this.devis.remise ? (1-(this.devis.remise / 100)) : 1) ) * (produitf.pourcentf ? produitf.pourcentf / 100 : 1)* (parseInt(produitf.tauxf) /100);
            }
        }
        return total;
    }

    TVAC()
    {
        let total = 0;

        for (let produit of this.produitDevis) {
            if (produit.taux == 5.5){
                total +=( produit.prix * produit.qte *  (this.devis.remise ? (1-(this.devis.remise / 100)) : 1) ) * (produit.pourcent ? produit.pourcent / 100 : 1)* (parseInt(produit.taux) /100);
            }
        }
        return total;
    }

    SummTvaC(){
        return this.TVAC() + this.TVACO();
    }

    TVADUO()
    {
        let total = 0;

        for (let produitf of this.produitFact) {
            if (produitf.tauxf == 2.1){
                total += (produitf.prix_devis * produitf.qte_devis *  (this.devis.remise ? (1-(this.devis.remise / 100)) : 1) ) * (produitf.pourcentf ? produitf.pourcentf / 100 : 1)* (parseInt(produitf.tauxf) /100);
            }
        }
        return total;
    }

    TVADU()
    {
        let total = 0;

        for (let produit of this.produitDevis) {
            if (produit.taux == 2.1){
                total += (produit.prix * produit.qte *  (this.devis.remise ? (1-(this.devis.remise / 100)) : 1) ) * (produit.pourcent ? produit.pourcent / 100 : 1)* (parseInt(produit.taux) /100);
            }
        }
        return total;
    }

    SummTvaDU(){
        return this.TVADU() + this.TVADUO();
    }

    TVAZO()
    {
        let total = 0;

        for (let produitf of this.produitFact) {
            if (produitf.tauxf == 0){
                total += (produitf.prix_devis * produitf.qte_devis *  (this.devis.remise ? (1-(this.devis.remise / 100)) : 1) ) * (produitf.pourcentf ? produitf.pourcentf / 100 : 1)* (parseInt(produitf.tauxf) /100);
            }
        }
        return total;
    }

    TVAZ()
    {
        let total = 0;

        for (let produit of this.produitDevis) {
            if (produit.taux == 0){
                total +=( produit.prix * produit.qte *  (this.devis.remise ? (1-(this.devis.remise / 100)) : 1) ) * (produit.pourcent ? produit.pourcent / 100 : 1)* (parseInt(produit.taux) /100);
            }
        }
        return total;
    }

    SummTvaZ(){
        return this.TVAZ() + this.TVAZO();
    }


    submit() {

        let factparams : any = {};
        factparams.devis = this.devis;
        factparams.produitDevis = this.produitDevis;
        factparams.produitFact = this.produitFact;
        factparams.nfact =this.nfact;
        //factparams.tvas =this.tvas;


        console.log(factparams);
        this.factureService.Flibre(factparams).subscribe(
            data=>{
                this.router.navigate(["/listefacture"]);
                this.alertService.success("La facture a été créée avec succès.");
            });
    }



}