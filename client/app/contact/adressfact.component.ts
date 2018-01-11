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

    addresses: any = {};
    adrefact: any[] = [];


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
            this.loadfactadr();
        });


        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';


    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }

    addAddress() {
        this.contactService.addAdressfact(this.id_contact, this.addresses).subscribe(data => {
            this.addresses = data;

            this.addresses = {};
            this.router.navigate(["/ficheclient/"+this.id_contact]);
            this.alertService.success("L'adresse de facturation a été enregistrée.");
        });
    }

    private loadfactadr() {
        this.contactService.getByIdFacAddress(this.id_contact).subscribe(data => {
            this.adrefact = data;

            console.log(this.adrefact);
        })
    }

}