import {Component, Input, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';
import {Message} from "../_models/messages/message";
import {MessageService} from "../_services/message.service";
import {Commentaire} from "../_models/messages/commentaire";
import {ConversationService} from "./conversation.service";
import {User} from "../_models/user";
import {ParamsService} from "../_services/params.service"; //

@Component({
    moduleId: module.id,
    templateUrl: 'discussion.component.html'
})

export class DiscussionComponent implements OnInit {

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};

    text: string ;

    id : number;

    message : Message ;

    private sub: any;

    conversation : Commentaire[] = [];


    constructor(
        private route: ActivatedRoute,
        private alertService: AlertService,
        private messageService: MessageService,
        private conversationService: ConversationService,
        private paramsService:ParamsService
    ) {

        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));


        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id']; // (+) converts string 'id' to a number
            console.log(this.id);
            this.messageService.getById(this.id.toString()).subscribe(data =>{
                console.log(data);
                this.message = data[0];
                this.loadAllAnswers();

            });
            // In a real app: dispatch action to load the details here.
        });

    }

    ngOnInit() {

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        //alert("lol");
        this.loaddroituser();
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    onSubmit(){
        var test: {}= {id_message: this.id, date_com: new Date(), contenu: this.text, id_user: this.currentUser._id};
        this.messageService.answer(test).subscribe(data =>{
            console.log(data);
        });
        this.loadAllAnswers();
        console.log(this.text);
    }

    loadAllAnswers(){
        this.messageService.getConversation(this.id).subscribe(data => {
            console.log(data);
            this.conversation = data;
            console.log(this.conversation);
        });
    }


}
