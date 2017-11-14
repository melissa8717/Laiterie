/**
 * Created by Utilisateur on 03/07/2017.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';
import {AchatsService} from "../_services/achats.service";
import {RechercheVehimatComponent} from "./recherchevehimat.component";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'listevehimat.component.html'
})

export class ListevehimatComponent  {
    model: any = {};
    vehi:any[]=[];
    id_vehmat:number;
    libelle:string;
    marque:string;
    immatriculation:string;
    nserie:string;
    type:string;
    vehimate:string;

    print: boolean = false;
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};

    vehimat:any=[];

    @ViewChild('recherche')
    recherche: RechercheVehimatComponent;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private achatsService:AchatsService,
        private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllVehimat();
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loaddroituser();
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    loadAllVehimat() {
            console.log(this.recherche.seek)
        this.achatsService.getAllVehimat().subscribe(vehi => {

            this.vehi = vehi;
            console.log(this.vehi);
            this.filtre(this.recherche.seek)

        });
    }
    filtre(test: any) {
        if (test.libelle) {
            this.vehi =
                this.vehi.filter(function (el:any) {
                    return ((el.libelle ? el.libelle : "").toLowerCase().indexOf(test.libelle.toLowerCase()) !== -1 );
                });
        }
        if (test.marque) {
            this.vehi =
                this.vehi.filter(function (el:any) {
                    return ((el.marque ? el.marque : "").toLowerCase().indexOf(test.marque.toLowerCase()) !== -1 );
                });
        }
        if (test.immatriculation) {
            this.vehi =
                this.vehi.filter(function (el:any) {
                    return ((el.immatriculation ? el.immatriculation : "").toLowerCase().indexOf(test.immatriculation.toLowerCase()) !== -1 );
                });
        }

        if (test.annee) {
            this.vehi =
                this.vehi.filter(function (el:any) {
                    return ((el.annee ? el.annee : "").toLowerCase().indexOf(test.annee.toLowerCase()) !== -1 );
                });
        }
        if (test.vehimate) {
            this.vehi =
                this.vehi.filter(function (el:any) {
                    return ((el.vehimate ? el.vehimate : "").toLowerCase().indexOf(test.vehimate.toLowerCase()) !== -1 );
                });
        }
    }

    private deletemat(id_vehmat:any) {
        console.log("deleting prod" + id_vehmat);
        this.achatsService.deletemat(id_vehmat)
            .subscribe(
                data => {
                    this.vehi = this.vehi.filter(x => x.id_vehmat != id_vehmat);
                    this.alertService.success('Votre produit a supprimé', true);
                   // console.log("after deletind: " + JSON.stringify(this.prod));
                },
                error => {
                    this.alertService.error(error._body);
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