import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AlertService, ContactService} from '../_services/index';
import {Contact, Mail, Telephone, Adresse, Qualification, Contrat} from '../_models/index';
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'adressfact.component.html'
})
export class AdressfactComponent implements OnInit {

    private contact = new Contact();
    private returnUrl: string;



    print: boolean = false;
    id_contact: number;

    currentUser: User;
    droitsuser: any = {};
    _id: any;
    data: any = {};

    private addresses: any = {};


    constructor(private route: ActivatedRoute,
                private router: Router,
                private contactService: ContactService,
                private alertService: AlertService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));


    }

    ngOnInit() {
        this.loaddroituser();

        this.route.params.subscribe(params => {
            this.id_contact = params['id_contact'];

        });


        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';


    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }

    private addAddress() {
        this.contactService.addAdressfact(this.id_contact, this.addresses).subscribe(data => {
            this.data = data;

            //this.adrefact.push(this.addresses);
            this.addresses = {};
        });
    }

}