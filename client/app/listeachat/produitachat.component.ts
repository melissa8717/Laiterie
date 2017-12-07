import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AchatsService, AlertService, AuthenticationService} from '../_services/index';
import {Product} from "../_models/products/produit";
import {FileUploader} from 'ng2-file-upload';
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";

const URL = 'http://' + location.hostname + ':4000/ged/';
const URLimg = 'http://' + location.hostname + ':4000/image/';

@Component({
    moduleId: module.id,
    templateUrl: 'produitachat.component.html',
})

export class ProduitachatComponent implements OnInit {

    //ged
    public uploader: FileUploader;
    public uploaderImg: FileUploader;
    public hasBaseDropZoneOver: boolean = false;

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    //fin ged

    private unites: any[] = [];
    private categories: any [] = [];
    private historique: any[];

    private loc = location.hostname;
    private id_produit: number;
    private num_version: string;

    private product = new Product();
    private updateProduct: any = {};

    private formattedDate: string; // useless ?
    private loading: boolean = false;
    private print: boolean = false;
    private currentUser: User;
    private droitsuser: any = {};
    private ged: any[];
    private production: any = {};
    // visualisation de l'image avant envoi
    private url: any;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private achatsService: AchatsService,
                private alertService: AlertService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loaddroituser();

        this.route.params.subscribe(params => {
            this.id_produit = params['id'];
            this.num_version = params['num_version'];

            this.achatsService.getById(this.id_produit, this.num_version).subscribe(val => {
                this.product = val[0];

                console.log(this.product);

                this.updateProduct = Object.assign({}, this.product);
                this.updateProduct.tarif_du = this.formattedDate;

                // la date a afficher sur la page
                let productDate = new Date(this.product.tarif_du);
                this.formattedDate = this.formatDate(productDate);
                this.loadHistorique(this.id_produit);
                this.loadCat();
                this.loadAllImg();
                this.loadUnites();
            });

            //ged
            this.getGed(params['id']);
            this.uploaderImg = new FileUploader({url: URLimg + "img/" + this.id_produit});
            this.uploaderImg.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };
            this.uploader = new FileUploader({url: URL + "produits/" + params['id']});
            this.uploader.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };
            //ged

        });
    }

    private loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
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
            this.updateProduct.id_cat = this.categories.find((cat) => cat.id_cat == this.updateProduct.id_cat).libelle;
        });
    }

    private loadUnites() {
        this.achatsService.getAllUnite().subscribe(unites => {
            this.unites = unites;
            this.updateProduct.unite = this.unites.find((u) => u.id_unite == this.updateProduct.unite).libelle;
        });
    }

    private modifyProduct() {
        this.loading = true;

        this.updateProduct.id_user = this.currentUser._id;
        this.updateProduct.id_cat = this.categories.find(cat => cat.libelle == this.updateProduct.id_cat).id_cat;
        this.updateProduct.unite = this.unites.find(u => u.libelle == this.updateProduct.unite).id_unite;

        console.log(this.updateProduct);

        this.achatsService.update(this.updateProduct).subscribe(() => {
            this.loading = false;
            this.router.navigate(['/listeachat']);
            this.alertService.success("Le produit a bien été modifié. ")
        });
    }

    private readUrl(event: any) {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (event: any) => {
                this.url = event.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }


    private formatDate(date: Date) {
        var day = ("0" + date.getDate()).slice(-2);
        var month = ("0" + (date.getMonth() + 1)).slice(-2)
        var year = date.getFullYear();
        return year + '-' + month + '-' + day; // format pour chrome, not tested in other browsers
    }

    private formatStringToDate(date: any) {
        let d = new Date(date);
        return this.formatDate(d);
    }


    /*************************** GED ***************************/
    private getGed(id_produit: number) {
        this.route.params.subscribe(params => {
            this.id_produit = params['id'];
            this.achatsService.getGed(id_produit)
                .subscribe(
                    data => {
                        this.ged = data;
                    },
                    error => {

                        this.alertService.error(error._body);
                    });
        });
    }

    /***************************fin GED************************************/

    imprimer() {
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            var css = '@page { size: landscape; }',
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


    loadAllImg() {
        this.achatsService.getAllImg().subscribe(production => {
            this.production = production[0];

            this.uploaderImg = new FileUploader({url: URLimg + "img/" + this.production.id_produit});
            this.uploaderImg.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };
        });
    }
}