/**
 * Created by cédric on 15/08/2017.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';
import {FactureService} from "../_services/facture.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";


@Component({
    moduleId: module.id,
    templateUrl: 'fournisseur.component.html'
})

export class FournisseurComponent {

    model: any = {};
    id_factfour:number;
    bdc : any []=[];
    print: boolean = false;
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};


    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private factureService: FactureService,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.loadFournisseur();
        this.loadBDC();
        this.loaddroituser();

    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    loadFournisseur(){
        this.route.params.subscribe(params => {
            this.id_factfour=params['id_factfour']
            console.log(this.id_factfour);
            this.factureService.getByIdFournisseur(this.id_factfour).subscribe(
                data=>{
                    this.model=data[0];
                    console.log(data)
                }
            )
        });
    }

    loadBDC(){
        this.route.params.subscribe(params => {
            this.id_factfour=params['id_factfour']
            console.log(this.id_factfour);
            this.factureService.getByIdBDC(this.id_factfour).subscribe(
                data=>{
                    this.bdc=data;
                    console.log(data)
                }
            )
        });
    }

    countTotalbdc() {

        let totalbdc = 0;

        for (let bdcs of this.bdc) {


                totalbdc += bdcs.montantbdc;
        }
        return totalbdc;
    }
    difference(){
        return this.countTotalbdc()- this.model.montantfact;
    }
    customTrackBy(index: number, obj: any): any {
        return index;
    }


    modify(factureparams:any) {


        //console.log(chantierparams);
        this.factureService.updateBDC(factureparams).subscribe(
            data=>{
                console.log(factureparams)
                this.alertService.success("Les données ont bien été modifiées.");
            });

    }


    imprimer(){
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            window.print();
            this.print = false;
        }, 1000);
    }

}