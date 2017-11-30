/**
 * Created by Wbat on 06/07/2017.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {FormBuilder, FormGroup} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {DevisService} from "../_services/devis.service";
import {VentesService} from "../_services/ventes.service";
import {ContactService} from "../_services/contact.service";
import {ChantierService} from "../_services/chantier.service";
import {Observable} from "rxjs/Observable";
import {isUndefined} from "util";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'newDevis.component.html'
})

export class NewDevisComponent implements OnInit {


    devis: any = {};

    valeur: any [] = [];

    produit: any = {};

    produits: {}[] = [];
    chantiers: {}[] = [];
    clients: {}[] = [];

    address = false;

    produitDevis: any[] = [];
    produitDevisOptions: any[] = [];
    remise: number;

    currentUser: User;         //
    droitsuser: any = {};         //
    _id: any;                   //
    data: any = {};
    ntva: number;
    fact: any[] = [];
    i:any;
    taux:number;


    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private contactService: ContactService,
                private chantierService: ChantierService,
                private devisService: DevisService,
                private venteService: VentesService,
                private builder: FormBuilder,
                private _sanitizer: DomSanitizer,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit(): void {
        //let timer = Observable.timer(2000,5000);
        this.loadAllChantiers();
        this.loadAllClients();
        this.loadAllProduits();
        this.loadAllTVA();
        this.loaddroituser();
        this.loadTva();
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
        tmp.obj = this.produit.obj;
        tmp.qte = this.produit.qte;
        tmp.prix = this.produit.prix;
        tmp.unite = this.produit.unite;
        tmp.option = this.produit.option;
        tmp.taux = this.produit.taux;
        tmp.commentaire = this.produit.commentaire;
        tmp.ref = this.produit.ref;


        var check = this.produitDevis.filter(obj => obj.ref == this.produit.obj.id_prc);

        if (check.length < 1) {
            if (tmp.obj.id_prc) {
                if (tmp.option) {
                    this.produitDevisOptions.push(tmp);
                }
                else {
                    this.produitDevis.push(tmp);
                    for (var i = 0; i < this.produitDevis.length; i++) {
                        console.log(this.produitDevis[i]);
                        let qte = this.produitDevis[i].qte;
                        let prix = this.produitDevis[i].prix;
                        // let taux = this.produitDevis[i].taux;
                        this.produitDevis[i].qte = qte;
                        this.produitDevis[i].prix = prix;
                        // this.produitDevis[i] = this.produitDevis[i].taux;
                    }
                }

            }
            else {
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

    supprimer(produit: any) {
        this.produitDevis = this.produitDevis.filter(obj => obj !== produit);
    }

    supprimeroption(produit: any) {
        this.produitDevisOptions = this.produitDevisOptions.filter(obj => obj !== produit);
    }

    accompteeuro() {
        this.devis.accomptepercentage = (this.devis.accompteeuros / this.countTotalTVA() * 100).toFixed(2);
    }

    accomptepercent() {
        this.devis.accompteeuros = (this.devis.accomptepercentage * this.countTotalTVA() / 100).toFixed(2);
    }

    test() {

        this.produit.qte = 1;
        this.produit.prix = this.produit.obj.prix_vente;
        this.produit.unite = this.produit.obj.unite;
        this.produit.ref = this.produit.obj.id_prc;
        this.produit.taux = this.produit.taux;
    }

    private loadAllChantiers() {
        this.chantierService.getAll().subscribe(chantiers => {
            this.chantiers = chantiers;
            console.log(this.chantiers)
        });
    }

    private loadAllClients() {
        // console.log("on envoie la requette");
        this.contactService.getAllClients().subscribe(clients => {
            this.clients = clients;
            console.log(this.clients);
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

    countTotal() {
        let total = 0;
        for (let produit of this.produitDevis) {
            total += produit.prix * produit.qte;
        }
        return total;
    }

    countTotalRemise() {
        return this.countTotal() - (this.countTotal() * this.devis.remise / 100);
    }

    countTotalOptionRemise() {
        return this.countTotalOptions() - (this.countTotalOptions() * (this.devis.remise / 100));
    }

    totalRemiseTVA() {
        return this.totalTVA() - (this.totalTVA() * this.devis.remise / 100);
    }

    countTVA() {

        return this.countTotalRemise() > 0 ? this.countTotalRemise() * ((this.produit.ntva ? this.produit.ntva : 0) / 100) : this.countTotal() * ((this.produit.ntva ? this.produit.ntva : 0) / 100);

    }


    countTotalTVA() {

        return this.countTotalRemise() > 0 ? this.countTotalRemise() * (1 + ((this.devis.tva ? this.devis.tva : 0) / 100)) : this.countTotal() + this.countAllTVA();

    }

    countTotalOptions() {
        let total = 0;
        for (let produit of this.produitDevisOptions) {
            total += produit.prix * produit.qte;
        }
        return total;
    }

    countTotalOptionsTVA() {
        return this.countTotalOptionRemise() > 0 ? this.countTotalOptionRemise() + this.countAllTVAO() : this.countTotalOptions() + this.countAllTVAO();
    }

    total() {
        return this.countTotal() + this.countTotalOptions();
    }

    totalremise() {
        return this.countTotalOptionRemise() + this.countTotalRemise();
    }

    totalTVAoption() {
        return this.countTotalOptionRemise() > 0 ? (this.countTotalOptionRemise() + this.countAllTVAO()) : (this.countTotalOptions() + this.countTotalOptions()) + this.countAllTVAO();
    }


    totalTVA() {
        return this.totalremise() > 0 ? (this.totalremise() * (1 + ((this.devis.tva ? this.devis.tva : 0) / 100))) : (this.countTotal() + this.countTotalOptions()) * (1 + ((this.devis.tva ? this.devis.tva : 0) / 100));
    }

    totalTVATVA() {
        return this.totalTVAoption() + this.countTVA();
    }

    loadAllTVA() {
        this.devisService.getAllTVA().subscribe(
            data => {
                this.valeur = data;
                console.log(data);
            }
        )
    }


    getAddress(id:any){
        if(id!=null){
            this.contactService.getById(id).subscribe(contact=>{
                    if(contact){
                        this.devis.address = contact.adresse;
                        this.devis.cp = contact.code_postal;
                        this.devis.ville = contact.ville;
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

        let devisparams: any = {};
        devisparams.devis = this.devis;
        if (this.devis.chantier.id_chantier) {
            devisparams.devis.id_chantier = this.devis.chantier.id_chantier;
            devisparams.devis.nom_chantier = this.devis.chantier.nom_chantier;
        }
        else {
            devisparams.devis.nom_chantier = this.devis.chantier;
            devisparams.devis.id_chantier = null;
        }
        devisparams.produitDevis = this.produitDevis;
        devisparams.produitDevisOptions = this.produitDevisOptions;

        console.log("submit"+devisparams);
        this.devisService.add(devisparams).subscribe(
            data => {
                this.router.navigate(["/listedevis"]);
                this.alertService.success("Le devis a été créé avec succès.");
            });
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


    autocompleListFormatterchantier = (data: any): SafeHtml => {
        let html = `<span>${data.nom_chantier} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    countNTVAZ() {
        let total = 0;

        for (let produit of this.produitDevis) {
            console.log(produit.prix);
            console.log(parseInt(produit.taux));
            if (produit.taux == 0) {
                total +=  0;


            }
        }
        return total;

    }
    countNTVA() {
        let total = 0;

        for (let produit of this.produitDevis) {
            console.log(produit.prix);
            console.log(parseInt(produit.taux));
            if (produit.taux == 2.1) {
                total += (produit.taux /100 ) * produit.prix * produit.qte;


            }
        }
        return total;

    }

    countNTVAC() {
        let total = 0;

        for (let produit of this.produitDevis) {
            console.log(produit.prix);
            console.log(parseInt(produit.taux));
            if (produit.taux == 5.5) {
                total += (produit.taux /100 ) * produit.prix * produit.qte;


            }
        }
        return total;

    }

    countNTVAD() {
        let total = 0;

        for (let produit of this.produitDevis) {

            if (produit.taux == 10) {
                total += (produit.taux /100 ) * produit.prix * produit.qte;


            }
        }
        return total;

    }

    countNTVAs() {
        let total = 0;

        for (let produit of this.produitDevis) {

            if (produit.taux == 20) {
                total += (produit.taux /100 ) * produit.prix * produit.qte;


            }
        }
        return total;

    }


    countNTVAZO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {
            console.log(produit.prix);
            console.log(parseInt(produit.taux));
            if (produit.taux == 0) {
                total +=  0 ;


            }
        }
        return total;

    }
    countNTVAO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {
            console.log(produit.prix);
            console.log(parseInt(produit.taux));
            if (produit.taux == 2.1) {
                total += (produit.taux /100 ) * produit.prix * produit.qte;


            }
        }
        return total;

    }

    countNTVACO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {
            console.log(produit.prix);
            console.log(parseInt(produit.taux));
            if (produit.taux == 5.5) {
                total += (produit.taux /100 ) * produit.prix * produit.qte;


            }
        }
        return total;

    }

    countNTVADO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {

            if (produit.taux == 10) {
                total += (produit.taux /100 ) * produit.prix * produit.qte;


            }
        }
        return total;

    }

    countNTVAsO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {

            if (produit.taux == 20) {
                total += (produit.taux /100 ) * produit.prix * produit.qte;


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
