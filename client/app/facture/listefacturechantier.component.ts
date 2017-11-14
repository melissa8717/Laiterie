import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';
import {FactureService} from "../_services/facture.service";
import {RecherchechantierfactureComponent} from "./recherchechantierfacture.component";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";


@Component({
    moduleId: module.id,
    templateUrl: 'listefacturechantier.component.html'
})

export class ListefacturechantierComponent {

    fact: any[] = [];
    id_chantier:number;
    list: any = [];
    date_echeance:string;
    date_demarrage:string;
    id_facture:number;
    statut: string;
    n_situation:number;
    id_devis: number;
    nom:any = {};
    print: boolean = false;
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};



    @ViewChild('recherche')
    recherche: RecherchechantierfactureComponent;

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

        this.loadfact();
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
            this.factureService.getByIdNom(this.id_chantier).subscribe(
                data=>{
                    this.nom=data[0];
                    console.log(data)
                }
            )
        });
    }

    loadfact(){
        this.route.params.subscribe(params => {
            this.id_chantier=params['id_chantier']
            console.log(this.id_chantier);
            this.factureService.getByIdListeFacture(this.id_chantier).subscribe(
                data=>{
                    this.fact=data;
                    console.log("fact");
                    console.log(data);
                    this.filtre(this.recherche.seek)
                }
            )
        });
    }

    filtre(test: any) {
        if (test.date_echeance) {
            this.fact =
                this.fact.filter(function (el) {
                    console.log(new Date(el.date_echeance).toDateString())
                    console.log(new Date(test.date_echeance).toDateString())
                    return (new Date(el.date_echeance).toDateString() === new Date(test.date_echeance).toDateString() );
                });
        }

        if (test.date_demarrage) {
            this.fact =
                this.fact.filter(function (el) {
                    console.log(new Date(el.date_demarrage).toDateString())
                    console.log(new Date(test.date_demarrage).toDateString())
                    return (new Date(el.date_demarrage).toDateString() === new Date(test.date_demarrage).toDateString() );
                });
        }

        if (test.nfactclient) {
            this.fact =
                this.fact.filter(function (el) {
                    return (el.nfactclient === test.nfactclient );
                });
        }

        if (test.id_devis) {
            this.fact =
                this.fact.filter(function (el) {
                    return (el.id_devis === test.id_devis );
                });
        }

        if (test.n_situation) {
            this.fact =
                this.fact.filter(function (el) {
                    return (el.n_situation === test.n_situation );
                });
        }

        if (test.statut) {
            this.fact =
                this.fact.filter(function (el: any) {
                    return ((el.statut ? el.statut: "").toLowerCase().indexOf(test.statut.toLowerCase()) !== -1 );
                });
        }

    }

    imprimer() {
        this.alertService.clear();
        var css = '@page ',
            pageFooter = document.getElementById('pageFooter');

        this.print = true;
        setTimeout(() => {

            window.print();
            this.print = false;
        }, 1000);
    }
}