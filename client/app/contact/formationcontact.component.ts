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
    templateUrl: 'formationcontact.component.html'
})
export class FormationcontactComponent  {


    returnUrl: string;
    print: boolean = false;

    currentUser: User;         //
    droitsuser: any = {};         //
    data:any={};

    id_contact:number;

    testing:any[] = [];
    fact: any[] = [];

    form: any[] = [];

    mat:any = {};
    entre:any = {};
    nom:any = {};

    caces:any[] = [];
    test:any={};
    facting:any={};



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

        this.loadAllStock();
        this.loadAllCaces();
        this.loadNom();
        this.loadform();
        this.loadCaces();
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

    loadAllStock() {
        this.contactService.getAllform().subscribe(testing => {

            this.testing = testing;
            console.log(this.test);

        });
    }

    autocompleListFormatterform = (data: any): SafeHtml => {
        let html = `<span>${data.designation} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    loadAllCaces() {
        console.log(this.fact)
        this.contactService.getAllCaces().subscribe(fact => {

            this.fact = fact;
            console.log(this.fact);


        });
    }

    autocompleListFormattercaces = (data: any): SafeHtml => {
        let html = `<span>${data.caces} : ${data.description}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };


    addFormation() {

        let eparams: any = {};
        eparams.test = this.test;
        eparams.nom = this.nom;


        this.contactService.addForm(eparams).subscribe(
            mat => {
                this.mat = mat;
                console.log(this.mat);

                //this.form.push(this.test);
                //this.entre = {};
            });
    }

    loadform() {
        this.route.params.subscribe(params => {
            this.id_contact = params['id_contact']
            console.log(this.id_contact);
            this.contactService.getByIdFormation(this.id_contact).subscribe(
                form => {
                    this.form = form;

                    // console.log(form);
                }
            )
        });
    }

    addCac() {

        let eparams: any = {};
        eparams.facting = this.facting;
        eparams.nom = this.nom;


        this.contactService.addCaces(eparams).subscribe(
            mat => {
                this.mat = mat;
                console.log(this.mat);

                //this.form.push(this.test);
                //this.entre = {};
            });
    }

    loadCaces() {
        this.route.params.subscribe(params => {
            this.id_contact = params['id_contact']
            console.log(this.id_contact);
            this.contactService.getByIdCaces(this.id_contact).subscribe(
                caces => {
                    this.caces = caces;

                    console.log(caces);
                }
            )
        });
    }


    modCaces(eParams:any) {


        //console.log(chantierparams);
        this.contactService.upCaces(eParams).subscribe(
            data=>{
                console.log(eParams)
                this.alertService.success("Les données ont bien été modifiées.");
            });

    }

    modFormation(eParams:any) {


        //console.log(chantierparams);
        this.contactService.upFormation(eParams).subscribe(
            data=>{
                console.log(eParams)
                this.alertService.success("Les données ont bien été modifiées.");
            });

    }

    private suprimer(id_formationcontact:any) {
        console.log("deleting prod" + id_formationcontact);
        this.contactService.deleteFormation(id_formationcontact)
            .subscribe(
                data => {
                    this.form = this.form.filter(x => x.id_formationcontact != id_formationcontact);

                    // console.log("after deletind: " + JSON.stringify(this.prod));
                },
                error => {
                    this.alertService.error(error._body);
                });
    }

}