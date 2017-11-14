/**
 * Created by Wbat on 23/05/2017.
 */
import {Component, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {CommandeService} from "../_services/commandes.service";
import {RechercheBdcComponent} from "./rechercheBdc.component";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: './suivicommande.component.html',

})

export class SuivicommandeComponent implements OnChanges {

    ngOnChanges(changes: SimpleChanges): void {
        console.log("Changement detecté: ");
        console.log(this.bdc);
    }
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};               //

    date: boolean = false;
    my: Date = new Date();

    model: any = {};
    loading = false;
    returnUrl: string;
    bdc: any[] = [];


    AchatPrevu: number = 0;
    AchatPrevuChantier: number = 0;
    AchatPrevuDepot: number = 0;
    AchatPrevuAutres: number = 0;
    livraisonprevu:number = 0;
    print: boolean = false;


    @ViewChild('recherche')
    recherche: RechercheBdcComponent;


    /**
     * convertis un mois en un string (a reflechir plus en détail)
     * @param date
     * @returns {any}
     */
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


    loadAllBons() {
        this.loading = true;
        if(this.recherche.seek.date_debut  || this.recherche.seek.date_fin ){
            console.log("Date select");
            this.date = true;
            this.commandeService.getAllDate().subscribe(
                data=>{
                    this.bdc = data;

                    this.filtreDate(this.recherche.seek);

                    console.log(this.bdc);

                    this.AchatPrevu = 0;
                    this.AchatPrevuChantier = 0;
                    this.AchatPrevuDepot = 0;
                    this.AchatPrevuAutres = 0;
                    this.livraisonprevu = 0;

                    for (let bdc of this.bdc) {
                        if(bdc.state != "annulé"){
                            this.AchatPrevu += bdc.total +bdc.tarifpourlivraisonreel;
                            this.livraisonprevu += bdc.tarifpourlivraisonreel;
                            if (bdc.livre == "Chantier") {
                                this.AchatPrevuChantier += bdc.total ;
                            }
                            else if (bdc.livre == "Stock") {
                                this.AchatPrevuDepot += bdc.total ;
                            }
                            else if (bdc.livre == "Enlevé") {
                                this.AchatPrevuAutres += bdc.total ;
                            }
                        }

                    }

                    this.loading = false;
                },
                err=>{
                    console.log(err);
                    this.loading = false;
                }

            )
        }
        else{
            console.log(this.my.getMonth());
            this.date = false;
            this.commandeService.getAll(this.my.getMonth()+1, this.my.getFullYear()).subscribe(
                data => {
                    this.bdc = data;

                    this.filtre(this.recherche.seek);

                    console.log(this.bdc);

                    this.AchatPrevu = 0;
                    this.AchatPrevuChantier = 0;
                    this.AchatPrevuDepot = 0;
                    this.AchatPrevuAutres = 0;
                    this.livraisonprevu = 0;

                    for (let bdc of this.bdc) {
                        if(bdc.state != "annulé"){
                            this.AchatPrevu += bdc.total +bdc.tarifpourlivraisonreel;
                            this.livraisonprevu += bdc.tarifpourlivraisonreel;
                            if (bdc.livre == "Chantier") {
                                this.AchatPrevuChantier += bdc.total ;
                            }
                            else if (bdc.livre == "Stock") {
                                this.AchatPrevuDepot += bdc.total ;
                            }
                            else if (bdc.livre == "Enlevé") {
                                this.AchatPrevuAutres += bdc.total ;
                            }
                        }

                    }
                    this.loading = false;
                },
                err =>{
                    this.alertService.error("Erreur lors du chargement des bons.");
                    this.loading = false;
                }
            );
        }
    }


    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private commandeService: CommandeService,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
            console.log(this.my)
    }

    back(){
        console.log(this.my);
        this.my.setMonth(this.my.getMonth()-1);
        this.loadAllBons();
        console.log(this.my);
    }

    up(){
        console.log(this.my);
        this.my.setMonth(this.my.getMonth()+1);
        console.log(this.my);
        this.loadAllBons();
    }

    printed(bdc: any) {
        bdc.state = "Imprimé";
        this.commandeService.changeState(bdc).subscribe(data => {
            console.log(data);
        })
    }

    send(bdc: any) {
        bdc.state = "Envoyé";
        this.commandeService.changeState(bdc).subscribe(data => {
            console.log(data);
        })
    }

    annuler(bdc: any) {
        bdc.state = "annulé";
        this.commandeService.changeState(bdc).subscribe(data => {
            console.log(data);
        })
    }

    /**
     * Filtre permettant de filtrer les messages, il n'est pas opti car il reload a chaque fois les bons de la base
     * TODO: Opti ça
     * @param test
     */
    filtre(test: any) {
        if (test.bonnumber) {
            this.bdc =
                this.bdc.filter(function (el) {
                    return (el.id_bdc === test.bonnumber );
                });
        }
        if (test.Chantier) {
            this.bdc =
                this.bdc.filter(function (el) {
                    return ((el.nom_chantier ? el.nom_chantier : "").toLowerCase().indexOf(test.Chantier.toLowerCase()) !== -1 );
                });
        }
        if (test.devisnumber) {
            this.bdc =
                this.bdc.filter(function (el) {
                    return (el.id_devis === test.devisnumber );
                });
        }
        if (test.fournisseur) {
            if(test.fournisseur.raison_sociale){
                this.bdc =
                    this.bdc.filter(function (el) {
                        return ((el.fournisseurNom ? el.fournisseurNom : "").toLowerCase().indexOf(test.fournisseur.raison_sociale.toLowerCase()) !== -1 );
                    });
            }
            else{
                this.bdc =
                    this.bdc.filter(function (el) {
                        return ((el.fournisseurNom ? el.fournisseurNom : "").toLowerCase().indexOf(test.fournisseur.toLowerCase()) !== -1 );
                    });
            }

        }
        if (test.by) {
            this.bdc =
                this.bdc.filter(function (el) {
                    return ((el.firstname ? el.firstname : "").toLowerCase().indexOf(test.by.toLowerCase()) !== -1 );
                });
        }
        if (test.date) {
            this.bdc =
                this.bdc.filter(function (el) {
                    console.log(new Date(el.date_livraison).toDateString());
                    console.log(new Date(test.date).toDateString());
                    return (new Date(el.date_livraison).toDateString() === new Date(test.date).toDateString() );
                });
        }
    }

    ngOnInit() {
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.loadAllBons();
        this.loaddroituser();
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    supprimer(bdc: any) {
        this.commandeService.delete(bdc.id_bdc).subscribe(data => {
                this.bdc = this.bdc.filter(obj => obj !== bdc);
                this.AchatPrevu = 0;
                this.AchatPrevuChantier = 0;
                this.AchatPrevuDepot = 0;
                this.AchatPrevuAutres = 0;
                for (let bdc of this.bdc) {
                    this.AchatPrevu += bdc.total;
                    if (bdc.livre == "Chantier") {
                        this.AchatPrevuChantier += bdc.total;
                    }
                    else if (bdc.livre == "Stock") {
                        this.AchatPrevuDepot += bdc.total;
                    }
                    else if (bdc.livre == "Enlevé") {
                        this.AchatPrevuAutres += bdc.total;
                    }
                }
            },
            err => {
                this.alertService.error("Erreur lors de la suppression de ce bon. ")
            })
    }

    imprimer(){
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            window.print();
            this.print = false;
        }, 1000);
    }

    valider(bdc: any) {
        //this.bdc = this.bdc.filter(obj => obj != bdc);
        for (let bdcommande of this.bdc) {
            if (bdcommande = bdc) {
                bdcommande.Recu = true;
            }
        }
        console.log(bdc);
    }


    private filtreDate(seek: any) {
        this.filtre(seek);



        if (seek.date_debut) {
            this.bdc =
                this.bdc.filter(function (el) {
                    return (new Date(el.date_livraison).valueOf() >= new Date(seek.date_debut).valueOf() );
                });
        }

        if (seek.date_fin) {
            this.bdc =
                this.bdc.filter(function (el) {
                    return (new Date(el.date_livraison).valueOf() <= new Date(seek.date_fin).valueOf() );
                });
        }

    }
}