import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, ContactService } from '../_services/index';
import { Contact, Mail, Telephone, Adresse, Qualification, Contrat } from '../_models/index';
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'ficheclient.component.html'
})
export class FicheclientComponent implements OnInit {

    contact = new Contact();
    returnUrl: string;

    mail = new Mail();
    mailPro = new Mail();
    telephoneFixe = new Telephone();
    telephoneMobile = new Telephone();
    telephonePro = new Telephone();
    telephoneFax  = new Telephone();
    adresse = new Adresse();

    print: boolean = false;

    cours: any = [] = [];
    chantier: any = [] = [];
    id_contact: number;

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private contactService: ContactService,
        private alertService: AlertService,
        private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.mail.type_mail = "perso";
        this.mailPro.type_mail = "pro";
        this.telephoneFixe.type_tel = "fixe";
        this.telephoneMobile.type_tel = "mobile";
        this.telephoneFax.type_tel = "fax";
        this.telephonePro.type_tel = "pro";
        this.adresse.type_adr = "defaut";

    }

    ngOnInit() {
        this.loaddroituser();


        this.route.params.subscribe(params => {
            this.getContact(params['id_contact']);
        });

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.loadAllchantier();
        this.loadAllencours();

    }
    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }



    loadAllchantier() {
        this.route.params.subscribe(params => {
            this.id_contact = params['id_contact']
            console.log(this.id_contact);
            this.contactService.getByIdchantier(this.id_contact).subscribe(
                data => {
                    this.chantier = data;

                    console.log(data);
                }
            )
        });
    }

    loadAllencours() {
        this.route.params.subscribe(params => {
            this.id_contact = params['id_contact']
            console.log(this.id_contact);
            this.contactService.getByIdencours(this.id_contact).subscribe(
                data => {
                    this.cours = data;

                    console.log(data);
                }
            )
        });
    }




    private getContact(id_contact: string){
        console.log(id_contact);
        this.contactService.getByIdAllInfos(id_contact).subscribe(
            data => {
                console.log(data);
                this.contact = data.contact;
                for(var i in data.mails){
                    switch(data.mails[i].type_mail){
                        case "perso": this.mail = data.mails[i]; break;
                        case "pro": this.mailPro = data.mails[i]; break;
                    }
                }
                for(var i in data.telephones){
                    switch(data.telephones[i].type_tel){
                        case "fixe": this.telephoneFixe = data.telephones[i]; break;
                        case "mobile": this.telephoneMobile = data.telephones[i]; break;
                        case "fax":this.telephoneFax = data.telephones[i]; break;
                        case "pro": this.telephonePro = data.telephones[i]; break;
                    }
                }
                if(data.adresse != null) this.adresse = data.adresse;

                var id_c = +id_contact;
                this.mail.id_contact = id_c;
                this.mailPro.id_contact = id_c;
                this.telephoneFixe.id_contact = id_c;
                this.telephoneMobile.id_contact = id_c;
                this.telephoneFax.id_contact = id_c;
                this.telephonePro.id_contact = id_c;
                this.adresse.id_contact = id_c;
            },
            error => {
                this.alertService.error(error._body);
            });
    }

    updateClient() {
        console.log("UpdateClient");
        var contactInfos = {
            "contact": this.contact,
            "mail": this.mail,
            "mailPro": this.mailPro,
            "telephoneFixe": this.telephoneFixe,
            "telephoneMobile": this.telephoneMobile,
            "telephoneFax":this.telephoneFax,
            "telephonePro": this.telephonePro,
            "adresse": this.adresse
        };
        console.log(contactInfos);
        this.contactService.update(contactInfos, this.contact.id_contact)
            .subscribe(
                data => {
                    this.alertService.success('Client mis à jour', true);
                    this.router.navigate(['/contact']);

                    console.log(data);
                },
                error => {
                    this.alertService.error(error._body);
                });
    }


    imprimer(){
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            var css = '@page { size: landscape; }',
                head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');

            style.type = 'text/css';
            style.media = 'print';

            if (style.sheet){
            } else {
                style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            window.print();
            this.print = false;
        }, 1000);
    }



}
