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
                  //  console.log(data);
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
                   // console.log(data);
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
        factureparams.libsitua = this.libsitua;
        factureparams.libsituaop = this.libsituaop;

        var test = +confirm('Etes vous sûr de vouloir enregistrer votre facture :');
        //console.log(factureparams);
        if (test ) {
            //console.log(factureparams);
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

    totalignesitua(lbsituas: any) {
        if (lbsituas.pourcents)
            return (lbsituas.qteprod / 100) * lbsituas.prix_prod * lbsituas.pourcents;
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

    countSitualib(lsituas: any) {
        let totalopt = 0;

        for (let lsituas of this.libsitua) {
            totalopt += lsituas.qteprod * lsituas.prix_prod;
        }
        return totalopt;
    }

    countSituaoptlib(situaop: any) {
        let totalopt = 0;

        for (let situaop of this.libsituaop) {
            totalopt += situaop.qteprod * situaop.prix_prod;
        }
        return totalopt;
    }

    countTTC(situas: any, options: any, situaop :any, lsituas: any) {
        return this.countSitua(situas) + this.countSituaopt(options) + this.countSituaoptlib(situaop) + this.countSitualib(lsituas);
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

    countLignel(lbsituas: any) {
        let totalopt = 0;

        for (let lbsituas of this.libsitua) {
            if (lbsituas.pourcents)
                totalopt += (lbsituas.qteprod / 100) * lbsituas.prix_prod * lbsituas.pourcents;
            else totalopt += 0;
        }
        return totalopt;

    }

    countLignelO(situaop: any) {
        let totalopt = 0;

        for (let situaop of this.libsituaop) {
            if (situaop.pourcent)
                totalopt += (situaop.qteprod / 100) * situaop.prix_prod * situaop.pourcent;
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

    countTotal(situas: any, valeur: any, options: any,lbsituas: any,situaop: any) {
        return (this.countLigne(situas)>0 ?this.countLigne(situas) :0) + (this.countOption(options)>0 ? this.countOption(options) :0) + (this.countLignel(lbsituas)>0 ? this.countLignel(lbsituas) : 0) + (this.countLignelO(situaop)>0 ? this.countLignelO(situaop) :0);
    }

    countRemise(situas: any, valeur: any, options: any,lbsituas: any,situaop: any) {
        return this.countTotal(situas, valeur, options,lbsituas,situaop) * ((this.valeur.remise ? this.valeur.remise : 0) / 100);
    }

    countTotalRemise(situas: any, valeur: any, options: any,lbsituas: any,situaop: any) {
        return this.countTotal(situas, valeur, options,lbsituas,situaop) * (1 - ((this.valeur.remise ? this.valeur.remise : 0) / 100));
    }

    countTotalNet(situas: any, valeur: any, options: any,lbsituas: any,situaop: any) {// en attendant plus value moins value
        return this.countTotalRemise(situas, valeur, options,lbsituas,situaop)
    }

    totalsituation(valeur: any,options:any) {
            return   this.countTotaldessitua(options) + (this.accomp.accompte_value ? this.accomp.accompte_value : 0);

    }

    countTotalsituation(situas: any, valeur: any, options: any,lbsituas :any,situaop: any) {
        this.model.montant_ht = this.countTotalNet(situas, valeur, options,lbsituas,situaop) - this.totalsituation(valeur,options);
        return this.model.montant_ht;
    }

    countTVA(situas: any, valeur: any, options: any,lbsituas:any,situaop: any) {

        return this.countTotalsituation(situas, valeur, options,lbsituas,situaop) * (this.valeur.tva ? this.valeur.tva : 0) / 100;
    }

    countSTotal(situas: any, valeur: any, options: any,lbsituas:any,situaop: any) {
        return this.countTotalsituation(situas, valeur, options,lbsituas,situaop) + this.TotauxTVA(situas, valeur, options,lbsituas,situaop);
    }

    countRetenu(situas: any, valeur: any, options: any,lsituas:any,situaop: any) {

        return this.countSTotal(situas, valeur, options,lsituas,situaop) * (this.model.retenue ? this.model.retenue : 0) / 100;
    }

    countTotalTTC(situas: any, valeur: any, options: any,lsituas:any,situaop: any) {
        return this.countSTotal(situas, valeur, options,lsituas,situaop) - this.countRetenu(situas, valeur, options,lsituas,situaop);

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

            if (lsituas.tva == 20) {
                total += (lsituas.prix_prod * lsituas.qteprod * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (lsituas.pourcents / 100) * (lsituas.tva / 100);
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
                total += (situaop.prix_prod * situaop.qteprod * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (situaop.pourcent / 100) * (situaop.tva / 100);
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

    TVADO() {
        let total = 0;

        for (let situas of this.situa) {

            if (situas.tvas == 10) {
                total += ( situas.prixfact * situas.qtefact * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (situas.pourcentage / 100) * (situas.tvas / 100);

            }
        }
        return total;
    }

    TVAD() {
        let total = 0;

        for (let lsituas of this.libsitua) {

            if (lsituas.tva == 10) {
                total += (lsituas.prix_prod * lsituas.qteprod * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (lsituas.pourcents / 100) * (lsituas.tva / 100);
            }

        }
        return total;
    }

    TVATDt() {
        let total = 0;

        for (let options of this.option) {

            if (options.tvao == 10) {
                total += (options.prixfact * options.qtefact * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (options.pourcentage / 100) * (options.tvao / 100);
            }

        }
        return total;
    }

    TVATDOt() {
        let total = 0;

        for (let situaop of this.libsituaop) {

            if (situaop.tva == 10) {
                total += (situaop.prix_prod * situaop.qteprod * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (situaop.pourcent / 100) * (situaop.tva / 100);
            }

        }
        return total;
    }

    STVAD(){
        let total = 0;

        for (let tvass of this.tvas) {

            if (tvass.tva == 10) {
                total += tvass.somme *(1-(this.valeur.remise / 100));
            }

        }
        return total;
    }


    SumTvaD() {
        return this.TVAD() + this.TVADO() + this.TVATDOt() + this.TVATDt() - this.STVAD();
    }

    TVACO() {
        let total = 0;

        for (let situas of this.situa) {

            if (situas.tvas == 5.5) {
                total += ( situas.prixfact * situas.qtefact * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (situas.pourcentage / 100) * (situas.tvas / 100);

            }
        }
        return total;
    }

    TVAC() {
        let total = 0;

        for (let lsituas of this.libsitua) {

            if (lsituas.tva == 5.5) {
                total += (lsituas.prix_prod * lsituas.qteprod * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (lsituas.pourcents / 100) * (lsituas.tva / 100);
            }

        }
        return total;
    }

    TVATCt() {
        let total = 0;

        for (let options of this.option) {

            if (options.tvao == 5.5) {
                total += (options.prixfact * options.qtefact * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (options.pourcentage / 100) * (options.tvao / 100);
            }

        }
        return total;
    }

    TVATCOt() {
        let total = 0;

        for (let situaop of this.libsituaop) {

            if (situaop.tva == 5.5) {
                total += (situaop.prix_prod * situaop.qteprod * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (situaop.pourcent / 100) * (situaop.tva / 100);
            }

        }
        return total;
    }

    STVAC(){
        let total = 0;

        for (let tvass of this.tvas) {

            if (tvass.tva == 5.5) {
                total += tvass.somme *(1-(this.valeur.remise / 100));
            }

        }
        return total;
    }


    SumTvaC() {
        return this.TVAC() + this.TVACO() + this.TVATCOt() + this.TVATCt() - this.STVAC();
    }

    TVADXO() {
        let total = 0;

        for (let situas of this.situa) {

            if (situas.tvas == 2.1) {
                total += ( situas.prixfact * situas.qtefact * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (situas.pourcentage / 100) * (situas.tvas / 100);

            }
        }
        return total;
    }

    TVADX() {
        let total = 0;

        for (let lsituas of this.libsitua) {

            if (lsituas.tva == 2.1) {
                total += (lsituas.prix_prod * lsituas.qteprod * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (lsituas.pourcents / 100) * (lsituas.tva / 100);
            }

        }
        return total;
    }

    TVATDXt() {
        let total = 0;

        for (let options of this.option) {

            if (options.tvao == 2.1) {
                total += (options.prixfact * options.qtefact * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (options.pourcentage / 100) * (options.tvao / 100);
            }

        }
        return total;
    }

    TVATDXOt() {
        let total = 0;

        for (let situaop of this.libsituaop) {

            if (situaop.tva == 2.1) {
                total += (situaop.prix_prod * situaop.qteprod * (this.valeur.remise ? (1 - (this.valeur.remise / 100)) : 1) ) * (situaop.pourcent / 100) * (situaop.tva / 100);
            }

        }
        return total;
    }

    STVADX(){
        let total = 0;

        for (let tvass of this.tvas) {

            if (tvass.tva == 2.1) {
                total += tvass.somme *(1-(this.valeur.remise / 100));
            }

        }
        return total;
    }


    SumTvaDX() {
        return this.TVADX() + this.TVADXO() + this.TVATDXOt() + this.TVATDXt() - this.STVADX();
    }

    TotauxTVA(situas: any, valeur: any, options: any,lbsituas:any,situaop: any){
        return (this.countTVA(situas, valeur, options,lbsituas,situaop)>0 ? this.countTVA(situas, valeur, options,lbsituas,situaop) : 0) + (this.SumTvaDX()>0 ? this.SumTvaDX() :0) + (this.SumTvaC() > 0 ? this.SumTvaC() : 0) + (this.SumTvaD()>0 ? this.SumTvaD() : 0) + (this.SumTvaV()> 0 ? this.SumTvaV() :0);
    }
}
