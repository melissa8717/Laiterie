import {Component, OnInit} from '@angular/core';
import {AlertService} from '../_services/index';
import {FactureService} from "../_services/facture.service";
import {ParamsService} from "../_services/params.service";
import {FileUploader} from 'ng2-file-upload';
import {User} from "../_models/user";


@Component({
    moduleId: module.id,
    templateUrl: 'histo_fac.component.html'
})

export class Histo_facComponent implements OnInit {
    //ged
    private uploader: FileUploader;
    private hasBaseDropZoneOver: boolean = false;
    private currentUser: User;
    private droitsuser: any = {};
    private ged: any[];

    private URL = 'http://' + location.hostname + ':4000/ged/fac';

    constructor(private alertService: AlertService,
                private factureService: FactureService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }


    ngOnInit(): void {
        this.loaddroituser();

        this.getGed();
        this.uploader = new FileUploader({url: this.URL});
        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };
    }

    fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    private loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }

    /*************************** GED ***************************/

    private getGed() {
        this.factureService.getGed().subscribe(ged => {
            this.ged = ged;
        }, error => {
            console.log("Couldn't load the ged infos");
            console.log(error);
            this.alertService.error(error._body);
        });
    };
}



