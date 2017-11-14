import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {PlanningService} from "../_services/planning.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";


@Component({
    moduleId: module.id,
    templateUrl: 'ajout_abs.component.html'
})

export class Ajout_absComponent {
    model: any = {};
    print: boolean = false;
    agen: any;
    agence: any = {};
    currentUser: User;
    droitsuser:any={};
    _id:any;
    data:any={};


    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private planningService: PlanningService,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loaddroituser();
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }
}