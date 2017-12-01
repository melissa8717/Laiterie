import {Component, OnInit} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {AlertService, DevisService, ParamsService} from '../_services/index';
import {User} from "../_models/user";


@Component({
    moduleId: module.id,
    templateUrl: 'histo_devis.component.html'
})

export class Histo_devisComponent implements OnInit {

    private uploader: FileUploader;
    private hasBaseDropZoneOver: boolean = false;
    private currentUser: User;
    private droitsuser: any = {};
    private ged: any[];

    private URL = 'http://' + location.hostname + ':4000/ged/dev';

    constructor(private alertService: AlertService,
                private devisService: DevisService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }


    ngOnInit(): void {
        this.loaddroituser();

        this.getGed();

        this.uploader = new FileUploader({url: this.URL});
        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }

    /*************************** GED ***************************/

    private getGed() {
        this.devisService.getGed()
            .subscribe(ged => {
                this.ged = ged;
            }, error => {
                console.log("Couldn't load the ged infos");
                console.log(error);
                this.alertService.error(error._body);
            });
    }
}



