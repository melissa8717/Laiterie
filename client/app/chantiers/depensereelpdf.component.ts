import {Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {ChantierService} from "../_services/chantier.service";
import {Chantier} from "../_models/index";
import {AlertService} from '../_services/index';
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";                      //



@Component({
    moduleId: module.id,
    templateUrl: 'depensereelpdf.component.html'
})

export class DepensereelpdfComponent {

    model: any[] = [];
    id_chantier:number;
    nom : any = {};
    print: boolean = false;
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};               //


    constructor(private route: ActivatedRoute,
                private alertService: AlertService,

                private chantierService: ChantierService,
                private paramsService:ParamsService
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {


        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";

        this.loadReel();
        this.loadNom();
        this.loaddroituser();
    }
    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    loadNom(){
        this.route.params.subscribe(Params => {
            this.id_chantier=Params['id_chantier'];
            console.log(this.id_chantier);
            this.chantierService.getByIdNom(this.id_chantier).subscribe(
                data=>{
                    this.nom=data[0];
                    console.log(data)
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
            totaldevis += prod.Qtelivre * prod.Prixreel;
        }
        return totaldevis;
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