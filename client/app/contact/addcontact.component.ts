/**
 * Created by Wbat on 23/05/2017.
 */
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AlertService, ContactService, ParamsService} from '../_services/index';
import {Adresse, Contact, Mail, Qualification, Telephone, User} from '../_models/index';

@Component({
    moduleId: module.id,
    templateUrl: 'addcontact.component.html'
})

export class AddcontactComponent implements OnInit {
    types = ["Employé", "Fournisseur", "Client",
        "Entreprise de travaux", "Laboratoire d'analyse",
        "Transporteur", "Site de traitement", "Ouvrier"];
    contrats = ["CDI", "CDD", "Intérimaire",
        "Stagiaire", "Contrat de professionnalisation"];
    statuts = ["User", "Superuser", "Admin"];
    qualifications: Qualification[];
    qualifChoisi: number;

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
    droitsuser: any = {};         //
    _id: any;                   //
    data: any = {};               //


    constructor(private route: ActivatedRoute,
                private router: Router,
                private contactService: ContactService,
                private alertService: AlertService,
                private paramsService: ParamsService) {
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
        this.getQualifications();
        this.loaddroituser();


        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }

    private getQualifications() {
        this.contactService.getQualifications()
            .subscribe(data => {
                this.qualifications = data;
            }, error => {
                console.error(error);
                this.alertService.error(error);
            });
    }

    addContact() {
        this.loading = true;
        let contactInfos = {
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
        this.contactService.create(contactInfos)
            .subscribe(data => {
                let uploads = [];
                if (this.image) {
                    uploads.push(this.contactService.upload("/contacts/" + data + "/image/upload", this.image));
                }
                for (let i in this.ged) {
                    uploads.push(this.contactService.upload("/contacts/" + data + "/ged/upload", this.ged[i]));
                }
                Promise.all(uploads)
                    .then(() => {
                        this.alertService.success('Nouveau contact créé', true);
                        this.loading = false;
                    }).catch((error) => {
                    this.alertService.error(error._body);
                    this.loading = false;
                });
            }, error => {
                this.alertService.error(error._body);
                this.loading = false;
            });
    }

}
