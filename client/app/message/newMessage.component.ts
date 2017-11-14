/**
 * Created by Wbat on 04/06/2017.
 */
import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
import {Message} from "../_models/messages/message";
import {MessageService} from "../_services/message.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {AlertService} from "../_services/alert.service";
import { Router } from '@angular/router';
import {ChantierService} from "../_services/chantier.service";
import {ParamsService} from "../_services/params.service"; //

@Component({

    moduleId: module.id,
    templateUrl: 'newMessage.component.html'
})

export class NewMessageComponent implements OnInit {
    seek:{} = {};
    currentUser: User;
    messages : Message[] = [];
    auteurs : User[] = [];

    chantier: {}[] = [];

    droitsuser:any={};         //
    _id:any;                   //
    data:any={};


    public dest = [{
        id: 1,
        name: 'Alexandre',
        prenom: '4,157,300,000'
    }, {
        id: 2,
        name: 'Anthony',
        prenom: '1,030,400,000'
    }, {
        id: 3,
        name: 'Jean',
        prenom: '738,600, 000'
    }, {
        id: 4,
        name: 'Cyprien',
        prenom: '461,114,000'
    }, {
        id: 5,
        name: 'Cedric',
        prenom: '390,700,000'
    }, {
        id: 6,
        name: 'Manon',
        prenom: '36,700,000'
    }, {
        id: 7,
        name: 'Gaspard',
        prenom: 0
    },
        {
            id: 8,
            name: 'Liavona',
            prenom: 0
        }
    ];

    public respo = [{
        id: 1,
        name: 'Jean',
        prenom: '4,157,300,000'
    }, {
        id: 2,
        name: 'Manon',
        prenom: '1,030,400,000'
    }
    ];
    public myForm: FormGroup;

    constructor(private messageService: MessageService,
                private userService: UserService,
                private router: Router,
                private chantierService: ChantierService,
                private alertService: AlertService,
                private builder: FormBuilder,
                private _sanitizer: DomSanitizer,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log(this.currentUser);
    }

    ngOnInit() {
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        this.myForm = this.builder.group({
            to: "",
            chantier:"",
            objet:"",
            message:""
        });
        this.loaddroituser();
        this.loadAllUsers();
        this.loadAllChantiers();
        console.log(this.auteurs);
    }

    autocompleListFormatteruser = (data: any) : SafeHtml => {
    let html = `<span>${data.firstname} ${data.lastname}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
}
    autocompleListFormatterchantier = (data: any) : SafeHtml => {
        let html = `<span>${data.nom_chantier} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    }

    onSubmit(value:any){
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
       console.log(value);
       let test: {titre : string, chantier: number, message: string, from : number,to: number, date_creation: string }=
           {message : value.message, chantier: value.chantier.id_chantier, titre : value.objet , to : value.to.id, from : currentUser._id, date_creation : new Date().toString() };
       console.log(test);
        this.messageService.create(test)
            .subscribe(
            data => {
                console.log("check")
                this.alertService.success('Message Envoyé', true);
                this.router.navigate(['/message']);
            },
            error => {
                this.alertService.error("Veuillez choisir un des éléments proposés dans les listes déroulantes! ");
            });
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.auteurs = users; });
    }


    private loadAllChantiers() {
        this.chantierService.getAll().subscribe(chantiers => { this.chantier = chantiers; });
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }




}