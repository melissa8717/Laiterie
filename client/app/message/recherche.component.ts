/**
 * Created by Alex on 05/06/2017.
 */

import {Component, Input, OnInit} from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
import {Message} from "../_models/messages/message";
import {MessageService} from "../_services/message.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ChantierService} from "../_services/chantier.service";
import {MessageComponent} from "./message.component";
import {ParamsService} from "../_services/params.service";

@Component({
    selector: 'recherche',
    moduleId: module.id,
    templateUrl: 'recherche.component.html'
})

export class RechercheComponent implements OnInit {
    seek:{} = {};

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};

    @Input('message')
    message: MessageComponent;

    messages : Message[] = [];
    auteurs: {}[] = [];
    filter:{
        auteur: {id : number},
        chantier: {id_chantier : number},
        date_debut: "",
        date_fin: "",
        dest: {id : number},
        objet: "",
        respo: "",
        traite: "",
    };

    chantier: {}[] = [];



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
    public myForm2: FormGroup;

    constructor(private messageService: MessageService,
                private userService: UserService,
                private chantierService: ChantierService,
                private builder: FormBuilder,
                private _sanitizer: DomSanitizer,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        //console.log(this.currentUser)
    }

    ngOnInit() {
        this.loaddroituser();

        this.myForm = this.builder.group({
            auteur : "",
            dest: "",
            respo:"",
            chantier:"",
            objet:"",
            date_debut:"",
            date_fin:"",
            traite:"",
        });
        this.myForm.valueChanges.subscribe(data => {
            this.filter = data;
            this.message.loadAllMessages()
        });
        this.loadAllUsers();
        this.loadAllChantiers();

    }

    autocompleListFormatter = (data: any) : SafeHtml => {
        let html = `<span>${data.name}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    autocompleListFormatteruser = (data: any) : SafeHtml => {
        let html = `<span>${data.firstname} ${data.lastname}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };
    autocompleListFormatterchantier = (data: any) : SafeHtml => {
        let html = `<span>${data.nom_chantier} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };



    onSubmit(value:any){
        //ApplyFilter on
        console.log(this.message.messages);
        console.log(value);
        this.filter = value;
        this.message.loadAllMessages();
        /*setTimeout(() => {
            this.message.messages =
                this.message.messages .filter(function(el){ return el.id === value.auteur.id; });
            // this.filter = value;

        }, 1000);*/

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