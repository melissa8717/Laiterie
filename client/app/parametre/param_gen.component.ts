/**
 * Created by Wbat on 13/07/2017.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AlertService, AuthenticationService} from '../_services/index';
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";
import {FileUploader} from 'ng2-file-upload';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {AppConfig} from "../app.config";
import any = jasmine.any;
// const URL = '/api/';
const URL = 'http://'+ location.hostname +':4000/ged/';
const URLimg = 'http://'+location.hostname+':4000/image/';

@Component({
    moduleId: module.id,
    templateUrl: 'param_gen.component.html'
})

export class Param_genComponent {

    //ged
    public uploader: FileUploader;
    public uploaderImg: FileUploader;
    public hasBaseDropZoneOver: boolean = false;

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    //fin ged
    loc = location.hostname;
    model: any = {};
    print: boolean = false;
    agen: any;
    agence: any = {};
    currentUser: User;
    droitsuser: any = {};
    _id: any;
    data: any = {};
    ged: any[];
    id_param_ged: number;
    id_agence: number;
    image: any[];

    constructor(private http: Http,
                private config: AppConfig,
                private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.loadAllagence();
        this.loaddroituser();
        this.getGed();

        //console.log(id_agence);

        /*this.route.params.subscribe(params => {
            this.id_agence = params['id_agence'];
            console.log(params);
            //ged
            this.getGed();

            this.uploaderImg = new FileUploader({url: URLimg + "agence/" + params['id_agence']});
            this.uploaderImg.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };

            this.uploader = new FileUploader({url: URL + "param/" + params['id_agence']});
            this.uploader.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };
            //ged
        });*/
    }

    // visualisation de l'image avant envoi
    url: any;
    readUrl(event: any) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (event: any) => {
                this.url = event.target.result;
            }
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    loadAllagence() {

        this.paramsService.getAllAgence().subscribe(model => {

            this.model = model[0];
            console.log(this.model);
            //console.log(this.currentUser);

            this.uploaderImg = new FileUploader({url: URLimg + "agence/" + this.model.id_agence});
            this.uploaderImg.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };

            /*this.uploader = new FileUploader({url: URL + "param/" + this.model.id_agence});
            this.uploader.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };*/

        });
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
            //console.log(this.data);
            //console.log(this.currentUser._id);
        });
    }

    addagence() {
        this.paramsService.addagence(this.model).subscribe(agen => {
            this.agen = agen;
            //console.log(this.model);
            //console.log("compo ts" this.agence);
            this.alertService.success('Nouvelle agence ajoutée avec succès', true);
            this.router.navigate(['/parametre_gen']);
        });
    }

    modify(aparams: any) {
        //console.log(aparams);
        this.paramsService.updateAgence(aparams).subscribe(
            data => {
                //this.data = data;
                //console.log(aparams);
                this.alertService.success("Les données ont bien été modifiées.");
            });
    }

    imprimer() {
        this.alertService.clear();
        var css = '@page',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');
        style.type = 'text/css';
        style.media = 'print';
        if (style.sheet) {
        } else {
            style.appendChild(document.createTextNode(css));
        }
        this.print = true;
        setTimeout(() => {
            window.print();
            this.print = false;
        }, 1000);
    }

    /*************************** GED ***************************/
    //ged
    private getGed() {
        this.paramsService.getGed(this.id_param_ged)
            .subscribe(
                data => {
                    this.ged = data;

                    console.log(this.model.id_agence);
                    this.uploader = new FileUploader({url: URL + "param/" + this.model.id_agence});
                    this.uploader.onAfterAddingFile = (file) => {
                        file.withCredentials = false;
                    };

                },
                error => {
                    console.log("Couldn't load the ged infos");
                    console.log(error);
                    this.alertService.error(error._body);
                });
    }
}
