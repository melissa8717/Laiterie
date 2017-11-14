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
    templateUrl: 'cat_prod.component.html'
})

export class Cat_prodComponent implements OnInit {


    cat: any[] = [];
    entre: any = {};
    mat:any;
    unite: any[] = [];
    prod: any = {};

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
        this.loadCat();
        this.loadUnite();


    }


    loadCat(){
        console.log(this.cat)

        this.paramsService.getAllCat().subscribe(cat => {

            this.cat = cat;
            //console.log(this.cat);

        });
    }

    modify(aparams:any) {

        console.log(aparams);
        this.paramsService.updateCat(aparams).subscribe(
            data=>{
                this.alertService.success("Les données ont bien été modifiées.");
            });
    }

    addCat() {

        //console.log(currentUser._id);
        this.paramsService.addCat(this.entre).subscribe(
            mat => {
                this.mat = mat;
                //console.log(this.mat);


                this.cat.push(this.entre);
                this.entre = {};
            });
    }

    loadUnite(){
        console.log(this.cat)

        this.paramsService.getAllUnite().subscribe(unite => {

            this.unite = unite;
            console.log(this.unite);

        });
    }

    upUnite(aparams:any) {

        console.log(aparams);
        this.paramsService.updateUnite(aparams).subscribe(
            data=>{
                this.alertService.success("Les données ont bien été modifiées.");
            });
    }

    addUnit() {

        //console.log(currentUser._id);
        this.paramsService.addUnite(this.prod).subscribe(
            mat => {
                this.mat = mat;
                //console.log(this.mat);


                this.unite.push(this.prod);
                this.prod = {};
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
