import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

import {AlertService, ContactService, ParamsService} from '../_services/index';
import {User} from "../_models";

@Component({
    moduleId: module.id,
    templateUrl: 'formationcontact.component.html'
})
export class FormationcontactComponent {


    private currentUser: User;
    private droitsuser: any = {};

    private id_contact: number;

    private testing: any[] = [];
    private fact: any[] = [];
    private form: any[] = [];

    private nom: any = {};

    private caces: any[] = [];
    private test: any = {};
    private facting: any = {};


    constructor(private route: ActivatedRoute,
                private contactService: ContactService,
                private alertService: AlertService,
                private _sanitizer: DomSanitizer,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    }


    ngOnInit() {
        this.route.params.subscribe(params => {
            this.id_contact = params['id_contact'];
        });


        this.loadAllStock();
        this.loadAllCaces();
        this.loadNom();
        this.loadform();
        this.loadCaces();
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }


    loadNom() {
        this.contactService.getByIdNom(this.id_contact).subscribe(user => {
                this.nom = user[0];
            }
        )
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

        this.form.push(eparams.test);

        this.contactService.addForm(eparams).subscribe(() => {
        });
    }

    loadform() {
        this.contactService.getByIdFormation(this.id_contact).subscribe(form => {
                this.form = form;
            }
        )
    }

    addCac() {
        let eparams: any = {};
        eparams.facting = this.facting;
        eparams.nom = this.nom;
;
        console.log(this.facting)
        this.caces.push(eparams.facting);

        this.contactService.addCaces(eparams).subscribe(() => {
        });
    }

    loadCaces() {
        this.contactService.getByIdCaces(this.id_contact).subscribe(caces => {
                this.caces = caces;
            }
        )
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

    supprimerca(id_cacon: any) {
        this.contactService.deleteCaces(id_cacon)
            .subscribe(() => {
                this.caces = this.caces.filter(x => x.id_cacon != id_cacon);
            }, error => {
                this.alertService.error(error._body);
            });
    }
}