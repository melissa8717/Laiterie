import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {PlanningService} from "../_services/planning.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";


@Component({
    moduleId: module.id,
    templateUrl: 'recapitulatifmois.component.html'
})

export class RecapitulatifmoisComponent {

    print: boolean = false;


    date: boolean = false;
    loading = false;
    my: Date = new Date();

    currentUser: User;         //
    droitsuser: any = {};         //
    _id: any;                   //
    data: any = {};

    chant: any []=[];


    monthArray: string[] = [

        "Janvier",
        "Fevrier",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Aout",
        "Septembre",
        "Octobre",
        "Novembre",
        "Decembre",
    ];


    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private planningService: PlanningService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.loaddroituser();
        this.loadRecap();
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            //console.log(this.data);
            //console.log(this.currentUser._id);

        });
    }

    back(){
        this.my.setMonth(this.my.getMonth()-1);
        this.loadRecap();
    }

    up(){
        this.my.setMonth(this.my.getMonth()+1);
        this.loadRecap();
    }

    loadRecap() {

        this.date = false;
        this.planningService.getAllRecap(this.my.getMonth()+1, this.my.getFullYear()).subscribe(
            data => {
                this.chant = data;
                this.loading= false;
                //console.log(this.chant)
            },
            err =>{
                this.alertService.error("Impossible de charger les heures du mois, veuillez réessayer ultérieurement");
                this.loading= false;
            }
        );
    }

}