import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AlertService, AuthenticationService, AchatsService} from '../_services/index';
import {Tva} from "../_models/index";
import {Contact} from "../_models/contacts/contact";
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";
import {FileUploader} from 'ng2-file-upload';

const URLimg = 'http://' + location.hostname + ':4000/image/';

@Component({
    moduleId: module.id,
    templateUrl: 'ajoutProduitAchat.component.html'
})

export class AjoutProduitAchatComponent {

    private uploaderImg: FileUploader;

    private tva_choisi: number;
    private tvas: Tva[] = [];
    private filter_tva: Tva[] = [];
    private fournisseurs: Contact[] = [];
    private fournisseur_choisi: string; // id de fournisseur
    private categories: any[] = [];
    private cat_choisi: string;
    private produit: any = {};
    private loading = false;
    private currentUser: User;
    private droitsuser: any = {};
    private id: string;
    // visualisation de l'image avant envoi
    private url: any;

    private unites: any[];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private achatsService: AchatsService,
                private alertService: AlertService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.getTVA();
        this.getFournisseurs();
        this.getCategories();
        this.loaddroituser();
        this.getUnite();

        this.route.params.subscribe(params => {
            this.id = params['id'];
            this.uploaderImg = new FileUploader({url: URLimg + "produit/" + params['id']});
            this.uploaderImg.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };
        });
    }


    readUrl(event: any) {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (event: any) => {
                this.url = event.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    getUnite() {
        this.achatsService.getAllUnite().subscribe(unites => {
            this.unites = unites;
            this.produit.unite = this.unites[0].libelle;
        });
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
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

    private getUniteId() {
        return this.unites.filter(x => x.libelle == this.produit.unite)[0].id_unite;
    }

    private addProduct() {
        this.loading = true;

        this.produit.id_tva = this.getTvaId();
        this.produit.id_contact = this.getFournisseurId();
        this.produit.categorie = this.getCategoryId();
        this.produit.unite = this.getUniteId();

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.produit.id_user = currentUser._id;


        this.achatsService.add(this.produit).subscribe(data => {
            this.alertService.success('Nouveau produit ajouté avec succès', true);
            this.loading = false;
            this.router.navigate(['/listeachat']);
        }, error => {
            this.alertService.error(error._body);
            this.loading = false;
        });
    }

    private getCategoryId() {
        return this.categories.filter(x => x.libelle == this.cat_choisi)[0].id_cat;
    }

    private getTvaId() {
        this.filter_tva = this.tvas.filter(x => x.taux == this.tva_choisi);
        return this.filter_tva[0].id_tva;
    }

    private getFournisseurId() {
        return this.fournisseurs.filter(x => x.nom == this.fournisseur_choisi)[0].id_contact;
    }

    Allref() {
        this.achatsService.getAllRef(this.produit.reference).subscribe(data => {
            if (data.length > 0)
                alert('Cette référence existe déjà!');
        });
    }

}
