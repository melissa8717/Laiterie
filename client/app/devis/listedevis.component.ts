/**
 * Created by Wbat on 04/07/2017.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {AlertService} from '../_services/index';
import {User} from "../_models/user";
import {DevisService} from "../_services/devis.service";
import {RechercheDevisComponent} from "./recherchedevis.component";
import {ParamsService} from "../_services/params.service"; //

@Component({
    moduleId: module.id,
    templateUrl: 'listedevis.component.html'
})

export class ListeDevisComponent implements OnInit {

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};

    devis : any = [];

    date:boolean = false;

    loading = false;

    print: boolean = false;


    @ViewChild('recherche')
    recherche: RechercheDevisComponent;

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


    ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.my.setMonth(this.my.getMonth())
        this.loadAllDevis();
        this.loaddroituser();
    }

    constructor(private alertService: AlertService,
                private router: Router,
                private devisService: DevisService,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));


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
        this.loadAllDevis();
    }

    up(){
        this.my.setMonth(this.my.getMonth()+1);
        //console.log(this.my);
        this.loadAllDevis();
    }

    nouveauChantier(devis: any){
        console.log(devis);
        if(devis.id_chantier == null){
            var nom_chantier = prompt("Votre devis n'était pas lié à un chantier. Veuillez entrer le nom de votre nouveau chantier :");
            console.log(nom_chantier);

        }
    }

    loadAllDevis() {

        this.loading = true;
        if(this.recherche.seek.date_debut  || this.recherche.seek.date_fin ){
            this.date = true;
            console.log("launch search");
            this.devisService.getAllDate().subscribe(
                data => {
                    this.devis = data;
                    this.filtreDate(this.recherche.seek);
                    this.loading= false;
                    console.log(this.devis)
                },
                err =>{
                    this.alertService.error("Impossible de charger les devis, veuillez réessayer ultérieurement");
                    this.loading= false;
                }
            );
        }
        else{
            this.date = false;
            this.devisService.getAll(this.my.getMonth()+1, this.my.getFullYear()).subscribe(
                data => {
                    this.devis = data;
                    this.filtre(this.recherche.seek);
                    this.loading= false;
                    console.log(this.devis)
                },
                err =>{
                    this.alertService.error("Impossible de charger les devis, veuillez réessayer ultérieurement");
                    this.loading= false;
                }
            );
        }

    }

    filtre(test: any) {
        if (test.devisnumber) {
            this.devis =
                this.devis.filter(function (el:any) {
                    return (el.id_devis === test.devisnumber );
                });
        }
        if (test.version) {
            this.devis =
                this.devis.filter(function (el:any) {
                    return (el.num_version === test.version );
                });
        }
        if (test.statut) {
            this.devis =
                this.devis.filter(function (el:any) {
                    return ((el.statut ? el.statut : "").toLowerCase().indexOf(test.statut.toLowerCase()) !== -1 );
                });
        }
        if (test.chantier) {
            if(test.chantier.nom_chantier){
                this.devis =
                    this.devis.filter(function (el:any) {
                        return ((el.nom_chantier ? el.nom_chantier : "").toLowerCase().indexOf(test.chantier.nom_chantier.toLowerCase()) !== -1 );
                    });
            }
            else{
                this.devis =
                    this.devis.filter(function (el:any) {
                        return ((el.nom_chantier ? el.nom_chantier : "").toLowerCase().indexOf(test.chantier.toLowerCase()) !== -1 );
                    });
            }

        }
        if (test.client) {
            if(test.client.raison_sociale || test.client.nom){
                this.devis =
                    this.devis.filter(function (el:any) {
                        return ((el.raison_sociale ? el.raison_sociale : el.nom).toLowerCase().indexOf((test.client.raison_sociale? test.client.raison_sociale : test.client.nom).toLowerCase()) !== -1 );
                    });
            }
            else{
                this.devis =
                    this.devis.filter(function (el:any) {
                        return ((el.raison_sociale ? el.raison_sociale : el.nom).toLowerCase().indexOf((test.client).toLowerCase()) !== -1 );
                    });
            }

        }

        if (test.TS) {
            this.devis =
                this.devis.filter(function (el:any) {
                    return (el.TS);
                });
        }


    }

    private filtreDate(seek: any) {
        this.filtre(seek);

        if (seek.date_debut) {
            this.devis =
                this.devis.filter(function (el : any) {
                    return (new Date(el.date_version).valueOf() >= new Date(seek.date_debut).valueOf() );
                });
        }

        if (seek.date_fin) {
            this.devis =
                this.devis.filter(function (el: any) {
                    return (new Date(el.date_version).valueOf() <= new Date(seek.date_fin).valueOf() );
                });
        }

    }



    imprimer(){
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            window.print();
            this.print = false;
        }, 1000);
    }

    sendEnvoye(devis:any){
        console.log(devis);
        this.devisService.sendEnvoye(devis.id_devis, devis.num_version).subscribe(
            data=>{
                console.log(data);
            },
            err=>{
                devis.envoye = false;
            }
        )
    }

    valider(devis: any){
        //console.log(devis);
        this.devisService.validate(devis).subscribe(
             data =>{
                 this.router.navigate(["/devischantier", devis.id_chantier]);
                 this.alertService.success("Le devis a bien été ajouté au chantier.");
                 console.log(data);
             }
         )
        //valider le devis, ajouter a la table chantierdevis
    }


}