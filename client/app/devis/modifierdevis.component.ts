/**
 * Created by Wbat on 09/08/2017.
 */

import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {FormBuilder} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {DevisService} from "../_services/devis.service";
import {VentesService} from "../_services/ventes.service";
import {ContactService} from "../_services/contact.service";
import {ChantierService} from "../_services/chantier.service";
import {Observable} from "rxjs/Observable";
import {isUndefined} from "util";
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'modifierdevis.component.html'
})

export class ModifierDevisComponent implements OnInit {
    devis: any = {};

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};

    produit: any = {};

    produits: {}[] = [];
    chantiers: {}[] = [];
    clients: {}[] = [];

    address = false;

    id:number;
    num_version:number;
    footer: string;

    produitDevis: any[] = [];
    produitDevisOptions: any[] = [];

    private sub: any;
    print: boolean = false;
    fact: any[] = [];



    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private contactService:ContactService,
                private chantierService:ChantierService,
                private devisService: DevisService,
                private venteService: VentesService,
                private paramsService: ParamsService,
                private builder: FormBuilder,
                private _sanitizer: DomSanitizer) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit(): void {
        //let timer = Observable.timer(2000,5000);
        this.loadAllChantiers();
        this.loadAllClients();
        this.loadAllProduits();
        this.loaddroituser();
        this.loadTva();

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.num_version = params['num_version'];
            //console.log(this.num_version)
            this.devisService.getById(this.id, this.num_version).subscribe(
                (data : any) =>{
                    this.devis  = data.devis[0];
                    this.produitDevis = data.detaille;
                    this.produitDevisOptions = data.options;
                    console.log(this.produitDevis);
                }
            )
        });



        //getdevis

        //getalldevisoptions

    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    ajouter() {
        let tmp: any = {};
        tmp.libelle = this.produit.obj.libelle;
        tmp.id_prc = this.produit.obj.id_prc ? this.produit.obj.id_prc : this.produit.ref;
        tmp.num_version = this.produit.obj.num_version;
        tmp.qte_devis = this.produit.qte;
        tmp.prix_devis = this.produit.prix;
        tmp.unite = this.produit.unite;
        tmp.taux = this.produit.taux;
        tmp.option = this.produit.option;


        var check = this.produitDevis.filter(obj => obj.id_prc == this.produit.obj.id_prc);

        if (check.length < 1) {
            if (tmp.id_prc) {
                if(tmp.option){
                    this.produitDevisOptions.push(tmp);
                }
                else{
                    this.produitDevis.push(tmp);
                }

            }
            else{
                this.alertService.error("Veuillez ajouter un produit existant.");
            }
        }
        else {
            this.alertService.error("Le produit " + tmp.libelle+ " n'a pas pu être ajouté.");
        }




        this.produit.qte = null;
        this.produit.prix = null;
        this.produit = {};
        this.accomptepercent();
        console.log(this.produitDevis);
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
    countTotalTVA() {
        return this.countTotalRemise()>0 ? this.countTotalRemise()* ((this.devis.tva ? this.devis.tva : 0) /100) :this.countTotal() * ((this.devis.tva ? this.devis.tva : 0) /100);
    }
    countTotalprodTVA() {
        return this.countTotalRemise()>0 ? this.countTotalRemise()* (1+((this.devis.tva ? this.devis.tva : 0) /100)) : this.countTotal() * (1+((this.devis.tva ? this.devis.tva : 0) /100));
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
    countTotalTVAoption() {
        return this.countTotalOptionRemise()>0 ? this.countTotalOptionRemise()* ((this.devis.tva ? this.devis.tva : 0) /100) :this.countTotalOptions() * ((this.devis.tva ? this.devis.tva : 0) /100);
    }

    countTotalOptionsTVA() {
        return this.countTotalOptionRemise()>0 ? this.countTotalOptionRemise()* (1+((this.devis.tva ? this.devis.tva : 0) /100)) :this.countTotalOptions() * (1+((this.devis.tva ? this.devis.tva : 0) /100));
    }



    total() {
        return this.countTotal() + this.countTotalOptions() ;
    }
    totalRemiseTVA() {
        return this. countTotalRemise() + this.countTotalOptionRemise();
    }

    totalTVA() {
        return this.countTotalTVA()+this.countTotalTVAoption() ;
    }
    totalfinal(){
        return this.countTotalOptionsTVA()+this.countTotalprodTVA();
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
        //modify here
        this.devisService.modify(devisparams, this.id, this.num_version).subscribe(
            data=>{
                console.log(data);
                this.router.navigate(["/listedevis"]);
                this.alertService.success("Le devis a été modifié avec succès.");
            }
        );

        /*this.devisService.duplicate(devisparams, this.id).subscribe(
            data=>{
                this.router.navigate(["/listedevis"]);
                this.alertService.success("Le devis a été créé avec succès.");
            });*/
    }

    customTrackBy(index: number, obj: any): any {
        return index;
    }

    autocompleListFormatterProducts = (data: any): SafeHtml => {
        let html = `<span>${data.id_prc}-${data.libelle} : ${data.prix_vente ? data.prix_vente + "€" : "Prix non défini"}</span>`;
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



    autocompleListFormatterchantier = (data: any): SafeHtml => {
        let html = `<span>${data.nom_chantier} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };


    imprimer(){
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            window.print();
            this.print = false;
        }, 1000);
    }

    countNTVAZ() {
        let total = 0;

        for (let produit of this.produitDevis) {

            if (produit.taux == 0) {
                total +=  0;


            }
        }
        return total;

    }
    countNTVA() {
        let total = 0;

        for (let produit of this.produitDevis) {

            if (produit.taux == 2.1) {
                total += produit.qte_devis * produit.prix_devis * (parseInt(produit.taux)/100);


            }
        }
        return total;

    }




    countNTVAC() {
        let total = 0;

        for (let produit of this.produitDevis) {

            if (produit.taux == 5.5) {
                total += produit.qte_devis * produit.prix_devis * (parseInt(produit.taux)/100);


            }
        }
        return total;

    }

    countNTVAD() {
        let total = 0;

        for (let produit of this.produitDevis) {


            if (produit.taux == 10) {
                total += produit.qte_devis * produit.prix_devis * (parseInt(produit.taux)/100);


            }
        }
        return total;

    }

    countNTVAs() {
        let total = 0;

        for (let produit of this.produitDevis) {


            if (produit.taux == 20) {
                total += produit.qte_devis * produit.prix_devis * (parseInt(produit.taux)/100);
            }
        }
        return total;

    }


    countNTVAZO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {

            if (produit.taux == 0) {
                total +=  0;


            }
        }
        return total;

    }
    countNTVAO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {
            if (produit.taux == 2.1) {
                total += (parseFloat(produit.taux)/100) * produit.prix_devis * produit.qte_devis;


            }
        }
        return total;

    }

    countNTVACO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {
            if (produit.taux == 5.5) {
                total += (parseFloat(produit.taux)/100) * produit.prix_devis * produit.qte_devis;


            }
        }
        return total;

    }

    countNTVADO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {

            if (produit.taux == 10) {
                total += (parseInt(produit.taux)/100) * produit.prix_devis * produit.qte_devis;


            }
        }
        return total;

    }

    countNTVAsO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {
            console.log(produit.prix);
            console.log(parseInt(produit.taux));
            if (produit.taux == 20) {
                total += (parseInt(produit.taux)/100) * produit.prix_devis * produit.qte_devis;

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


    loadTva(){
        // console.log(this.fact)

        this.paramsService.getAllTVA().subscribe(fact => {

            this.fact = fact;
            // console.log(this.fact);

        });
    }

}
