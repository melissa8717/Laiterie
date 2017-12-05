import {Component, Input} from '@angular/core';
import {User} from "../_models/user";
import {FileItem, FileUploader} from "ng2-file-upload";
import {AlertService, DevisService, FactureService, ParamsService} from "../_services/index";

@Component({
    moduleId: module.id,
    selector: 'ged',
    templateUrl: 'ged.component.html'
})

export class GedComponent {

    @Input() gedName: string;

    private uploader: FileUploader;
    private hasBaseDropZoneOver: boolean = false;
    private currentUser: User;
    private droitsuser: any = {};
    private gedUrl: string;
    private ged: any[];

    constructor(private alertService: AlertService,
                private devisService: DevisService,
                private factureService: FactureService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }


    ngOnInit(): void {
        this.loaddroituser();
        this.getGed();

        this.gedUrl = 'http://' + location.hostname + ':4000/ged/' + this.gedName;

        this.uploader = new FileUploader({url: this.gedUrl});

        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };

        this.uploader.onSuccessItem = (item: FileItem, response: string) => {
            if (response) {
                this.getGed();
                item.remove();
                let __this = this;
                setTimeout(function () {
                    __this.uploader.progress = 0;
                }, 1000);
            }
        }
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }

    getGed() {
        let serviceToUse;

        switch (this.gedName) {
            case 'dev':
                serviceToUse = this.devisService;
                break;
            case 'fac':
                serviceToUse = this.factureService;
                break;
            default:
                console.log("Error : GED NOT FOUND");
                return;
        }

        serviceToUse.getGed()
            .subscribe(ged => {
                this.ged = ged;
            }, error => {
                console.log("Couldn't load the ged infos");
                console.log(error);
                this.alertService.error(error._body);
            });
    }

    fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }
}