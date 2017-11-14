import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService} from '../_services/index';
import {ChantierService} from "../_services/chantier.service";
import {Chantier} from "../_models/index";
import {FileUploader} from 'ng2-file-upload';
import {AppConfig} from "../app.config";
const URL = 'http://'+ location.hostname +':4000/ged/';
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'fichechantier.component.html'
})

export class FichechantierComponent implements OnInit {

    //ged
    public uploader : FileUploader ;
    public hasBaseDropZoneOver:boolean = false;

    public fileOverBase(e:any):void {
        this.hasBaseDropZoneOver = e;
    }
    //fin ged
    loc = location.hostname;
    currentUser: User;
    droitsuser:any={};
    _id:any;
    data:any={};
    returnUrl: string;
    chantier: Chantier[] = [];
    model: any = {};
    id_chantier: number;
    phases: any[] = [];
    id_phase: number;
    aphases: any = {};
    mat: any;
    rapports: any[] = [];
    id_rapport: number;
    araps: any = {};
    rap: any;
    print: boolean = false;
    ged : any[];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private chantierService: ChantierService,
                private alertService: AlertService,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loaddroituser();

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        // get return url from route parameters or default to '/'
        this.loadTout();
        this.loadphase();
        this.loadRapport();

        this.route.params.subscribe(params => {
           // this.id_chantier = params['id_chantier'];
            //ged
            this.getGed(params['id_chantier']);


            this.uploader = new FileUploader({url: URL + "chant/" + params['id_chantier']});
            this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
            //ged
        });
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    loadTout() {
        this.route.params.subscribe(params => {
            this.id_chantier = params['id_chantier']
            console.log(this.id_chantier);
            this.chantierService.getByIdTout(this.id_chantier).subscribe(
                data => {
                    this.model = data[0];
                    console.log(data)
                }
            )
        });
    }

    modify() {

        let chantierparams: any = {};
        chantierparams.model = this.model;

        console.log(chantierparams);
        this.chantierService.updateFiche(chantierparams).subscribe(
            data => {
                this.router.navigate(["/listechantier"]);
                this.alertService.success("Le chantier a été modifié.");
            });
    }


    /*-------------------------------------Phase-----------------------------------*/
    private loadphase() {
        this.route.params.subscribe(params => {
            this.id_chantier = params['id_chantier']
            console.log(this.id_chantier);
            this.chantierService.getByIdPhase(this.id_chantier).subscribe(
                data => {
                    this.phases = data;
                    console.log(data)
                }
            )
        });
    }

    private deletePhase(id_phase: any) {
        console.log("deleting phase" + id_phase);
        this.chantierService.deletePhase(id_phase)
            .subscribe(
                data => {
                    this.phases = this.phases.filter(x => x.id_phase != id_phase);

                    // console.log("after deletind: " + JSON.stringify(this.prod));
                },
                error => {
                    this.alertService.error(error._body);
                });
    }

    addPhase() {

        //console.log(currentUser._id);
        this.chantierService.addPhase(this.id_chantier, this.aphases).subscribe(
            mat => {
                this.mat = mat;
                console.log(this.mat);

                this.phases.push(this.aphases);
                this.aphases = {};
            });
    }

    /*------------------------Rapport-----------------------------------------*/
    private loadRapport() {
        this.route.params.subscribe(params => {
            this.id_chantier = params['id_chantier']
            console.log(this.id_chantier);
            this.chantierService.getByIdRapport(this.id_chantier).subscribe(
                data => {
                    this.rapports = data;
                    //console.log("rapports");
                    console.log(data);
                }
            )
        });
    }

    private deleteRapport(id_rapport: any) {
        console.log("deleting phase" + id_rapport);
        this.chantierService.deletePhase(id_rapport)
            .subscribe(
                data => {
                    this.rapports = this.rapports.filter(x => x.id_rapport != id_rapport);

                    // console.log("after deletind: " + JSON.stringify(this.prod));
                },
                error => {
                    this.alertService.error(error._body);
                });
    }

    addRapport() {

        //console.log(currentUser._id);
        this.chantierService.addRapport(this.id_chantier, this.araps).subscribe(
            rap => {
                this.mat = rap;
                console.log(this.rap);

                this.rapports.push(this.araps);
                this.araps = {};
            });
    }

    imprimer() {
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            var css = '@page { size: landscape; }',
                head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');

            style.type = 'text/css';
            style.media = 'print';

            if (style.sheet) {
            } else {
                style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            window.print();
            this.print = false;
        }, 1000);
    }

    /*************************** GED ***************************/

    private getGed(id_chantier : number){
        this.chantierService.getGed(id_chantier)
            .subscribe(
                data => {
                    this.ged = data;
                    console.log(this.ged);
                },
                error => {
                    console.log("Couldn't load the ged infos");
                    console.log(error);
                    this.alertService.error(error._body);
                });
    }

}












