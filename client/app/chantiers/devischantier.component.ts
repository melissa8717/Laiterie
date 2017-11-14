import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService} from '../_services/index';
import {ChantierService} from "../_services/chantier.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";                      //
import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours,
    format,
} from 'date-fns';




@Component({
    moduleId: module.id,
    templateUrl: 'devischantier.component.html'
})

export class DevischantierComponent {
    id_chantier:number;
    chant:any = [] = [];
    nom : any = {};
    print: boolean = false;
    date:string;
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};               //





    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private chantierService: ChantierService,

                private alertService: AlertService,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    }

    ngOnInit() {


        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loadDevis();
        this.loadNom();
        this.loaddroituser();

    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }




    loadNom(){
        this.route.params.subscribe(Params => {
            this.id_chantier=Params['id_chantier'];
            console.log(this.id_chantier);
            this.chantierService.getByIdNom(this.id_chantier).subscribe(
                data=>{
                    this.nom=data[0];
                    console.log(data)
                }
            )
        });
    }

    loadDevis(){
        this.route.params.subscribe(params => {
            this.id_chantier=params['id_chantier']
            console.log(this.id_chantier);
            this.chantierService.getByIdDevischantier(this.id_chantier).subscribe(
                data=>{
                    this.chant=data;
                    console.log(data)
                }
            )
        });
    }

    modify(chantierparams:any) {


        //console.log(chantierparams);
        this.chantierService.updateDevischantier(chantierparams).subscribe(
            data=>{
                console.log(chantierparams)
                this.alertService.success("Les données ont bien été modifiées.");
            });

    }
    imprimer() {
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            window.print();
            this.print = false;
        }, 1000);

    }

    

}