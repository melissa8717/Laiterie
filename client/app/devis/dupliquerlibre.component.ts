import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService} from '../_services/index';
import {ChantierService} from "../_services/chantier.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";                      //
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
import {FactureService} from "../_services/facture.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {FormBuilder} from "@angular/forms";
import {VentesService} from "../_services/ventes.service";
import {ContactService} from "../_services/contact.service";




@Component({
    moduleId: module.id,
    templateUrl: 'dupliquerlibre.component.html'
})

export class DupliquerlibreComponent {
    devis: any = {};

    produit: any = {};

    produits: {}[] = [];
    chantiers: {}[] = [];
    clients: {}[] = [];

    address = false;

    id_devis:number;
    num_version:number;
    footer: string;

    produitDevis: any[] = [];
    produitDevisOptions: any[] = [];

    private sub: any;
    print: boolean = false;
    cgv: any ={};
    fact: any={};

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};
    facts:any[]=[];




    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private contactService:ContactService,
                private chantierService:ChantierService,
                private factureService:FactureService,
                private devisService: DevisService,
                private venteService: VentesService,
                private paramsService: ParamsService,
                private builder: FormBuilder, private _sanitizer: DomSanitizer) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    }

    ngOnInit() {


        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        /* this.loadDevis();

         this.produits();*/

        this.loadAllFooter();
        this.loaddroituser();
        this.loadCat();
        this.loadTva();



        this.sub = this.route.params.subscribe(params => {
            this.id_devis = params['id_devis'];
            this.num_version = params['num_version'];
            //console.log(this.num_version)
            this.devisService.getByIddupliquer(this.id_devis, this.num_version).subscribe(
                (data : any) =>{
                    this.devis  = data.devis[0];
                    this.produitDevis = data.detaille;
                    this.produitDevisOptions = data.options;
                        console.log( this.produitDevisOptions);
                        console.log(this.produitDevis); console.log(this.devis);
                }
            )
        });

    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            //console.log(this.data);
            //console.log(this.currentUser._id);
        });
    }

    loadAllFooter() {
        //console.log(this.recherche.seek)

        this.factureService.getAllFooter().subscribe(data => {
            this.fact = data[0];
            //console.log(this.fact);

        });
    }


    ajouter() {
        let tmp: any = {};
        tmp.produit = this.produit.obj;
        tmp.qte_devis = this.produit.qte;
        tmp.prix_devis = this.produit.prix;
        tmp.unite = this.produit.unite;
        tmp.option = this.produit.option;
        tmp.commentaire = this.produit.commentaire;
        tmp.taux = this.produit.taux;

        var check = this.produitDevis.filter(obj => obj.ref == this.produit.obj);

        if (check.length < 1) {
            if(tmp.option){
                this.produitDevisOptions.push(tmp);
            }
            else{
                this.produitDevis.push(tmp);
                for(var i = 0 ; i <  this.produitDevis.length; i++){
                    //console.log('TEST TS AJOUTER : '+this.produitDevis[i].prix);
                    let qte = this.produitDevis[i].qte_devis;
                    let prix = this.produitDevis[i].prix_devis;
                    let unite = this.produitDevis[i].unite;
                    this.produitDevis[i].qte_devis = qte;
                    this.produitDevis[i].prix_devis = prix;
                    this.produitDevis[i].unite = unite;
                }
            }
        }
        else {
            this.alertService.error("Le produit " + tmp.obj + " n'a pas pu être ajouté.");
        }
        this.produit.qte = null;
        this.produit.prix = null;
        this.produit.unite = null;
        this.produit = {};
        this.accomptepercent();
        //console.log('TEST TS AJOUTER : '+this.produitDevis);
    }




    supprimer(produit: any) {
        this.produitDevis = this.produitDevis.filter(obj => obj !== produit);
    }

    supprimeroption(produit: any) {
        this.produitDevisOptions = this.produitDevisOptions.filter(obj => obj !== produit);
    }

    accompteeuro(){
        this.devis.accompte_percent = (+this.devis.accompte_value / this.totalTVA() *100).toFixed(2);
    }
    accomptepercent(){
        this.devis.accompte_value = (+this.devis.accompte_percent * this.totalTVA() /100).toFixed(2);
    }

    test() {
        console.log(this.devis)
        console.log(this.produit)
        this.produit.qte = 1;
        this.produit.prix = this.produit.obj.prix_vente;
        this.produit.unite = this.produit.obj.unite;
        this.produit.ref = this.produit.obj.id_prc;
    }

    private loadAllChantiers() {
        this.chantierService.getAll().subscribe(chantiers => {
            this.chantiers = chantiers;
            // console.log(this.chantiers)
        });
    }

    private loadAllClients() {
        // console.log("on envoie la requette");
        this.contactService.getAllClients().subscribe(clients => {
            this.clients = clients;
            // console.log(this.clients);
        });
    }

    loadAllProduits() {
        this.venteService.getAll().subscribe(
            data => {
                this.produits = data;
                //  console.log(this.produits);
            }
        )
    }

    countTotal() {
        let total = 0;
        for (let produit of this.produitDevis) {
            total += produit.prix_devis * produit.qte_devis;
        }
        return total;
    }



    countTotalRemise() {
        return this.countTotal() - (this.countTotal() * this.devis.remise / 100);
    }

    countTotalprodTVA(){
        return this.countTotalRemise()>0 ? this.countTotalRemise()* ((this.devis.tvadevis ? this.devis.tvadevis : 0) /100) : this.countTotal()* ((this.devis.tvadevis ? this.devis.tvadevis : 0) /100);
    }
    countTotalTVA() {
        return (this.countTotalRemise()>0 ? this.countTotalRemise()* (1+((this.devis.tvadevis ? this.devis.tvadevis : 0) /100)) : this.countTotal()* (1+((this.devis.tvadevis ? this.devis.tvadevis : 0) /100)))+ this. countAllTVA();
    }






    countTotalOptions() {
        let total = 0;
        for (let produit of this.produitDevisOptions) {
            total += produit.prix_devis * produit.qte_devis;
        }
        return total;
    }

    countTotalOptionRemise() {
        return this.countTotalOptions() - (this.countTotalOptions() * this.devis.remise / 100);
    }
    countTotalOptionsTVA() {
        return this.countTotalOptionRemise()>0?this.countTotalOptionRemise() * ((this.devis.tvadevis ? this.devis.tvadevis : 0) /100):this.countTotalOptions()* ((this.devis.tvadevis ? this.devis.tvadevis : 0) /100);
    }
    countTotalOptionstotalTVA() {
        return (this.countTotalOptionRemise()>0?this.countTotalOptionRemise() * ((1+(this.devis.tvadevis ? this.devis.tvadevis : 0) /100)):this.countTotalOptions()* (1+((this.devis.tvadevis ? this.devis.tvadevis : 0) /100)))+ this.countAllTVAO();
    }





    total() {
        return this.countTotal() + this.countTotalOptions() ;
    }

    totalRemiseTVA() {
        return this.countTotalOptionRemise() + this.countTotalRemise();
    }
    totalTVA() {
        return  this.countTotalprodTVA()+this.countTotalOptionsTVA() + this.countAllTVAO() + this.countAllTVA();
    }

    countTotalfinal(){
        return this. countTotalTVA()+this.countTotalOptionstotalTVA();
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

    submit() {

        let devisparams : any = {};
        devisparams.devis = this.devis;
        devisparams.produitDevis = this.produitDevis;
        devisparams.produitDevisOptions = this.produitDevisOptions;

        console.log(devisparams);
        this.devisService.duplicatelibre(devisparams, this.id_devis).subscribe(
            data=>{
                this.router.navigate(["/listedevis"]);
                this.alertService.success("Le devis a été créé avec succès.");
            });
    }

    customTrackBy(index: number, obj: any): any {
        return index;
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
            console.log(this.cgv);

        });
    }
    loadTva(){
        this.paramsService.getAllTVA().subscribe(facts => {

            this.facts = facts;

        });
    }


    countNTVAZ() {
        let total = 0;

        for (let produit of this.produitDevis) {

            if (produit.taux == 0 || produit.tva == 0) {
                total +=  0;


            }
        }
        return total;

    }
    countNTVA() {
        let total = 0;

        for (let produit of this.produitDevis) {
            if (produit.taux == 2.1 || produit.tva == 2.1) {
                total += (produit.taux? produit.taux /100 : produit.tva/100) * produit.prix_devis * produit.qte_devis *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


            }
        }
        return total;

    }

    countNTVAC() {
        let total = 0;

        for (let produit of this.produitDevis) {

            if (produit.taux == 5.5 || produit.tva == 5.5) {
                total += (produit.taux? produit.taux /100 : produit.tva/100) * produit.prix_devis * produit.qte_devis *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


            }
        }
        return total;

    }

    countNTVAD() {
        let total = 0;

        for (let produit of this.produitDevis) {

            if (produit.taux == 10 || produit.tva == 10) {
                total += (produit.taux? produit.taux /100 : produit.tva/100) * produit.prix_devis * produit.qte_devis *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


            }
        }
        return total;

    }

    countNTVAs() {
        let total = 0;

        for (let produit of this.produitDevis) {

            if ((produit.taux == 20) ||(produit.tva == 20)) {
                total += (produit.taux? produit.taux /100 : produit.tva/100) * produit.prix_devis * produit.qte_devis *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


            }
        }
        return total;

    }


    countNTVAZO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {
            if (produit.taux == 0 || produit.tva == 0) {
                total +=  0 ;


            }
        }
        return total;

    }
    countNTVAO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {

            if (produit.taux == 2.1 || produit.tva == 2.1) {
                total += (produit.taux? produit.taux /100 : produit.tva/100) * produit.prix_devis * produit.qte_devis *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


            }
        }
        return total;

    }

    countNTVACO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {

            if (produit.taux == 5.5 || produit.tva == 5.5) {
                total += (produit.taux? produit.taux /100 : produit.tva/100) * produit.prix_devis * produit.qte_devis *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


            }
        }
        return total;

    }

    countNTVADO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {

            if (produit.taux == 10 || produit.tva == 10) {
                total += (produit.taux? produit.taux /100 : produit.tva/100) * produit.prix_devis * produit.qte_devis *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


            }
        }
        return total;

    }

    countNTVAsO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {

            if (produit.taux == 20 || produit.tva == 20) {
                total += (produit.taux? produit.taux /100 : produit.tva/100) * produit.prix_devis * produit.qte_devis *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


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


}