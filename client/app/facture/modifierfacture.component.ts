/**
 * Created by cédric on 17/07/2017.
 */
/**
 * Created by cédric on 17/07/2017.
 */
import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {FactureService} from '../_services/facture.service';
import {ParamsService} from '../_services/params.service'; //
import {User} from '../_models/user';
import {FileUploader} from 'ng2-file-upload';
import {AppConfig} from '../app.config';

const URLimg = 'http://' + location.hostname + ':4000/image/';

@Component({
    moduleId: module.id,
    templateUrl: 'modifierfacture.component.html'
})

export class ModifierfactureComponent {
    public uploaderImg: FileUploader;


    currentUser: User;         //
    droitsuser: any = {};         //
    _id: any;                   //
    data: any = {};

    model: any = {};
    nfact: any = {};
    pourcentage: number;
    id_facture: number;
    n_situation: number;
    fact: any = {};
    situa: any[] = [];
    libelle: string;
    id_produit: number;
    totalsit: any = {};
    valeur: any = {};
    accompte_value: number;
    option: any[] = [];
    montant_ht: number;
    optsit: any = {};
    remise: number;
    print: boolean = false;
    showHide = true;
    style: any [] = [];
    accomp: any = {};

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
        this.loadModif();
        this.loadSituation();
        this.loadTotalSit();
        this.loadValeur();
        this.loadOption();
        this.loadOptsit();
        this.loadAllNfact();
        this.loaddroituser();
        this.loadAccompte();
        this.loadAllagence();
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    loadAllFooter() {

        this.factureService.getAllFooter().subscribe(fact => {
            this.fact = fact[0];
            console.log(this.fact);

        });
    }

    loadAllNfact() {

        this.factureService.getAllnfact().subscribe(data => {
            this.nfact = data[0];
            console.log(this.nfact);

        });
    }

    loadModif() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture']
            this.n_situation = params['n_situation']
            console.log(this.id_facture);
            this.factureService.getByIdModif(this.id_facture, this.n_situation).subscribe(
                data => {
                    this.model = data[0];
                    console.log(this.model)
                }
            )
        });
    }


    loadSituation() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture']
            this.n_situation = params['n_situation']
            console.log(this.id_facture, this.n_situation);
            this.factureService.getByIdSituation(this.id_facture, this.n_situation).subscribe(
                data => {
                    this.situa = data;
                    console.log('situa');
                    console.log(data);
                }
            )
        });
    }

    loadOption() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture']
            this.n_situation = params['n_situation']
            console.log(this.id_facture, this.n_situation);
            this.factureService.getByIdSitoption(this.id_facture, this.n_situation).subscribe(
                data => {
                    this.option = data;
                    console.log('option');
                    console.log(data);
                }
            )
        });
    }

    loadOptsit() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture']
            this.n_situation = params['n_situation']
            console.log(this.id_facture, this.n_situation);
            this.factureService.getByIdOptSit(this.id_facture, this.n_situation).subscribe(
                data => {
                    this.optsit = data[0];
                    console.log('option');
                    console.log(data);
                }
            )
        });
    }

    loadTotalSit() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture']
            this.n_situation = params['n_situation']
            console.log(this.id_facture, this.n_situation);
            this.factureService.getByIdTotalSit(this.id_facture, this.n_situation).subscribe(
                data => {
                    this.totalsit = data[0];
                    console.log(data);
                }
            )
        });
    }

    loadAccompte() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture']
            this.n_situation = params['n_situation']
            console.log(this.id_facture);
            this.factureService.getByIdAccpt(this.id_facture, this.n_situation).subscribe(
                data => {
                    this.accomp = data[0];
                    console.log(this.accomp)
                }
            )
        });
    }

    submit() {

        let factureparams: any = {};
        factureparams.situa = this.situa;
        factureparams.option = this.option;
        factureparams.model = this.model;
        factureparams.valeur = this.valeur;
        factureparams.nfact = this.nfact;

        var test = +confirm('Etes vous sür de vouloir enregitrer votre facture :');
        //console.log(factureparams);
        if (test ) {
            console.log(factureparams);
            this.factureService.createSituation(factureparams, this.id_facture).subscribe(
                data => {
                    this.router.navigate(['/listefacture']);
                    this.alertService.success('La nouvelle situation de la facture a été créée avec succès.');
                });
        }
    }

    customTrackBy(index: number, obj: any): any {
        return index;
    }

    loadValeur() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture']
            console.log(this.id_facture);
            this.factureService.getByIdValeur(this.id_facture).subscribe(
                data => {
                    this.valeur = data[0];
                    console.log(data)
                }
            )
        });
    }


    totaligne(situas: any) {
        if (situas.pourcentage)
            return (situas.qtefact / 100) * situas.prixfact * situas.pourcentage;
        else return 0;
    }

    totaligneopt(options: any) {
        if (options.pourcentage)
            return (options.qtefact / 100) * options.prixfact * options.pourcentage;
        else return 0;
    }

    countSitua(situas: any) {
        let totalopt = 0;

        for (let situas of this.situa) {
            totalopt += situas.qtefact * situas.prixfact;
        }
        return totalopt;
    }

    countSituaopt(options: any) {
        let totalopt = 0;

        for (let options of this.option) {
            totalopt += options.qtefact * options.prixfact;
        }
        return totalopt;
    }

    countTTC(situas: any, options: any) {
        return this.countSitua(situas) + this.countSituaopt(options)
    }

    countLigne(situas: any) {
        let totalopt = 0;

        for (let situas of this.situa) {
            if (situas.pourcentage)
                totalopt += (situas.qtefact / 100) * situas.prixfact * situas.pourcentage;
            else totalopt += 0;
        }
        return totalopt;
    }

    countOption(options: any) {
        let totalopt = 0;

        for (let options of this.option) {
            if (options.pourcentage)
                totalopt += (options.qtefact / 100) * options.prixfact * options.pourcentage;
            else totalopt += 0;
        }
        return totalopt;
    }

    countTotal(situas: any, valeur: any, options: any) {
        return this.countLigne(situas) + this.countOption(options);
    }

    countRemise(situas: any, valeur: any, options: any) {
        return this.countTotal(situas, valeur, options) * ((this.valeur.remise ? this.valeur.remise : 0) / 100);
    }

    countTotalRemise(situas: any, valeur: any, options: any) {
        return this.countTotal(situas, valeur, options) * (1 - ((this.valeur.remise ? this.valeur.remise : 0) / 100));
    }

    countTotalNet(situas: any, valeur: any, options: any) {// en attendant plus value moins value
        return this.countTotalRemise(situas, valeur, options)
    }

    totalsituation(valeur: any) {
        if (this.valeur.remise)
            return ((this.totalsit.totaldet + (this.optsit.totalopt > 0 ? this.optsit.totalopt : 0 )) * (1 - (this.valeur.remise / 100))) + (this.accomp.accompte_value ? this.accomp.accompte_value : 0);
        else return (this.totalsit.totaldet + (this.optsit.totalopt > 0 ? this.optsit.totalopt : 0 )) + (this.accomp.accompte_value ? this.accomp.accompte_value : 0);
    }

    countTotalsituation(situas: any, valeur: any, options: any) {
        this.model.montant_ht = this.countTotalNet(situas, valeur, options) - this.totalsituation(valeur);
        return this.model.montant_ht;
    }

    countTVA(situas: any, valeur: any, options: any) {

        return this.countTotalsituation(situas, valeur, options) * (this.valeur.tva ? this.valeur.tva : 0) / 100;
    }

    countSTotal(situas: any, valeur: any, options: any) {
        return this.countTotalsituation(situas, valeur, options) + this.countTVA(situas, valeur, options);
    }

    countRetenu(situas: any, valeur: any, options: any) {

        return this.countSTotal(situas, valeur, options) * (this.model.retenue ? this.model.retenue : 0) / 100;
    }

    countTotalTTC(situas: any, valeur: any, options: any) {
        return this.countSTotal(situas, valeur, options) - this.countRetenu(situas, valeur, options);

    }


    imprimer() {
        this.alertService.clear();
        var css = '@page ',
            pageFooter = document.getElementById('pageFooter');


        this.print = true;
        setTimeout(() => {

            window.print();
            this.print = false;
        }, 1000);
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
}
