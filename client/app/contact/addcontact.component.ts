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
    private types = ["Employé", "Fournisseur", "Client",
        "Entreprise de travaux", "Laboratoire d'analyse",
        "Transporteur", "Site de traitement", "Ouvrier"];
    private contrats = ["CDI", "CDD", "Intérimaire",
        "Stagiaire", "Contrat de professionnalisation"];
    private statuts = ["User", "Superuser", "Admin"];

    private qualifications: Qualification[];
    private qualifChoisi: number;

    private contact = new Contact();
    private mail = new Mail();
    private mailPro = new Mail();
    private telephoneFixe = new Telephone();
    private telephoneMobile = new Telephone();
    private telephonePro = new Telephone();
    private telephoneFax = new Telephone();
    private adresse = new Adresse();

    private loading = false;
    private returnUrl: string;
    private currentUser: User;
    private droitsuser: any = {};


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
        this.contactService.create(contactInfos).subscribe(() => {
            this.alertService.success('Nouveau contact créé', true);
            this.loading = false;
        }, error => {
            this.alertService.error(error);
            this.loading = false;
        });
    }
}
