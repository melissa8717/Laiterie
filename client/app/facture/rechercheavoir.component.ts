import {Component, Input} from '@angular/core';

import {ListeavoirComponent} from "./listeavoir.component";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    selector: 'rechercheavoir',
    moduleId: module.id,
    templateUrl: 'rechercheavoir.component.html'
})

export class RechercheavoirComponent  {
    seek: any = {};
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};


    @Input('liste')
    liste: ListeavoirComponent;

    constructor(
        private paramsService:ParamsService
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loaddroituser();                         //
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    fireLoad() {
        this.liste.loadAllAvoir();
        console.log(this.seek);
    }


}