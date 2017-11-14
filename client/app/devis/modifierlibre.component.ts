import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService} from '../_services/index';
import {ChantierService} from "../_services/chantier.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";
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
    templateUrl: 'modifierlibre.component.html'
})

export class ModifierlibreComponent {
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
    currentUser: User;
    droitsuser:any={};
    _id:any;
    data:any={};

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

        this.loadAllFooter();
        this.loaddroituser();
        this.loadAllProduits();
        this.loadAllClients();
        this.loadCat();

        this.sub = this.route.params.subscribe(params => {
            this.id_devis = params['id_devis'];
            this.num_version = params['num_version'];
            //console.log(this.num_version)
            this.devisService.getByIddupliquer(this.id_devis, this.num_version).subscribe(
                (data : any) =>{
                    this.devis  = data.devis[0];
                    this.produitDevis = data.detaille;
                    this.produitDevisOptions = data.options;
                    //console.log('TS DEVIS : ');
                    //console.log(data);
                }
            )
        });
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];
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

        var check = this.produitDevis.filter(obj => obj.ref == this.produit.obj);

        if (check.length < 1) {
            if(tmp.option){
                this.produitDevisOptions.push(tmp);
            }
            else{
                this.produitDevis.push(tmp);
                for(var i = 0 ; i <  this.produitDevis.length; i++){
                    let qte = this.produitDevis[i].qte_devis;
                    let prix = this.produitDevis[i].prix_devis;
                    let unite = this.produitDevis[i].unite;
                    let commentaire = this.produitDevis[i].commentaire;
                    this.produitDevis[i].qte_devis = qte;
                    this.produitDevis[i].prix_devis = prix;
                    this.produitDevis[i].unite = unite;
                    this.produitDevis[i].commentaire = commentaire;
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
        //console.log(this.devis)
        //console.log(this.produit)
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
        return this.countTotalRemise()>0 ? this.countTotalRemise()* ((this.devis.tva ? this.devis.tva : 0) /100) : this.countTotal()* ((this.devis.tva ? this.devis.tva : 0) /100);
    }
    countTotalTVA() {
        return this.countTotalRemise()>0 ? this.countTotalRemise()* (1+((this.devis.tva ? this.devis.tva : 0) /100)) : this.countTotal()* (1+((this.devis.tva ? this.devis.tva : 0) /100));
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
        return this.countTotalOptionRemise()>0?this.countTotalOptionRemise() * ((this.devis.tva ? this.devis.tva : 0) /100):this.countTotalOptions()* ((this.devis.tva ? this.devis.tva : 0) /100);
    }
    countTotalOptionstotalTVA() {
        return this.countTotalOptionRemise()>0?this.countTotalOptionRemise() * ((1+(this.devis.tva ? this.devis.tva : 0) /100)):this.countTotalOptions()* (1+((this.devis.tva ? this.devis.tva : 0) /100));
    }

    total() {
        return this.countTotal() + this.countTotalOptions() ;
    }

    totalRemiseTVA() {
        return this.countTotalOptionRemise() + this.countTotalRemise();
    }
    totalTVA() {
        return  this.countTotalprodTVA()+this.countTotalOptionsTVA();
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
        this.devisService.modifylibre(devisparams, this.id_devis, this.num_version).subscribe(
            data=>{
                this.router.navigate(["/listedevis"]);
                this.alertService.success("Le devis a été modifié avec succès.");
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
        //console.log(this.cgv)

        this.paramsService.getAllVente().subscribe(cgv => {

            this.cgv = cgv[0];
            //console.log(this.cgv);
        });
    }

}