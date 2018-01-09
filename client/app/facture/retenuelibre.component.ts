/**
 * Created by cédric on 08/01/2018.
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
    templateUrl: 'retenuelibre.component.html'
})

export class RetenuelibreComponent {


    currentUser: User;
    droitsuser: any = {};
    _id: any;
    data: any = {};

    model: any = {};
    valeur: any = {};
    fact: any = {};
    pourcentage: number;
    id_facture: number;
    n_situation: number;

    situa: any[] = [];
    option: any[] = [];
    libsitua: any[] = [];
    libsituaop: any[] = [];
    base: any [] = [];


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

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));


        this.loaddroituser();
        this.loadModif();
        this.loadSituation();
        this.loadOption();
        this.loadlibreSituation();
        this.loadlibreSituationoption();
        this.loadBase();

    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];


        });
    }



    loadModif() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture'];
            this.n_situation = params['n_situation'];
            this.factureService.getByIdLibreModif(this.id_facture, this.n_situation).subscribe(
                data => {
                    this.model = data[0];
                    console.log(data);
                }
            )
        });
    }



    loadAllFooter() {

        this.factureService.getAllFooter().subscribe(fact => {
            this.fact = fact[0];
            console.log(this.fact);

        });
    }

    loadSituation() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture'];
            this.n_situation = params['n_situation'];
            this.factureService.getByIdSituation(this.id_facture, this.n_situation).subscribe(
                data => {
                    this.situa = data;
                    // console.log(data);
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
                    // console.log(data);
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
                    //console.log(data);
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

    loadBase() {
        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture'];
            this.n_situation = params['n_situation'];
            this.factureService.getByIdLibrebase(this.id_facture, this.n_situation).subscribe(
                data => {
                    this.base = data;
                    console.log(data);
                }
            )
        });
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

    countTTCremise(situas: any, options: any, situaop :any, lsituas: any) {

        return this.countTTC(situas, options, situaop, lsituas) * (this.model.remise ? (1 - (this.model.remise / 100)) : 1) ;
    }



    TVAVO() {
        let total = 0;

        for (let situas of this.situa) {

            if (situas.tvas == 20) {
                total += ( situas.prixfact * situas.qtefact * (this.model.remise? (1 - (this.model.remise / 100)) : 1) )* (situas.tvas / 100);

            }
        }
        return total;
    }

    TVAV() {
        let total = 0;

        for (let lsituas of this.libsitua) {

            if (lsituas.tva == 20) {
                total += (lsituas.prix_prod * lsituas.qteprod * (this.model.remise ? (1 - (this.model.remise / 100)) : 1) )  * (lsituas.tva / 100);
            }

        }
        return total;
    }

    TVATVt() {
        let total = 0;

        for (let options of this.option) {

            if (options.tvao == 20) {
                total += (options.prixfact * options.qtefact * (this.model.remise ? (1 - (this.model.remise / 100)) : 1) )  * (options.tvao / 100);
            }

        }
        return total;
    }

    TVATVOt() {
        let total = 0;

        for (let situaop of this.libsituaop) {

            if (situaop.tva == 20) {
                total += (situaop.prix_prod * situaop.qteprod * (this.model.remise ? (1 - (this.model.remise / 100)) : 1) )  * (situaop.tva / 100);
            }

        }
        return total;
    }




    SumTvaV() {
        return this.TVAV() + this.TVAVO() + this.TVATVOt() + this.TVATVt();
    }

    TVADO() {
        let total = 0;

        for (let situas of this.situa) {

            if (situas.tvas == 10) {
                total += ( situas.prixfact * situas.qtefact * (this.model.remise ? (1 - (this.model.remise / 100)) : 1) ) * (situas.tvas / 100);

            }
        }
        return total;
    }

    TVAD() {
        let total = 0;

        for (let lsituas of this.libsitua) {

            if (lsituas.tva == 10) {
                total += (lsituas.prix_prod * lsituas.qteprod * (this.model.remise ? (1 - (this.model.remise / 100)) : 1) ) * (lsituas.tva / 100);
            }

        }
        return total;
    }

    TVATDt() {
        let total = 0;

        for (let options of this.option) {

            if (options.tvao == 10) {
                total += (options.prixfact * options.qtefact * (this.model.remise ? (1 - (this.model.remise / 100)) : 1) ) * (options.tvao / 100);
            }

        }
        return total;
    }

    TVATDOt() {
        let total = 0;

        for (let situaop of this.libsituaop) {

            if (situaop.tva == 10) {
                total += (situaop.prix_prod * situaop.qteprod * (this.model.remise ? (1 - (this.model.remise / 100)) : 1) ) * (situaop.tva / 100);
            }

        }
        return total;
    }




    SumTvaD() {
        return this.TVAD() + this.TVADO() + this.TVATDOt() + this.TVATDt() ;
    }

    TVACO() {
        let total = 0;

        for (let situas of this.situa) {

            if (situas.tvas == 5.5) {
                total += ( situas.prixfact * situas.qtefact * (this.model.remise ? (1 - (this.model.remise / 100)) : 1) ) * (situas.tvas / 100);

            }
        }
        return total;
    }

    TVAC() {
        let total = 0;

        for (let lsituas of this.libsitua) {

            if (lsituas.tva == 5.5) {
                total += (lsituas.prix_prod * lsituas.qteprod * (this.model.remise ? (1 - (this.model.remise / 100)) : 1) ) * (lsituas.tva / 100);
            }

        }
        return total;
    }

    TVATCt() {
        let total = 0;

        for (let options of this.option) {

            if (options.tvao == 5.5) {
                total += (options.prixfact * options.qtefact * (this.model.remise ? (1 - (this.model.remise / 100)) : 1) ) * (options.tvao / 100);
            }

        }
        return total;
    }

    TVATCOt() {
        let total = 0;

        for (let situaop of this.libsituaop) {

            if (situaop.tva == 5.5) {
                total += (situaop.prix_prod * situaop.qteprod * (this.model.remise ? (1 - (this.model.remise / 100)) : 1) ) * (situaop.tva / 100);
            }

        }
        return total;
    }



    SumTvaC() {
        return this.TVAC() + this.TVACO() + this.TVATCOt() + this.TVATCt() ;
    }

    TVADXO() {
        let total = 0;

        for (let situas of this.situa) {

            if (situas.tvas == 2.1) {
                total += ( situas.prixfact * situas.qtefact * (this.model.remise ? (1 - (this.model.remise / 100)) : 1) ) * (situas.tvas / 100);

            }
        }
        return total;
    }

    TVADX() {
        let total = 0;

        for (let lsituas of this.libsitua) {

            if (lsituas.tva == 2.1) {
                total += (lsituas.prix_prod * lsituas.qteprod * (this.model.remise ? (1 - (this.model.remise / 100)) : 1) ) * (lsituas.tva / 100);
            }

        }
        return total;
    }

    TVATDXt() {
        let total = 0;

        for (let options of this.option) {

            if (options.tvao == 2.1) {
                total += (options.prixfact * options.qtefact * (this.model.remise ? (1 - (this.model.remise / 100)) : 1) ) * (options.tvao / 100);
            }

        }
        return total;
    }

    TVATDXOt() {
        let total = 0;

        for (let situaop of this.libsituaop) {

            if (situaop.tva == 2.1) {
                total += (situaop.prix_prod * situaop.qteprod * (this.model.remise ? (1 - (this.model.remise / 100)) : 1) ) * (situaop.tva / 100);
            }

        }
        return total;
    }




    SumTvaDX() {
        return this.TVADX() + this.TVADXO() + this.TVATDXOt() + this.TVATDXt();
    }

    TotauxTVA(situas: any, valeur: any, options: any,lbsituas:any,situaop: any){
        return (this.SumTvaDX()>0 ? this.SumTvaDX() :0) + (this.SumTvaC() > 0 ? this.SumTvaC() : 0) + (this.SumTvaD()>0 ? this.SumTvaD() : 0) + (this.SumTvaV()> 0 ? this.SumTvaV() :0);
    }

    countTotalTTC(situas: any, valeur: any, options: any,lbsituas:any,situaop: any){
        return this.TotauxTVA(situas, valeur, options,lbsituas,situaop) + this.countTTCremise(situas, options, situaop, lbsituas);
    }

    countretenue(situas: any, valeur: any, options: any,lbsituas:any,situaop: any){
        return this.countTotalTTC(situas, valeur, options,lbsituas,situaop) * (this.model.id_version ? this.model.id_version : 0) / 100;
    }

}