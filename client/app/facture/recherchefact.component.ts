/**
 * Created by cédric on 11/07/2017.
 */
import {Component, Input} from '@angular/core';
import {ListefactureComponent} from "./listefacture.component";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    selector: 'recherchefacturation',
    moduleId: module.id,
    templateUrl: 'recherchefact.component.html'
})

export class RecherchefacturationComponent  {
    seek: any = {};
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};


    @Input('liste')
    liste: ListefactureComponent;

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
        this.liste.loadAllFacture();
        console.log(this.seek);
    }



}