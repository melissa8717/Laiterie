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
    templateUrl: 'bdc.component.html'
})

export class BdcComponent {
    contacts: any = [];
    model: any;

    total: number;
    prix: number = 0;
    ht: number;
    quantite: number;
    livraison: number = 0;

    all: number = 0;
    fact: any={};
    chantiers: {}[] = [];
    fournisseurs: {}[] = [];
    products: {}[] = [];

    currentUser: User;

    List: any[] = [];
    print: boolean = false;

    droitsuser:any={};
    _id:any;
    data:any={};

    listing: any[] = [];
    new:any={};
    objf:any={};
    produitf: any = {};
    listingoption: any[] = [];
    bdc:any={};


    public myForm: FormGroup;


    constructor(private router: Router,
                private chantierService: ChantierService,
                private alertService: AlertService,
                private contactService: ContactService,
                private productService: AchatsService,
                private commandeService: CommandeService,
                private factureService: FactureService,
                private builder: FormBuilder,
                private _sanitizer: DomSanitizer,
                private paramsService:ParamsService) {

        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    date(){
        return new Date();
    }

    ngOnInit() {

        this.loaddroituser();

        this.myForm = this.builder.group({
            chantier: "",
            fournisseur: "",
            adresse: "",
            place: "",
            date: "",
            produit: "",
            quantite: "",
            ht: "",
            livraison: "",
        });


        this.myForm.valueChanges.subscribe(data => {
            //console.log(data);
            this.model = data.produit;
            //console.log(this.model);
            this.ht = this.ht ? data.ht : data.produit.prix_achat;
            this.quantite = this.quantite ? data.quantite : 1;

            this.prix = data.produit.prix_achat;
            console.log(this.model.prix_achat)
            console.log(data.ht)
            this.total = (data.ht ? data.ht : this.model.prix_achat) * (data.quantite ? data.quantite : 1);
            console.log(this.total)
            this.livraison = data.livraison;
            let total = 0;
            //if(list)
            for (let prod of this.List) {
                total += prod.total;
            }
            this.all = total + this.livraison;

        });

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flat";

        this.loadAllProducts();
        this.loadAllChantiers();
        this.loadAllFournisseurs();
        this.loadAllFooter();


    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    private loadAllChantiers() {
        this.chantierService.getAll().subscribe((chantiers: any) => {
            this.chantiers = chantiers;
            console.log(this.chantiers)
        });
    }

    private loadAllFournisseurs() {
        // console.log("on envoie la requette");
        this.contactService.getAllFournisseurs().subscribe(fournisseurs => {
            this.fournisseurs = fournisseurs;
            //console.log(this.fournisseurs);
        });
    }

    private loadAllProducts() {
        this.productService.getAll().subscribe(products => {
            this.products = products;
           // console.log(this.products);
        });
    }


    autocompleListFormatterProducts = (data: any): SafeHtml => {
        let html = `<span>${data.libelle} : ${data.prix_achat}€</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    autocompleListFormatterContact = (data: any): SafeHtml => {
        let html = `<span>${data.raison_sociale} : ${data.titre} ${data.nom}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    autocompleListFormatterchantier = (data: any): SafeHtml => {
        let html = `<span>${data.nom_chantier} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };


    addProduct() {

        var check = this.List.filter(obj => obj.id_produit == this.model.id_produit);

        if (check.length < 1) {
            if (this.model.id_produit) {
                let libelle = this.model.libelle;
                this.List.push({
                    reference: this.model.reference,
                    libelle: this.model.libelle,
                    unite: this.model.unite,
                    prix_prevu: this.ht ? this.ht : this.model.prix_achat,
                    ht: this.model.prix_achat,
                    quantite: this.quantite ? this.quantite : 1,
                    total: this.total,
                    id_produit: this.model.id_produit,
                    num_version: this.model.num_version
                });
                let total = 0;
                for (let prod of this.List) {
                    total += prod.total;
                }
                this.all = total + this.livraison;
                this.myForm.patchValue({
                    produit: "",
                    quantite: "",
                    ht: "",
                });
                this.alertService.success("Le produit " + libelle + " à bien été rajouté");
            }
        }
        else {
            this.alertService.error(" Vous avez déjà ajouté ce produit à votre bon de commande. ")
        }
        //console.log(this.List);
    }


    removeProduct(prod: any) {
        this.List = this.List.filter(obj => obj !== prod);


        let total = 0;
        for (let prod of this.List) {
            total += prod.total;
        }
        this.all = total + this.livraison;
    }

    onSubmit(value: any) {


        if ((this.List.length <0) ) {
            this.alertService.error("Veuillez entrer au moins un produit");
        } else {

            value.model = this.List;


            var bdc_param: any = {};
            bdc_param.adresse = value.adresse;
            bdc_param.id_fournisseur = value.fournisseur.id_contact;
            bdc_param.date = value.date;
            bdc_param.place = value.place;
            bdc_param.livraison = value.livraison ? value.livraison : 0;
            bdc_param.id_user = this.currentUser._id;
            bdc_param.id_chantier = value.chantier.id_chantier;
            bdc_param.products = this.List;
            bdc_param.listing = this.listing;


            this.commandeService.add(bdc_param).subscribe(data => {
                    this.router.navigate(['/suivi_commande']);
                    this.alertService.success("Bon de commande ajouté");
                },
                err => {
                    this.alertService.error(" Erreur lors de la création du bdc, Réessayez ou contactez un administrateur : " + err)
                });
        }

    }

    ajouter() {
        let tmps: any = {};
        tmps.produit = this.produitf.objf;
        tmps.qtef = this.produitf.qtef;
        tmps.prixf = this.produitf.prixf;
        tmps.unitef = this.produitf.unitef;
        tmps.referencef = this.produitf.referencef;

        tmps.optionf = this.produitf.optionf;

        var check = this.listing.filter(objf => objf.refi == this.produitf.objf);

        if (check.length < 1) {
            if(tmps.optionf){
                this.listingoption.push(tmps);
            }
            else{
                this.listing.push(tmps);
                for(var i = 0 ; i <  this.listing.length; i++){
                    //console.log('TEST TS AJOUTER : '+this.produitDevis[i].prix);
                    let qtef = this.listing[i].qtef;
                    let prixf = this.listing[i].prixf;
                    let unitef = this.listing[i].unitef;

                    this.listing[i].qtef = qtef;
                    this.listing[i].prixf = prixf;
                    this.listing[i].unitef = unitef;


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

    }


    testfact() {

        console.log(this.produitf.libelle);
        this.produitf.qtef = 1;
        this.produitf.prixf = this.produitf.objf.prixf;
        this.produitf.unitef = this.produitf.objf.unitef;

    }

    supprimerfact(prode: any) {
        this.listing = this.listing.filter(objf => objf !== prode);
    }

    totalibre(){
        let total = 0;
        for (let prode of this.listing) {
            total += prode.prixf * prode.qtef;
        }
        return total;

    }

    totaprod(){
        let total = 0;
        for (let prod of this.List) {
            total += prod.prix_prevu * prod.quantite;
        }
        return total;

    }

    imprimer(){
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            window.print();
            this.print = false;
        }, 1000);
    }

    loadAllFooter() {
        //console.log(this.recherche.seek)
        this.factureService.getAllFooter().subscribe(data => {
            this.fact = data[0];
            console.log(this.fact);

        });
    }
}