/**
 * Created by cédric on 29/06/2017.
 */
import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AlertService, AuthenticationService} from '../_services/index';
import {AchatsService} from "../_services/achats.service";
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";
import {FileUploader} from 'ng2-file-upload';

const URLimg = 'http://'+location.hostname+':4000/image/';

@Component({
    moduleId: module.id,
    templateUrl: 'ajout_vehimat.component.html'
})

export class Ajout_vehimatComponent {

    public uploaderImg: FileUploader;

    model: any = {};
    mat: any;
    currentUser: User;
    droitsuser: any = {};
    _id: any;
    data: any = {};
    id: string;
    image: any[];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private achatsService: AchatsService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loaddroituser();
        this.route.params.subscribe(params => {
            this.id = params['id'];
            this.uploaderImg = new FileUploader({url: URLimg + "matvehi/" + params['id']});
            this.uploaderImg.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };
        });
    }

    // visualisation de l'image avant envoi //**************************************************************************
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

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
            console.log(this.data);
            console.log(this.currentUser._id);
        });
    }

    date() {
        return new Date();
    }

    addMat() {

        //console.log(currentUser._id);
        this.achatsService.addMat(this.model).subscribe(mat => {

            this.mat = mat;
            //console.log(this.mat);
            this.alertService.success('Nouveau matériel ajouté avec succès', true);
            this.router.navigate(['/listevehimat']);

        });
    }
}