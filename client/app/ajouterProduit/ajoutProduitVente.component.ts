import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, AuthenticationService} from '../_services/index';
import {Product, Tva} from "../_models/index";
import {VentesService} from "../_services/ventes.service";
import {AchatsService} from "../_services/achats.service";
import {FormBuilder} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";
import {FileUploader} from 'ng2-file-upload';

const URLimg = 'http://' + location.hostname + ':4000/image/';

@Component({
    moduleId: module.id,
    templateUrl: 'ajoutProduitVente.component.html'
})

export class AjoutProduitVenteComponent {

    private uploaderImg: FileUploader;

    private allProducts: Product[] = [];
    private mainOeuvreList: any[] = [];

    private produit = new Product();


    private categories: any[] = [];
    private cat_choisi: string;
    private unites: any[] = [];
    private uni_choisi: string;
    private tva_choisi: number;
    private tvas: Tva[] = [];
    private loading = false;
    private mainOeuvre: any[] = [];
    private mainOeuvreAdd: any = {};
    private n: number;
    private produitadd: any = {};
    private produitsComposes: Product[] = [];
    private currentUser: User;
    private droitsuser: any = {};

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private ventesService: VentesService,
                private achatsService: AchatsService,
                private alertService: AlertService,
                private builder: FormBuilder,
                private _sanitizer: DomSanitizer,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.n = 7;
        this.produit.marge = 0;
    }

    ngOnInit() {
        this.getTVA();
        this.getAllProduitsVentes();
        this.getCategories();
        this.loadAll();
        this.getUnite();
        this.loaddroituser();

        this.route.params.subscribe(params => {
            this.uploaderImg = new FileUploader({url: URLimg + "produitv/" + params['id']});
            this.uploaderImg.onAfterAddingFile = file => {
                file.withCredentials = false;
            };
        });
    }

    // visualisation de l'image avant envoi
    url: any;

    readUrl(event: any) {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (event: any) => {
                this.url = event.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }

    private loadAll() {
        this.achatsService.getAllMainOeuvre().subscribe(data => {
            this.mainOeuvre = data;
        });
    }

    private getAllProduitsVentes() {
        this.achatsService.getAll().subscribe(produits => {
            this.allProducts = produits;
        });
    }

    autocompleListFormatterProducts = (data: any): SafeHtml => {
        let html = `<span>${data.libelle} : ${data.prix_achat}€ - ${data.raison_sociale ? data.raison_sociale : data.nom + " " + data.prenom} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };


    autocompleListFormatterMo = (data: any): SafeHtml => {
        let html = `<span>${data.libelle} : ${data.salaire_charge}€ </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    private ajouterProduitVente() {
        this.produit.categorie = this.getCategoryId();
        this.produit.unite = this.getUnityId();
        this.produit.prix_achat = this.getTotalPrixAchat();
        this.produit.prix_vente = this.getTotalPrixVente();
        this.produit.id_user = this.currentUser._id;

        let tmp: any = {};
        tmp.produit = this.produit;
        tmp.produits = this.produitsComposes;
        tmp.mainOeuvre = this.mainOeuvreList;

        console.log(tmp);

        this.ventesService.add(tmp).subscribe(() => {
            this.alertService.success('Nouveau produit ajouté avec succès.', true);
            this.loading = false;
            this.router.navigate(["/listevente"]);
        }, () => {
            this.alertService.error('Erreur lors de l\'ajout du produit. Veuillez réessayer.', true);
        });
    }

    private getTVA() {
        this.achatsService.getAllTva().subscribe(tvas => {
            this.tvas = tvas;
            this.tva_choisi = this.tvas[0].taux;
        });
    }

    private getCategories() {
        this.achatsService.getAllCategories().subscribe(cats => {
            this.categories = cats;
            this.cat_choisi = this.categories[0].libelle;
        });
    }

    private getUnite() {
        this.achatsService.getAllUnite().subscribe(unis => {
            this.unites = unis;
            this.uni_choisi = this.unites[0].libelle;
        });
    }

    private getCategoryId() {
        return this.categories.find(x => x.libelle == this.cat_choisi).id_cat;
    }

    private getUnityId() {
        return this.unites.find(x => x.libelle == this.uni_choisi).id_unite;
    }

    private chooseProductByLibelle() {
        let prod = this.allProducts.find(x => x.libelle == this.produitadd.libelle.libelle);
        this.produitadd = Object.assign({}, prod);

        this.produitadd.quantite = 1;
        this.calcpercent(this.produitadd);
    }

    private chooseMainOeuvreLibelle(i: number) {
        let prod = this.mainOeuvre.filter(x => x.libelle == this.mainOeuvreAdd.libelle.libelle)[0];
        this.mainOeuvreAdd = Object.assign({}, prod);
        this.mainOeuvreAdd.quantite = "00:00";
        this.calcpercent(this.mainOeuvreAdd);
    }


    calcpercent(mo: any) {
        mo.margepc = (mo.marge && this.getTotalPrixAchat()) ?
            (mo.marge / this.getTotalPrixAchat() * 100).toFixed(2) : 0;
    }

    verifymarge(mo: any) {
        if (mo.margepc < mo.margepcmin) {
            alert("Attention, votre marge est inférieure à la marge minimale !");
        }
    }

    calcvalue(mo: any) {
        mo.marge = (mo.margepc && this.getTotalPrixAchat()) ?
            (mo.margepc * this.getTotalPrixAchat() / 100).toFixed(2) : 0;

    }

    calctotalprod(mo: any) {
        return (mo.prix_achat && mo.quantite) ? (mo.prix_achat) * mo.quantite : 0;
    }

    calctotal(mo: any): number {
        return (mo.salaire_charge && this.getMinutesFromTime(mo.quantite.toString())) ?
            (mo.salaire_charge) * this.getMinutesFromTime(mo.quantite.toString()) / 60 : 0;
    }

    getMinutesFromTime(timer: string): number {
        if (timer) {
            var t = timer.split(':');
            return parseInt(t[0]) * 60 + parseInt(t[1]);
        }
        return 0;
    }

    customTrackBy(index: number, obj: any): any {
        return index;
    }

    addProduct() {
        let check = this.produitsComposes.filter(obj => obj.id_produit == this.produitadd.id_produit);
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

        this.calcvalue(this.produit);

    }

    addMO() {
        let check = this.mainOeuvreList.filter(obj => obj.id_produit == this.mainOeuvreAdd.id_produit);
        if (check.length < 1) {
            let tmp = this.mainOeuvreAdd;
            this.mainOeuvreList.push(tmp);

            this.mainOeuvreAdd = {};
        }
        else {
            this.mainOeuvreAdd = {};
            this.alertService.error("Cette main d'oeuvre n'a pas pu être ajoutée. Elle est déjà présente dans la liste.");
        }

        this.calcvalue(this.produit);
    }

    supprimer(produit: any) {
        this.produitsComposes = this.produitsComposes.filter(obj => obj !== produit);
        this.calcvalue(this.produit);
    }

    supprimermainoeuvre(produit: any) {
        this.mainOeuvreList = this.mainOeuvreList.filter(obj => obj !== produit);
        this.calcvalue(this.produit);
    }

    // la somme des prix des prods comps
    private getTotalPrixAchat(): number {
        let i;
        let total = 0;

        for (i in this.produitsComposes) {
            total += (this.produitsComposes[i].prix_achat) * this.produitsComposes[i].quantite;
        }

        for (i in this.mainOeuvreList) {
            total += this.calctotal(this.mainOeuvreList[i]);
        }

        return +total.toFixed(2);
    }

    private getTotalMarge() {
        let i;
        let total = 0;
        for (i in this.produitsComposes) {
            total += (+this.produitsComposes[i].marge * this.produitsComposes[i].quantite);
        }
        for (i in this.mainOeuvreList) {
            total += (+this.mainOeuvreList[i].marge * this.mainOeuvreList[i].quantite);
        }
        return total;
    }

    private getMargePourcentage() {
        //return (100 * (this.getTotalMarge() / this.getTotalPrixAchat())).toFixed(2);
        return (100 * (this.getTotalMarge() / this.getTotalPrixAchat())).toFixed(2);
    }

    private getTotalPrixVente(): number {
        //return (1* (this.getTotalPrixAchat() + this.getTotalMarge()));
        return +((+this.getTotalPrixAchat() + +this.produit.marge).toFixed(2));
    }

    private debug() {
        let copy = Object.assign([], this.produitsComposes);
        copy = copy.filter(x => x.id_produit != "0");
    }

}