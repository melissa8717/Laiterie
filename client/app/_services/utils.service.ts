import {Injectable} from "@angular/core";
import {AlertService, ParamsService} from "./index";
import {User} from "../_models";


@Injectable()
export class UtilsService {

    public currentUser: User;
    public droitsUser: any = {};

    public isPrinting: boolean = false;

    constructor(private alertService: AlertService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loaddroituser();
    }

    private loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsUser = data[0];
        });
    }

    public print() {
        this.isPrinting = true;
        this.alertService.clear();
        setTimeout(() => {
            window.print();
            this.isPrinting = false;
        });
    }
}