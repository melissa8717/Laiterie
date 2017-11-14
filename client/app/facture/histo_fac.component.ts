import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AlertService, AuthenticationService} from '../_services/index';
import {FormBuilder, FormGroup} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {FactureService} from "../_services/facture.service";
import {ParamsService} from "../_services/params.service";
import {FileUploader} from 'ng2-file-upload';
import {User} from "../_models/user";
import {Observable} from "rxjs/Observable";
import {isUndefined} from "util";
const URL = 'http://' + location.hostname + ':4000/ged/';

@Component({
    moduleId: module.id,
    templateUrl: 'histo_fac.component.html'
})

export class Histo_facComponent implements OnInit {
    //ged
    public uploader: FileUploader;
    public hasBaseDropZoneOver: boolean = false;

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }
    //fin ged
    loc = location.hostname;
    returnUrl: string;
    currentUser: User;
    droitsuser: any = {};
    _id: any;
    data: any = {};
    private sub: any;
    print: boolean = false;
    id_facture: number;
    id_factged: number;
    ged: any[];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private factureService: FactureService,
                private builder: FormBuilder,
                private _sanitizer: DomSanitizer,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit(): void {
        this.loaddroituser();
        //let timer = Observable.timer(2000,5000);
        this.sub = this.route.params.subscribe(params => {
            this.id_facture = params['id_facture'];
            //console.log(this.num_version)
        });

        this.route.params.subscribe(params => {
            this.id_facture = params['id_facture'];
            //ged
            this.getGed();
            this.uploader = new FileUploader({url: URL + "fac/" + params['id']});
            this.uploader.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };
            //ged
        });
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
            console.log(this.data);
            console.log(this.currentUser._id);
        });
    }

    //getdevis
    //getalldevisprod
    //getalldevisoptions

    imprimer() {
        this.alertService.clear();

        var css = '@page ',
            pageFooter = document.getElementById('pageFooter');

        this.print = true;
        setTimeout(() => {

            window.print();
            this.print = false;
        }, 1000);
    }

    /*************************** GED ***************************/

    private getGed() {

        this.factureService.getGed(this.id_factged)

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
    };
}



