/**
 * Created by Wbat on 23/05/2017.
 */
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {FileUploader} from 'ng2-file-upload';
import {AchatsService, AlertService, UtilsService, VentesService} from '../_services/index';
import {Product} from '../_models/products/produit';


@Component({
    moduleId: module.id,
    templateUrl: 'produitvente.component.html'
})

export class ProduitventeComponent implements OnInit {

    private uploaderImg: FileUploader;

    private id_product: number;
    private num_version: string;

    private unites: any[] = [];
    private categories: any[] = [];
    private historique: any[];
    private allProducts: Product[] = [];
    private allMainOeuvres: any[] = [];

    private product = new Product();
    private updateProduct = new Product();

    private products: any[] = [];
    private mainOeuvres: any[] = [];

    private newProduct: any = {};
    private newMainOeuvre: any = {};

    private formattedDate: string;
    private loading = false;
    private print: boolean = false;


    constructor(private route: ActivatedRoute,
                private router: Router,
                private ventesService: VentesService,
                private achatsService: AchatsService,
                private alertService: AlertService,
                private _sanitizer: DomSanitizer,
                private utilsService: UtilsService) {
    }

    ngOnInit() {
        this.loadAllMainOeuvres();

        this.route.params.forEach(params => {
            this.id_product = params['id'];
            this.num_version = params['num_version'];

            this.ventesService.getById(this.id_product, this.num_version).subscribe(val => {
                this.product = val[0];
                this.updateProduct = Object.assign({}, this.product);

                // la date a afficher sur la page
                this.formattedDate = this.formatDate(new Date(this.product.tarif_du));

                this.loadHistorique();
                this.loadAllCategories();
                this.loadAllUnites();
            });
        });
    }

    private loadAllMainOeuvres() {
        this.achatsService.getAllMainOeuvre().subscribe(data => {
            this.allMainOeuvres = data;
        });
    }

    private loadHistorique() {
        this.ventesService.getAllHisto(this.id_product).subscribe(data => {
            this.historique = data;
        });
    }

    private loadAllCategories() {
        this.achatsService.getAllCategories().subscribe(categories => {
            this.categories = categories;
            this.updateProduct.cat_libelle = this.categories.find(cat => cat.id_cat == this.updateProduct.id_cat).libelle;
        });
    }

    private loadAllUnites() {
        this.achatsService.getAllUnite().subscribe(unites => {
            this.unites = unites;
            this.updateProduct.unite = this.unites.find(u => u.id_unite == this.updateProduct.unite).libelle;
            this.loadAllProduitsAchats();
            this.loadProduitsComposes();
        });
    }

    private loadAllProduitsAchats() {
        this.achatsService.getAll().subscribe(products => {
            this.allProducts = products;
            this.allProducts.forEach((product: any) => {
                let u = this.unites.find(u => u.id_unite == product.unite);
                if (u) product.unite = u.libelle;
            });
        });
    }

    private loadProduitsComposes() {
        this.loading = true;
        this.ventesService.getAllProdComp(this.id_product, this.num_version).subscribe(produits => {
            this.products = produits.produits;
            this.products.forEach((product: any) => {
                let u = this.unites.find(u => u.id_unite == product.unite);
                if (u) product.unite = u.libelle;
            });
            this.mainOeuvres = produits.mainOeuvre;
            this.loading = false;
        });
    }

    private modifyProduct() {
        this.loading = true;

        if (this.uploaderImg && this.uploaderImg.queue[0]) {
            this.uploaderImg.queue[0].upload();
        }

        this.updateProduct.prix_achat = this.getTotalPrixAchat();
        this.updateProduct.prix_vente = this.getTotalPrixVente();
        this.updateProduct.id_cat = this.categories.find(cat => cat.libelle == this.updateProduct.cat_libelle).id_cat;
        this.updateProduct.unite = this.unites.find(u => u.libelle == this.updateProduct.unite).id_unite;
        this.updateProduct.id_user = this.utilsService.currentUser._id;

        let tmp: any = {
            produit: this.updateProduct,
            produits: this.products,
            mainOeuvre: this.mainOeuvres
        };

        this.ventesService.newVersion(tmp).subscribe(() => {
            this.alertService.success('Le produit a bien été mis a jour. ')
            this.loading = false;
            this.router.navigate(['/listevente']);
        }, err => {
            console.error(err);
        })
    }


    private addProduct() {
        let check = this.products.filter(obj => obj.id_produit == this.newProduct.id_produit);
        if (check.length < 1) {
            let tmp = this.newProduct;
            this.newProduct = {};
            this.products.push(tmp);
            this.products.sort();
        }
        else {
            this.newProduct = {};
            this.alertService.error('Le produit n\'a pas pu être ajouté. Il est déjà présent dans la liste.')
        }
        this.calcvalue(this.updateProduct);
    }

    private addMO() {
        let check = this.mainOeuvres.filter(obj => obj.id_produit == this.newMainOeuvre.id_produit);
        if (check.length < 1) {
            let tmp = this.newMainOeuvre;
            this.mainOeuvres.push(tmp);
            this.newMainOeuvre = {};
        }
        else {
            this.newMainOeuvre = {};
            this.alertService.error('Cette main d\'oeuvre n\'a pas pu être ajoutée. Elle est déjà présente dans la liste.');
        }

        this.calcvalue(this.updateProduct);
    }


    private chooseProductByLibelle() {
        let prod = this.allProducts.find(x => x.libelle == this.newProduct.libelle.libelle);
        this.newProduct = Object.assign({}, prod);
        this.newProduct.quantite = 1;
        this.calcpercent(this.newProduct);
    }

    private getTotalMarge() {
        let i;
        let total = 0;
        for (i in this.products) {
            total += (+this.products[i].marge * this.products[i].quantite);
        }
        for (i in this.mainOeuvres) {
            total += (+this.mainOeuvres[i].marge * this.mainOeuvres[i].quantite);
        }
        return total;
    }


    private getTotalPrixVente(): number {
        return +((+this.getTotalPrixAchat() + +this.updateProduct.marge).toFixed(2));
    }


    private verifymarge(mo: any) {
        if (+mo.margepc < +mo.margemin) {
            alert('Attention, votre marge est inférieure à la marge minimale !');
        }
    }

    private supprimer(produit: any) {
        this.products = this.products.filter(obj => obj !== produit);
        this.calcvalue(this.updateProduct);
    }

    private supprimermainoeuvre(produit: any) {
        this.mainOeuvres = this.mainOeuvres.filter(obj => obj !== produit);
        this.calcvalue(this.updateProduct);
    }

    private chooseMainOeuvreLibelle() {
        let prod = this.allMainOeuvres.find(x => x.libelle == this.newMainOeuvre.libelle.libelle);
        this.newMainOeuvre = Object.assign({}, prod);
        this.newMainOeuvre.quantite = '00:00';
        this.calcpercent(this.newMainOeuvre);
    }

    private calcpercent(mo: any) {
        mo.margepc = (mo.marge && this.getTotalPrixAchat()) ?
            (mo.marge / this.getTotalPrixAchat() * 100).toFixed(2) : 0;
    }


    private calcvalue(mo: any) {
        mo.marge = (mo.margepc && this.getTotalPrixAchat()) ?
            (mo.margepc * this.getTotalPrixAchat() / 100).toFixed(2) : 0;
    }

    private getTotalPrixAchat(): number {
        let i;
        let total: number = 0;

        for (i in this.products) {
            total += (this.products[i].prix_achat) * this.products[i].quantite;
        }

        for (i in this.mainOeuvres) {
            total += this.calctotal(this.mainOeuvres[i]);
        }
        return +total.toFixed(2);
    }

    calctotalprod(mo: any) {
        return (mo.prix_achat && mo.quantite) ? (mo.prix_achat) * mo.quantite : 0;
    }

    calctotal(mo: any): number {
        return (mo.salaire_charge && this.getMinutesFromTime(mo.quantite.toString())) ?
            (mo.salaire_charge) * this.getMinutesFromTime(mo.quantite.toString()) / 60 : 0;
    }

    customTrackBy(index: number, obj: any): any {
        return index;
    }

    getMinutesFromTime(timer: string): number {
        if (timer) {
            let t = timer.split(':');
            return parseInt(t[0]) * 60 + parseInt(t[1]);
        }
        return 0;
    }

    autocompleListFormatterProducts = (data: any): SafeHtml => {
        let html = `<span>${data.libelle} : ${data.prix_achat}€ - ${data.raison_sociale ? data.raison_sociale : data.nom + ' ' + data.prenom} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };


    autocompleListFormatterMo = (data: any): SafeHtml => {
        let html = `<span>${data.libelle} : ${data.salaire_charge}€ </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    private formatDate(date: Date) {
        let day = ('0' + date.getDate()).slice(-2);
        let month = ('0' + (date.getMonth() + 1)).slice(-2);
        let year = date.getFullYear();

        return year + '-' + month + '-' + day; // format pour chrome, not tested in other browsers
    }


    imprimer() {
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            let css = '@page { size: landscape; }',
                head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');

            style.type = 'text/css';
            style.media = 'print';

            if (style.sheet) {
            } else {
                style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            window.print();
            this.print = false;
        }, 1000);
    }
}