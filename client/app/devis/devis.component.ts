import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {FileUploader} from 'ng2-file-upload';
import {AppConfig} from '../app.config';
import {AlertService, ChantierService, ContactService, DevisService, FactureService, ParamsService, VentesService} from '../_services/index';
import {User} from '../_models/user';


const URLimg = 'http://' + location.hostname + ':4000/image/';
const URLFili = 'http://' + location.hostname + ':4000/filigrane/';

@Component({
    moduleId: module.id,
    templateUrl: 'devis.component.html'
})

export class DevisComponent implements OnInit {

    private uploaderImg: FileUploader;
    private uploaderFili: FileUploader;

    private devis: any = {};

    private produit: any = {};

    private produits: {}[] = [];
    private chantiers: {}[] = [];
    private clients: {}[] = [];
    private fact: any = {};
    private address = false;
    private currentUser: User;
    private droitsuser: any = {};
    private loc = location.hostname;
    private img: any = {};
    private fili: any = {};
    private num_version: number;
    private produitDevis: any[] = [];
    private produitDevisOptions: any[] = [];
    private print: boolean = false;
    private cgv: any = {};
    private id: number;
    private fileReader = new FileReader();
    private base64Files: any;


    constructor(private route: ActivatedRoute,
                private router: Router,
                private alertService: AlertService,
                private contactService: ContactService,
                private chantierService: ChantierService,
                private devisService: DevisService,
                private venteService: VentesService,
                private factureService: FactureService,
                private paramsService: ParamsService,
                private _sanitizer: DomSanitizer,
                private config: AppConfig) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit(): void {
        this.loadAllChantiers();
        this.loadAllClients();
        this.loadAllProduits();
        this.loadAllFooter();
        this.loadCat();
        this.loaddroituser();
        this.loadAllagence();
        this.loadAllFili();


        this.route.params.subscribe(params => {
            this.id = params['id'];
            this.num_version = params['num_version'];

            this.devisService.getById(this.id, this.num_version).subscribe((data: any) => {
                this.devis = data.devis[0];
                this.produitDevis = data.detaille;
                this.produitDevisOptions = data.options;
            })
        });
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }


    ajouter() {
        let tmp: any = {};
        tmp.obj = this.produit.obj;
        tmp.qte = this.produit.qte;
        tmp.prix = this.produit.prix;
        tmp.unite = this.produit.unite;
        tmp.option = this.produit.option;
        tmp.ref = this.produit.ref;

        let check = this.produitDevis.filter(obj => obj.ref == this.produit.obj.id_prc);

        if (check.length < 1) {
            if (tmp.obj.id_prc) {
                if (tmp.option) {
                    this.produitDevisOptions.push(tmp);
                }
                else {
                    this.produitDevis.push(tmp);
                    for (let i = 0; i < this.produitDevis.length; i++) {
                        let qte = this.produitDevis[i].qte;
                        let prix = this.produitDevis[i].prix;
                        this.produitDevis[i].qte = qte;
                        this.produitDevis[i].prix = prix;
                    }
                }

            }
            else {
                this.alertService.error('Veuillez ajouter un produit existant.');
            }
        }
        else {
            this.alertService.error('Le produit ' + tmp.obj.libelle + ' n\'a pas pu être ajouté.');
        }


        this.produit.qte = null;
        this.produit.prix = null;
        this.produit = {};
        this.accomptepercent();
    }

    supprimer(produit: any) {
        this.produitDevis = this.produitDevis.filter(obj => obj !== produit);
    }

    supprimeroption(produit: any) {
        this.produitDevisOptions = this.produitDevisOptions.filter(obj => obj !== produit);
    }

    accompteeuro() {
        this.devis.accomptepercentage = (this.devis.accompteeuros / this.totalTVA() * 100).toFixed(2);
    }

    accomptepercent() {
        this.devis.accompteeuros = (this.devis.accomptepercentage * this.totalTVA() / 100).toFixed(2);
    }


    private loadAllChantiers() {
        this.chantierService.getAll().subscribe(chantiers => {
            this.chantiers = chantiers;
        });
    }

    private loadAllClients() {
        this.contactService.getAllClients().subscribe(clients => {
            this.clients = clients;

        });
    }

    loadAllProduits() {
        this.venteService.getAll().subscribe(data => {
            this.produits = data;
        })
    }

    countTotal() {
        let total = 0;
        for (let produit of this.produitDevis) {
            total += produit.prix_devis * produit.qte_devis;
        }
        return total;
    }

    countTotalVI() {
        let total = 0;
        for (let produit of this.produitDevis) {
            if (produit.taux == 20) {
                total += produit.prix_devis * produit.qte_devis * (produit.taux / 100);
            }

        }
        return total;
    }


    totalRemiseprod() {
        return this.countTotal() - (this.countTotal() * ((this.devis.remise ? this.devis.remise : 0) / 100));
    }

    countTVAprod() {
        return this.totalRemiseprod() > 0 ? this.totalRemiseprod() * ((this.devis.tva ? this.devis.tva : 0) / 100) : this.countTotal() * ((this.devis.tva ? this.devis.tva : 0) / 100);
    }

    countTotalTVA() {
        return this.totalRemiseprod() > 0 ? this.totalRemiseprod() + this.countAllTVA() : 0;
    }


    countTotalOptions() {
        let total = 0;
        for (let produit of this.produitDevisOptions) {
            total += produit.prix_devis * produit.qte_devis;
        }
        return total;
    }

    countTotalOptionRemise() {
        return this.countTotalOptions() - (this.countTotalOptions() * (this.devis.remise ? this.devis.remise : 0) / 100);
    }

    countTotalOptionsTVA() {
        return this.countTotalOptionRemise() > 0 ? this.countTotalOptionRemise() * ((this.devis.tva ? this.devis.tva : 0) / 100) : this.countTotalOptions() * ((this.devis.tva ? this.devis.tva : 0) / 100);
    }


    Totaloption() {
        return this.countTotalOptionRemise() > 0 ? this.countTotalOptionRemise() * (1 + ((this.devis.tva ? this.devis.tva : 0) / 100)) : this.countTotalOptions() * (1 + ((this.devis.tva ? this.devis.tva : 0) / 100));
    }


    total() {
        return this.countTotal() + this.countTotalOptions();
    }

    totalTVA() {
        return this.Totaloption() + this.countAllTVAO();
    }

    countTotalRemise() {
        return this.countTotalOptionRemise() + this.totalRemiseprod();
    }

    TVAtotal() {
        return this.countTotalOptionsTVA() + this.countTVAprod();
    }


    totalRemiseTVA() {
        return this.totalTVA() - (this.totalTVA() * this.devis.remise / 100);
    }

    getAddress(id: any) {
        if (id != null) {
            this.contactService.getAddress(id).subscribe(data => {
                if (data[0]) {
                    this.devis.address = data[0].adresse;
                    this.devis.cp = data[0].code_postal;
                    this.devis.ville = data[0].ville;
                    this.address = false
                }
                else {
                    this.devis.address = '';
                    this.devis.cp = '';
                    this.devis.ville = '';
                    this.address = true;
                }
            })
        }
        else {
            this.address = false;
        }
    }

    submit() {
        let devisparams: any = {};
        devisparams.devis = this.devis;
        devisparams.produitDevis = this.produitDevis;
        devisparams.produitDevisOptions = this.produitDevisOptions;

        this.devisService.add(devisparams).subscribe(() => {
            this.router.navigate(['/listedevis']);
            this.alertService.success('Le devis a été créé avec succès.');
        });
    }

    autocompleListFormatterProducts = (data: any): SafeHtml => {
        let html = `<span>${data.libelle} : ${data.prix_vente ? data.prix_vente + '€' : 'Prix non défini'}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    autocompleListFormatterContactValue = (data: any): SafeHtml => {
        return `${data.raison_sociale ? data.raison_sociale : data.nom + ' ' + data.prenom}`;
    };

    autocompleListFormatterContact = (data: any): SafeHtml => {
        let html = `<span>${data.raison_sociale ? data.raison_sociale : data.nom + ' ' + data.prenom}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };


    autocompleListFormatterchantier = (data: any): SafeHtml => {
        let html = `<span>${data.nom_chantier} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };


    imprimer() {
        this.alertService.clear();

        this.print = true;
        setTimeout(() => {

            window.print();
            this.print = false;
        }, 1000);
    }

    loadAllFooter() {
        this.factureService.getAllFooter().subscribe(data => {
            this.fact = data[0];


        });
    }

    loadCat() {
        this.paramsService.getAllVente().subscribe(cgv => {
            this.cgv = cgv[0];
        });
    }

    acceptOffer(option: any) {
        this.devisService.acceptOffer(option).subscribe();
    }


    public onChange(event: Event) {
        if (event.target['files']) {
            this.readFiles(event.target['files'], 0);
        }
    };

    private readFiles(files: any[], index: number) {
        let file = files[index];
        this.fileReader.onload = () => {
            this.base64Files.push(this.fileReader.result);
            if (files[index + 1]) {
                this.readFiles(files, index + 1);
            }
        };
        this.fileReader.readAsDataURL(file);
    }


    loadAllagence() {
        this.paramsService.getAllAgence().subscribe(img => {
            this.img = img[0];

            this.uploaderImg = new FileUploader({url: URLimg + 'agence/' + this.img.id_agence});
            this.uploaderImg.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };
        });
    }

    loadAllFili() {
        this.paramsService.getAllFili().subscribe(fili => {
            this.fili = fili[0];

            this.uploaderFili = new FileUploader({url: URLFili + "agence/" + this.fili.id_agence});
            this.uploaderFili.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };
        });
    }

    countNTVAZ() {
        let total = 0;
        for (let produit of this.produitDevis) {
            if ((produit.taux == 0) || (parseInt(produit.tva) == 0)) {
                total += 0;
            }
        }
        return total;

    }

    countNTVA() {
        let total = 0;

        for (let produit of this.produitDevis) {

            if ((produit.taux == 2.1) || (parseFloat(produit.tva) == 2.1)) {
                total += produit.qte_devis * produit.prix_devis * (produit.taux ? (parseFloat(produit.taux) / 100) : (parseFloat(produit.tva) / 100));


            }
        }
        return total;

    }


    countNTVAC() {
        let total = 0;

        for (let produit of this.produitDevis) {

            if ((produit.taux == 5.5) || (parseFloat(produit.tva) == 5.5)) {
                total += produit.qte_devis * produit.prix_devis * (produit.taux ? (parseFloat(produit.taux) / 100) : (parseFloat(produit.tva) / 100));


            }
        }
        return total;

    }

    countNTVAD() {
        let total = 0;

        for (let produit of this.produitDevis) {


            if ((produit.taux == 10) || (parseInt(produit.tva) == 10)) {
                total += produit.qte_devis * produit.prix_devis * (produit.taux ? (parseInt(produit.taux) / 100) : (parseInt(produit.tva) / 100));


            }
        }
        return total;

    }

    countNTVAs() {
        let total = 0;

        for (let produit of this.produitDevis) {


            if ((produit.taux == 20) || (parseInt(produit.tva) == 20)) {
                total += produit.qte_devis * produit.prix_devis * (produit.taux ? (parseInt(produit.taux) / 100) : (parseInt(produit.tva) / 100));
            }
        }
        return total;

    }


    countNTVAZO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {

            if ((produit.taux == 0) || (parseInt(produit.tva) == 0)) {
                total += 0;


            }
        }
        return total;

    }

    countNTVAO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {
            if ((produit.taux == 2.1) || (parseFloat(produit.tva) == 2.1)) {
                total += produit.qte_devis * produit.prix_devis * (produit.taux ? (parseFloat(produit.taux) / 100) : (parseFloat(produit.tva) / 100));


            }
        }
        return total;

    }

    countNTVACO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {
            if ((produit.taux == 5.5) || (parseFloat(produit.tva) == 5.5)) {
                total += produit.qte_devis * produit.prix_devis * (produit.taux ? (parseFloat(produit.taux) / 100) : (parseFloat(produit.tva) / 100));


            }
        }
        return total;

    }

    countNTVADO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {

            if ((produit.taux == 10) || (parseInt(produit.tva) == 10)) {
                total += produit.qte_devis * produit.prix_devis * (produit.taux ? (parseInt(produit.taux) / 100) : (parseInt(produit.tva) / 100));


            }
        }
        return total;

    }

    countNTVAsO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {

            if ((produit.taux == 20) || (parseInt(produit.tva) == 20)) {
                total += produit.qte_devis * produit.prix_devis * (produit.taux ? (parseInt(produit.taux) / 100) : (parseInt(produit.tva) / 100));

            }
        }
        return total;

    }


    countAllTVA() {
        return ((this.countNTVA() ? this.countNTVA() : 0) + (this.countNTVAC() ? this.countNTVAC() : 0) + (this.countNTVAD() ? this.countNTVAD() : 0)) + (this.countNTVAs() ? this.countNTVAs() : 0);


    }

    countAllTVAO() {
        return ((this.countNTVAO() ? this.countNTVAO() : 0) + (this.countNTVACO() ? this.countNTVACO() : 0) + (this.countNTVADO() ? this.countNTVADO() : 0)) + (this.countNTVAsO() ? this.countNTVAsO() : 0);


    }


}



