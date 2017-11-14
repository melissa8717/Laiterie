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
    templateUrl: 'fraisprevisionel.component.html'
})

export class FraisprevisionelComponent implements OnInit {
    entre: any = {};

    frais: any = {};

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

    this.loadFrais();

    }

    addFrais() {

        //console.log(currentUser._id);
        this.paramsService.addfraisprev(this.entre).subscribe(
            mat => {

                console.log(this.entre);


                //this.frais.push(this.entre);
                this.entre = {};
            });
    }

    loadFrais(){
        //console.log(this.frais)

        this.paramsService.getAllFrais().subscribe(frais => {

            this.frais = frais[0];
            console.log(this.frais);


        });
    }


}