import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService} from '../_services/index';
import {ChantierService} from "../_services/chantier.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";






@Component({
    moduleId: module.id,
    templateUrl: 'balancechantierpdf.component.html'
})

export class BalancechantierpdfComponent {

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};               //

    model: any[] = [];
    id_chantier:number;

    quantite:string;
    qte_devis:number;
    prix_achat:number;
    opt:any[] = [];
    reel: any[] = [];
    nom: any = {};
    libre:any[] = [];
    facture:any[] = [];
    prev:any[] = [];
    gene:any[] = [];
    pourcen:any[] = [];
    main:any[] = [];
    print: boolean = false;



    constructor(private route: ActivatedRoute,
                private router: Router,
                private chantierService: ChantierService,
                private alertService: AlertService,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    }


    ngOnInit() {

        this.loaddroituser();

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";


        this.loadPrev();
        this.loadPrevopt();
        this.loadReel();
        this.loadNom();
        this.loadLibre();
        this.loadFacture();
        this.loadPrevdevis();
        this.loadReelgen();
        this.loadPourcentdev();
        this.loadmain();

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


    customTrackBy(index: number, obj: any): any {
        return index;
    }

    getMinutesFromTime(timer: string): number {
        if (timer) {
            var t = timer.split(':');
            //console.log(parseInt(t[0]) * 60 + parseInt(t[1]));
            return parseInt(t[0]) * 60 + parseInt(t[1]);
        }
        return 0;
    }

    /*-------------------------------------------produit provisionnel----------------------------------------*/

    loadPrev(){
        this.route.params.subscribe(Params => {
            this.id_chantier=Params['id_chantier'];
            console.log(this.id_chantier);
            this.chantierService.getByIdPrev(this.id_chantier).subscribe(
                data=>{
                    this.model=data;
                    console.log(data)
                }
            )
        });
    }

    loadPrevopt(){
        this.route.params.subscribe(params => {
            this.id_chantier=params['id_chantier'];
            console.log(this.id_chantier);
            this.chantierService.getByIdPrevopt(this.id_chantier).subscribe(
                data=>{
                    this.opt=data;
                    console.log(data)
                }
            )
        });
    }





    countTotalmo(prods:any) {

        let totalmo = 0;

        for (let prods of this.model) {
            if (prods.quantite)
                (prods.salaire_charge && this.getMinutesFromTime(prods.quantite.toString())) ?
                    totalmo += (prods.salaire_charge) *(prods.qte_devis) * this.getMinutesFromTime(prods.quantite.toString()) / 60:
                    totalmo +=0;

        }
        return totalmo;
    }

    countTotaltemps(prods:any) {

        let totalmo = 0;

        for (let prods of this.model) {
            if (prods.quantite)
                (this.getMinutesFromTime(prods.quantite.toString())) ?
                    totalmo += (prods.qte_devis) * this.getMinutesFromTime(prods.quantite.toString())/60 :
                    totalmo +=0;

        }
        return totalmo;
    }



    countTotalmopt(opti:any) {

        let totalmopt = 0;

        for (let opti of this.opt) {
            if (opti.quantite)
                (opti.salaire_charge && this.getMinutesFromTime(opti.quantite.toString())) ?
                    totalmopt += (opti.salaire_charge) *(opti.qte_devis) * this.getMinutesFromTime(opti.quantite.toString())/60 :
                    totalmopt +=0;

        }
        return totalmopt;
    }

    countTotaltempsopt(opti:any) {

        let totalmopt = 0;

        for (let opti of this.opt) {
            if (opti.quantite)
                (this.getMinutesFromTime(opti.quantite.toString())) ?
                    totalmopt += (opti.qte_devis) * this.getMinutesFromTime(opti.quantite.toString()) / 60:
                    totalmopt +=0;

        }
        return totalmopt;
    }




    countTotalpro(prod:any) {

        let totalpro = 0;

        for (let prod of this.model) {

            totalpro += prod.qte_devis  * prod.prix_achat * parseFloat(prod.quantite);

        }
        return totalpro;
    }

    countTotalpropt(opts:any) {

        let totalpropt = 0;

        for (let opts of this.opt) {

            totalpropt += opts.qte_devis  * opts.prix_achat * parseFloat(opts.quantite);

        }
        return totalpropt;
    }

    countTotalproduit(prod:any,opts:any){
        return this.countTotalpro(prod)  +this.countTotalpropt(opts);
    }

    countTotalmain(prods:any,opti:any){
        return this.countTotalmo(prods) + this.countTotalmopt(opti);
    }

    countTemps(opti:any,prods:any){
        return this. countTotaltempsopt(opti) +  this.countTotaltemps(prods);
    }


    /*----------------------------------produit réel-----------------------------------------------------------------*/

    loadReel(){
        this.route.params.subscribe(Params => {
            this.id_chantier=Params['id_chantier']
            console.log(this.id_chantier);
            this.chantierService.getByIdReel(this.id_chantier).subscribe(
                data=>{
                    this.reel=data;
                    console.log(data)
                }
            )
        });
    }

    countReeldevis(prod:any) {

        let totaldevis = 0;

        for (let prod of this.reel) {
            totaldevis += prod.Qtelivre * prod.Prixreel;
        }
        return totaldevis;
    }

    /*----------------------------facture situation------------------------*/

    loadFacture(){
        this.route.params.subscribe(Params => {
            this.id_chantier=Params['id_chantier'];
            console.log(this.id_chantier);
            this.chantierService.getByIdFacturechantier(this.id_chantier).subscribe(
                data=>{
                    this.facture=data;
                    console.log(data)
                }
            )
        });
    }
    countFact(prod:any) {

        let totalfact = 0;

        for (let prod of this.facture) {
            totalfact += prod.montant_ht;
        }
        return totalfact;
    }

    /*----------------------------devislibre--------------------------------------*/
    loadLibre(){
        this.route.params.subscribe(Params => {
            this.id_chantier=Params['id_chantier'];
            console.log(this.id_chantier);
            this.chantierService.getByIdDevislibre(this.id_chantier).subscribe(
                data=>{
                    this.libre=data;
                    console.log(data)
                }
            )
        });
    }

    countTotallibre(libres:any) {

        let totallibre = 0;

        for (let libres of this.libre) {
            if (libres.montantht)

                totallibre += libres.montantht;
            else totallibre +=0;

        }
        return totallibre;
    }


    /*-----------------previsionnelle frais généraux-----------------------------------------*/
//réel erreur

    loadPrevdevis(){
        this.route.params.subscribe(Params => {
            this.id_chantier=Params['id_chantier'];
            console.log(this.id_chantier);
            this.chantierService.getByIdfraispre(this.id_chantier).subscribe(
                data=>{
                    this.prev=data;
                    console.log(data)
                }
            )
        });
    }

    countPrevdevis(prevs:any) {

        let totallibre = 0;

        for (let prevs of this.prev) {


            totallibre += prevs.somme;

        }
        return totallibre;
    }

    /*--------------------------------------frais généraux réel--------------------------------------------------*/
//previsionnel erreur

    loadReelgen(){
        this.route.params.subscribe(Params => {
            this.id_chantier=Params['id_chantier'];
            console.log(this.id_chantier);
            this.chantierService.getByIdfraisreel(this.id_chantier).subscribe(
                data=>{
                    this.gene=data;
                    console.log(data)
                }
            )
        });
    }

    countReelgen(prevs:any) {

        let totallibre = 0;

        for (let genes of this.gene) {


            totallibre += genes.montantprev;

        }
        return totallibre;
    }

    /*--------------------------------pourcentage--------------------------------------------------------*/

    loadPourcentdev(){
        this.route.params.subscribe(Params => {
            this.id_chantier=Params['id_chantier'];
            console.log(this.id_chantier);
            this.chantierService.getByIdpourcentdevis(this.id_chantier).subscribe(
                data=>{
                    this.pourcen=data;
                    console.log(data)
                }
            )
        });
    }



    countPourcentdev(pours:any) {

        let totallibre = 0;

        for (let pours of this.pourcen) {

            totallibre += pours.total;

        }
        return totallibre;
    }
    /*-------------------------calcul des valeurs frazis--------------------------------------*/

    countPourcent(prods:any,opti:any,prod:any,opts:any,pours:any){
        return (this.countTotalmain(prods,opti) + this.countTotalproduit(prod,opts))/this.countPourcentdev(pours);
    }

    //Valeur des frais réels
    countReel(prevs:any,prods:any,opti:any,prod:any,opts:any,pours:any){
        return (this.countPrevdevis(prevs) * this.countPourcent(prods,opti,prod,opts,pours) );
    }

    //Valeur des frais provisionnels
    countPrevisionnel(prevs:any,prods:any,opti:any,prod:any,opts:any,pours:any){
        return (this. countReelgen(prevs) * this.countPourcent(prods,opti,prod,opts,pours) );
    }

    /*--------------depense previsionel------------------------*/
    countDepense(prevs:any,prods:any,opti:any,prod:any,opts:any,pours:any){
        return this.countTotalproduit(prod,opts) + this.countTotalmain(prods,opti) + this.countPrevisionnel(prevs,prods,opti,prod,opts,pours);
    }

    /*--------------------------Marge prévisionnel -----------------------------------*/
    countMargeperv(libres:any,prevs:any,prods:any,opti:any,prod:any,opts:any,pours:any){
        return (this.countTotallibre(libres) + this.countTotalproduit(prod,opts) + this.countTotalmain(prods,opti)) - this.countDepense(prevs,prods,opti,prod,opts,pours);

    }


    /*-----------------------main d'oeuvre réel---------------------------------------*/

    loadmain(){
        this.route.params.subscribe(Params => {
            this.id_chantier=Params['id_chantier'];
            console.log(this.id_chantier);
            this.chantierService.getByIdmainreel(this.id_chantier).subscribe(
                data=>{
                    this.main=data;
                    console.log(data)
                }
            )
        });
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

    countHeureI(mains:any) {

        let totalmopt = 0;

        for (let mains of this.main) {
            if (mains.type_contrat == "Intérimaire")
                (this.getMinutesFromTime(mains.nb_heure.toString())) ?
                    totalmopt += this.getMinutesFromTime(mains.nb_heure.toString()) :
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

    countHeure(mains:any) {

        let totalmopt:number = 0;

        for (let mains of this.main) {
            if (mains.type_contrat != "Intérimaire") {
                (this.getMinutesFromTime(mains.nb_heure.toString())) ?
                    totalmopt += +this.getMinutesFromTime(mains.nb_heure.toString()) :
                    totalmopt += 0;
                //console.log(totalmopt)
                //console.log('bouboui')
            }
        }
        return totalmopt;
    }


    countTotaloeuvre(mains:any){
        return this.countMainI(mains) + this.countMain(mains);
    }

    countTotalhoeuvre(mains:any){
        return this.countHeure(mains) + this. countHeureI(mains);
    }

    countMargereel(prod:any,mains:any,prevs:any,prods:any,opti:any,opts:any,pours:any){
        return this.countFact(prod)-(this.countTotaloeuvre(mains) + this.countReel(prevs,prods,opti,prod,opts,pours) +this.countReeldevis(prod));
    }

    countpourcentage(prod:any,mains:any,prevs:any,prods:any,opti:any,opts:any,pours:any){
        return ((this.countFact(prod) /(this.countTotaloeuvre(mains) + this.countReel(prevs,prods,opti,prod,opts,pours) +this.countReeldevis(prod)))-1)*100;
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