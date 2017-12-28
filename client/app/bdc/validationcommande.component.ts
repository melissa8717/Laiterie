/**
 * Created by Wbat on 29/06/2017.
 */
import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {CommandeService} from "../_services/commandes.service";
import {FormBuilder} from "@angular/forms";
import {FactureService} from "../_services/facture.service";

import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {AchatsService} from "../_services/achats.service";
import {User} from "../_models/user";
import {ParamsService} from "../_services/params.service";


@Component({
    moduleId: module.id,
    templateUrl: 'validationcommande.component.html'
})

export class ValidationCommandeComponent implements OnInit {

    droitsuser:any={};         //
    _id:any;                   //
    data:any={};               //

    model: any = {};

    private sub: any;

    id: number;
    currentUser: User;

    bdc: any = {};
    print: boolean = false;
    fact: any={};

    List: {
        qte: number,
        prix_prevu: number,
        reference: string,
        libelle: string
        unite: string,
        ht: number,
        total: number,
        id_produit: number,
        Prixreel:number,
        Qtelivre:number,
    }[] = [];

    imprevuList: {
        qte: number,
        prix_prevu: number,
        reference: string,
        libelle: string
        unite: string,
        ht: number,
        total: number,
        id_produit: number,
        Prixreel:number,
        Qtelivre:number,
    }[] = [];

    total: number;

    prix: number = 0;

    ht: number;

    quantite: number;

    livraison: number = 0;

    all: number = 0;

    products: {}[] = [];
    libre: {qtep: number, prix_p: number, ref: string, libelle: string
        unit: string,refi:any,qte:number,prix_prevu:number,Qte_livre:number,Prixreel:number}[] = [];

   // public myForm: FormGroup;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private commandeService: CommandeService,
                private factureService: FactureService,

                private productService: AchatsService,
                private alertService: AlertService,
                private builder: FormBuilder,
                private _sanitizer: DomSanitizer,
                private paramsService:ParamsService) {
        this.loadAllProducts();
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    }
    date(){
        return new Date();
    }


    supprimer(produit: any) {
        this.imprevuList = this.imprevuList.filter(obj => obj !== produit)
    }

    addProduct(){
        //console.log(this.model);
        let tmp: any = {};
        tmp.reference = this.model.reference;
        tmp.libelle = this.model.produit;
        tmp.unite = this.model.unite;
        tmp.Prixreel = this.model.Prixreel;
        tmp.Qtelivre = this.model.Qtelivre;

        var check = this.List.filter(obj => obj.reference == this.model.reference);
        var check2 = this.imprevuList.filter(obj => obj.reference == this.model.reference);
        if (check.length < 1 && check2.length < 1) {
            this.imprevuList.push(tmp);
           // console.log(this.imprevuList)
            this.model = {};
        }
        else{
            this.alertService.error(" Vous avez déjà ajouté ce produit à votre bon de commande. ")
            this.model = {};
        }
    }

    setupProd(){
        this.model.reference = this.model.produit.reference;
        this.model.unite = this.model.produit.unite;
        this.model.Prixreel = this.model.produit.prix_achat;
        this.model.Qtelivre = 1;

    }

    ngOnInit() {

        this.loaddroituser();

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";


        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.commandeService.getById(this.id.toString()).subscribe(data => {

                this.bdc = data[0];
                this.livraison = this.bdc.tarifpourlivraison;
                //console.log(this.bdc)

                this.commandeService.getAllProducts(this.id).subscribe(
                    data => {
                        this.List = data;
                        //console.log("getall prods");
                        //console.log(data);

                        let total = 0;


                        if(! this.bdc.Recu){
                            for (let produit of this.List) {
                                //console.log(total)
                                (function (prod) {
                                    prod.Qtelivre = prod.qte;
                                    prod.Prixreel = prod.prix_prevu;
                                })(produit);
                            }
                        }

                        //if(list)
                        for (let produit of this.List) {
                            //console.log(total)
                            (function(prod){
                                    total += prod.qte * prod.prix_prevu;
                            })(produit);
                        }
                        this.all = total + this.livraison;

                       // console.log(this.List);

                    }
                );


                this.commandeService.getAllImprevuProducts(this.id).subscribe(
                    data => {
                        this.imprevuList = data;
                       // console.log(this.imprevuList);
                    },
                    err=>{
                        console.log("error in get all imprevu");
                    }
                );


            });
            this.commandeService.getAllibre(this.id).subscribe(
                libre => {
                    this.libre = libre;
                   // console.log(libre);

                    if(! this.bdc.Recu){
                        for (let prode of this.libre) {
                            //console.log(total)
                            (function (prode) {
                                prode.Qte_livre = prode.qte;
                                prode.Prixreel = prode.prix_prevu;
                            })(prode);
                        }
                    }

                });
        });
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];


        });
    }

    private loadAllProducts() {
        this.productService.getAll().subscribe(products => {
            this.products = products;
            //console.log(this.products);
        });
    }

    autocompleListFormatterProducts = (data: any): SafeHtml => {
        let html = `<span>${data.libelle} : ${data.prix_achat}€</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    totalfacture(): number{
        let total =0;
        for(let produit of this.List){
            total += produit.Prixreel * produit.Qtelivre;
        }
        for(let produit of this.imprevuList){
            total += produit.Prixreel * produit.Qtelivre;
        }
        return total + this.livraison;
    }

    submit(){

        //date != null
       var req : {id: number, livraison: number, date_livraison: string, list: any, listimprevu: any,libre:any} = {id: 0, livraison: 0, date_livraison: null, list:{}, listimprevu:{},libre:{}};
        req.id = this.id;
        req.livraison = this.livraison;
        req.date_livraison = this.bdc.date_livraison_reel;
        req.list = this.List;
        req.listimprevu = this.imprevuList;
        req.libre = this.libre;
        //console.log(req);
       this.commandeService.validate(req).subscribe(
            data=>{
                this.router.navigate(['/suivi_commande']);
                this.alertService.success("Le bon a bien été validé");
            }
        );
    }

    totallibre(){
        let total=0;
        for(let prode of this.libre){
            total += prode.prix_prevu * prode.qte;
        }
        return total;
    }

    totalprod(){
        let total=0;
        for(let prod of this.List){
            total += prod.prix_prevu * prod.qte;
        }
        return total;
    }

    totallibrelivre(){
        let total=0;
        for(let prode of this.libre){
            total += prode.Prixreel * prode.Qte_livre;
        }
        return total;
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