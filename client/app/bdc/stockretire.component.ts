/**
 * Created by Wbat on 05/01/2018.
 */
import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {CommandeService} from "../_services/commandes.service";
import {ParamsService} from "../_services/params.service";

@Component({
    moduleId: module.id,
    templateUrl: 'stockretire.component.html'
})

export class StockretireComponent {

    id_bdc: number;
    id: number;
    bdc: any = {};
    list: any[] = [];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private alertService: AlertService,
                private commandeService: CommandeService,
                private paramsService: ParamsService) {

    }

    ngOnInit() {

        this.route.params.subscribe(params => {
            this.id_bdc = params['id'];

            this.commandeService.getByIdRetrait(this.id_bdc).subscribe(data => {
                this.bdc = data[0];
                console.log(this.bdc);
            });

            this.commandeService.getByIdOter(this.id_bdc).subscribe(data => {
                this.list = data;

                console.log(this.list);
            })
        });

    }



}