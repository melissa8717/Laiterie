/**
 * Created by Cedric on 20/08/2017.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";




@Component({
    moduleId: module.id,
    templateUrl: 'cgv.component.html'
})

export class CgvComponent implements OnInit {

    cgv: any ={};
    currentUser: User;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    }


    ngOnInit() {
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loadCat();

    }


    loadCat(){
        console.log(this.cgv)

        this.paramsService.getAllVente().subscribe(cgv => {

            this.cgv = cgv[0];
            console.log(this.cgv);

        });
    }

    modify(aparams:any) {

        console.log(aparams);
        this.paramsService.updateVente(aparams).subscribe(
            data=>{
                this.alertService.success("Les données ont bien été modifiées.");
            });
    }

}