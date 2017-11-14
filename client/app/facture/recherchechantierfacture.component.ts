import {Component, Input} from '@angular/core';

import {ListefacturechantierComponent} from "./listefacturechantier.component";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    selector: 'recherchechantierfacture',
    moduleId: module.id,
    templateUrl: 'recherchechantierfacture.component.html'
})

export class RecherchechantierfactureComponent  {
    seek: any = {};
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};


    @Input('liste')
    liste: ListefacturechantierComponent;

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
        this.liste.loadfact();
        console.log(this.seek);
    }


}