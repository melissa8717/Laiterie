import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ChantierService} from "../_services/chantier.service";
import {Chantier} from "../_models/index";
import {FileUploader} from 'ng2-file-upload';
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";

const URL = 'http://' + location.hostname + ':4000/ged/';

@Component({
    moduleId: module.id,
    templateUrl: 'gestionproj.component.html'
})

export class GestionprojComponent implements OnInit {

    //@ViewChild("gantt_here") ganttContainer: ElementRef; ///////////////////////////////////////////////////////////////

    public uploader: FileUploader;
    public hasBaseDropZoneOver: boolean = false;

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    loc = location.hostname;
    currentUser: User;
    droitsuser: any = {};
    _id: any;
    data: any = {};
    returnUrl: string;
    chantier: Chantier[] = [];
    model: any = {};
    id_chantier: number;
    id_phase: number;
    mat: any;
    id_rapport: number;
    print: boolean = false;
    ged: any[];

    constructor(private route: ActivatedRoute,
                private chantierService: ChantierService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loaddroituser();

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        this.route.params.subscribe(params => {
            this.id_chantier = params['id_chantier'];
            this.chantierService.getByIdTout(this.id_chantier).subscribe(
                data => {
                    this.model = data[0];
                }
            );
            this.uploader = new FileUploader({url: URL + "chant/" + this.id_chantier});
            this.uploader.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };
        });
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }
}












