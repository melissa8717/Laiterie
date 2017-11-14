/**
 * Created by Wbat on 25/07/2017.
 */
import {Component, Input} from '@angular/core';
import {ListeventeComponent} from "./listevente.component";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    selector: 'recherchevente',
    moduleId: module.id,
    templateUrl: 'recherchevente.component.html'
})

export class RechercheVenteComponent  {
    seek: any = {};
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};

    @Input('vente')
    vente: ListeventeComponent;

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
        console.log(this.seek);
        this.vente.filterProducts(this.seek);
    }



}