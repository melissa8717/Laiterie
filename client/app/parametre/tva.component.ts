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
    templateUrl: 'tva.component.html'
})

export class TvaComponent implements OnInit {


    fact: any[] = [];

    print: boolean = false;
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
        this.loadTva();

    }

    loadTva(){
        console.log(this.fact)

        this.paramsService.getAllTVA().subscribe(fact => {

            this.fact = fact;
            console.log(this.fact);

        });
    }

    modify(a_params:any) {

        console.log(a_params);
        this.paramsService.updateTva(a_params).subscribe(
            data=>{
                this.alertService.success("Les données ont bien été modifiées.");
            });
    }

    imprimer() {
        this.alertService.clear();
        var css = '@page',
            head = document.head || document.getElementsByTagName('head')[0],

            style = document.createElement('style');

        style.type = 'text/css';
        style.media = 'print';

        if (style.sheet) {
        } else {
            style.appendChild(document.createTextNode(css));
        }




        this.print = true;
        setTimeout(() => {

            window.print();
            this.print = false;
        }, 1000);
    }



}
