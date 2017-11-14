import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
import {MessageService} from "../_services/message.service";
import {PlanningService} from "../_services/planning.service";
import {ParamsService} from "../_services/params.service";
import {FileUploader} from 'ng2-file-upload'; //////////////////////////////////////////////////////////////////////////

const URLimg = 'http://'+location.hostname+':4000/image/'; /////////////////////////////////////////////////////////////

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {

    public uploaderImg: FileUploader; //////////////////////////////////////////////////////////////////////////////////

    currentUser: User;
    users: User[] = [];
    alarms: any[] = [];
    msg: number;
    param:any={};
    droitsuser:any={};
    _id:any;
    data:any={};
    messages : any [] = [];
    form:any []= [];
    caces:any []= [];

    model: any = {}; //////////////////////////////////////////////////////////////////////////////////////////////////
    loc = location.hostname;
    image: any[];
    id_agence: number;

    constructor(private userService: UserService,
                private planningService: PlanningService,
                private paramsService:ParamsService,
                private messageService:MessageService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log(this.currentUser);
    }

    ngOnInit() {
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        console.log("passage a flat");
        body.className += "flat";
        //this.loadAllUsers();
        this.loadUnreadMsg();
        this.loadAlarmes();
        this.loadparam();
        this.loaddroituser();
        this.loadAllMessages();
        this.loadAlarmeform();
        this.loadAlarmecaces();
        this.loadAllagence();
    }

    loadAllagence() {

        this.paramsService.getAllAgence().subscribe(model => {

            this.model = model[0];
            console.log(this.model);
            //console.log(this.currentUser);

            this.uploaderImg = new FileUploader({url: URLimg + "agence/" + this.model.id_agence}); ////////////////////////
            this.uploaderImg.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };

            /*this.uploader = new FileUploader({url: URL + "param/" + this.model.id_agence});
            this.uploader.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };*/

        });
    }


    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            //console.log(this.currentUser._id);

        });
    }

    deleteUser(_id: string) {
        this.userService.delete(_id).subscribe(() => { this.loadAllUsers() });
    }

    checkday(date: any){
        return (new Date(date).getUTCDate() == new Date().getUTCDate() && new Date(date).getMonth() == new Date().getMonth() && new Date(date).getFullYear() == new Date().getFullYear());
    }

    private loadAlarmes(){
        this.planningService.loadAlarms(+this.currentUser._id).subscribe(
            alarms =>{
                this.alarms = alarms;
                //console.log(this.alarms);

            });
    }

    private loadUnreadMsg(){
        this.messageService.unreadMsg(this.currentUser._id).subscribe(msg =>{
            this.msg = msg[0].nbUnread;
            //console.log(this.msg);
        });
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }

    loadparam(){

        this.paramsService.getAllHome().subscribe(param => {

            this.param = param;
            //console.log(this.param);

        });
    }
    meteo(param:any) {
        for (let params of this.param) {
            return '<iframe height="190" frameborder="0" width="283" scrolling="no" src="http://www.prevision-meteo.ch/services/html/'+params.meteo+'/square" allowtransparency="true" style="margin-left: 20px;"> </iframe>';
        }
    }


    loadAllMessages() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        //console.log(currentUser._id);
        this.messageService.getAllHome(currentUser._id).subscribe(messages => {

            this.messages = messages;
            //console.log(this.messages);
        });
    }

    loadAlarmeform(){
        this.paramsService.getAlarmeformation().subscribe(
            form =>{
                this.form = form;
                console.log(this.form);

            });
    }

    loadAlarmecaces(){
        this.paramsService.getAlarmecaces().subscribe(
            caces =>{
                this.caces = caces;
                console.log(this.caces);

            });
    }

}