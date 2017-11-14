/**
 * Created by cédric on 29/06/2017.
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'licence.component.html'
})

export class LicenceComponent  {
    model: any = {};
    lic:any;
    currentUser: User;



    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));



    }



    addLicence() {


        this.paramsService.addLicence(this.model).subscribe(lic => {

            this.lic = lic;
            console.log(this.model);
            //console.log("compo ts" this.lic);
            this.alertService.success('Nouvelle licence ajoutée avec succès', true);
            this.router.navigate(['/licence']);

        });
    }





}
