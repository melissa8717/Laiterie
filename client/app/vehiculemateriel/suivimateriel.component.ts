/**
 * Created by cédric on 04/07/2017.
 */
import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AlertService, AuthenticationService} from '../_services/index';
import {AchatsService} from "../_services/achats.service";
import {FileUploader} from 'ng2-file-upload';
import {AppConfig} from "../app.config";
import {MessageService} from "../_services/message.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

const URL = 'http://' + location.hostname + ':4000/ged/';
const URLimg = 'http://' + location.hostname + ':4000/image/';

@Component({
    moduleId: module.id,
    templateUrl: 'suivimateriel.component.html'
})

export class SuivimaterielComponent implements OnInit {

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
    id_vehmat: number;
    entre: any = {};
    entretiens: any[] = [];
    id_entretien: number;
    mat: any;
    print: boolean = false;
    returnUrl: string;
    ged: any[];
    veh: any[];
    currentUser: User;
    droitsuser: any = {};
    _id: any;
    data: any = {};
    image: any[];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private messageService: MessageService,
                private achatsService: AchatsService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {

        this.loaddroituser();

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.loadvehimat();
        this.loadentretien();

        this.route.params.subscribe(params => {
            this.id_vehmat = params['id'];
            //ged
            this.getGed(params['id']);

            this.uploaderImg = new FileUploader({url: URLimg + "matvehi/" + params['id']});
            this.uploaderImg.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };

            this.uploader = new FileUploader({url: URL + "matvehi/" + params['id']});
            this.uploader.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };
            //ged
        });
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

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);
        });
    }

    loadvehimat() {
        this.route.params.subscribe(params => {
            this.id_vehmat = params['id']
            console.log(this.id_vehmat);
            this.achatsService.getByIdIdvehmat(this.id_vehmat).subscribe(
                data => {
                    this.model = data[0];
                    //console.log(data)
                }
            )
        });
    }

    private modify() {
        console.log("new id_vehmat: " + JSON.stringify(this.model));
        this.achatsService.updatevehmat(this.model).subscribe(
            data => {
                this.alertService.success('Votre demande a été modifiée avec succès', true);
                console.log("added successful: " + data);
            }
        );
    }

    private loadentretien() {
        this.route.params.subscribe(params => {
            this.id_vehmat = params['id']
            console.log(this.id_vehmat);
            //console.log("test");
            this.achatsService.getByIdEntretien1(this.id_vehmat).subscribe(
                data => {
                    this.entretiens = data;
                    // console.log("test2");
                    console.log(data)
                }
            )
        });
    }

    addEntretien() {

        //console.log(currentUser._id);
        this.achatsService.addEntretien(this.id_vehmat, this.entre).subscribe(
            mat => {
                this.mat = mat;
                console.log(this.mat);

                this.entretiens.push(this.entre);
                this.entre = {};
            });
    }

    private deleteEntre(id_entretien: any) {
        console.log("deleting prod" + id_entretien);
        this.achatsService.deleteEntre(id_entretien)
            .subscribe(
                data => {
                    this.entretiens = this.entretiens.filter(x => x.id_entretien != id_entretien);
                    // console.log("after deletind: " + JSON.stringify(this.prod));
                },
                error => {
                    this.alertService.error(error._body);
                });
    }

    /*************************** GED ***************************/

    private getGed(id_vehmat: number) {
        this.messageService.getGed(id_vehmat)
            .subscribe(
                data => {
                    this.ged = data;
                    console.log(this.ged);
                },
                error => {
                    console.log("Couldn't load the ged infos");
                    console.log(error);
                    console.log(id_vehmat);
                    this.alertService.error(error._body);
                });
    }


    imprimer() {
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            var css = '@page { size: landscape; }',
                head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');

            style.type = 'text/css';
            style.media = 'print';

            if (style.sheet) {
            } else {
                style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            window.print();
            this.print = false;
        }, 1000);
    }

}