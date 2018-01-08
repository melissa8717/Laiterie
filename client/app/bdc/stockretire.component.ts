/**
 * Created by Wbat on 05/01/2018.
 */
import {Component, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {CommandeService} from "../_services/commandes.service";
import {RechercheBdcComponent} from "./rechercheBdc.component";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: './stockretire.component.html',

})

export class StockretireComponent {

    currentUser: User;
    droitsuser:any={};
    data:any={};
    id_bdc:number;
    model:any={};
    listes:any[]=[];

    constructor(private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private commandeService: CommandeService,
    private paramsService:ParamsService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loadModif();
    this.loadListes();
}

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];


        });
    }

    loadModif() {
        this.route.params.subscribe(params => {
            this.id_bdc = params['id_bdc'];

            this.commandeService.getByIdRemove(this.id_bdc).subscribe(
                data => {
                    this.model = data[0];



                }
            )
        });
    }

    loadListes() {
        this.route.params.subscribe(params => {
            this.id_bdc = params['id_bdc'];

            this.commandeService.getByIdRemlist(this.id_bdc).subscribe(
                data => {
                    this.listes = data;

                }
            )
        });
    }

    totalcount(){
       let total =0;

        for (let prod of this.listes) {
            total+= prod.qte * prod.prix_prevu;
        }

        return total;

    }

}