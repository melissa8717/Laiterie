import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, AuthenticationService} from '../_services/index';
import {FormBuilder, FormGroup} from "@angular/forms";
import {VentesService} from "../_services/ventes.service";
import {DevisService} from "../_services/devis.service";
import {ContactService} from "../_services/contact.service";
import {ChantierService} from "../_services/chantier.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'devislibre.component.html'
})

export class DevislibreComponent  implements OnInit{

    currentUser: User;
    droitsuser:any={};
    _id:any;
    data:any={};
    devis: any = {};
    valeur:any []=[];
    produit: any = {};
    produits: {}[] = [];
    chantiers: {}[] = [];
    clients: {}[] = [];
    address = false;
    produitDevis: any[] = [];
    produitDevisOptions: any[] = [];
    remise:number;
    fact: any[] = [];

    constructor(private route: ActivatedRoute,
                private alertService: AlertService,
                private authenticationService: AuthenticationService,
                private router: Router,
                private chantierService:ChantierService,
                private devisService: DevisService,
                private contactService:ContactService,
                private venteService: VentesService,
                private builder: FormBuilder,
                private _sanitizer: DomSanitizer,
                private paramsService:ParamsService){
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit(){
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loadAllTVA();
        this.loadAllClients();
        this.loadAllChantiers();
        this.loaddroituser();
        this.loadAllProduits();
        this.loadTva();
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
            console.log(this.data);
            console.log(this.currentUser._id);
        });
    }

    ajouter() {
        let tmp: any = {};
        tmp.obj = this.produit.obj;
        tmp.ref = this.produit.ref;
        tmp.qte = this.produit.qte;
        tmp.prix = this.produit.prix;
        tmp.unite = this.produit.unite;
        tmp.option = this.produit.option;
        tmp.taux = this.produit.taux;
        tmp.commentaire = this.produit.commentaire;
        //tmp.ref = this.produit.ref;

        var check = this.produitDevis.filter(obj => obj.ref == this.produit.obj); //.id_prc

        if (check.length < 1) {
            if(tmp.option){
                this.produitDevisOptions.push(tmp);
            }
            else{
                this.produitDevis.push(tmp);
                for(var i = 0 ; i <  this.produitDevis.length; i++){
                    //console.log('TEST TS AJOUTER : '+this.produitDevis[i].prix);
                    let qte = this.produitDevis[i].qte;
                    let prix = this.produitDevis[i].prix;
                    this.produitDevis[i].qte = qte;
                    this.produitDevis[i].prix = prix;
                }
            }
        }
        else {
            this.alertService.error("Le produit " + tmp.obj + " n'a pas pu être ajouté.");
        }
        this.produit.qte = null;
        this.produit.prix = null;
        this.produit = {};
        this.accomptepercent();
        //console.log('TEST TS AJOUTER : '+this.produitDevis);
    }

    submit() {

        let devisparams : any = {};
        console.log(devisparams)
        devisparams.devis = this.devis;
        devisparams.produitDevis = this.produitDevis;
        devisparams.produitDevisOptions = this.produitDevisOptions;


        //console.log('TEST SUBMIT PRIX 0 : '+this.produitDevis[0].prix);
        //console.log('TEST TS CHANTIER : '+this.devis.chantier);


        this.devisService.addLibre(devisparams).subscribe(
            data=>{
                this.router.navigate(["/listedevis"]);
                //this.alertService.success("Le devis a été créé avec succès.");
            });
    }

    supprimer(produit: any) {
        this.produitDevis = this.produitDevis.filter(obj => obj !== produit);
    }

    supprimeroption(produit: any) {
        this.produitDevisOptions = this.produitDevisOptions.filter(obj => obj !== produit);
    }

    accompteeuro(){
        this.devis.accomptepercentage = (this.devis.accompteeuros / this.countTotalTVA() *100).toFixed(2);
    }
    accomptepercent(){
        this.devis.accompteeuros = (this.devis.accomptepercentage * this.countTotalTVA() /100).toFixed(2);
    }

    test() {
        //console.log('TEST DEVIS : '+this.devis)
        //console.log('TEST PRODUIT : '+this.produit)
        this.produit.qte = 1;
        this.produit.prix = this.produit.obj.prix_vente;
        this.produit.unite = this.produit.obj.unite;
        this.produit.ref = this.produit.obj.id_prc;
        this.produit.taux = this.produit.obj.taux;
    }

    private loadAllChantiers() {
        this.chantierService.getAll().subscribe(chantiers => {
            this.chantiers = chantiers;
            //console.log(this.chantiers)
        });
    }

    private loadAllClients() {
        // console.log("on envoie la requette");
        this.contactService.getAllClients().subscribe(clients => {
            this.clients = clients;
            //console.log(this.clients);
        });
    }

    loadAllProduits() {
        this.venteService.getAll().subscribe(
            data => {
                this.produits = data;
                //console.log(this.produits);
            }
        )
    }

    countTotal() {
        let total = 0;
        for (let produit of this.produitDevis) {
            total += produit.prix * produit.qte;
        }
        return this.devis.total = total;
    }

    countTotalRemise() {
        this.devis.montant_ht = this.countTotal() - (this.countTotal() * this.devis.remise / 100);
         return this.devis.montant_ht;
    }

    countTotalOptionRemise() {
        return this.countTotalOptions() - (this.countTotalOptions() * (this.devis.remise / 100));
    }

    totalRemiseTVA() {
        return this.totalTVA() - (this.totalTVA() * this.devis.remise / 100);
    }

    countTVA() {
        return this.countTotalRemise() > 0 ? this.countTotalRemise() *  ((this.devis.tva ? this.devis.tva : 0) / 100): this.countTotal() *  ((this.devis.tva ? this.devis.tva : 0) / 100);
    }

    countTotalTVA() {
        return (this.countTotalRemise() > 0 ? this.countTotalRemise() * (1 + ((this.devis.tva ? this.devis.tva : 0) / 100)):this.countTotal() * (1 + ((this.devis.tva ? this.devis.tva : 0) / 100)))+ this.countAllTVA();
    }

    countTotalOptions() {
        let total = 0;
        for (let produit of this.produitDevisOptions) {
            total += produit.prix * produit.qte;
        }
        return total;
    }
    countTotalOptionsTVA() {
        return (this.countTotalOptionRemise()>0 ? this.countTotalOptionRemise() * (1 +(this.devis.tva ? this.devis.tva : 0) /100) : this.countTotalOptions()* (1 + ((this.devis.tva ? this.devis.tva : 0) / 100))) +this. countAllTVAO();
    }

    total() {
        return this.countTotal() + this.countTotalOptions() ;
    }

    totalremise(){
        return this. countTotalOptionRemise() + this.countTotalRemise();
    }

    totalTVAoption() {
        return this.countTotalOptionRemise()>0 ? (this.countTotalOptionRemise()* ((this.devis.tva ? this.devis.tva : 0) /100)) : ( this.countTotalOptions()) *((this.devis.tva ? this.devis.tva : 0) /100);
    }

    totalTVA() {
        return (this.totalremise()>0 ? (this.totalremise()* (1 + ((this.devis.tva ? this.devis.tva : 0) /100))) : (this.countTotal() + this.countTotalOptions()) *(1 +((this.devis.tva ? this.devis.tva : 0) /100))) + this.countAllTVA() + +this. countAllTVAO() ;
    }

    totalTVATVA(){
        return this. totalTVAoption() + this. countTVA()+  this.countAllTVAO()+ this.countAllTVA();
    }

    loadAllTVA(){
        this.devisService.getAllTVA().subscribe(
            data => {
                this.valeur = data;
                //console.log(data);
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
                total += (produit.taux /100 ) * produit.prix * produit.qte *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


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
                total += (produit.taux /100 ) * produit.prix * produit.qte *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


            }
        }
        return total;

    }

    countNTVAD() {
        let total = 0;

        for (let produit of this.produitDevis) {

            if (produit.taux == 10) {
                total += (produit.taux /100 ) * produit.prix * produit.qte *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


            }
        }
        return total;

    }

    countNTVAs() {
        let total = 0;

        for (let produit of this.produitDevis) {

            if (produit.taux == 20) {
                total += (produit.taux /100 ) * produit.prix * produit.qte *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


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

            if (produit.taux == 2.1) {
                total += (produit.taux /100 ) * produit.prix * produit.qte *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


            }
        }
        return total;

    }

    countNTVACO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {

            if (produit.taux == 5.5) {
                total += (produit.taux /100 ) * produit.prix * produit.qte *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


            }
        }
        return total;

    }

    countNTVADO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {

            if (produit.taux == 10) {
                total += (produit.taux /100 ) * produit.prix * produit.qte *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


            }
        }
        return total;

    }

    countNTVAsO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {

            if (produit.taux == 20) {
                total += (produit.taux /100 ) * produit.prix * produit.qte *(this.devis.remise ? (1-(this.devis.remise / 100)) :1);


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
        this.paramsService.getAllTVA().subscribe(fact => {

            this.fact = fact;
            console.log(this.fact);

        });
    }

}
