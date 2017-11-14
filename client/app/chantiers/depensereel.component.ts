import {Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {ChantierService} from "../_services/chantier.service";
import {Chantier} from "../_models/index";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";                      //



@Component({
    moduleId: module.id,
    templateUrl: 'depensereel.component.html'
})

export class DepensereelComponent {

    model: any[] = [];
    id_chantier:number;
    nom : any = {};
    main:any[] = [];
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};               //

    constructor(private route: ActivatedRoute,
                private chantierService: ChantierService,
                private paramsService:ParamsService
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loaddroituser();

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.loadReel();
        this.loadNom();
        this.loadmain();
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    getMinutesFromTime(timer: string): number {
        if (timer) {
            var t = timer.split(':');
            //console.log(parseInt(t[0]) * 60 + parseInt(t[1]));
            return parseInt(t[0]) * 60 + parseInt(t[1]);
        }
        return 0;
    }

    loadNom(){
        this.route.params.subscribe(Params => {
            this.id_chantier=Params['id_chantier'];
            console.log(this.id_chantier);
            this.chantierService.getByIdNom(this.id_chantier).subscribe(
                data=>{
                    this.nom=data[0];
                    //console.log(data)
                }
            )
        });
    }

    loadReel(){
        this.route.params.subscribe(Params => {
            this.id_chantier=Params['id_chantier']
            console.log(this.id_chantier);
            this.chantierService.getByIdReel(this.id_chantier).subscribe(
                data=>{
                    this.model=data;
                    console.log(data)
                }
            )
        });
    }

    countReeldevis(prod:any) {

        let totaldevis = 0;

        for (let prod of this.model) {
            totaldevis += prod.tarifpourlivraisonreel? prod.tarifpourlivraisonreel  + prod.total :  prod.total;
        }
        return totaldevis;
    }

    /*--------------------------------------------------------*/

    loadmain(){
        this.route.params.subscribe(Params => {
            this.id_chantier=Params['id_chantier'];
            console.log(this.id_chantier);
            this.chantierService.getByIdmainreel(this.id_chantier).subscribe(
                data=>{
                    this.main=data;
                   // console.log(data)
                }
            )
        });
    }

    countMaintest(nb_heure:any,tauxsurcharge:number) {

        let totalmopt = 0;

            if ((nb_heure) &&(tauxsurcharge)){
                (this.getMinutesFromTime(nb_heure.toString())) ?
                    totalmopt += (tauxsurcharge) * this.getMinutesFromTime(nb_heure.toString()) / 60:
                    totalmopt +=0;

        }
        return totalmopt;
    }


    countMainI(mains:any) {

        let totalmopt = 0;

        for (let mains of this.main) {
            if (mains.type_contrat == "Intérimaire")
                (this.getMinutesFromTime(mains.nb_heure.toString())) ?
                    totalmopt += (mains.tauxsurcharge) * this.getMinutesFromTime(mains.nb_heure.toString()) / 60:
                    totalmopt +=0;

        }
        return totalmopt;
    }

    countMain(mains:any) {

        let totalmopt:number = 0;

        for (let mains of this.main) {
            if (mains.type_contrat != "Intérimaire")
                (this.getMinutesFromTime(mains.nb_heure.toString())) ?
                    totalmopt += +(mains.tauxsurcharge) * +this.getMinutesFromTime(mains.nb_heure.toString()) / 60:
                    totalmopt +=0;

        }
        return totalmopt;
    }


    countSomme(mains:any,prod:any){
        return this.countMain(mains)+ this.countMainI(mains)+ this.countReeldevis(prod);
    }

}