import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AchatsService, AlertService, UtilsService} from '../_services/index';
import {Product} from "../_models/products/produit";
import {FileUploader} from 'ng2-file-upload';
import {Contact} from "../_models/contacts/contact";

@Component({
    moduleId: module.id,
    templateUrl: 'produitachat.component.html',
})

export class ProduitachatComponent implements OnInit {

    // Image uploader
    public uploaderImg: FileUploader;

    private id_product: number;
    private num_version: string;

    private unites: any[] = [];
    private categories: any [] = [];
    private historique: any[];
    private fournisseurs: Contact[] = [];

    private product = new Product();
    private updateProduct = new Product();

    private formattedDate: string; // useless ?
    private loading: boolean = false;
    private print: boolean = false;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private achatsService: AchatsService,
                private alertService: AlertService,
                private utilsService: UtilsService) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.id_product = params['id'];
            this.num_version = params['num_version'];

            this.achatsService.getById(this.id_product, this.num_version).subscribe(val => {
                this.product = val[0];

                this.updateProduct = Object.assign({}, this.product);
                this.updateProduct.tarif_du = this.formattedDate;

                // la date a afficher sur la page
                let productDate = new Date(this.product.tarif_du);
                this.formattedDate = this.formatDate(productDate);
                this.loadHistorique(this.id_product);
                this.loadCat();
                this.loadUnites();
                this.loadFournisseurs();
            });
        });
    }


    private loadHistorique(id: number) {
        this.achatsService.getAllHisto(id).subscribe(modifs => {
            // charge la date de modif et le prenom de contact qui a fait la modif
            this.historique = modifs;
        });
    }

    private loadCat() {
        this.achatsService.getAllCategories().subscribe(categories => {
            this.categories = categories;
            this.updateProduct.cat_libelle = this.categories.find(cat => cat.id_cat == this.updateProduct.id_cat).libelle;
        });
    }

    private loadUnites() {
        this.achatsService.getAllUnite().subscribe(unites => {
            this.unites = unites;
            this.updateProduct.unite = this.unites.find(u => u.id_unite == this.updateProduct.unite).libelle;
        });
    }

    private loadFournisseurs() {
        this.achatsService.getAllFournisseur().subscribe(fournisseurs => {
            this.fournisseurs = fournisseurs;
            this.updateProduct.contact_name = this.fournisseurs.find(f => f.id_contact == this.updateProduct.id_contact).nom;
        });
    }

    private modifyProduct() {
        this.loading = true;

        if(this.uploaderImg && this.uploaderImg.queue[0]) {
            this.uploaderImg.queue[0].upload();
        }

        this.updateProduct.id_user = this.utilsService.currentUser._id;
        this.updateProduct.id_cat = this.categories.find(cat => cat.libelle == this.updateProduct.cat_libelle).id_cat;
        this.updateProduct.unite = this.unites.find(u => u.libelle == this.updateProduct.unite).id_unite;
        this.updateProduct.id_contact = this.fournisseurs.find(f => f.nom == this.updateProduct.contact_name).id_contact;

        this.achatsService.update(this.updateProduct).subscribe(() => {
            this.alertService.success("Le produit a bien été modifié. ");
            this.loading = false;
            this.router.navigate(['/listeachat']);
        });
    }


    private formatDate(date: Date) {
        let day = ("0" + date.getDate()).slice(-2);
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
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