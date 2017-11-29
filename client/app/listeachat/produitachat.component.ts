import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AlertService, AuthenticationService, AchatsService} from '../_services/index';
import {Product} from "../_models/products/produit";
import {Histo} from "../_models/histo";
import {FileUploader} from 'ng2-file-upload';
import {AppConfig} from "../app.config";
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";

const URL = 'http://' + location.hostname + ':4000/ged/';
const URLimg = 'http://' + location.hostname + ':4000/image/';

@Component({
    moduleId: module.id,
    templateUrl: 'produitachat.component.html',
})

export class ProduitachatComponent implements OnInit {
    unites = ["m", "m²", "m3", "litre", "tonne", "kilogramme", "heure", "unité", "mètre linéaire"];

    //ged
    public uploader: FileUploader;
    public uploaderImg: FileUploader;
    public hasBaseDropZoneOver: boolean = false;
    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }
    //fin ged

    loc = location.hostname;
    id: string;
    num_version: string
    private sub: any;
    product = new Product();
    productDate: Date;
    formattedDate: string;
    updateProduct: any = {};
    modif = new Histo();
    loading = false;
    historique: any[];
    print: boolean = false;
    currentUser: User;
    droitsuser: any = {};
    _id: any;
    data: any = {};
    returnUrl: string;
    ged: any[];
    id_produit: number;
    cat: any [] = [];
    image: any[];
    production: any ={};

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private achatService: AchatsService,
                private alertService: AlertService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loaddroituser();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        this.sub = this.route.params.subscribe(params => {

            this.id = params['id']; // (+) converts string 'id' to a number
            this.num_version = params['num_version']; // (+) converts string 'id' to a number

            // In a real app: dispatch action to load the details here.
            this.achatService.getById(this.id, this.num_version).subscribe(val => {
                this.product = val[0]; // val c'est l'array d'un seul element
               //
                // console.log(this.product);

                this.updateProduct = Object.assign({}, this.product);
                this.updateProduct.tarif_du = this.formattedDate;

                // la date a afficher sur la page
                this.productDate = new Date(this.product.tarif_du);
                this.formattedDate = this.formatDate(this.productDate);
                this.loadHistorique(this.id);
                this.loadCat();
                this.loadAllImg();

            });

            console.log("this id_produit: " + this.id);

            this.route.params.subscribe(params => {
                this.id = params['id'];
                console.log("id"+params['id']);
               // this.id = params['id_produit'];
                //ged
                this.getGed(params['id']);
                this.uploaderImg = new FileUploader({url: URLimg + "img/" + this.id_produit});
                console.log("id uploader"+  URLimg + "img/" + this.id_produit);
                this.uploaderImg.onAfterAddingFile = (file) => {
                    file.withCredentials = false;
                };
                this.uploader = new FileUploader({url: URL + "produits/" + params['id']});
                this.uploader.onAfterAddingFile = (file) => {
                    file.withCredentials = false;
                };
                //ged
            });

        });
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
            //console.log(this.data);
            //console.log(this.currentUser._id);
        });
    }

    getHost(){
        var h = location.hostname;
        return h;
    }

    // visualisation de l'image avant envoi
    url: any;

    readUrl(event: any) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (event: any) => {
                this.url = event.target.result;
            }
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    private loadHistorique(id: string) {
        this.achatService.getAllHisto(id).subscribe(
            modifs => {
                // charge la date de modif et le prenom de contact qui a fait la modif
                this.historique = modifs;
               // console.log(this.historique);
                //console.log("loaded histo : " + JSON.stringify(this.historique));
            }
        );
    }

    private loadCat() {
        this.achatService.getAllCategories().subscribe(
            cat => {
                this.cat = cat;
               // console.log(this.cat);

            }
        );
    }

    private modifyProduct() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.updateProduct.id_user = currentUser._id;
        console.log("update prd"+this.updateProduct+this.id);
        this.loading = true;
        this.achatService.update(this.updateProduct).subscribe(
            data => {
                console.log("data update prod: " + data);
                this.loading = false;
                this.router.navigate(['/listeachat']);
                this.alertService.success("Le produit a bien été modifié. ")
            }
        );
    }



    private formatDate(date: Date) {
        var day = ("0" + date.getDate()).slice(-2);
        var month = ("0" + (date.getMonth() + 1)).slice(-2)
        var year = date.getFullYear();
        return year + '-' + month + '-' + day; // format pour chrome, not tested in other browsers
    }

    private formatStringToDate(date: any) {
        var d = new Date(date);
        // console.log("formatted date: " + this.formatDate(d));
        return this.formatDate(d);
    }


    private debug() {
        console.log("historique avec les noms: " + JSON.stringify(this.historique));
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
      //  console.log(currentUser._id);
        //console.log(currentUser.firstName);
    }


    /*************************** GED ***************************/
    private getGed(id_produit: number) {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.achatService.getGed(id_produit)
                .subscribe(
                    data => {
                        this.ged = data;
                       // console.log(this.ged);
                    },
                    error => {
                      //  console.log("Couldn't load the ged infos");
                        //console.log(error);
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

        this.achatService.getAllImg().subscribe(production => {

            this.production = production[0];
            console.log("prod"+this.production);
            //console.log(this.currentUser);

            this.uploaderImg = new FileUploader({url: URLimg + "img/" + this.production.id_produit});
            this.uploaderImg.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };

            /*this.uploader = new FileUploader({url: URL + "param/" + this.model.id_agence});
            this.uploader.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };*/

        });

    }
}