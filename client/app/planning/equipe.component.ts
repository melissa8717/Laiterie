import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {PlanningService} from "../_services/planning.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";
import {ContactService} from "../_services/contact.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {FormBuilder} from "@angular/forms";


@Component({
    moduleId: module.id,
    templateUrl: 'equipe.component.html'
})

export class EquipeComponent {
    model: any = {};
    print: boolean = false;
    id_equipe:number;
    data:any;
    equipes: any[] = [];
    equipe: any []=[];
    currentUser: User;
    droitsuser:any={};
    _id:any;

    ouvriers: any[] = [];
    ouvriersfiltered: any[] = [];

    work:any[] = [];
    worker:any[] = [];
    test:any = {};
    mat:any = {};


    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private planningService: PlanningService,
                private builder: FormBuilder,
                private _sanitizer: DomSanitizer,
                private contactService: ContactService,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loadEquipe();
        this.loadAllOuvriers();
        this.loadOuvier();
        this.loadAllOuvier();
    }

    ngOnInit() {
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loaddroituser();

    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            //console.log(this.data);
            //console.log(this.currentUser._id);

        });
    }

    loadAllOuvriers() {
        this.contactService.getAllOuvriers().subscribe(
            data => {
                this.ouvriers = data;
                this.ouvriersfiltered = data;
                //console.log(data)
            }
        );
    }

    addEquipe() {

        this.planningService.addEquipe(this.model).subscribe(
            data => {
                this.data = data;
                // console.log(this.model);

                this.equipes.push(this.model);
                this.model = {};
            });
    }
    private deleteEquipe(id_equipe:any) {
        console.log("deleting prod" + id_equipe);
        this.planningService.deleteEquipe(id_equipe)
            .subscribe(
                data => {
                    this.equipes = this.equipes.filter(x => x.id_equipe != id_equipe);

                    // console.log("after deletind: " + JSON.stringify(this.prod));
                },
                error => {
                    this.alertService.error(error._body);
                });
    }
    loadEquipe() {

        this.planningService.getAllEquipe().subscribe(data => {
            this.equipe = data;
            //console.log(this.equipe);

        });
    }

    loadOuvier() {

        this.planningService.getAllEquipeouvrier().subscribe(data => {
            this.work = data;
            //console.log(this.work);

        });
    }

    autocompleListOuvrier = (data: any): SafeHtml => {
        let html = `<span>${data.nom} ${data.prenom}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };



    modifouv(eParams:any) {
        console.log(eParams);
        this.planningService.upouvrier(eParams).subscribe(
            data=>{
                console.log(eParams)
                this.alertService.success("Les données ont bien été modifiées.");
            });

    }

    loadAllOuvier() {

        this.planningService.getAllouvrier().subscribe(data => {
            this.worker = data;
            console.log(this.worker);

        });
    }

    addWorker() {

        let eparams: any = {};
        eparams.test = this.test;
        console.log(eparams);

        this.planningService.addWorker(eparams).subscribe(
            mat => {

                this.router.navigate(["/planning_simple"]);
                this.alertService.success("La personne a été ajoutée avec succès à l'équipe.");
                this.mat = mat;
                console.log(this.mat);

            });
    }


}
