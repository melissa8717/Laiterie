/**
 * Created by cédric on 05/07/2017.
 */
import {Component, Input} from '@angular/core';
import {ListevehimatComponent} from "./listevehimat.component";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    selector: 'recherchevehimat',
    moduleId: module.id,
    templateUrl: 'recherchevehimat.component.html'
})

export class RechercheVehimatComponent  {
    seek: any = {};

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};

    @Input('vehimat')
    vehimat: ListevehimatComponent;

    constructor(
        private paramsService:ParamsService
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    fireLoad() {
        this.vehimat.loadAllVehimat();
        console.log(this.seek);
    }

    ngOnInit() {
        this.loaddroituser();
    }
    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }


}