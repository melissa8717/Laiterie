import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

import {AlertService, AuthenticationService, ContactService, ParamsService} from '../_services/index';
import {User} from "../_models";

@Component({
    moduleId: module.id,
    templateUrl: 'formationcontact.component.html'
})
export class FormationcontactComponent {


    returnUrl: string;
    print: boolean = false;

    currentUser: User;
    droitsuser: any = {};
    data: any = {};

    id_contact: number;

    testing: any[] = [];
    fact: any[] = [];

    form: any[] = [];

    mat: any = {};
    entre: any = {};
    nom: any = {};

    caces: any[] = [];
    test: any = {};
    facting: any = {};


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
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }


    loadNom() {
        this.route.params.subscribe(params => {
            this.id_contact = params['id_contact'];
            this.contactService.getByIdNom(this.id_contact).subscribe(user => {
                    console.log(user);
                    this.nom = user[0];
                }
            )
        });
    }

    loadAllStock() {
        this.contactService.getAllform().subscribe(testing => {
            this.testing = testing;
        });
    }

    autocompleListFormatterform = (data: any): SafeHtml => {
        let html = `<span>${data.designation} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    loadAllCaces() {
        this.contactService.getAllCaces().subscribe(fact => {
            this.fact = fact;
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

        this.contactService.addForm(eparams).subscribe(mat => {
            this.mat = mat;
        });
    }

    loadform() {
        this.route.params.subscribe(params => {
            this.id_contact = params['id_contact'];
            console.log(this.id_contact);
            this.contactService.getByIdFormation(this.id_contact).subscribe(form => {
                    this.form = form;
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
            });
    }

    loadCaces() {
        this.route.params.subscribe(params => {
            this.id_contact = params['id_contact'];
            this.contactService.getByIdCaces(this.id_contact).subscribe(caces => {
                    this.caces = caces;
                }
            )
        });
    }


    modCaces(eParams: any) {
        this.contactService.upCaces(eParams).subscribe(() => {
            this.alertService.success("Les données ont bien été modifiées.");
        });
    }

    modFormation(eParams: any) {
        this.contactService.upFormation(eParams).subscribe(() => {
            this.alertService.success("Les données ont bien été modifiées.");
        });
    }

    supprimer(id_formationcontact: any) {
        this.contactService.deleteFormation(id_formationcontact)
            .subscribe(() => {
                this.form = this.form.filter(x => x.id_formationcontact != id_formationcontact);
            }, error => {
                this.alertService.error(error._body);
            });
    }
}