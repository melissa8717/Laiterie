import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ContactService } from '../_services/contact.service';


import { AlertService, AuthenticationService } from '../_services/index';
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

import {FormBuilder, FormGroup} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";


@Component({
    moduleId: module.id,
    templateUrl: 'equipement.component.html'
})
export class EquipementComponent {


    returnUrl: string;
    print: boolean = false;

    currentUser: User;         //
    droitsuser: any = {};         //
    data: any = {};

    id_contact: number;

    nom: any = {};
    equipement: any = {};
    allequip:any[]=[];
    mat:any = {};

    constructor(private route: ActivatedRoute,
                private router: Router,
                private contactService: ContactService,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private builder: FormBuilder,
                private _sanitizer: DomSanitizer,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    }


    ngOnInit() {


        this.loadNom();
        this.loadAllequipe();

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));


    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            //console.log(this.data);
            //console.log(this.currentUser._id);

        });
    }


    loadNom() {
        this.route.params.subscribe(params => {
            this.id_contact = params['id_contact']
            console.log(this.id_contact);
            this.contactService.getByIdNom(this.id_contact).subscribe(
                nom => {
                    this.nom = nom[0];

                    // console.log(nom);
                }
            )
        });
    }

    ajouter(){
        this.contactService.equipement(this.id_contact,this.equipement).subscribe(
            mat => {
                this.mat=mat;
                this.allequip.push(this.equipement);
                //console.log(this.equipement);
            });
    }

    loadAllequipe() {
        this.route.params.subscribe(params => {
            this.id_contact = params['id_contact']

            this.contactService.getByIdequipement(this.id_contact).subscribe(
                data => {
                    this.allequip = data;

                }
            )
        });
    }

    private suprimer(id_equipement:any) {
        console.log("deleting prod" + id_equipement);
        this.contactService.deleteEquipement(id_equipement)
            .subscribe(
                data => {
                    this.allequip = this.allequip.filter(x => x.id_equipement != id_equipement);

                    // console.log("after deletind: " + JSON.stringify(this.prod));
                },
                error => {
                    this.alertService.error(error._body);
                });
    }

}