import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AchatsService, AlertService, AuthenticationService, UtilsService} from '../_services/index';
import {Product} from "../_models/products/produit";

@Component({
    moduleId: module.id,
    templateUrl: 'listeachat.component.html',
})

export class ListeachatComponent implements OnInit {

    private products: Product[] = []; // ne change jamais, contient tous les produits

    private filteredProducts: Product[] = []; // pour la recherche - easy switch between all and filtered
    private print: boolean = false;


    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private achatsService: AchatsService,
                private alertService: AlertService,
                private utilsService: UtilsService) {
    }

    ngOnInit() {
        this.loadAllProducts();
    }

    private loadAllProducts() {
        this.achatsService.getAllProduitsAchat().subscribe(products => {
            this.products = products;
            this.filteredProducts = products;
        });

    }

    private delete(id: number) {
        this.achatsService.delete(id).subscribe(() => {
            this.alertService.success('Produit supprimé', true);
            this.products = this.products.filter(x => x.id_produit != id);
            this.filteredProducts = this.products.filter(x => x.id_produit != id);
        }, error => {
            this.alertService.error(error._body);
        });
    }

    private navigateToProduct(id: string) {
        this.router.navigate(['/produitvente', id]);
    }

    private printPage(htmlPage: any) {
        var w = window.open("about:blank");
        w.document.write(htmlPage);
        if (navigator.appName == 'Microsoft Internet Explorer') window.print();
        else w.print();
    }


    filterProducts(seek: any) {
        this.filteredProducts = this.products;

        console.log(this.filteredProducts);
        console.log(seek);

        if (seek.libelle) {
            this.filteredProducts = this.filteredProducts.filter(function (product: Product) {
                return ((product.libelle ? product.libelle : "").toLowerCase().indexOf((seek.libelle ? seek.libelle : "").toLowerCase()) !== -1);
            });
        }
        if (seek.nom) {
            this.filteredProducts = this.filteredProducts.filter(function (el: Product) {
                return ((el.contact_name ? el.contact_name : "").toLowerCase().indexOf((seek.nom ? seek.nom : "").toLowerCase()) !== -1);
            });
        }
        if (seek.fournisseur) {
            if (seek.fournisseur.raison_sociale) {
                this.filteredProducts =
                    this.filteredProducts.filter(function (el: Product) {
                        return ((el.raison_sociale ? el.raison_sociale : "").toLowerCase().indexOf(seek.fournisseur.raison_sociale.toLowerCase()) !== -1);
                    });
            }
            else {
                this.filteredProducts =
                    this.filteredProducts.filter(function (el: Product) {
                        return ((el.contact_name ? el.contact_name : "").toLowerCase().indexOf(seek.fournisseur.nom.toLowerCase()) !== -1);
                    });
            }
        }
        if (seek.cat_libelle) {
            this.filteredProducts = this.filteredProducts.filter(function (el: Product) {
                return ((el.cat_libelle ? el.cat_libelle : "").toLowerCase().indexOf((seek.cat_libelle ? seek.cat_libelle : "").toLowerCase()) !== -1);
            });
        }

    }

    private showAll() {
        this.filteredProducts = this.products;
    }

    imprimer() {
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            window.print();
            this.print = false;
        }, 1000);
    }
}