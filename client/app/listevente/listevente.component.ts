/**
 * Created by Wbat on 23/05/2017.
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService, AchatsService } from '../_services/index';
import { Product } from "../_models/products/produit";
import {VentesService} from "../_services/ventes.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'listevente.component.html',
})

export class ListeventeComponent {
    products: Product[] = [];       // ne change jamais, contient tous les produits
    returnUrl: string;

    productToFind = {libelle: "", categorie: "", produitCompose: ""};   // pour la recherche
    produitCompose = new Product();  // pour la recherche - produit compose
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
        private ventesService: VentesService,
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
        this.ventesService.getAll().subscribe(products => {
            this.products = products;
            console.log(this.products)
            this.filteredProducts = products;
        });
    }

    private delete(id: string) {

        this.ventesService.delete(id)
            .subscribe(
                data => {
                    this.alertService.success('Produit supprimé', true);
                    this.products = this.products.filter(x => x.id_prc !== id);
                    this.filteredProducts = this.products.filter(x => x.id_prc !== id);
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

        if(seek.reference){
            this.filteredProducts = this.filteredProducts.filter(function (el: any) {
                return ((el.id_prc ? el.id_prc : "").toString().toLowerCase().indexOf((seek.reference? seek.reference : "").toLowerCase()) !== -1);
            });
        }

        if(seek.categorie){
            this.filteredProducts = this.filteredProducts.filter(function (el: any) {
                return ((el.cat_libelle ? el.cat_libelle : "").toLowerCase().indexOf((seek.categorie? seek.categorie : "").toLowerCase()) !== -1);
            });
        }
    }

    private showAll() {
        this.filteredProducts = this.products;
    }

    private isEmpty(str: string) {
        return (!str || 0 === str.length);
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