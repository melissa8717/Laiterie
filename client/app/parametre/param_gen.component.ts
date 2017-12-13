/**
 * Created by Wbat on 13/07/2017.
 */
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FileUploader} from "ng2-file-upload";

import {AlertService, ParamsService, UtilsService} from '../_services/index';


@Component({
    moduleId: module.id,
    templateUrl: 'param_gen.component.html'
})

export class Param_genComponent {

    // Image Uploader
    private url: any; // visualisation de l'image avant envoi
    private uploaderImg: FileUploader;
    private urlImg: string = 'http://' + location.hostname + ':4000/image/agence';

    private model: any = {};


    constructor(private router: Router,
                private alertService: AlertService,
                private paramsService: ParamsService,
                public utilsService: UtilsService) {
    }

    ngOnInit() {
        this.loadAllagence();
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

    loadAllagence() {
        this.paramsService.getAllAgence().subscribe(agences => {
            if (agences && agences[0]) {
                this.model = agences[0];
                this.setUploaderImg();
            }
        });
    }

    setUploaderImg() {
        this.uploaderImg = new FileUploader({url: this.urlImg + "/" + this.model.id_agence});
        this.uploaderImg.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };
    }

    addagence() {
        this.paramsService.addagence(this.model).subscribe(id => {
            this.model.id_agence = id;
            this.setUploaderImg();
            this.alertService.success('Nouvelle agence ajoutée avec succès', true);
        });
    }

    modify() {
        this.paramsService.updateAgence(this.model).subscribe(() => {
            this.alertService.success("Les données ont bien été modifiées.");
        });
    }

    modifyImg() {
        this.uploaderImg.queue[0].upload();
        this.alertService.success("Image modifiée");
    }

}
