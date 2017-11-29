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
    libsitua: any[] = [];
    libsituaop: any[] = [];
    totalfact: any[] = [];
    tvas: any[] = [];


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
        this.loadlibreSituation();
        this.loadlibreSituationoption();
        this.loadTotlafact();
        this.loadTVAtotal();
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

    loadAllNfact() {

        this.factureService.getAllnfact().subscribe(data => {
            this.nfact = data[0];

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


                }
            )
        });
    }

    loadTotlafact() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture'];
            this.n_situation = params['n_situation'];
            this.factureService.getByIdTotlafact(this.id_facture, this.n_situation).subscribe(
                data => {
                    this.totalfact = data;
                }
            )
        });
    }


    loadSituation() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture'];
            this.n_situation = params['n_situation'];
           this.factureService.getByIdSituation(this.id_facture, this.n_situation).subscribe(
                data => {
                    this.situa = data;
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
                }
            )
        });
    }

    loadlibreSituation() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture']
            this.n_situation = params['n_situation']
            console.log(this.id_facture, this.n_situation);
            this.factureService. getByIdlibresituation(this.id_facture, this.n_situation).subscribe(
                data => {
                    this.libsitua = data;

                }
            )
        });
    }

    loadlibreSituationoption() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture']
            this.n_situation = params['n_situation']
            console.log(this.id_facture, this.n_situation);
            this.factureService. getByIdlibresituationoption(this.id_facture, this.n_situation).subscribe(
                data => {
                    this.libsituaop = data;
                    //console.log(data);
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
                    //console.log(data);
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
                    //console.log(data);
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
                    //console.log(this.accomp)
                }
            )
        });
    }

    loadTVAtotal() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture']
            this.n_situation = params['n_situation']
            console.log(this.id_facture);
            this.factureService.getByIdTotlaTVA(this.id_facture, this.n_situation).subscribe(
                data => {
                    this.tvas = data;
                    console.log(this.tvas)
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
                    //console.log(data)
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

    totalignesitua(lsituas: any) {
        if (lsituas.pourcent)
            return (lsituas.qteprod / 100) * lsituas.prix_prod * lsituas.pourcent;
        else return 0;
    }

    totalignesituaop(situaop: any) {
        if (situaop.pourcent)
            return (situaop.qteprod / 100) * situaop.prix_prod * situaop.pourcent;
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

    countTotaldessitua(options: any) {
        let totalopt = 0;

        for (let options of this.totalfact) {
                totalopt += options.montant_ht;
        }
        return  totalopt;
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

    totalsituation(valeur: any,options:any) {
            return   this.countTotaldessitua(options) + (this.accomp.accompte_value ? this.accomp.accompte_value : 0);

    }

    countTotalsituation(situas: any, valeur: any, options: any) {
        this.model.montant_ht = this.countTotalNet(situas, valeur, options) - this.totalsituation(valeur,options);
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

    TVAVO() {
        let total = 0;

        for (let situas of this.situa) {

            if (situas.tvas == 20) {
                total += ( situas.prixfact * situas.qtefact * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (situas.pourcentage / 100) * (situas.tvas / 100);

            }
        }
        return total;
    }

    TVAV() {
        let total = 0;

        for (let lsituas of this.libsitua) {

            if (lsituas.tvas == 20) {
                total += (lsituas.prix_prod * lsituas.qteprod * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (lsituas.pourcent / 100) * (lsituas.tva / 100);
            }

        }
        return total;
    }

    TVATVt() {
        let total = 0;

        for (let options of this.option) {

            if (options.tvao == 20) {
                total += (options.prixfact * options.qtefact * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (options.pourcentage / 100) * (options.tvao / 100);
            }

        }
        return total;
    }

    TVATVOt() {
        let total = 0;

        for (let situaop of this.libsituaop) {

            if (situaop.tva == 20) {
                total += (situaop.prix_prod * situaop.qteprod * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (situaop.pourcentage / 100) * (situaop.taux / 100);
            }

        }
        return total;
    }

    STVAV(){
        let total = 0;

        for (let tvass of this.tvas) {

            if (tvass.tva == 20) {
                total += tvass.somme *(1-(this.valeur.remise / 100));
            }

        }
        return total;
    }


    SumTvaV() {
        return this.TVAV() + this.TVAVO() + this.TVATVOt() + this.TVATVt() - this.STVAV();
    }

    /*TVADO() {
        let total = 0;

        for (let libres of this.libre) {

            if (libres.taux == 10) {
                total += ( libres.prix_devis * libres.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (libres.pourcentage / 100) * (libres.taux / 100);

            }
        }
        return total;
    }

    TVAD() {
        let total = 0;

        for (let details of this.detail) {

            if (details.taux == 10) {
                total += (details.prix_devis * details.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (details.pourcentage / 100) * (details.taux / 100);
            }

        }
        return total;
    }

    TVATDt() {
        let total = 0;

        for (let options of this.option) {

            if (options.taux == 10) {
                total += (options.prix_devis * options.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (options.pourcentage / 100) * (options.taux / 100);
            }

        }
        return total;
    }

    TVATDOt() {
        let total = 0;

        for (let libreoptions of this.libreoption) {

            if (libreoptions.taux == 10) {
                total += (libreoptions.prix_devis * libreoptions.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (libreoptions.pourcentage / 100) * (libreoptions.taux / 100);
            }

        }
        return total;
    }

    SumTvaD() {
        return this.TVAD() + this.TVADO() + this.TVATDOt() + this.TVATDt();
    }

    TVACO() {
        let total = 0;

        for (let libres of this.libre) {

            if (libres.taux == 5.5) {
                total += ( libres.prix_devis * libres.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (libres.pourcentage / 100) * (libres.taux / 100);

            }
        }
        return total;
    }

    TVAC() {
        let total = 0;

        for (let details of this.detail) {

            if (details.taux == 5.5) {
                total += (details.prix_devis * details.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (details.pourcentage / 100) * (details.taux / 100);
            }

        }
        return total;
    }

    TVATCt() {
        let total = 0;

        for (let options of this.option) {

            if (options.taux == 5.5) {
                total += (options.prix_devis * options.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (options.pourcentage / 100) * (options.taux / 100);
            }

        }
        return total;
    }

    TVATCOt() {
        let total = 0;

        for (let libreoptions of this.libreoption) {

            if (libreoptions.taux == 5.5) {
                total += (libreoptions.prix_devis * libreoptions.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (libreoptions.pourcentage / 100) * (libreoptions.taux / 100);
            }

        }
        return total;
    }

    SumTvaC() {
        return this.TVAC() + this.TVACO() + this.TVATCOt() + this.TVATCt();
    }

    TVADXO() {
        let total = 0;

        for (let libres of this.libre) {

            if (libres.taux == 2.1) {
                total += ( libres.prix_devis * libres.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (libres.pourcentage / 100) * (libres.taux / 100);

            }
        }
        return total;
    }

    TVADX() {
        let total = 0;

        for (let details of this.detail) {

            if (details.taux == 2.1) {
                total += (details.prix_devis * details.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (details.pourcentage / 100) * (details.taux / 100);
            }

        }
        return total;
    }

    TVATDXt() {
        let total = 0;

        for (let options of this.option) {

            if (options.taux == 2.1) {
                total += (options.prix_devis * options.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (options.pourcentage / 100) * (options.taux / 100);
            }

        }
        return total;
    }

    TVATDXOt() {
        let total = 0;

        for (let libreoptions of this.libreoption) {

            if (libreoptions.taux == 2.1) {
                total += (libreoptions.prix_devis * libreoptions.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (libreoptions.pourcentage / 100) * (libreoptions.taux / 100);
            }

        }
        return total;
    }

    SumTvaDX() {
        return this.TVADX() + this.TVADXO() + this.TVATDXOt() + this.TVATDXt();
    }

    TVAZO() {
        let total = 0;

        for (let libres of this.libre) {

            if (libres.taux == 0) {
                total +=0;

            }
        }
        return total;
    }

    TVAZ() {
        let total = 0;

        for (let details of this.detail) {

            if (details.taux == 0) {
                total += 0;
            }

        }
        return total;
    }

    TVATZt() {
        let total = 0;

        for (let options of this.option) {

            if (options.taux == 0) {
                total += 0;
            }

        }
        return total;
    }

    TVATZOt() {
        let total = 0;

        for (let libreoptions of this.libreoption) {

            if (libreoptions.taux == 0) {
                total += 0;
            }

        }
        return total;
    }

    SumTvaZ() {
        return this.TVAZ() + this.TVAZO() - this.TVATZOt() - this.TVATZt();
    }*/
}
