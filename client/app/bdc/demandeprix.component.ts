/**
 * Created by Wbat on 03/07/2017.
 */
import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {CommandeService} from "../_services/commandes.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {FormBuilder} from "@angular/forms";
import {AchatsService} from "../_services/achats.service";
import {ChantierService} from "../_services/chantier.service";
import {ContactService} from "../_services/contact.service";
import {User} from "../_models/user";
import {FactureService} from "../_services/facture.service";

import {ParamsService} from "../_services/params.service"; //

@Component({
    moduleId: module.id,
    templateUrl: './demandeprix.component.html'
})

export class DemandePrixComponent  {

    currentUser: User;

    nomFournisseur: string;

    nomChantier: string;
    fact: any={};
    model: any = {};

    list: any[] = [];

    demande: any={};

    print: boolean = false;

    droitsuser:any={};         //
    _id:any;                   //
    data:any={};               //

    products: {}[] = [];
    chantiers: {}[] = [];
    fournisseurs: {}[] = [];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private alertService: AlertService,
                private chantierService: ChantierService,
                private contactService: ContactService,
                private commandeService: CommandeService,
                private factureService : FactureService,
                private productService: AchatsService,
                private _sanitizer: DomSanitizer,
                private paramsService:ParamsService)
    {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loadAllProducts();
        this.loadAllChantiers();
        this.loadAllFournisseurs();
        this.loadAllFooter();

        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    }

    saveProd(newValue: any){
        console.log(newValue);

        this.model.qte = 1;
        this.model.reference = newValue.reference;
    }

    date(){
        return new Date();
    }

    ngOnInit() {
        this.loaddroituser();                         //
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }



    ajouter(){
        console.log(this.print);
        console.log(this.model);
        let tmp : any = {} ;
        tmp.reference =  this.model.reference;
        tmp.libelle =  this.model.libelle;
        tmp.unite = this.model.unite;
        tmp.qte =  this.model.qte;

        var test = this.list.filter(obj => obj.reference == tmp.reference).length <= 100;

        if(test){
            this.list.push(tmp);
            this.alertService.success("Le produit "+ tmp.libelle + " a été ajouté. ");

        }
        else{
            this.alertService.error("Le produit "+ tmp.libelle+" n'a pas pu être ajouté. ");
        }

        this.model = {};

    }


    supprimer(produit: any){
        this.list = this.list.filter(obj => obj !== produit);
    }

    imprimer(){
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            window.print();
            this.print = false;
        }, 1000);
    }






    private loadAllChantiers() {
        this.chantierService.getAll().subscribe((chantiers:any) => {
            this.chantiers = chantiers;
            //console.log(this.chantiers)
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
            console.log(this.products);
        });
    }


    autocompleListFormatterProducts = (data: any): SafeHtml => {
        let html = `<span>${data.libelle} : ${data.prix_achat}€</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    autocompleListFormatterContact = (data: any): SafeHtml => {
        let html = `<span>${data.nom}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    autocompleListFormatterChantier = (data: any): SafeHtml => {
        let html = `<span>${data.nom_chantier} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    loadAllFooter() {
        //console.log(this.recherche.seek)
        this.factureService.getAllFooter().subscribe((data:any) => {
            this.fact = data[0];
            console.log(this.fact);

        });

    }

    enregistrer() {

        let devisparams : any = {};
        devisparams.demande = this.demande;
        devisparams.list = this.list;

        console.log(devisparams);
        this.commandeService.demandes(devisparams).subscribe(
            data=>{
                this.router.navigate(["/listedevis"]);
                this.alertService.success("Le demande de prix  a été enregistrée avec succès.");
            });
    }

}