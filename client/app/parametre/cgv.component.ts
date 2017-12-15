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
    templateUrl: 'cgv.component.html'
})

export class CgvComponent implements OnInit {

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
        this.loadCat();


    }


    loadCat(){
        console.log(this.cgv)

        this.paramsService.getAllVente().subscribe(cgv => {
            if (cgv && cgv[0]) {
                this.cgv = cgv[0];
                this.fili = cgv[0];
                this.setUploaderFili();
            }
        });
    }

    modify(aparams:any) {

        console.log(aparams);
        this.paramsService.updateVente(aparams).subscribe(
            data=>{
                this.alertService.success("Les données ont bien été modifiées.");
            });
    }

    modifyFili() {
        this.uploaderFili.queue[0].upload();

        this.alertService.success("Image modifiée");
    }

    addcgv() {


        this.paramsService.addVente(this.cgv).subscribe(id => {
            this.setUploaderFili();
            this.fili.id_agence = id;
            console.log("fili ts"+this.fili.id_agence+id);



        });
    }
    setUploaderFili() {
        this.uploaderFili = new FileUploader({url: this.urlFili + "/" + this.model.id_agence});
        this.uploaderFili.onAfterAddingFile = (file) => {
            file.withCredentials = false;
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