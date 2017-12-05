import {Component, Input} from '@angular/core';
import {User} from "../_models/user";
import {FileItem, FileUploader} from "ng2-file-upload";
import {AlertService, ContactService, DevisService, FactureService, ParamsService} from "../_services/index";

@Component({
    moduleId: module.id,
    selector: 'ged',
    templateUrl: 'ged.component.html'
})

export class GedComponent {

    @Input() gedName: string;
    @Input() id: number;

    private uploader: FileUploader;
    private currentUser: User;
    private droitsuser: any = {};
    private gedUrl: string;
    private ged: any[];

    constructor(private alertService: AlertService,
                private devisService: DevisService,
                private factureService: FactureService,
                private contactService: ContactService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }


    ngOnInit() {
        this.loaddroituser();
        this.getGed();

        this.gedUrl = 'http://' + location.hostname + ':4000/ged/' + this.gedName;

        if (this.id) {
            this.gedUrl += "/" + this.id;
        }

        this.uploader = new FileUploader({url: this.gedUrl});

        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };

        this.uploader.onSuccessItem = (item: FileItem, response: string) => {
            if (response) {
                this.getGed();
                item.remove();
            }
        }
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }

    getGed() {
        let __this = this;

        switch (this.gedName) {
            case 'dev':
                this.devisService.getGed().subscribe(ged => success(ged), err => error(err));
                break;
            case 'fac':
                this.factureService.getGed().subscribe(ged => success(ged), err => error(err));
                break;
            case 'contact':
                this.contactService.getGed(this.id).subscribe(ged => success(ged), err => error(err));
                break;
            case 'param':
                this.paramsService.getGed(this.id).subscribe(ged => success(ged), err => error(err));
                break;
            default:
                console.error("GED NOT FOUND");
                return;
        }

        function success(ged: any[]) {
            __this.ged = ged;
        }

        function error(err: any) {
            console.error(err);
            __this.alertService.error("La GED n'est pas disponible");
        }
    }

}