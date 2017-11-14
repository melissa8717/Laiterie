import {Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {ChantierService} from "../_services/chantier.service";
import {Chantier} from "../_models/index";
import {AlertService} from '../_services/index';
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";                      //



@Component({
    moduleId: module.id,
    templateUrl: 'depenseprev.component.html'
})

export class DepenseprevComponent {
    chantier: Chantier[] = [];
    model: any[] = [];
    id_chantier:number;
    nom : any = {};

    quantite:string;
    qte_devis:number;
    prix_achat:number;
    totalpro:number;
    opt:any[] = [];
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
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.loadPrev();
        this.loadPrevopt();
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

    calctotal(prods:any): number {
        if (prods.quantite) //console.log(this.getMinutesFromTime(prods.quantite.toString()));
        return (prods.salaire_charge && this.getMinutesFromTime(prods.quantite.toString())) ?
            (prods.salaire_charge) *(prods.qte_devis) * this.getMinutesFromTime(prods.quantite.toString()) / 60 :
            0;
    }

    calctotalopt(opti:any): number {
        if (opti.quantite) //console.log(this.getMinutesFromTime(prods.quantite.toString()));
            return (opti.salaire_charge && this.getMinutesFromTime(opti.quantite.toString())) ?
                (opti.salaire_charge) *(opti.qte_devis) * this.getMinutesFromTime(opti.quantite.toString()) / 60 :
                0;
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



    countTotalmopt(opti:any) {

        let totalmopt = 0;

        for (let opti of this.opt) {
            if (opti.quantite)
                (opti.salaire_charge && this.getMinutesFromTime(opti.quantite.toString())) ?
            totalmopt += (opti.salaire_charge) *(opti.qte_devis) * this.getMinutesFromTime(opti.quantite.toString()) / 60:
                    totalmopt +=0;

        }
        return totalmopt;
    }

    totalproduit(prod:any){
        return prod.qte_devis * prod.prix_achat * parseFloat(prod.quantite);
    }
    totalproduitopt(opts:any){
        return opts.qte_devis * opts.prix_achat * parseFloat(opts.quantite);
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

    countTotal(prod:any,prods:any,opti:any,opts:any){
        return this.countTotalpro(prod) + this.countTotalmo(prods) + this.countTotalmopt(opti) +this.countTotalpropt(opts);
    }

    countTotalpds(prod:any,opts:any){
        return this.countTotalpro(prod)  +this.countTotalpropt(opts);
    }

    countTotalmain(prods:any,opti:any){
        return this.countTotalmo(prods) + this.countTotalmopt(opti) ;
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