import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService, AchatsService } from '../_services/index';
import { Mainoeuvre } from "../_models/products/mainoeuvre";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'mainoeuvre.component.html',
})

export class MainoeuvreComponent {
    loading = false;

    mainOuevre: Mainoeuvre[] = [];  // tous

    moToFind = {libelle: ""};   // pour la recherche
    filteredMos: Mainoeuvre[] = []; // pour la recherche - easy switch between all and filtered

    moToCreate :any = {};

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private achatsService: AchatsService,
        private alertService: AlertService,
        private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAll();
        this.loaddroituser();
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    private loadAll() {
        this.achatsService.getAllMainOeuvre().subscribe(
            data => {
                this.mainOuevre = data;
                this.filteredMos = data;
            }
        );
    }

    private filter() {
        this.filteredMos = this.mainOuevre.filter(x =>
            x.libelle.includes(this.moToFind.libelle)
        );
    }

    private showAll() {
        this.filteredMos = this.mainOuevre;
    }

    private createMo() {
        //var createdId;

        this.achatsService.createMainOeuvre(this.moToCreate).subscribe(
            data => {
                this.alertService.success('Ajouté avec succès', true);

                // pour les afficher dans la liste directement
                //this.mainOuevre.push(this.moToCreate);
                let test:any = {};
                test.libelle  =this.moToCreate.libelle;
                test.taux_horaire  =this.moToCreate.taux_horaire;
                test.heure_brute  =this.moToCreate.heure_brute;
                test.salaire_charge = this.moToCreate.salaire_charge;

                this.filteredMos.push(test);
                this.moToCreate.salaire_charge = null;
                this.moToCreate.libelle = null;
                this.moToCreate.taux_horaire= null;
                this.moToCreate.heure_brute= null;
            },
            error => {
                this.alertService.error(error._body);
                this.loading = false;
            }
        );

    }

    private modify(m: Mainoeuvre) {
        this.achatsService.updateMainOeuvre(m).subscribe(
            data => {
                this.alertService.success('Modifié avec succès', true);
            }
        );
    }

    private debug() {
    }
}