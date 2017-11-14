import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, UserService } from '../_services/index';
import {User} from "../_models/user";
import {ParamsService} from "../_services/params.service";

@Component({
    moduleId: module.id,
    templateUrl: 'droituser.component.html'
})

export class DroituserComponent {

    util:any={};
    id:number;
    droits:any={};
    adroits:any={};
    mat: any;

    currentUser: User;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private alertService: AlertService,
        private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }



    ngOnInit() {
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        this.loadUser();
        this.loadDroit();
    }




    loadUser(){
        this.route.params.subscribe(Params => {
            this.id=Params['id'];
            console.log(this.id);
            this.paramsService.getByIduser(this.id).subscribe(
                data=>{
                    this.util=data[0];
                    console.log(data)
                }
            )
        });
    }


    addDroit() {

        //console.log(currentUser._id);
        this.userService.createdroit(this.id, this.adroits).subscribe(
            mat => {
                this.mat = mat;
                console.log(this.mat);

                //this.phases.push(this.aphases);
                this.adroits = {};
            });
    }

    loadDroit(){
        this.route.params.subscribe(Params => {
            this.id=Params['id'];
            console.log(this.id);
            this.userService. getCurrentnb(this.id).subscribe(
                data=>{
                    this.droits=data[0];
                    console.log(data)
                }
            )
        });
    }

    modify() {

        let userparams: any = {};
        userparams.droits = this.droits;

        console.log(userparams);
        this.userService.modifdroit(userparams).subscribe(
            data => {
                this.router.navigate(["/utilisation"]);
                this.alertService.success("Les droits ont été modifiés.");
            });
    }

}