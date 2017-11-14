import {Component, Input} from '@angular/core';
import {ContactComponent} from "./contact.component";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    selector: 'rechercheContact',
    moduleId: module.id,
    templateUrl: 'rechercheContact.component.html'
})

export class RechercheContactComponent  {
    seek: any = {};
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};

    @Input('liste')
    contact: ContactComponent;

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
        this.contact.loadAllContacts();
        console.log(this.seek);
    }



}