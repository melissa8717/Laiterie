import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AchatsService, AlertService, UtilsService} from '../_services/index';
import {Tva} from "../_models/index";
import {Contact} from "../_models/contacts/contact";
import {FileUploader} from 'ng2-file-upload';


@Component({
    moduleId: module.id,
    templateUrl: 'ajoutProduitAchat.component.html'
})

export class AjoutProduitAchatComponent {

    private unites: any[];
    private tvas: Tva[] = [];
    private fournisseurs: Contact[] = [];
    private categories: any[] = [];

    private tva_choisi: number;
    private fournisseur_choisi: string; // id de fournisseur
    private cat_choisi: string;
    private produit: any = {};
    private loading = false;


    constructor(private utilsService: UtilsService,
                private router: Router,
                private achatsService: AchatsService,
                private alertService: AlertService) {
    }

    ngOnInit() {
        this.getTVA();
        this.getFournisseurs();
        this.getCategories();
        this.getUnite();
    }

    getUnite() {
        this.achatsService.getAllUnite().subscribe(unites => {
            this.unites = unites;
            this.produit.unite = this.unites[0].libelle;
        });
    }

    private getTVA() {
        this.achatsService.getAllTva().subscribe(tvas => {
            this.tvas = tvas;
            this.tva_choisi = this.tvas[0].taux;
        });
    }

    private getFournisseurs() {
        this.achatsService.getAllFournisseur().subscribe(fourniss => {
            this.fournisseurs = fourniss;
            this.fournisseur_choisi = this.fournisseurs[0].nom;
        });
    }

    private getCategories() {
        this.achatsService.getAllCategories().subscribe(cats => {
            this.categories = cats;
            this.cat_choisi = this.categories[0].libelle;
        });
    }

    private addProduct() {
        this.loading = true;

        this.produit.id_tva = this.tvas.find(x => x.taux == this.tva_choisi).id_tva;
        this.produit.id_contact = this.fournisseurs.find(x => x.nom == this.fournisseur_choisi).id_contact;
        this.produit.categorie = this.categories.find(x => x.libelle == this.cat_choisi).id_cat;
        this.produit.unite = this.unites.find(x => x.libelle == this.produit.unite).id_unite;

        this.produit.id_user = this.utilsService.currentUser._id;

        this.achatsService.add(this.produit).subscribe(id => {
            this.alertService.success('Nouveau produit ajouté avec succès', true);
            this.loading = false;
            this.router.navigate(['/listeachat']);
        }, error => {
            this.alertService.error(error._body);
            this.loading = false;
        });
    }

    Allref() {
        this.achatsService.getAllRef(this.produit.reference).subscribe(data => {
            if (data.length > 0)
                alert('Cette référence existe déjà!');
        });
    }

}
