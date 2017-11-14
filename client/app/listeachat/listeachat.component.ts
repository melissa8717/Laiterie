import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService, AchatsService } from '../_services/index';
import { Product } from "../_models/products/produit";
import {RechercheAchatComponent} from "./rechercheachat.component";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'listeachat.component.html',
})

export class ListeachatComponent {
    products: Product[] = [];       // ne change jamais, contient tous les produits
    returnUrl: string;
    // contactToFind = {nom:"", prenom:"", type:"", tel:"", adresse:"", code_postal:"", ville:""};
    productToFind = {libelle: "", fournisseur: "", categorie: ""};   // pour la recherche

    // cette liste des produits est affiché sur la page html
    filteredProducts: Product[] = []; // pour la recherche - easy switch between all and filtered
    print: boolean = false;

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private achatsService: AchatsService,
        private alertService: AlertService,
        private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllProducts();
        this.loaddroituser();
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    private loadAllProducts() {
        this.achatsService.getAllProduitsAchat().subscribe(products => {
            this.products = products;
            this.filteredProducts = products;
            console.log(this.products);
        });

    }

    private delete(id: string) {
        console.log("deleting product" + id);
        this.achatsService.delete(id)
            .subscribe(
                data => {
                    this.alertService.success('Produit supprimé', true);
                    this.products = this.products.filter(x => x.id_produit !== id);
                    this.filteredProducts = this.products.filter(x => x.id_produit !== id);
                    // console.log("after deletind: " + JSON.stringify(this.products));
                },
                error => {
                    this.alertService.error(error._body);
                });
    }

    private navigateToProduct(id: string) {
        this.router.navigate(['/produitvente', id]);
    }

    private printPage(htmlPage: any)  {
        var w = window.open("about:blank");
        w.document.write(htmlPage);
        if (navigator.appName == 'Microsoft Internet Explorer') window.print();
        else w.print();
    }


    filterProducts(seek: any) {

        console.log(seek);

        this.filteredProducts = this.products;

        if(seek.libelle){
            this.filteredProducts = this.filteredProducts.filter(function (el: any) {
               return ((el.libelle ? el.libelle : "").toLowerCase().indexOf((seek.libelle? seek.libelle : "").toLowerCase()) !== -1);
            });
        }
        if(seek.nom){
            this.filteredProducts = this.filteredProducts.filter(function (el: any) {
                return ((el.nom ? el.nom : "").toLowerCase().indexOf((seek.nom? seek.nom : "").toLowerCase()) !== -1);
            });
        }
        if (seek.fournisseur) {
            if(seek.fournisseur.raison_sociale){
                this.filteredProducts =
                    this.filteredProducts.filter(function (el) {
                        return ((el.nom ? el.nom : "").toLowerCase().indexOf(seek.fournisseur.raison_sociale.toLowerCase()) !== -1 );
                    });
            }
            else{
                this.filteredProducts =
                    this.filteredProducts.filter(function (el) {
                        return ((el.nom ? el.nom : "").toLowerCase().indexOf(seek.fournisseur.toLowerCase()) !== -1 );
                    });
            }
        }
        if(seek.catlibel){
            this.filteredProducts = this.filteredProducts.filter(function (el: any) {
                return ((el.catlibel ? el.catlibel : "").toLowerCase().indexOf((seek.catlibel? seek.catlibel : "").toLowerCase()) !== -1);
            });
        }

    }

    private showAll() {
        this.filteredProducts = this.products;
    }

    imprimer(){
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            window.print();
            this.print = false;
        }, 1000);
    }
}