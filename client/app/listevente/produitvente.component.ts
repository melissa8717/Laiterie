/**
 * Created by Wbat on 23/05/2017.
 */
import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService, AchatsService, ContactService} from '../_services/index';
import {Product} from "../_models/products/produit";
import {Histo} from "../_models/histo";
import {VentesService} from "../_services/ventes.service";
import {FormBuilder} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";
import {FileUploader} from 'ng2-file-upload';

const URLimg = 'http://'+location.hostname+':4000/image/';

@Component({
    moduleId: module.id,
    templateUrl: 'produitvente.component.html',
})

export class ProduitventeComponent implements OnInit {
    unites = ["m", "m²", "m3", "litre", "tonne", "kilogramme", "heure", "unité", "m linéaire", "lot", "sac", "big bag"];

    public uploaderImg: FileUploader;

    loc = location.hostname;
    id: string;
    num_version: string;
    private sub: any;
    product = new Product();
    productDate: Date;
    formattedDate: string;
    produitadd: any = {};
    mainOeuvreAdd: any = {};
    mainOeuvre: any[] = [];
    allProducts: Product[] = [];
    prodsComp: any[]; // de produit_compose, donc juste les IDs et la quantite
    produitsComposes: any[] = []; // produits composes total (de la table 'produit'), avec les prix et tout
    mainOeuvreList: any[] = []; // produits composes total (de la table 'produit'), avec les prix et tout
    updateProduct = new Product();
    modif = new Histo();
    loading = false;
    historique: any[];
    print: boolean = false;
    currentUser: User;
    droitsuser: any = {};
    _id: any;
    data: any = {};
    image: any[];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private ventesService: VentesService,
                private achatsService: AchatsService,
                private contactService: ContactService,
                private alertService: AlertService,
                private builder: FormBuilder, private _sanitizer: DomSanitizer,
                private _route: ActivatedRoute,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {

        this.loaddroituser();

        this.getAllProduitsVentes();
        this.loadAll();
        this.route.params.forEach(
            params => {

                this.id = params['id']; // (+) converts string 'id' to a number
                this.num_version = params['num_version'];

                this.loadProduitsComposes(this.id);

                // In a real app: dispatch action to load the details here.

                this.ventesService.getById(this.id, this.num_version).subscribe(val => {
                    this.product = val[0]; // val c'est l'array d'un seul element

                    // init les vals de updateProduct
                    this.updateProduct = Object.assign({}, this.product);

                    // la date a afficher sur la page
                    this.productDate = new Date(this.product.tarif_du);
                    this.formattedDate = this.formatDate(this.productDate);

                    this.loadHistorique(this.id);
                    console.log(this.product);

                    this.uploaderImg = new FileUploader({url: URLimg + "produitv/" + params['id']});
                    this.uploaderImg.onAfterAddingFile = (file) => {
                        file.withCredentials = false;
                    };
                });
            });
    }

    // visualisation de l'image avant envoi //**************************************************************************
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

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }


    private modifyProduct() {

        this.product.prix_achat = this.getTotalPrixAchat();
        this.product.prix_vente = this.getTotalPrixVente();


        let tmp: any = {
            produit: this.product,
            produits: this.produitsComposes,
            mainOeuvre: this.mainOeuvreList
        }

        console.log(tmp);
        this.loading = true;
        this.ventesService.newVersion(tmp).subscribe(
            data => {
                this.loading = false;
                this.router.navigate(['/listevente']);
                this.alertService.success("Le produit a bien été mis a jour. ")
            },
            err => {
                console.log(err);
            }
        )


    }


    private loadHistorique(id: string) {
        this.ventesService.getAllById(id).subscribe(
            data => {
                this.historique = data;
            },
            err => {
                console.log("impossible de charger l'historique");
            }
        )
    }


    private chooseProductByLibelle(i: number) {

        var prod = this.allProducts.filter(x => x.libelle == this.produitadd.libelle.libelle)[0];
        this.produitadd = Object.assign({}, prod);
        this.produitadd.quantite = 1;
        this.calcpercent(this.produitadd);
    }

    private getTotalMarge() {
        var total = 0;
        for (var i in this.produitsComposes) {
            total += (+this.produitsComposes[i].marge * this.produitsComposes[i].quantite);
        }
        for (var i in this.mainOeuvreList) {
            total += (+this.mainOeuvreList[i].marge * this.mainOeuvreList[i].quantite);
        }
        return total;
    }


    private getTotalPrixVente(): number {
        //return (1* (this.getTotalPrixAchat() + this.getTotalMarge()));
        return +((+this.getTotalPrixAchat() + +this.product.marge).toFixed(2));
    }


    verifymarge(mo: any) {
        if (+mo.margepc < +mo.margemin) {
            alert("Attention, votre marge est inférieure à la marge minimale !");
        }
    }

    supprimer(produit: any) {
        this.produitsComposes = this.produitsComposes.filter(obj => obj !== produit);
        console.log(this.produitsComposes)
        this.calcvalue(this.product);
    }

    supprimermainoeuvre(produit: any) {
        this.mainOeuvreList = this.mainOeuvreList.filter(obj => obj !== produit);
        this.calcvalue(this.product);
    }

    private chooseMainOeuvreLibelle(i: number) {
        var prod = this.mainOeuvre.filter(x => x.libelle == this.mainOeuvreAdd.libelle.libelle)[0];
        this.mainOeuvreAdd = Object.assign({}, prod);
        this.mainOeuvreAdd.quantite = "00:00";
        this.calcpercent(this.mainOeuvreAdd);
    }

    calcpercent(mo: any) {
        console.log("lol", mo.marge, this.getTotalPrixAchat());
        mo.margepc = (mo.marge && this.getTotalPrixAchat()) ?
            (mo.marge / this.getTotalPrixAchat() * 100).toFixed(2) : 0;
    }


    calcvalue(mo: any) {
        //this.verifymarge(mo);
        console.log(mo.margepc, this.getTotalPrixAchat())
        console.log(mo);
        mo.marge = (mo.margepc && this.getTotalPrixAchat()) ?
            (mo.margepc * this.getTotalPrixAchat() / 100).toFixed(2) : 0;
    }

    private getTotalPrixAchat(): number {
        /*var total = 0;
         for (var i in this.produitsComposes) {
         total += (this.produitsComposes[i].prix_achat * this.produitsComposes[i].quantite);
         }
         return total;*/

        var total: number = 0;

        for (var i in this.produitsComposes) {
            total += (this.produitsComposes[i].prix_achat ) * this.produitsComposes[i].quantite;
        }

        for (var i in this.mainOeuvreList) {
            total += this.calctotal(this.mainOeuvreList[i]);
        }

        return +total.toFixed(2);
    }

    addProduct() {
        if (this.produitadd.id_produit) {
            console.log(this.produitadd.id_produit);
        }
        var check = this.produitsComposes.filter(obj => obj.id_produit == this.produitadd.id_produit);
        if (check.length < 1) {
            let tmp = this.produitadd;
            this.produitadd = {};
            this.produitsComposes.push(tmp);
            this.produitsComposes.sort();
        }
        else {
            this.produitadd = {};
            this.alertService.error("Le produit n'a pas pu être ajouté. Il est déjà présent dans la liste.")
        }

        this.calcvalue(this.product);

    }

    addMO() {
        var check = this.mainOeuvreList.filter(obj => obj.id_produit == this.mainOeuvreAdd.id_produit);
        if (check.length < 1) {
            let tmp = this.mainOeuvreAdd;
            this.mainOeuvreList.push(tmp);

            this.mainOeuvreAdd = {};
        }
        else {
            this.mainOeuvreAdd = {};
            this.alertService.error("Cette main d'oeuvre n'a pas pu être ajoutée. Elle est déjà présente dans la liste.");
        }

        this.calcvalue(this.product);
    }


    calctotalprod(mo: any) {
        return (mo.prix_achat && mo.quantite) ? ( mo.prix_achat) * mo.quantite : 0;
    }

    calctotal(mo: any): number {
        if (mo.quantite) console.log(this.getMinutesFromTime(mo.quantite.toString()));
        return (mo.salaire_charge && this.getMinutesFromTime(mo.quantite.toString())) ?
            (mo.salaire_charge) * this.getMinutesFromTime(mo.quantite.toString()) / 60 :
            0;
    }

    customTrackBy(index: number, obj: any): any {
        return index;
    }

    getMinutesFromTime(timer: string): number {
        if (timer) {
            var t = timer.split(':');
            return parseInt(t[0]) * 60 + parseInt(t[1]);
        }
        return 0;
    }


    private loadAll() {
        this.achatsService.getAllMainOeuvre().subscribe(
            data => {
                this.mainOeuvre = data;
                console.log(this.mainOeuvre)

            }
        );
    }

    private getAllProduitsVentes() {
        // cherche dans la table produit - donc tous les produits
        this.achatsService.getAll().subscribe(
            produits => {
                this.allProducts = produits;
                console.log(this.allProducts);
            }
        );
    }

    autocompleListFormatterProducts = (data: any): SafeHtml => {
        let html = `<span>${data.libelle} : ${data.prix_achat}€ - ${data.raison_sociale ? data.raison_sociale : data.nom + " " + data.prenom} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };


    autocompleListFormatterMo = (data: any): SafeHtml => {
        let html = `<span>${data.libelle} : ${data.salaire_charge}€ </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };


    // id - id de CE produit
    private loadProduitsComposes(id: string) {
        this.loading = true;
        this.ventesService.getAllProdComp(id, this.num_version).subscribe(
            produits => {
                // recupere les prods comps de ce produit la
                this.produitsComposes = produits.produits;
                console.log(this.produitsComposes)

                this.mainOeuvreList = produits.mainOeuvre;

                this.loading = false;
            }
        );
    }

    // id - id du produit compose a charger
    // cette methode cherche le produit dans la table 'produit' donc les prods achat
    /*private loadEachProduct(id: string) {
        this.achatsService.getById(id).subscribe(
            product => {
                // console.log("un prod: " + JSON.stringify(product));
                this.produitsComposes.push(product[0]);
            }
        );
    }*/


    private formatDate(date: Date) {
        var day = ("0" + date.getDate()).slice(-2);
        var month = ("0" + (date.getMonth() + 1)).slice(-2)
        var year = date.getFullYear();

        return year + '-' + month + '-' + day; // format pour chrome, not tested in other browsers
    }

    private formatStringToDate(date: any) {
        var d = new Date(date);
        return this.formatDate(d);
    }

    private getQuantity(id: string) {
        return this.produitsComposes.filter(x => x.id_produit == id)[0].quantite;
    }

    // ======= pour l'affichage ========
    private getMargePourcentage() {
        return (this.updateProduct.marge / this.updateProduct.prix_achat * 100).toFixed(2);
    }

    private updatePrixVente() {
        return (this.updateProduct.prix_achat + this.updateProduct.marge);
    }

    private updateMarge() {
        return (this.updateProduct.prix_vente - this.updateProduct.prix_achat);
    }

    private debug() {
        /*console.log("produits composes charges: " + JSON.stringify(this.produitsComposes));

         let currentUser = JSON.parse(localStorage.getItem('currentUser'));
         console.log(currentUser._id);
         console.log(currentUser.firstName);*/
        console.log("in debug");
        console.log("prod modifie: " + JSON.stringify(this.updateProduct));

    }

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


}