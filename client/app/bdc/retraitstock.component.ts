/**
 * Created by Wbat on 04/07/2017.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {AlertService} from '../_services/index';
import {User} from "../_models/user";
import {CommandeService} from "../_services/commandes.service";
import {ParamsService} from "../_services/params.service";

@Component({
    moduleId: module.id,
    templateUrl: 'retraitstock.component.html'
})

export class RetraitstockComponent implements OnInit {

    currentUser: User;         //
    droitsuser: any = {};         //
    data: any = {};
    retrait:any=[]=[];

    date: boolean = false;
    loading = false;
    print: boolean = false;
    my: Date = new Date();

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


    ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.my.setMonth(this.my.getMonth())
        this.loaddroituser();
        this.loadAllRetrait();
    }

    constructor(private alertService: AlertService,
                private router: Router,
                private commandeService: CommandeService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));


    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];


        });
    }


    back() {
        this.my.setMonth(this.my.getMonth() - 1);
        this.loadAllRetrait()
    }

    up() {
        this.my.setMonth(this.my.getMonth() + 1);

        this.loadAllRetrait();
    }


    loadAllRetrait(){

        this.commandeService.retrait(this.my.getMonth()+1, this.my.getFullYear()).subscribe(
            data => {
                this.retrait = data;
                console.log(this.retrait);

            });
    }


}