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
    com:any[]=[];



    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        //this.authenticationService.logout();
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.loadCom();

    }

    modify(ag_params:any) {

        console.log(ag_params);

        var test = +confirm ("Acceptez vous les conditions de vente :");
        //console.log(factureparams);
        if(test) {
            this.paramsService.updateTest(ag_params).subscribe(
                data => {
                    this.router.navigate(["/login"]);
                    this.alertService.success("La licence a bien été mise à jour.");
                });
        }
    }

    loadCom(){
        //console.log(this.com)

        this.paramsService.getComlic().subscribe(com => {

            this.com = com;
            console.log(this.com);

        });
    }



}
