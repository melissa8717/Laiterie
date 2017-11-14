import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, ContactService } from '../_services/index';
import { Contact } from '../_models/index';
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'devisclient.component.html'
})
export class DevisclientComponent implements OnInit {
    id_contact:number;
    devis: any = [] = [];
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};               //



    constructor(private route: ActivatedRoute,
                private router: Router,
                private contactService: ContactService,
                private alertService: AlertService,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {

        this.loaddroituser();
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";



        // get return url from route parameters or default to '/'
       // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        this.loadAllDevis();
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    loadAllDevis() {
        this.route.params.subscribe(params => {
            this.id_contact = params['id_contact']
            console.log(this.id_contact);
            this.contactService.getByIdDevisclient(this.id_contact).subscribe(
                data => {
                    this.devis = data;

                    console.log(data);
                }
            )
        });
    }
}