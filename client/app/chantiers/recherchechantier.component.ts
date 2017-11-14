
import {Component, Input} from '@angular/core';
import {ListechantierComponent} from "./listechantier.component";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    selector: 'recherchechantier',
    moduleId: module.id,
    templateUrl: 'recherchechantier.component.html'
})

export class RechercheChantierComponent  {
    seek: any = {};
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};

    @Input('chantier')
    chantier: ListechantierComponent;

    constructor(
        private paramsService:ParamsService
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    ngOnInit() {
        this.loaddroituser();                         //
    }

    fireLoad() {
      this.chantier.loadAllchantier();
        console.log(this.seek);
    }



}