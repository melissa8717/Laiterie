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
    templateUrl: 'fraismois.component.html'
})

export class FraismoisComponent {

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};

    frais: any []=[];
    date: boolean = false;
    mat:any;
    chant: any []=[];
    loading = false;
    entre: any = {};
    valeur:number;
    prev: any = {};
    mois: any = {};
    id_frais:number;
    print: boolean = false;

    pour: any = {};

    my: Date = new Date();

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


        this.loadMois();
        this.loadPrev()
        this.loadAllFrais();
        this.loaddroituser();

    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }


    back(){
        this.my.setMonth(this.my.getMonth()-1);
        this.loadMois();
        this.loadPrev();
    }

    up(){
        this.my.setMonth(this.my.getMonth()+1);
        //console.log(this.my);
        this.loadMois();
        this.loadPrev();
    }

   loadAdd(){
        this.factureService.addfrais(this.entre).subscribe(
            mat => {
                //console.log(this.mat);

                this.chant.push(this.entre);
               // console.log(this.entre);
            });
    }

    loadAddprev(){
        this.factureService.addprev(this.prev).subscribe(
            mat => {
                //console.log(this.mat);

                this.mois=(this.prev);
               // console.log(this.prev);
            });
    }


    loadMois() {

        this.date = false;
        this.factureService.getAllFraismois(this.my.getMonth()+1, this.my.getFullYear()).subscribe(
            data => {
                this.chant = data;
                this.loading= false;
                //console.log(this.chant)
            },
            err =>{
                this.alertService.error("Impossible de charger les frais généraux, veuillez réessayer ultérieurement");
                this.loading= false;
            }
        );
    }

    private deletion(id_frais:any){
        console.log("deleting frais" + id_frais);
        this.factureService.deleteFrais(id_frais)
            .subscribe(
                data => {
                    this.chant = this.chant.filter(x => x.id_frais != id_frais);

                    // console.log("after deletind: " + JSON.stringify(this.prod));
                },
                error => {
                    this.alertService.error(error._body);
                });
    }

    loadPrev() {

        this.date = false;
        this.factureService.getAllPrev(this.my.getMonth()+1, this.my.getFullYear()).subscribe(
            data => {
                this.mois = data[0];
                this.loading= false;
                console.log(this.mois)
            },
            err =>{
                this.alertService.error("Impossible de charger les frais généraux, veuillez réessayer ultérieurement");
                this.loading= false;
            }
        );
    }

    modify(factureparams:any) {

        console.log(factureparams);
        this.factureService.updateFraismois(factureparams).subscribe(
            data=>{
                console.log(factureparams)
                this.alertService.success("Les données ont bien été modifiées.");
            });

    }

    countTotal() {
        let total = 0;

        for (let chants of this.chant) {

                total += chants.valeur;

        }
        return total;
    }

    countPourcent(chants:any){
       return (chants.valeur * 100)/ this.countTotal();
    }
    countTotalpourcent(){
        let total = 0;

        for (let chants of this.chant) {

            total += (chants.valeur * 100) / this.countTotal();

        }
        return total;
                       }
    loadAllFrais() {
        console.log(this.pour)
        this.factureService.getAllFraispour().subscribe(data => {

            this.pour = data[0];
            console.log(this.pour);

        });
    }
}