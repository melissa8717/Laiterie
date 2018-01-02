/**
 * Created by Wbat on 23/05/2017.
 */
import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AlertService} from '../_services/index';
import {ChantierService} from "../_services/chantier.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ContactService} from "../_services/contact.service";
import {CommandeService} from "../_services/commandes.service";
import {User} from "../_models/user";
import {AchatsService} from "../_services/achats.service";
import {FactureService} from "../_services/facture.service";
import {ParamsService} from "../_services/params.service";


@Component({
    moduleId: module.id,
    templateUrl: 'otestock.component.html'
})

export class OtestockComponent {


    model: any;

    situa: any[] = [];
    situas: any = {};

    produitDevis: any[] = [];

    products: {}[] = [];

    chantiers: {}[] = [];

    currentUser: User;

    print: boolean = false;

    droitsuser:any={};
    _id:any;
    data:any={};

    chantier: any = {};
    nom:string;



    constructor(private router: Router,
                private chantierService: ChantierService,
                private alertService: AlertService,
                private contactService: ContactService,
                private productService: AchatsService,
                private commandeService: CommandeService,
                private factureService: FactureService,
                private builder: FormBuilder,
                private _sanitizer: DomSanitizer,
                private paramsService: ParamsService) {

        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }



    ngOnInit() {

        this.loaddroituser();
        this.loadAllProducts();
        this.loadAllChantiers();

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flat";


    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

        });
    }

    private loadAllChantiers() {
        this.chantierService.getAll().subscribe((chantiers: any) => {
            this.chantiers = chantiers;
            console.log(this.chantiers)
        });
    }

    autocompleListFormatterchantier = (data: any): SafeHtml => {
        let html = `<span>${data.nom_chantier} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    private loadAllProducts() {
        this.productService.getAll().subscribe(products => {
            this.products = products;
            console.log(this.products);
        });
    }


    autocompleListFormatterProducts = (data: any): SafeHtml => {
        let html = `<span>${data.libelle} : ${data.prix_achat}€</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };
    ajouter() {
        let tmp: any = {};
        tmp.obj = this.situas.obj;
        tmp.qtefact = this.situas.qtefact;
        tmp.prix_achat = this.situas.prix_achat;
        tmp.num_version = this.situas.num_version;
        tmp.id_produit = this.situas.id_produit;
        tmp.reference = this.situas.reference;
        tmp.unite = this.situas.unite;


        var check = this.produitDevis.filter(obj => obj.ref == this.situas.obj.id_produit);

        if (check.length < 1) {
            if (tmp.obj.id_produit) {

                this.produitDevis.push(tmp);
                for (var i = 0; i < this.produitDevis.length; i++) {
                    console.log(this.produitDevis[i]);
                    let qtefact = this.produitDevis[i].qtefact;
                    this.produitDevis[i].qtefact = qtefact;
                }

            }
            else {
                this.alertService.error('Veuillez ajouter un produit existant.');
            }
        }
        else {
            this.alertService.error('Le produit ' + tmp.obj.libelle + ' n\'a pas pu être ajouté.');
        }


        this.situas.qtefact = null;
        this.situas = {};

        //console.log(this.produitDevis);
    }

    test() {

        console.log(this.situas)
        this.situas.qtefact = 1;
        this.situas.id_produit = this.situas.obj.id_produit;
        this.situas.reference = this.situas.obj.reference;
        this.situas.unite = this.situas.obj.unite;
        this.situas.prix_achat = this.situas.obj.prix_achat;
        this.situas.num_version = this.situas.obj.num_version;

    }

    supprimer(situas: any) {
        this.produitDevis = this.produitDevis.filter(obj => obj !== situas);
    }

    submite() {

        let stockparams: any = {};


        stockparams.produitDevis = this.produitDevis;
        stockparams.chantier = this.chantier;
        stockparams.id_user = this.currentUser._id;
        console.log(stockparams);

        this.commandeService.otestock(stockparams).subscribe(
            data => {
                this.router.navigate(['/suivi_commande']);
                this.alertService.success('Les produits ont été retirés des stocks avec succès.');
            });
    }
}