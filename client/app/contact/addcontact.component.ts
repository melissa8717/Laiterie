/**
 * Created by Wbat on 23/05/2017.
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, ContactService } from '../_services/index';
import { Contact, Mail, Telephone, Adresse, CACES, Qualification } from '../_models/index';
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'addcontact.component.html'
})

export class AddcontactComponent {
    types = ["Employé", "Fournisseur", "Client",
            "Entreprise de travaux", "Laboratoire d'analyse",
            "Transporteur", "Site de traitement", "Ouvrier"];
    contrats = ["CDI", "CDD", "Intérimaire",
            "Stagiaire", "Contrat de professionnalisation"];
    statuts = ["User", "Superuser", "Admin"];
    caces : CACES[];
    qualifications : Qualification[];
    qualifChoisi : number;

    contact = new Contact();
    mail = new Mail();
    mailPro = new Mail();
    telephoneFixe = new Telephone();
    telephoneMobile = new Telephone();
    telephonePro = new Telephone();
    telephoneFax = new Telephone();
    adresse = new Adresse();

    image: File;
    ged: File[];

    loading = false;
    returnUrl: string;
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};               //


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
        this.getCACES();
        this.getQualifications();
        this.loaddroituser();


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

    private getCACES(){
        this.contactService.getCACES()
            .subscribe(
                data => {
                    this.caces = data;
                },
                error => {
                    console.log("Couldn't load the caces infos");
                    this.alertService.error(error._body);
                });
    }

    private getQualifications(){
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

    public fileImageChange(event: any) {
        let fileList: FileList = event.target.files;
        if(fileList.length > 0) {
            this.image = fileList[0];
            this.contact.image_url = this.image.name;
        }
    }

    public fileGEDChange(event: any) {
        let fileList = event.target.files;
        if(fileList.length > 0) {
            this.ged = fileList;
        }
    }

    addContact() {
        this.loading = true;
        console.log("Validate addContact");
        var contactInfos = {
            "contact": this.contact,
            "mail": this.mail,
            "mailPro": this.mailPro,
            "telephoneFixe": this.telephoneFixe,
            "telephoneMobile": this.telephoneMobile,
            "telephoneFax": this.telephoneFax,
            "telephonePro": this.telephonePro,
            "adresse": this.adresse,
            "qualification": this.qualifChoisi
        };
        console.log(contactInfos);
        this.contactService.create(contactInfos)
            .subscribe(
                data => {
                    var uploads = [];
                    if(this.image){
                        uploads.push(this.contactService.upload("/contacts/"+data+"/image/upload", this.image));
                    }
                    for(var i in this.ged){
                        uploads.push(this.contactService.upload("/contacts/"+data+"/ged/upload", this.ged[i]));
                    }
                    Promise.all(uploads)
                    .then((response) => {
                        this.alertService.success('Nouveau contact créé', true);
                        this.loading = false;
                    }).catch((error) => {
                        this.alertService.error(error._body);
                        this.loading = false;
                    });
                },
                error => {
                    this.alertService.error(error._body);
                    this.loading = false;
                });
    }

}
