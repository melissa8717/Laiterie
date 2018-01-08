import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, ContactService } from '../_services/index';
import { Contact } from '../_models/index';
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'factclient.component.html'
})
export class FactclientComponent implements OnInit {
    id_contact:number;
    facture: any = [] = [];
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

        this.loadAllFact();
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];



        });
    }

    loadAllFact() {
        this.route.params.subscribe(params => {
            this.id_contact = params['id_contact']
            console.log(this.id_contact);
            this.contactService.getByIdFacclient(this.id_contact).subscribe(
                data => {
                    this.facture = data;


                }
            )
        });
    }
}