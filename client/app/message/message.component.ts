/**
 * Created by Wbat on 20/05/2017.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';
import {MessageService} from "../_services/message.service";
import {Message} from "../_models/messages/message";
import {RechercheComponent} from "./recherche.component";
import {ConversationService} from "./conversation.service";
import {User} from "../_models/user";
import {ParamsService} from "../_services/params.service"; //

@Component({
    moduleId: module.id,
    providers: [ConversationService],
    templateUrl: 'message.component.html'
})

export class MessageComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;
    messages : Message[] = [];
    currentUser:User;

    droitsuser:any={};         //
    _id:any;                   //
    data:any={};

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private messageService: MessageService,
        private alertService: AlertService,
        private conversationService: ConversationService,
        private paramsService:ParamsService)
    {

        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }



     @ViewChild('recherche')
     recherche: RechercheComponent;


    ngOnInit() {

        this.loaddroituser();

        this.loadAllMessages();

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        console.log("passage a flatclair");
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

    loadAllMessages() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        //console.log(currentUser._id);
        this.messageService.getAll(currentUser._id).subscribe(messages => {
            var test = this.recherche.filter;
            this.messages = messages;

            if(test) {
                console.log(test);
                if (test.auteur){
                    this.messages =
                        this.messages.filter(function (el) {
                            return (el.id === test.auteur.id /*|| el.toString().toLowerCase().indexOf(test.auteur.toString().toLowerCase())*/);
                        });
                }
                if (test.dest) {
                    this.messages =
                        this.messages.filter(function (el) {
                            return (el.destinataire === test.dest.id);
                        });
                }
                if (test.chantier) {
                    this.messages =
                        this.messages.filter(function (el) {
                            return (el.id_chantier === test.chantier.id_chantier);
                        });
                }
                if (test.date_debut) {
                    this.messages =
                        this.messages.filter(function (el) {
                            //console.log(new Date(el.date_creation).valueOf());
                            //console.log( new Date(test.date_debut).valueOf());
                            return (new Date(el.date_creation).valueOf() > new Date(test.date_debut).valueOf());
                        });
                }
               if (test.date_fin) {
                    this.messages =
                        this.messages.filter(function (el) {
                            return (new Date(el.date_creation).valueOf() < new Date(test.date_fin).valueOf());
                        });
               }

                if (test.objet) {
                    this.messages =
                        this.messages.filter(function (el) {
                            return (el.titre.toLowerCase().indexOf(test.objet.toLowerCase()) !== -1);
                        });
                }
                if (test.traite) {
                    if(test.traite == "oui")
                        this.messages =
                            this.messages.filter(function (el) {
                            return (el.traite == true );
                            });
                    if(test.traite == "non")
                        this.messages =
                            this.messages.filter(function (el) {
                                return (el.traite != true );
                            });
                }
            }


            console.log(this.messages);
        },
        err => {
            console.log(err);
        });

    }

    supprimer(id: string) {
        this.messageService.delete(id).subscribe(
            data=>{
                console.log("suppression OK");
                this.messages =
                    this.messages.filter(function(el){ return el.id_message != +id; });
            },
            error => {
                console.log("error");
            }
        );

    }

    /*changeMessage(message: Message ){
        this.conversationService.message = message;
        console.log(this.conversationService.message);
        this.router.navigate(['discussion']);
        //alert(this.conversationService.message);
    }*/

}
