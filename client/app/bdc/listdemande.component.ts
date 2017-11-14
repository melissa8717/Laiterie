/**
 * Created by Wbat on 03/07/2017.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {CommandeService} from "../_services/commandes.service";
import {ParamsService} from "../_services/params.service"; //

@Component({
    moduleId: module.id,
    templateUrl: 'listdemande.component.html'
})

export class ListdemandeComponent {

    list:any=[]=[];



    constructor(private route: ActivatedRoute,
                private router: Router,
                private alertService: AlertService,
                private commandeService: CommandeService,
                private paramsService: ParamsService) {

    }

    ngOnInit() {

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        this.loadAlldemande();

    }

    loadAlldemande() {
        this.commandeService.getAllListing().subscribe(list => {
            this.list = list;
            console.log(this.list);

        });
    }


}