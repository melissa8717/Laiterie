import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService } from '../_services/index';
import {User} from "../_models/user";
import {ParamsService} from "../_services/params.service";

@Component({
    moduleId: module.id,
    templateUrl: 'utilisation.component.html'
})

export class UtilisationComponent {

    util:any []=[];

    model: any = {};
    loading = false;
    count: any = {};
    test: any = {};
    compte: any = {};


    currentUser: User;

    constructor(
        private router: Router,
        private userService: UserService,
        private paramsService:ParamsService,
        private alertService: AlertService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }



    ngOnInit() {
        this.loadAllUser();
        this.loadCount();
        this.loadCompte();
    }


    loadAllUser() {
        this.userService.getAllUser().subscribe(util => {
            this.util = util;

        });
    }


    modify(id:number,userparams:any) {

        console.log(userparams);
        console.log(id);
        this.userService.updateUser(id,userparams).subscribe(
            data=>{
                this.alertService.success("Les données ont bien été modifiées.");
            });

    }


    register() {
        this.loading = true;
        this.model.address = {};
        this.model.address.zip = 83;
        this.model.address.rue = "Rue de la street";
        this.userService.create(this.model)
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error._body);
                    this.loading = false;
                });
    }

    loadCount() {
        this.userService.getCount().subscribe(count => {
            this.count = count[0];
            //console.log(this.count)
            console.log(this.currentUser);

        });
    }

    /*loadCurrentnb(_id:any) {
        this.userService.getCurrentnb(_id).subscribe(test => {
            this.test = test[0];

            //console.log(this.count);
            console.log(this.currentUser);

        });
    }*/

    private deleteuser(id:any) {
        console.log("deleting prod" + id);
        this.paramsService.deleteuser(id)
            .subscribe(
                data => {
                    this.util = this.util.filter(x => x.id != id);
                    this.alertService.success('Le user a  étésupprimé', true);
                    // console.log("after deletind: " + JSON.stringify(this.prod));
                },
                error => {
                    this.alertService.error(error._body);
                });
    }

    modup(user_params:any) {

        console.log(user_params);
        this.paramsService.updateuser(user_params).subscribe(
            data=>{
                this.alertService.success("Les données ont bien été modifiées.");
            });
    }

    loadCompte() {
        this.paramsService.getCompte().subscribe(compte => {
            this.compte = compte[0];
            console.log(this.compte)


        });
    }

}