import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {AlertService, ContactService, ParamsService} from '../_services/index';
import {Adresse, Contact, Contrat, Mail, Qualification, Telephone, User} from '../_models/index';

@Component({
    moduleId: module.id,
    templateUrl: 'fichecontact.component.html',
})

export class FichecontactComponent implements OnInit {

    private loc = location.hostname;
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
    // visualisation de l'image avant envoi
    private url: any;

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
        this.loadAllContrat();
        this.loadAllLastContrat();
        this.getQualifications();
        this.loaddroituser();

        this.route.params.subscribe(params => {
            this.id_contact = params['id_contact'];
            this.getContact(params['id_contact']);
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    readUrl(event: any) {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (event: any) => {
                this.url = event.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
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
                console.log("Couldn't load the qualifications infos");
                console.log(error);
                this.alertService.error(error._body);
            });
    }

    private getContact(id_contact: number) {
        this.contactService.getByIdAllInfos(id_contact).subscribe(data => {
            this.contact = data.contact;
            for (let i in data.mails) {
                switch (data.mails[i].type_mail) {
                    case "perso":
                        this.mail = data.mails[i];
                        break;
                    case "pro":
                        this.mailPro = data.mails[i];
                        break;
                }
            }
            for (let i in data.telephones) {
                switch (data.telephones[i].type_tel) {
                    case "fixe":
                        this.telephoneFixe = data.telephones[i];
                        break;
                    case "mobile":
                        this.telephoneMobile = data.telephones[i];
                        break;
                    case "fax":
                        this.telephoneFax = data.telephones[i];
                        break;
                    case "pro":
                        this.telephonePro = data.telephones[i];
                        break;
                }
            }
            if (data.adresse != null) this.adresse = data.adresse;
            this.qualifChoisi = data.qualification;
            this.contrats = data.contrats;

            let id_c = +id_contact;
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

        console.log(this.contact.n_secu);
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
            this.alertService.error(error._body);
        });
    }

    loadAllContrat() {
        this.route.params.subscribe(params => {
            this.id_contact = params['id_contact']
        this.contactService.getByIdContrat(this.id_contact).subscribe(contrat => {
                this.contrat = contrat;
            }
        )
        });
    }

    loadAllLastContrat() {
        this.route.params.subscribe(params => {
            this.id_contact = params['id_contact']
        this.contactService.getByIdLastContrat(this.id_contact).subscribe(data => {
                this.lastcontrat = data[0];

            }
        )
        });
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


    imprimer() {
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
