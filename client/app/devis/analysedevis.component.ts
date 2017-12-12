import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {AlertService} from '../_services/index';
import {DevisService} from "../_services/devis.service";

@Component({
    moduleId: module.id,
    templateUrl: 'analysedevis.component.html'
})

export class AnalysedevisComponent implements OnInit {

    private detail: any = [] = [];
    private id_devis: number;
    private num_version: number;
    private qte_devis: number;
    private prix_achat: number;
    private option: any = [] = [];
    private margedeta: number;
    private margeopti: number;
    private devis: any = {};

    constructor(private route: ActivatedRoute,
                private alertService: AlertService,
                private devisService: DevisService) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.id_devis = params['id_devis'];
            this.num_version = params['num_version'];

            this.loadDevis();
            this.loadOption();
            this.loadAnalyse();
        });
    }

    customTrackBy(index: number): any {
        return index;
    }

    loadDevis() {
        this.devisService.getByIdAnalyse(this.id_devis, this.num_version).subscribe(data => {
            this.detail = data;
        })
    }

    pricedet(details: any) {
        if (details.margedev)
            details.prix_dev = ((details.margedev / 100) + 1) * details.prix_achat;

        else details.prix_dev = ((details.margepc / 100) + 1) * details.prix_achat;

        return details.prix_dev;
    }

    countDetail(details: any) {
        return this.pricedet(details) != 0 ? this.pricedet(details) * details.qte_devis : 0;
    }

    margedet(details: any) {
        this.margedeta = this.pricedet(details) - details.prix_achat;
        return this.margedeta;
    }

    countTotaldet() {

        let totaldet = 0;

        for (let details of this.detail) {
            if (details.prix_dev)
                totaldet += this.pricedet(details) != 0 ? this.pricedet(details) * details.qte_devis : 0;
            else 0;
        }
        return totaldet;
    }


    loadOption() {
        this.devisService.getByIdAnalyseopt(this.id_devis, this.num_version).subscribe(data => {
            this.option = data;
        })
    }

    priceopt(options: any) {
        if (options.margedev)
            options.prix_dev = ((options.margedev / 100) + 1) * options.prix_achat;

        else options.prix_dev = ((options.margepc / 100) + 1) * options.prix_achat;

        return options.prix_dev;

    }

    countOption(options: any) {
        return this.priceopt(options) != 0 ? this.priceopt(options) * options.qte_devis : 0;
    }

    margeopt(options: any) {
        this.margeopti = this.priceopt(options) - options.prix_achat;
        return this.margeopti;
    }

    countTotaloption(options: any) {

        let totaldet = 0;

        for (let options of this.option) {
            if (options.prix_dev)
                totaldet += this.priceopt(options) != 0 ? this.priceopt(options) * options.qte_devis : 0;
            else 0;
        }
        return totaldet;
    }

    modify(devisparams: any) {
        this.devisService.updateDevisdetail(devisparams).subscribe(() => {
                this.alertService.success("Les données ont bien été modifiées.");
            });
    }

    sommeTotal(options: any) {
        return this.countTotaloption(options) + this.countTotaldet();
    }

    modifyopt(devisparams: any) {
        this.devisService.updateDevisoption(devisparams).subscribe(() => {
            this.alertService.success("Les données ont bien été modifiées.");
        });
    }

    loadAnalyse() {
        this.devisService.getByIdAnaldevis(this.id_devis, this.num_version).subscribe(data => {
            this.devis = data[0];
        })
    }
}

