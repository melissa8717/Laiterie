/**
 * Created by cédric on 14/08/2017.
 */
import {Component, Input} from '@angular/core';

import {ListefacturefournisseurComponent} from "./listefacturefournisseur.component";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    selector: 'recherchefournisseur',
    moduleId: module.id,
    templateUrl: 'recherchefournisseur.component.html'
})

export class RecherchefournisseurComponent  {
    seek: any = {};
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};


    @Input('liste')
    liste: ListefacturefournisseurComponent;

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
        this.liste.loadMois();
        console.log(this.seek);
    }



}