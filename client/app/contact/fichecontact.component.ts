import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {AlertService, ContactService, ParamsService} from '../_services/index';
import {Adresse, Contact, Contrat, Mail, Qualification, Telephone, User} from '../_models/index';
import {FileUploader} from "ng2-file-upload";

@Component({
    moduleId: module.id,
    templateUrl: 'fichecontact.component.html',
})

export class FichecontactComponent implements OnInit {

    // Image Uploader
    private url: any;
    private urlImg: string = 'http://' + location.hostname + ':4000/image/contact';
    private uploaderImg: any;

    private currentUser: User;
    private droitsuser: any = {};
    private contact = new Contact();
    private returnUrl: string;
    private mail = new Mail();
    private mailPro = new Mail();
    private telephoneFixe = new Telephone();
    private telephoneMobile = new Telephone();
    private telephoneFax = new Telephone();
    private telephonePro = new Telephone();
    private adresse = new Adresse();
    private qualifications: Qualification[];
    private qualifChoisi: number;
    private id_contact: number;
    private contrats: Contrat[];
    private print: boolean = false;
    private contrat: any = [] = [];
    private lastcontrat: any = {};
    private newcontrat: any = {};


    constructor(private route: ActivatedRoute,
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
        this.loaddroituser();
        this.getQualifications();

        this.route.params.subscribe(params => {
            this.id_contact = params['id_contact'];

            this.getContact(this.id_contact);
            this.loadAllContrat();
            this.loadAllLastContrat();
            this.setUploaderImg();
        });

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
                this.alertService.error("Impossible de charger les qualifications.");
            });
    }

    private getContact(id_contact: number) {
        this.contactService.getByIdAllInfos(id_contact).subscribe(data => {
            this.contact = data.contact;
            for (let mail of data.mails) {
                switch (mail.type_mail) {
                    case "perso":
                        this.mail = mail;
                        break;
                    case "pro":
                        this.mailPro = mail;
                        break;
                }
            }
            for (let phone of data.telephones) {
                switch (phone.type_tel) {
                    case "fixe":
                        this.telephoneFixe = phone;
                        break;
                    case "mobile":
                        this.telephoneMobile = phone;
                        break;
                    case "fax":
                        this.telephoneFax = phone;
                        break;
                    case "pro":
                        this.telephonePro = phone;
                        break;
                }
            }
            if (data.adresse != null) this.adresse = data.adresse;
            this.qualifChoisi = data.qualification;
            this.contrats = data.contrats;

            let id_c = id_contact;
            this.mail.id_contact = id_c;
            this.mailPro.id_contact = id_c;
            this.telephoneFixe.id_contact = id_c;
            this.telephoneMobile.id_contact = id_c;
            this.telephoneFax.id_contact = id_c;
            this.telephonePro.id_contact = id_c;
            this.adresse.id_contact = id_c;
        }, error => {
            this.alertService.error(error._body);
        });
    }

    updateContact() {
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

        this.contactService.update(contactInfos, this.contact.id_contact).subscribe(() => {
            this.alertService.success('Contact mis à jour', true);
            if ((this.contact.contrat || this.contact.contrat != "") &&
                this.contact.date_sortie &&
                this.contact.date_entree) {
                let newContrat = new Contrat();
                newContrat.date_debut = this.contact.date_entree;
                newContrat.date_fin = this.contact.date_sortie;
                newContrat.type_contrat = this.contact.contrat;
                this.contrats.push(newContrat);
            }
            this.getContact(this.id_contact);
        }, error => {
            this.alertService.error(error);
        });
    }

    loadAllContrat() {
        this.contactService.getByIdContrat(this.id_contact).subscribe(contrat => {
            this.contrat = contrat;
        });
    }

    loadAllLastContrat() {
        this.contactService.getByIdLastContrat(this.id_contact).subscribe(data => {
            this.lastcontrat = data[0];
        })
    }

    loadAdd() {
        this.contrat.push(this.lastcontrat);
        this.contactService.addcontrat(this.lastcontrat).subscribe(() => {
        });
    }

    loadNewcontrat() {
        this.contrat.push(this.newcontrat);
        this.contactService.newcontrat(this.id_contact, this.newcontrat).subscribe(() => {
        });
    }

    private setUploaderImg() {
        this.uploaderImg = new FileUploader({url: this.urlImg + "/" + this.id_contact});
        this.uploaderImg.onAfterAddingFile = (file: any) => {
            file.withCredentials = false;
        };
    }

    private readUrl(event: any) {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (event: any) => {
                this.url = event.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    private imprimer() {
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            let css = '@page { size: landscape; }',
                head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');

            style.type = 'text/css';
            style.media = 'print';

            if (style.sheet) {
            } else {
                style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            window.print();
            this.print = false;
        }, 1000);
    }

}
