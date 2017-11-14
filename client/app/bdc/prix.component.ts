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
    templateUrl: 'prix.component.html'
})

export class PrixComponent {

    list:any=[]=[];
    id_demande:number;


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
        this.loadDeatil();

    }

    loadDeatil() {
        this.route.params.subscribe(params => {
            this.id_demande = params['id_demande']
            console.log(this.id_demande);
            this.commandeService.getByIdDetail(this.id_demande).subscribe(
                data => {
                    this.list = data;
                    console.log(data)
                }
            )
        });

    }

}