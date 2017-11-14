import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, ContactService } from '../_services/index';
import { Contact } from '../_models/index';

import {RechercheContactComponent } from "./rechercheContact.component";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'contact.component.html'
})
export class ContactComponent implements OnInit {
    types = ["Employé","Ouvrier","Fournisseur", "Client", "Intérimaire",
            "Entreprise de travaux", "Laboratoire d'analyse",
            "Transporteur", "Site de traitement"];
    contacts: Contact[] = [];

    contactToFind = {nom:"", prenom:"", type:"", tel:"", adresse:"", code_postal:"", ville:"",cville:"",raison_sociale:"",cadresse:"",ccp:""};
    filteredContacts: Contact[] = [];

    returnUrl: string;
    print: boolean = false;

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};

    @ViewChild('recherche')
    recherche: RechercheContactComponent;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private contactService: ContactService,
        private alertService: AlertService,
        private paramsService:ParamsService,
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loaddroituser();

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";

        this.loadAllContacts();

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

    public loadAllContacts() {
        this.contactService.getList().subscribe(contacts => {
            this.contacts = contacts;
            for(var i in contacts){
                if(contacts[i].mailPro != null)
                    this.contacts[i].mail = contacts[i].mailPro;
                else
                    this.contacts[i].mail = contacts[i].mailPerso;

                if(contacts[i].telPro != null)
                    this.contacts[i].tel = contacts[i].telPro;
                else if(contacts[i].telMobile != null)
                    this.contacts[i].tel = contacts[i].telMobile;
                else
                    this.contacts[i].tel = contacts[i].telFixe;

                if(this.contacts[i].nom == null) this.contacts[i].nom = "";
                if(this.contacts[i].prenom == null) this.contacts[i].prenom = "";
                if(this.contacts[i].raison_sociale == null) this.contacts[i].raison_sociale = "";
                if(this.contacts[i].telFixe == null) this.contacts[i].telFixe = "";
                if(this.contacts[i].telMobile == null) this.contacts[i].telMobile = "";
                if(this.contacts[i].telPro == null) this.contacts[i].telPro = "";
                if(this.contacts[i].adresse == null) this.contacts[i].adresse = "";
                if(this.contacts[i].code_postal == null) this.contacts[i].code_postal = "";
                if(this.contacts[i].ville == null) this.contacts[i].ville = "";
                if(this.contacts[i].cville == null) this.contacts[i].cville = "";
                if(this.contacts[i].cadresse == null) this.contacts[i].cadresse = "";
                if(this.contacts[i].cpp == null) this.contacts[i].cpp = "";
            }
            console.log(this.contacts);
            this.filteredContacts = this.contacts;
            this.filtre(this.recherche.seek)

        });
    }

    private deleteContact(contact : Contact){
        this.contactService.delete(""+contact.id_contact).subscribe(
            data => {
                this.contacts = this.contacts.filter(x => x.id_contact != contact.id_contact);
                this.filteredContacts = this.filteredContacts.filter(x => x.id_contact != contact.id_contact);
                this.alertService.success("Le contact a bien été supprimé");
            },
            error => {
                this.alertService.error(error._body);
                console.log(error);
            });

    }

    private showAll() {
        this.filteredContacts = this.contacts;
    }

    private filterContacts() {
        console.log(this.contactToFind);
        this.filteredContacts = this.contacts.filter(x =>
            x.nom.includes(this.contactToFind.nom) &&
            x.prenom.includes(this.contactToFind.prenom) &&
            x.type.includes(this.contactToFind.type)  &&
            (x.telFixe.includes(this.contactToFind.tel) ||
            x.telMobile.includes(this.contactToFind.tel) ||
            x.telPro.includes(this.contactToFind.tel)) &&
            x.raison_sociale.includes(this.contactToFind.raison_sociale)  &&
           // x.adresse.includes(this.contactToFind.adresse) &&
            x.cadresse.includes(this.contactToFind.cadresse) &&
           // x.code_postal.includes(this.contactToFind.code_postal) &&
            x.cville.includes(this.contactToFind.cville) &&
            x.ccp.includes(this.contactToFind.ccp)
        );


    }

    filtre(test: any) {
        if (test.nom) {
            this.filteredContacts =
                this.filteredContacts.filter(function (el: any) {
                    return ((el.nom ? el.nom : "").toLowerCase().indexOf(test.nom.toLowerCase()) !== -1 );
                });
        }

        if (test.prenom) {
            this.filteredContacts =
                this.filteredContacts.filter(function (el: any) {
                    return ((el.prenom ? el.prenom : "").toLowerCase().indexOf(test.prenom.toLowerCase()) !== -1 );
                });
        }

        if (test.raison_sociale) {
            this.filteredContacts =
                this.filteredContacts.filter(function (el: any) {
                    return ((el.raison_sociale ? el.raison_sociale : "").toLowerCase().indexOf(test.raison_sociale.toLowerCase()) !== -1 );
                });
        }

        if (test.type) {
            this.filteredContacts =
                this.filteredContacts.filter(function (el: any) {
                    return ((el.type ? el.type : "").toLowerCase().indexOf(test.type.toLowerCase()) !== -1 );
                });
        }

        if (test.mail) {
            this.filteredContacts =
                this.filteredContacts.filter(function (el: any) {
                    return ((el.mail ? el.mail : "").toLowerCase().indexOf(test.mail.toLowerCase()) !== -1 );
                });
        }

        if (test.tel) {
            this.filteredContacts =
                this.filteredContacts.filter(function (el:any) {
                    return (el.tel === test.tel );
                });
        }

        if (test.cadresse) {
            this.filteredContacts =
                this.filteredContacts.filter(function (el: any) {
                    return ((el.cadresse ? el.cadresse : "").toLowerCase().indexOf(test.cadresse.toLowerCase()) !== -1 );
                });
        }

        if (test.ccp) {
            this.filteredContacts =
                this.filteredContacts.filter(function (el: any) {
                    return ((el.ccp ? el.ccp : "").toLowerCase().indexOf(test.ccp.toLowerCase()) !== -1 );
                });
        }

        if (test.cville) {
            this.filteredContacts =
                this.filteredContacts.filter(function (el: any) {
                    return ((el.cville ? el.cville : "").toLowerCase().indexOf(test.cville.toLowerCase()) !== -1 );
                });
        }
    }

    public downloadFiche(id: number){
        return this.contactService.download(id);
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
