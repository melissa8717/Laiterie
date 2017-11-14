import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, ContactService } from '../_services/index';
import { Contact, Mail, Telephone, Adresse, Qualification, Contrat } from '../_models/index';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import {FileUploader} from 'ng2-file-upload';
import {AppConfig} from "../app.config";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

// const URL = '/api/';

@Component({
    moduleId: module.id,
    templateUrl: 'fichecontactpdf.component.html'
})


export class FichecontactpdfComponent implements OnInit {

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};

    contact = new Contact();
    returnUrl: string;

    mail = new Mail();
    mailPro = new Mail();
    telephoneFixe = new Telephone();
    telephoneMobile = new Telephone();
    telephonePro = new Telephone();
    adresse = new Adresse();

    qualifications : Qualification[];
    qualifChoisi : number;
    id_contact : number;
    contrats : Contrat[];
    print: boolean = false;
    id_contrat:number;

    contrat: any = [] = [];
    lastcontrat: any ={};

    tauxhoraire:number;
    newcontrat:any={};


    constructor(
        private http: Http,
        private config: AppConfig,
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
        this.telephonePro.type_tel = "pro";
        this.adresse.type_adr = "defaut";




    }


    ngOnInit() {
        this.loadAllContrat();
        this.loadAllLastContrat();
        this.getQualifications();
        this.loaddroituser();

        this.route.params.subscribe(params => {
            this.id_contact = params['id_contact'];
            this.getContact(params['id_contact']);

        });

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    private getQualifications() {
        this.contactService.getQualifications()
            .subscribe(
                data => {
                    this.qualifications = data;
                },
                error => {
                    console.log("Couldn't load the qualifications infos");
                    console.log(error);
                    this.alertService.error(error._body);
                });
    }

    private getContact(id_contact: string){
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
                        case "pro": this.telephonePro = data.telephones[i]; break;
                    }
                }
                if(data.adresse != null) this.adresse = data.adresse;
                this.qualifChoisi = data.qualification;
                this.contrats = data.contrats;

                var id_c = +id_contact;
                this.mail.id_contact = id_c;
                this.mailPro.id_contact = id_c;
                this.telephoneFixe.id_contact = id_c;
                this.telephoneMobile.id_contact = id_c;
                this.telephonePro.id_contact = id_c;
                this.adresse.id_contact = id_c;
            },
            error => {
                this.alertService.error(error._body);
            });
    }

    updateContact() {
        console.log("UpdateContact");
        var contactInfos = {
            "contact": this.contact,
            "mail": this.mail,
            "mailPro": this.mailPro,
            "telephoneFixe": this.telephoneFixe,
            "telephoneMobile": this.telephoneMobile,
            "telephonePro": this.telephonePro,
            "adresse": this.adresse,
            "qualification": this.qualifChoisi
        };
        console.log(contactInfos);
        this.contactService.update(contactInfos, this.contact.id_contact)
            .subscribe(
                data => {
                    this.alertService.success('Contact mis à jour', true);
                    if((this.contact.contrat || this.contact.contrat != "") &&
                        this.contact.date_sortie &&
                        this.contact.date_entree){
                        var newContrat = new Contrat();
                        newContrat.date_debut = this.contact.date_entree;
                        newContrat.date_fin = this.contact.date_sortie;
                        newContrat.type_contrat = this.contact.contrat;
                        this.contrats.push(newContrat);
                    }
                    console.log(data);
                },
                error => {
                    this.alertService.error(error._body);
                });
    }

    loadAllContrat() {
        this.route.params.subscribe(params => {
            this.id_contact = params['id_contact']
            console.log(this.id_contact);
            this.contactService.getByIdContrat(this.id_contact).subscribe(
                data => {
                    this.contrat = data;

                    console.log(data);
                }
            )
        });
    }

    loadAllLastContrat() {
        this.route.params.subscribe(params => {
            this.id_contact = params['id_contact']
            console.log(this.id_contact);
            this.contactService.getByIdLastContrat(this.id_contact).subscribe(
                data => {
                    this.lastcontrat = data[0];

                    //console.log(data);
                }
            )
        });
    }

    loadAdd(){
        this.contactService.addcontrat(this.lastcontrat).subscribe(
            mat => {
                //console.log(this.mat);

                this.contrat.push(this.lastcontrat);

            });
    }

    loadNewcontrat(){
        this.contactService.newcontrat(this.id_contact,this.newcontrat).subscribe(
            mat => {


                this.contrat.push(this.newcontrat);
                console.log(this.newcontrat);
            });
    }


    imprimer(){
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            window.print();
            this.print = false;
        }, 1000);
    }

}
