import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService} from '../_services/index';
import {ChantierService} from "../_services/chantier.service";

import {RechercheChantierComponent} from "./recherchechantier.component";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";                      //


@Component({
    moduleId: module.id,
    templateUrl: 'listechantier.component.html',
})

export class ListechantierComponent {
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};               //
    model: any = {};
    chantier: any = [];
    chant: any = [] = []; // contient tout les chantiers


    nom_chantier: string;
    id_chantier: number;
    nom: string;
    responsable: string;
    ville: string;
    print: boolean = false;




    @ViewChild('recherche')
    recherche: RechercheChantierComponent;

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

    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }


    loadAllchantier() {
        console.log(this.recherche.seek)

        this.chantierService.getAllChantier().subscribe(chant => {

            this.chant = chant;
            console.log(this.chant);
            this.filtre(this.recherche.seek)

        });
    }

    filtre(test: any) {
        if (test.nom_chantier) {
            this.chant =
                this.chant.filter(function (el: any) {
                    return ((el.nom_chantier ? el.nom_chantier : "").toLowerCase().indexOf(test.nom_chantier.toLowerCase()) !== -1 );
                });
        }

        if (test.id_chantier) {
            this.chant =
                this.chant.filter(function (el:any) {
                    return (el.id_chantier === test.id_chantier );
                });
        }

        if (test.nom) {
            this.chant =
                this.chant.filter(function (el: any) {
                    return ((el.nom ? el.nom : "").toLowerCase().indexOf(test.nom.toLowerCase()) !== -1 );
                });
        }
        if (test.responsable) {
            this.chant =
                this.chant.filter(function (el: any) {
                    return ((el.responsable ? el.responsable : "").toLowerCase().indexOf(test.responsable.toLowerCase()) !== -1 );
                });
        }

        if (test.ville) {
            this.chant =
                this.chant.filter(function (el: any) {
                    return ((el.ville ? el.ville : "").toLowerCase().indexOf(test.ville.toLowerCase()) !== -1 );
                });
        }
    }

    private deletechantier(id_chantier: any) {
        console.log("deleting " + id_chantier);

        this.chantierService.deletechantier(id_chantier)
            .subscribe(
                data => {
                    console.log("suppression OK");
                    this.chant = this.chant.filter((x:any) => x.id_chantier != id_chantier);
                    this.alertService.success('Votre chantier a été supprimé', true);

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