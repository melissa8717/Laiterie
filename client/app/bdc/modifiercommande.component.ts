/**
 * Created by Wbat on 22/06/2017.
 */
import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {CommandeService} from "../_services/commandes.service";
import {AchatsService} from "../_services/achats.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {FactureService} from "../_services/facture.service";

import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";                      //

@Component({
    moduleId: module.id,
    templateUrl: './modifiercommande.component.html'
})

export class ModifierBDCComponent implements OnInit {
    model: any;

    total: number;
    prix: number = 0;
    ht: number;
    quantite: number;
    livraison: number = 0;

    all: number = 0;

    private sub: any;

    bdc: any = {};

    id: number;
    fact: any={};


    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};               //

    products: {}[] = [];
    print: boolean = false;
    agence: any ={};


    List: {
        qte: number, prix_prevu: number, reference: string, libelle: string
        unite: string,
        ht: number,
        total: number,
        id_produit: number,
        num_version: number,
    }[] = [];

    public myForm: FormGroup;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private commandeService: CommandeService,
                private productService: AchatsService,
                private alertService: AlertService,
                private factureService : FactureService,
                private builder: FormBuilder,
                private _sanitizer: DomSanitizer,
                private paramsService:ParamsService) {

        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));




        this.sub = this.route.params.subscribe(params => {
            this.id = params['id']; // (+) converts string 'id' to a number
            //console.log(this.id);
            this.commandeService.getById(this.id.toString()).subscribe(data => {

                this.bdc = data[0];
                //console.log(this.bdc);
                this.livraison = this.bdc.tarifpourlivraison;

                this.myForm.patchValue({
                    livraison: this.livraison
                })


            });



            this.myForm = this.builder.group({
                adresse: "",
                livre: "",
                date: "",
                produit: "",
                quantite: "",
                ht: "",
                livraison: "",
            });

            this.myForm.valueChanges.subscribe(data => {
                //console.log(data);
                this.model = data.produit;
                //console.log(this.model);
                this.ht = data.ht;
                this.quantite = data.quantite;
                this.prix = data.produit.prix_achat;
                this.total = (data.ht ? data.ht : this.model.prix_achat) * (data.quantite ? data.quantite : 1);
                this.livraison =  data.livraison ;
                console.log(this.livraison);
                let total = 0;
                //if(list)
                for (let prod of this.List) {
                    total += prod.qte * prod.prix_prevu;
                }

                this.all = total + this.livraison;
            });

            // on modif etc ici




            this.loadAllProducts();
            this.loadAllFooter();
            this.loadAllagence();



            this.commandeService.getAllProducts(this.id).subscribe(
                data => {
                    this.List = data;
                    console.log(data);

                    let total = 0;
                    //if(list)
                    for (let prod of this.List) {
                        //console.log(total)
                        total += prod.qte * prod.prix_prevu;
                    }
                    this.all = total + this.livraison;


                }
            )
            // In a real app: dispatch action to load the details here.
        });

    }

    ngOnInit() {
        // reset login status

        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flat";

        this.loaddroituser();


    }
    date(){
        return new Date();
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }


    autocompleListFormatterProducts = (data: any): SafeHtml => {
        let html = `<span>${data.libelle} : ${data.prix_achat}€</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    autocompleListFormatterContact = (data: any): SafeHtml => {
        let html = `<span>${data.nom}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    autocompleListFormatterchantier = (data: any): SafeHtml => {
        let html = `<span>${data.nom_chantier} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };


    private loadAllProducts() {
        this.productService.getAll().subscribe(products => {
            this.products = products;
            //console.log(this.products);
        });
    }


    addProduct() {

        //modifier pour le cas ou on a déjà ajouté le produit

        var check = this.List.filter(obj => obj.id_produit == this.model.id_produit);
        //console.log(check);

        if (check.length < 1) {
            if (this.model.id_produit) {
                let libelle = this.model.libelle;
                this.List.push({
                    reference: this.model.reference,
                    libelle: this.model.libelle,
                    unite: this.model.unite,
                    prix_prevu: this.ht ? this.ht : this.model.prix_achat,
                    ht: this.model.prix_achat,
                    qte: this.quantite ? this.quantite : 1,
                    total: this.total,
                    id_produit: this.model.id_produit,
                    num_version: this.model.num_version,
                });
                let total = 0;
                for (let prod of this.List) {
                    total += prod.qte * prod.prix_prevu;
                }
                this.all = total + this.livraison;


                this.myForm.patchValue({
                    produit: "",
                    quantite: "",
                    ht: "",
                })

                this.alertService.success("Le produit " + libelle + " à bien été rajouté");


            }
        }
        else {
            this.alertService.error(" Vous avez déjà ajouté ce produit à votre bon de commande. ");
        }



        console.log(this.List);
    }


    removeProduct(prod: any) {

        this.List = this.List.filter(obj => obj !== prod);

        let total = 0;
        for (let prod of this.List) {
            total += prod.total;
        }
        this.all = total + this.livraison;

    }

    onSubmit(value: any) {
        if (this.List.length < 1) {
            this.alertService.error("Veuillez entrer au moins un produit");
        } else {
            if (value.adresse == "")
                value.adresse = this.bdc.adresselivraison;
            if (value.date == "")
                value.date = this.bdc.date_livraison;
            if (value.livre == "") {
                value.livre = this.bdc.livre;
            }

            if (value.livraison == "")
                value.livraison = this.bdc.tarifpourlivraison;

            value.id_bdc = this.id;
            value.products = this.List;

            console.log(value);

            this.commandeService.update(value).subscribe(
                success => {
                    this.router.navigate(['/suivi_commande']);
                    this.alertService.success("Votre bon de commande a bien été mis a jour. ");
                },
                err => {
                    this.alertService.error(" Erreur lors de la mise a jour. " + err)
                }
            );
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


    loadAllFooter() {
        //console.log(this.recherche.seek)
        this.factureService.getAllFooter().subscribe(data => {
            this.fact = data[0];
            console.log(this.fact);

        });

    }
    loadAllagence() {

        this.paramsService.getAllAgence().subscribe(agence => {

            this.agence = agence[0];
            console.log(this.agence);
            //console.log(this.currentUser);

        });
    }
}
