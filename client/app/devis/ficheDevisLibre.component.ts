import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FileUploader} from 'ng2-file-upload';
import {AppConfig} from '../app.config';
import {AlertService, DevisService, FactureService, ParamsService} from '../_services/index';
import {User} from "../_models/user";


const URLimg = 'http://' + location.hostname + ':4000/image/';
const URLFili = 'http://' + location.hostname + ':4000/filigrane/';

@Component({
    moduleId: module.id,
    templateUrl: 'ficheDevisLibre.component.html'
})

export class FicheDevisLibreComponent implements OnInit {

    private uploaderImg: FileUploader;
    private uploaderFili: FileUploader;

    private fact: any = {};
    private devis: any = {};
    private print: boolean = false;
    private currentUser: User;
    private droitsuser: any = {};
    private id_devis: number;
    private num_version: number;
    private produit: any = [] = [];
    private produitop: any = [] = [];
    private cgv: any = {};

    private loc = location.hostname;

    private img: any = {};
    private fili: any = {};

    private fileReader = new FileReader();
    private base64Files: any;


    constructor(private route: ActivatedRoute,
                private devisService: DevisService,
                private factureService: FactureService,
                private alertService: AlertService,
                private config: AppConfig,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loaddroituser();
        this.loadAllFooter();
        this.loadCat();
        this.loadAllagence();

        this.route.params.subscribe(params => {
            this.id_devis = params['id_devis'];
            this.num_version = params['num_version'];

            this.loadDevis();
            this.produits();
            this.produitsop();
        });


    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }

    loadAllFooter() {
        this.factureService.getAllFooter().subscribe(data => {
            this.fact = data[0];
        });
    }

    loadDevis() {
        this.devisService.getByIdLibre(this.id_devis, this.num_version).subscribe(data => {
            this.devis = data[0];
        })
    }

    produits() {
        this.devisService.getByIdLibreproduit(this.id_devis, this.num_version).subscribe(data => {
            this.produit = data;

        })
    }

    produitsop() {
        this.devisService.getByIdLibreproduitopt(this.id_devis, this.num_version).subscribe(data => {
            this.produitop = data;
        })
    }

    countTotaldet() {

        let totaldet = 0;

        for (let prod of this.produit) {
            if (prod.accepted != 0)
                totaldet += prod.qte_devis * prod.prix_devis;
            else totaldet += 0;
        }
        return totaldet;
    }


    countTva() {
        return this.countTotaldet() * (this.devis.tva / 100) * (this.devis.remise ? (1 - (this.devis.remise / 100)) : 1);
    }

    countTtc() {
        return (this.countTotaldet() * (this.devis.remise ? (1 - (this.devis.remise / 100)) : 1)) + this.countAllTVA() + this.countTva();
    }

    countTotalopt() {

        let totaldet = 0;

        for (let prode of this.produitop) {

            totaldet += prode.qte_devis * prode.prix_devis;

        }
        return totaldet;
    }

    countTvaopt() {
        return this.countTotalopt() * (this.devis.tva / 100) * (this.devis.remise ? (1 - (this.devis.remise / 100)) : 1);
    }

    countTtcopt() {
        return (this.countTotalopt() * (this.devis.remise ? (1 - (this.devis.remise / 100)) : 1)) + this.countAllTVAO() + this.countTvaopt();
    }

    acceptOfferLibre(prod: any) {
        this.devisService.offerlibre(prod).subscribe();
    }

    imprimer() {
        this.alertService.clear();

        this.print = true;
        setTimeout(() => {


            window.print();
            this.print = false;
        }, 1000);

    }



    loadCat() {
        this.paramsService.getAllVente().subscribe(cgv => {
            this.cgv = cgv[0];
        });
    }

    countNTVAZ() {
        let total = 0;

        for (let prod of this.produit) {

            if (parseInt(prod.tva) == 0) {
                total += 0;


            }
        }
        return total;

    }

    countNTVA() {
        let total = 0;

        for (let prod of this.produit) {

            if (parseFloat(prod.tva) == 2.1) {
                total += (parseFloat(prod.tva) / 100) * prod.prix_devis * prod.qte_devis * (this.devis.remise ? (1 - (this.devis.remise / 100)) : 1);


            }
        }
        return total;

    }

    countNTVAC() {
        let total = 0;

        for (let prod of this.produit) {

            if (parseFloat(prod.tva) == 5.5) {
                total += (parseFloat(prod.tva) / 100) * prod.prix_devis * prod.qte_devis * (this.devis.remise ? (1 - (this.devis.remise / 100)) : 1);


            }
        }
        return total;

    }

    countNTVAD() {
        let total = 0;

        for (let prod of this.produit) {

            if (parseInt(prod.tva) == 10) {
                total += (parseInt(prod.tva) / 100) * prod.prix_devis * prod.qte_devis * (this.devis.remise ? (1 - (this.devis.remise / 100)) : 1);


            }
        }
        return total;

    }

    countNTVAs() {
        let total = 0;

        for (let prod of this.produit) {
            if (parseInt(prod.tva) == 20) {
                total += (parseInt(prod.tva) / 100) * prod.prix_devis * prod.qte_devis * (this.devis.remise ? (1 - (this.devis.remise / 100)) : 1);


            }
        }
        return total;

    }


    countNTVAZO() {
        let total = 0;

        for (let prode of this.produitop) {

            if (parseInt(prode.tva) == 0) {
                total += 0;


            }
        }
        return total;

    }

    countNTVAO() {
        let total = 0;

        for (let prode of this.produitop) {

            if (parseFloat(prode.tva) == 2.1) {
                total += (parseFloat(prode.tva) / 100) * prode.prix_devis * prode.qte_devis * (this.devis.remise ? (1 - (this.devis.remise / 100)) : 1);


            }
        }
        return total;

    }

    countNTVACO() {
        let total = 0;

        for (let prode of this.produitop) {

            if (parseFloat(prode.tva) == 5.5) {
                total += (parseFloat(prode.tva) / 100) * prode.prix_devis * prode.qte_devis * (this.devis.remise ? (1 - (this.devis.remise / 100)) : 1);


            }
        }
        return total;

    }

    countNTVADO() {
        let total = 0;

        for (let prode of this.produitop) {

            if (parseInt(prode.tva) == 10) {
                total += (parseInt(prode.tva) / 100) * prode.prix_devis * prode.qte_devis * (this.devis.remise ? (1 - (this.devis.remise / 100)) : 1);


            }
        }
        return total;

    }

    countNTVAsO() {
        let total = 0;

        for (let prode of this.produitop) {

            if (parseInt(prode.tva) == 20) {
                total += (parseInt(prode.tva) / 100) * prode.prix_devis * prode.qte_devis * (this.devis.remise ? (1 - (this.devis.remise / 100)) : 1);


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

    totalvi() {
        return this.countNTVAs() + this.countNTVAsO();
    }

    totaldi() {
        return this.countNTVADO() + this.countNTVAD();
    }

    totalci() {
        return this.countNTVAC() + this.countNTVACO();
    }

    totaldei() {
        return this.countNTVA() + this.countNTVAO();
    }

    totalcountTTC() {
        return this.countTtcopt() + this.countTtc();
    }

    totalremiseoptet() {
        return this.countTotalopt() * (1 - (this.devis.remise ? this.devis.remise / 100 : 0)) + this.countTotaldet() * (1 - (this.devis.remise ? this.devis.remise / 100 : 0));
    }

    totalHT() {
        return this.countTotalopt() + this.countTotaldet();
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
}

export class AppComponent {
    title = 'app works!';
    //set a property that holds a random color for our style.

    //declare the fontsize and background color properties
    public font_size="12px";
    public background_color="grey ";

    //declare a variable to hold class name:
    public my_Class = 'style1';


    }

