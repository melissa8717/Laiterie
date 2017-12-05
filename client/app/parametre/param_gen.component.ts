/**
 * Created by Wbat on 13/07/2017.
 */
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AlertService} from '../_services/index';
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";
import {FileUploader} from "ng2-file-upload";


@Component({
    moduleId: module.id,
    templateUrl: 'param_gen.component.html'
})

export class Param_genComponent {

    private loc = location.hostname;
    private model: any = {};
    private print: boolean = false;
    private currentUser: User;
    private droitsuser: any = {};
    // visualisation de l'image avant envoi
    private url: any;
    private uploaderImg: FileUploader;
    private urlImg: string = 'http://' + location.hostname + ':4000/image/';

    constructor(private router: Router,
                private alertService: AlertService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllagence();
        this.loaddroituser();
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
        this.uploaderImg = new FileUploader({url: this.urlImg + "agence/" + this.model.id_agence});
        this.uploaderImg.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }

    addagence() {
        this.paramsService.addagence(this.model).subscribe(id => {
            this.model.id_agence = id;
            this.setUploaderImg();
            this.alertService.success('Nouvelle agence ajoutée avec succès', true);
        });
    }

    modify(aparams: any) {
        this.paramsService.updateAgence(aparams).subscribe(() => {
            this.alertService.success("Les données ont bien été modifiées.");
        });
    }

    imprimer() {
        this.alertService.clear();
        let css = '@page',
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
}
