/**
 * Created by Cedric on 20/08/2017.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";
import {FileUploader} from "ng2-file-upload";




@Component({
    moduleId: module.id,
    templateUrl: 'filigrane.component.html'
})

export class FiligraneComponent implements OnInit {

    cgv: any ={};
    currentUser: User;
    fili: any= {};
    model: any= {};
    id_agence : any={};
    private url: any; // visualisation de l'image avant envoi
    private uploaderFili: FileUploader;

    private urlFili: string = 'http://' + location.hostname + ':4000/image/filig';



    constructor(private route: ActivatedRoute,
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
        this.loadAllFili();
        this.route.params.subscribe(params => {
            this.id_agence = params['id_agence'];
            this.setUploaderFili();



        });



    }


    modifyFili() {
        this.uploaderFili.queue[0].upload();

        this.alertService.success("Image modifiée");
    }

    loadAllFili (){
        this.paramsService.getAllFili().subscribe(filigr => {
            if (filigr && filigr[0]) {
                this.fili = filigr[0];

                this.setUploaderFili();
                console.log(this.fili);


            }

        });
    }

    addagence() {
        this.paramsService.addagence(this.model).subscribe(id => {
            this.model.id_agence = id;
            this.setUploaderFili();
            this.alertService.success('Nouvelle agence ajoutée avec succès', true);
        });
    }
    setUploaderFili() {
        this.uploaderFili = new FileUploader({url: this.urlFili + "/" + this.id_agence});
        this.uploaderFili.onAfterAddingFile = (file) => {
            file.withCredentials = false;
            console.log(this.id_agence);

        };
    }

    readUrl(event: any) {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (event: any) => {
                this.url = event.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

}