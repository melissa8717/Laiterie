import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {FactureService} from '../_services/facture.service';
import {ParamsService} from '../_services/params.service'; //
import {User} from '../_models/user';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {FormBuilder} from '@angular/forms';
import {FileUploader} from 'ng2-file-upload';
import {AppConfig} from '../app.config';

const URLimg = 'http://' + location.hostname + ':4000/image/';

@Component({
    moduleId: module.id,
    templateUrl: 'avoirlibre.component.html'
})

export class AvoirlibreComponent {
    public uploaderImg: FileUploader;


    currentUser: User;
    droitsuser: any = {};
    _id: any;                   //
    data: any = {};

    model: any = {};

    fact: any = {};

    id_facture: number;
    n_situation: number;
    produitDevis: any[] = [];
    produitDevisopt: any[] = [];
    navoir: any = {};
    situa: any[] = [];
    situas: any = {};

    files: any[] = [];
    fileReader = new FileReader();
    base64Files: any;
    loc = location.hostname;
    image: any[];
    id_agence: number;
    img: any = {};

    print: boolean = false;


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

        this.loadAllFooter();
        this.loaddroituser();
        this.loadAllAvoir();
        this.loadModif();
        this.loadSituation();
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

    loadAllAvoir() {

        this.factureService.getAllNavoir().subscribe(avoir => {
            this.navoir = avoir[0];
            console.log(this.navoir);

        });
    }

    loadModif() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture'];
            this.n_situation = params['n_situation'];
            this.factureService.getByIdLibreModif(this.id_facture, this.n_situation).subscribe(
                data => {
                    this.model = data[0];

                }
            )
        });
    }

    loadSituation() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture']
            this.n_situation = params['n_situation']
            console.log(this.id_facture, this.n_situation);
            this.factureService.getByIdAvoirlibre(this.id_facture, this.n_situation).subscribe(
                data => {
                    this.situa = data;
                    console.log(this.situa);
                }
            )
        });
    }

    autocompleListFormatterSitua = (data: any): SafeHtml => {
        let html = `<span>${data.nom}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    ajouter() {
        let tmp: any = {};
        tmp.obj = this.situas.obj;
        tmp.qte = this.situas.qte;
        tmp.prix = this.situas.prix;
        tmp.tva = this.situas.tva;
        tmp.id_prod = this.situas.id_prod;


        var check = this.produitDevis.filter(obj => obj.ref == this.situas.obj.id_prod);

        if (check.length < 1) {
            if (tmp.obj.id_prod) {

                this.produitDevis.push(tmp);
                for (var i = 0; i < this.produitDevis.length; i++) {
                    console.log(this.produitDevis[i]);
                    let qte = this.produitDevis[i].qte;
                    let prix = this.produitDevis[i].prix;
                    this.produitDevis[i].qte = qte;
                    this.produitDevis[i].prix = prix;
                }

            }
            else {
                this.alertService.error('Veuillez ajouter un produit existant.');
            }
        }
        else {
            this.alertService.error('Le produit ' + tmp.obj.nom + ' n\'a pas pu être ajouté.');
        }


        this.situas.qte = null;
        this.situas.prix = null;
        this.situas = {};

        //console.log(this.produitDevis);
    }

    test() {

        console.log(this.situas)
        this.situas.qte = 1;
        this.situas.prix = this.situas.obj.prix;
        this.situas.tva = this.situas.obj.tva;

    }

    supprimer(situas: any) {
        this.produitDevis = this.produitDevis.filter(obj => obj !== situas);
    }


    countTotalSit() {
        let total = 0;
        for (let situas of this.produitDevis) {
            total += situas.prix * situas.qte;
        }
        return total;
    }

    countRemise() {
        this.model.montant_ht = this.countTotalSit() * (this.model.remise ? (1 - (this.model.remise) / 100) : 1)*(-1);
        return this.model.montant_ht
    }

    TVAV() {
        let total = 0;

        for (let produit of this.produitDevis) {

            if (produit.tva == 20) {
                total += (produit.prix * produit.qte * (this.model.remise ? (1 - (this.model.remise / 100)) : 1) ) * (produit.tva / 100);
            }

        }
        return total;
    }

    TVAD() {
        let total = 0;

        for (let produit of this.produitDevis) {

            if (produit.tva == 10) {
                total += (produit.prix * produit.qte * (this.model.remise ? (1 - (this.model.remise / 100)) : 1) ) * (produit.tva / 100);
            }

        }
        return total;
    }

    TVAC() {
        let total = 0;

        for (let produit of this.produitDevis) {

            if (produit.tva == 5.5) {
                total += (produit.prix * produit.qte * (this.model.remise ? (1 - (this.model.remise / 100)) : 1) ) * (produit.tva / 100);
            }

        }
        return total;
    }

    TVADU() {
        let total = 0;

        for (let produit of this.produitDevis) {

            if (produit.tva == 2.1) {
                total += (produit.prix * produit.qte * (this.model.remise ? (1 - (this.model.remise / 100)) : 1) ) * (produit.tva / 100);
            }

        }
        return total;
    }

    TVAZ() {
        let total = 0;

        for (let produit of this.produitDevis) {

            if (produit.tva == 0) {
                total += (produit.prix * produit.qte * (this.model.remise ? (1 - (this.model.remise / 100)) : 1) );
            }

        }
        return total;
    }


    countTotalTTC() {
        return (this.countRemise()) - (+ this.TVAV() + this.TVAD() + this.TVAC() + this.TVADU() + this.TVAZ());
    }


    submit() {

        let avoirparams: any = {};
        avoirparams.model = this.model;
        avoirparams.navoir = this.navoir;
        avoirparams.produitDevis = this.produitDevis;

        console.log(avoirparams);
        this.factureService.addavoirlibre(avoirparams).subscribe(
            data => {
                this.router.navigate(['/listeavoir']);
                this.alertService.success('L\'avoir a été créé avec succès.');
            });
    }

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
            console.log(this.img);
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

    imprimer() {
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            window.print();
            this.print = false;
        }, 1000);
    }
}