import {Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService} from '../_services/index';
import {ChantierService} from "../_services/chantier.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";                      //


@Component({
    moduleId: module.id,
    templateUrl: 'chantiermois.component.html'
})

export class ChantiermoisComponent {

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};                //
    cmois: any = [] = [];
    chant: any = [];
    date: boolean = false;

    loading = false;

    my: Date = new Date();
    print: boolean = false;


    monthArray: string[] = [

        "Janvier",
        "Fevrier",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Aout",
        "Septembre",
        "Octobre",
        "Novembre",
        "Decembre",
    ];


    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private chantierService: ChantierService,
                private alertService: AlertService,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    }

    ngOnInit() {

        this.loaddroituser();
        this.loadAllchantier();


        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.my.setMonth(this.my.getMonth());
        //this.loadMois();


    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            //console.log(this.data);
            //console.log(this.currentUser._id);

        });
    }

   /* back(){
        this.my.setMonth(this.my.getMonth()-1);
        this.loadMois();
    }

    up(){
        this.my.setMonth(this.my.getMonth()+1);
        //console.log(this.my);
        this.loadMois();
    }

    loadMois() {

        this.date = false;
        this.chantierService.getAllMois(this.my.getMonth()+1, this.my.getFullYear()).subscribe(
            data => {
                this.chant = data;
                //this.filtre(this.recherche.seek);
                this.loading= false;
               //console.log(this.chant)
            },
            err =>{
                this.alertService.error("Impossible de charger les devis, veuillez réessayer ultérieurement");
                this.loading= false;
            }
        );
    }*/

    countDevis(chantiers:any) {
        let totaldevis = 0;

        for (let chantiers of this.cmois) {

                totaldevis += chantiers.total ? chantiers.total : chantiers.montantht;

        }
        return totaldevis;
    }
    countFacture(chantiers:any) {
        let totalfact = 0;

        for (let chantiers of this.cmois) {

            totalfact += chantiers.montantfact;

        }
        return totalfact;
    }
    loadAllchantier() {


        this.chantierService.getAllCmois().subscribe(cmois => {

            this.cmois = cmois;
            console.log(this.cmois);


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