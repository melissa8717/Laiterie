/**
 * Created by Wbat on 13/07/2017.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";


@Component({
    moduleId: module.id,
    templateUrl: 'formation.component.html'
})

export class FormationComponent implements OnInit {

    entre: any = {};
    mat:any;
    print: boolean = false;
    currentUser: User;
    formation:any []=[];


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
        this.loadFormatinon();

    }

    addFormation() {

        //console.log(currentUser._id);
        this.paramsService.addFormation(this.entre).subscribe(
            mat => {
                this.mat = mat;
                //console.log(this.mat);


                //this.cat.push(this.entre);
                this.entre = {};
            });
    }

    loadFormatinon(){
        console.log(this.formation)

        this.paramsService.getAllFormation().subscribe(formation => {

            this.formation = formation;
            console.log(this.formation);

        });
    }


}