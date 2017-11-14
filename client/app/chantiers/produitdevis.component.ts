import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService} from '../_services/index';
import {ChantierService} from "../_services/chantier.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";






@Component({
    moduleId: module.id,
    templateUrl: 'produitdevis.component.html'
})

export class ProduitdevisComponent  {
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};               //

    model:any = [] = [];
    id_chantier:number;
    option:any = [] = [];
    nom: any ={};
    print: boolean = false;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private chantierService: ChantierService,
        private alertService: AlertService,
        private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }



    ngOnInit() {

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";

        // get return url from route parameters or default to '/'
        this.loadDevis();
        this.loadOption();
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

    loadDevis(){
        this.route.params.subscribe(params => {
            this.id_chantier=params['id_chantier']
            console.log(this.id_chantier);
            this.chantierService.getByIdDevis(this.id_chantier).subscribe(
                data=>{
                    this.model=data;
                    console.log(data)
                }
            )
        });
    }

    loadOption(){
        this.route.params.subscribe(params => {
            this.id_chantier=params['id_chantier']
            console.log(this.id_chantier);
            this.chantierService.getByIdDevisoption(this.id_chantier).subscribe(
                data=>{
                    this.option=data;
                    console.log(data)
                }
            )
        });
    }

    countqtotal(model:any) {
        let qtotal = 0;

        for (let prod of this.model) {
                if(prod.quantite)
                    qtotal +=  prod.qte_devis * prod.quantite;
                    else qtotal += 0;
        }
        return qtotal;
    }
    countptotal(model:any) {
        let qtotal = 0;

        for (let prod of this.model) {
            if(prod.quantite)
                    qtotal +=  prod.qte_devis * prod.quantite * prod.prix_achat;
                   else qtotal += 0;
        }
        return qtotal;
    }

    countopttotal(option:any) {
       let qtotal = 0;

       for (let prods of this.option) {
           if(prods.quantite)
                   qtotal +=  prods.qte_devis * prods.quantite;
                 else  qtotal += 0;
       }
       return qtotal;
   }

   counttotalopt(option:any) {
        let qtotal = 0;

        for (let prods of this.option) {
            if(prods.quantite)
                    qtotal +=  prods.qte_devis * prods.quantite * prods.prix_achat;
                    else qtotal += 0;
        }
        return qtotal;
    }


    countqte(option:any,model:any){
    return this.countqtotal(model) + this.countopttotal(option);
    }

    countprice(option:any,model:any){
        return this.countptotal(model) + this. counttotalopt(option);
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