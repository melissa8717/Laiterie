import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {FactureService} from '../_services/facture.service';
import {ParamsService} from '../_services/params.service'; //
import {User} from '../_models/user';
import {DomSanitizer} from '@angular/platform-browser';
import {FormBuilder} from '@angular/forms';
import {FileUploader} from 'ng2-file-upload';
import {AppConfig} from '../app.config';

const URLimg = 'http://' + location.hostname + ':4000/image/';

@Component({
    moduleId: module.id,
    templateUrl: 'avoirimprim.component.html'
})

export class AvoirimprimComponent {

    public uploaderImg: FileUploader;


    currentUser: User;
    droitsuser: any = {};
    _id: any;                   //
    data: any = {};

    valeur: any = {};
    id_avoir: number;
    fact: any = {};
    produit: any[] = [];
    libre: any[] = [];
    print: boolean = false;

    files: any[] = [];
    fileReader = new FileReader();
    base64Files: any;
    loc = location.hostname;
    image: any[];
    id_agence: number;
    img: any = {};


    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private factureService: FactureService,
                private builder: FormBuilder,
                private _sanitizer: DomSanitizer,
                private paramsService: ParamsService,
                private config: AppConfig) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        let body = document.getElementsByTagName('body')[0];
        body.className = '';
        body.className += 'flatclair';
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.loaddroituser();
        this.loadAvoir();
        this.loadAllFooter();
        this.loadProduit();
        this.loadlibre();
        this.loadAllagence();


    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }

    loadAllFooter() {

        this.factureService.getAllFooter().subscribe(fact => {
            this.fact = fact[0];

        });
    }

    loadAvoir() {
        this.route.params.subscribe(params => {
            this.id_avoir = params['id_avoir']
            this.factureService.getByIdAvoir(this.id_avoir).subscribe(
                data => {
                    this.valeur = data[0];
                    console.log(data);
                }
            )
        });
    }

    loadProduit() {
        this.route.params.subscribe(params => {
            this.id_avoir = params['id_avoir']
            this.factureService.getByIdPeodavoir(this.id_avoir).subscribe(
                data => {
                    this.produit = data;
                    console.log(data)
                }
            )
        });
    }

    loadlibre() {
        this.route.params.subscribe(params => {
            this.id_avoir = params['id_avoir']
            this.factureService.getByIdPeodavlibre(this.id_avoir).subscribe(
                data => {
                    this.libre = data;
                   // console.log(data)
                }
            )
        });
    }

    countTotalProduit() {
        let total = 0;
        for (let prod of this.produit) {
            total += prod.prixfact * prod.qtefact;
        }
        return total;
    }

    countTotallibre() {
        let total = 0;
        for (let prod of this.libre) {
            total += prod.prix * prod.qte;
        }
        return total;
    }

    countTotals(){
        return this.countTotallibre() + this.countTotalProduit();
    }

    countTotallibreremise() {

             return  this.countTotals()* (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 0);

    }

    countTva() {
        return (this.countTotallibreremise()>0 ? this.countTotallibreremise() : this.countTotals()) * (this.valeur.tva / 100);
    }


    TVAV() {
        let total = 0;

        for (let produit of this.libre) {

            if (produit.tva == 20) {
                total += (produit.prix * produit.qte * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (produit.tva / 100);
            }

        }
        return total;
    }

    TVAD() {
        let total = 0;

        for (let produit of this.libre) {

            if (produit.tva == 10) {
                total += (produit.prix * produit.qte * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (produit.tva / 100);
            }

        }
        return total;
    }

    TVAC() {
        let total = 0;

        for (let produit of this.libre) {

            if (produit.tva == 5.5) {
                total += (produit.prix * produit.qte * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (produit.tva / 100);
            }

        }
        return total;
    }

    TVADU() {
        let total = 0;

        for (let produit of this.libre) {

            if (produit.tva == 2.1) {
                total += (produit.prix * produit.qte * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (produit.tva / 100);
            }

        }
        return total;
    }

    TVAZ() {
        let total = 0;

        for (let produit of this.libre) {

            if (produit.tva == 0) {
                total += 0 ;
            }

        }
        return total;
    }

    countTotalavoir() {
        return  (this.countTotallibreremise() >0 ? this.countTotallibreremise() :  this.countTotals()) + this.countTva() + this.TVAV() + this.TVAD() + this.TVAC() + this.TVADU() + this.TVAZ();
    }

    imprimer() {
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            window.print();
            this.print = false;
        }, 1000);
    }

    public onChange(event: Event) {
        let files = event.target['files'];
        if (event.target['files']) {
            console.log(event.target['files']);
            this.readFiles(event.target['files'], 0);
        }
    };

    private readFiles(files: any[], index: number) {
        let file = files[index];
        this.fileReader.onload = () => {
            this.base64Files.push(this.fileReader.result);
            if (files[index + 1]) {
                this.readFiles(files, index + 1);
            } else {
                console.log('loaded all files');
            }
        };
        this.fileReader.readAsDataURL(file);
    }


    loadAllagence() {

        this.paramsService.getAllAgence().subscribe(img => {

            this.img = img[0];
            //console.log(this.img);
            //console.log(this.currentUser);

            this.uploaderImg = new FileUploader({url: URLimg + 'agence/' + this.img.id_agence});
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