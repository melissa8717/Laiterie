/**
 * Created by cédric on 04/07/2017.
 */
import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, AuthenticationService} from '../_services/index';
import {AchatsService} from "../_services/achats.service";
import {MessageService} from "../_services/message.service";
import {FileUploader} from 'ng2-file-upload';
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";

const URLimg = 'http://' + location.hostname + ':4000/image/';

@Component({
    moduleId: module.id,
    templateUrl: 'suivivehicule.component.html'
})

export class SuivivehiculeComponent {

    private uploaderImg: FileUploader;
    private loc = location.hostname;
    private url: any;

    private model: any = {};
    private id_vehmat: number;
    private entre: any = {};
    private print: boolean = false;
    private entretiens: any[] = [];
    private mat: any;
    private currentUser: User;
    private droitsuser: any = {};

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

        this.route.params.subscribe(params => {
            this.id_vehmat = params['id'];
            this.loadvehimat();
            this.loadentretien();
        })
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }

    loadvehimat() {
        this.uploaderImg = new FileUploader({url: URLimg + "matvehi/" + this.id_vehmat});
        this.uploaderImg.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };

        this.achatsService.getByIdmat(this.id_vehmat).subscribe(data => {
            this.model = data[0];
        })
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

    private modify() {
        this.achatsService.updatevehmat(this.model).subscribe(() => {
            this.alertService.success('Votre demande a été modifiée avec succès', true);
        })
    }

    private loadentretien() {
        this.achatsService.getByIdEntretien1(this.id_vehmat).subscribe(data => {
            this.entretiens = data;
        })
    }

    private addEntretien() {
        this.achatsService.addEntretien(this.id_vehmat, this.entre).subscribe(mat => {
            this.mat = mat;
            this.entretiens.push(this.entre);
            this.entre = {};
        });
    }

    private deleteEntre(id_entretien: any) {
        this.achatsService.deleteEntre(id_entretien).subscribe(() => {
            this.entretiens = this.entretiens.filter(x => x.id_entretien != id_entretien);
        }, error => {
            this.alertService.error(error._body);
        })
    }

    imprimer() {
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            let css = '@page { size: landscape; }',
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