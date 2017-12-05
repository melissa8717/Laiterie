/**
 * Created by Wbat on 17/07/2017.
 */
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {FormBuilder} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {DevisService} from "../_services/devis.service";
import {VentesService} from "../_services/ventes.service";
import {ContactService} from "../_services/contact.service";
import {ChantierService} from "../_services/chantier.service";
import {FactureService} from "../_services/facture.service";
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'dupliquerdevis.component.html'
})

export class DupliquerDevisComponent implements OnInit {
    private devis: any = {};
    private produit: any = {};

    private produits: {}[] = [];
    private chantiers: {}[] = [];

    private address = false;

    private id: number;
    private num_version: number;

    private produitDevis: any[] = [];
    private produitDevisOptions: any[] = [];

    private print: boolean = false;
    private cgv: any = {};
    private fact: any = {};
    private tvas: any[] = [];

    private currentUser: User;
    private droitsuser: any = {};


    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private contactService: ContactService,
                private chantierService: ChantierService,
                private factureService: FactureService,
                private devisService: DevisService,
                private venteService: VentesService,
                private paramsService: ParamsService,
                private builder: FormBuilder, private _sanitizer: DomSanitizer) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit(): void {
        this.loadAllChantiers();
        this.loadAllProduits();
        this.loadAllFooter();
        this.loadCat();
        this.loaddroituser();
        this.loadTva();

        this.route.params.subscribe(params => {
            this.id = params['id'];
            this.num_version = params['num_version'];
            this.devisService.getById(this.id, this.num_version).subscribe((data: any) => {
                this.devis = data.devis[0];
                this.produitDevis = data.detaille;
                this.produitDevisOptions = data.options;
            })
        });
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }


    ajouter() {
        let tmp: any = {};
        tmp.libelle = this.produit.obj.libelle;
        tmp.id_prc = this.produit.obj.id_prc ? this.produit.obj.id_prc : this.produit.ref;
        tmp.num_version = this.produit.obj.num_version;
        tmp.qte_devis = this.produit.qte;
        tmp.prix_devis = this.produit.prix;
        tmp.unite = this.produit.unite;
        tmp.option = this.produit.option;
        tmp.taux = this.produit.taux;

        let check = this.produitDevis.filter(obj => obj.id_prc == this.produit.obj.id_prc);

        if (check.length < 1) {
            if (tmp.id_prc) {
                if (tmp.option) {
                    this.produitDevisOptions.push(tmp);
                }
                else {
                    this.produitDevis.push(tmp);
                }

            }
            else {
                this.alertService.error("Veuillez ajouter un produit existant.");
            }
        }
        else {
            this.alertService.error("Le produit " + tmp.libelle + " n'a pas pu être ajouté.");
        }

        this.produit.qte = null;
        this.produit.prix = null;
        this.produit = {};
        this.accomptepercent();
    }

    supprimer(produit: any) {
        this.produitDevis = this.produitDevis.filter(obj => obj !== produit);
    }

    supprimeroption(produit: any) {
        this.produitDevisOptions = this.produitDevisOptions.filter(obj => obj !== produit);
    }

    accompteeuro() {
        this.devis.accompte_percent = (+this.devis.accompte_value / this.totalTVA() * 100).toFixed(2);
    }

    accomptepercent() {
        this.devis.accompte_value = (+this.devis.accompte_percent * this.totalTVA() / 100).toFixed(2);
    }

    test() {
        this.produit.qte = 1;
        this.produit.prix = this.produit.obj.prix_vente;
        this.produit.unite = this.produit.obj.unite;
        this.produit.ref = this.produit.obj.id_prc;

    }

    private loadAllChantiers() {
        this.chantierService.getAll().subscribe(chantiers => {
            this.chantiers = chantiers;

        });
    }

    loadAllProduits() {
        this.venteService.getAll().subscribe(data => {
            this.produits = data;

        });
    }

    countTotal() {
        let total = 0;
        for (let produit of this.produitDevis) {
            total += produit.prix_devis * produit.qte_devis;
        }
        return total;
    }


    countTotalRemise() {
        return this.countTotal() - (this.countTotal() * this.devis.remise / 100);
    }

    countTotalprodTVA() {
        return this.countTotalRemise() > 0 ? this.countTotalRemise() * ((this.devis.tva ? this.devis.tva : 0) / 100) : this.countTotal() * ((this.devis.tva ? this.devis.tva : 0) / 100);
    }

    countTotalTVA() {
        return this.countTotalRemise() > 0 ? this.countTotalRemise() * (1 + ((this.devis.tva ? this.devis.tva : 0) / 100)) : this.countTotal() * (1 + ((this.devis.tva ? this.devis.tva : 0) / 100));
    }


    countTotalOptions() {
        let total = 0;
        for (let produit of this.produitDevisOptions) {
            total += produit.prix_devis * produit.qte_devis;
        }
        return total;
    }

    countTotalOptionRemise() {
        return this.countTotalOptions() - (this.countTotalOptions() * this.devis.remise / 100);
    }

    countTotalOptionsTVA() {
        return this.countTotalOptionRemise() > 0 ? this.countTotalOptionRemise() * ((this.devis.tva ? this.devis.tva : 0) / 100) : this.countTotalOptions() * ((this.devis.tva ? this.devis.tva : 0) / 100);
    }

    countTotalOptionstotalTVA() {
        return this.countTotalOptionRemise() > 0 ? this.countTotalOptionRemise() * ((1 + (this.devis.tva ? this.devis.tva : 0) / 100)) : this.countTotalOptions() * (1 + ((this.devis.tva ? this.devis.tva : 0) / 100));
    }


    total() {
        return this.countTotal() + this.countTotalOptions();
    }

    totalRemiseTVA() {
        return this.countTotalOptionRemise() + this.countTotalRemise();
    }

    totalTVA() {
        return this.countTotalprodTVA() + this.countTotalOptionsTVA();
    }

    countTotalfinal() {
        return this.countTotalTVA() + this.countTotalOptionstotalTVA();
    }


    getAddress(id: any) {
        if (id != null) {
            this.contactService.getAddress(id).subscribe(
                data => {
                    if (data[0]) {
                        this.devis.address = data[0].adresse;
                        this.devis.cp = data[0].code_postal;
                        this.devis.ville = data[0].ville;
                        this.address = false
                    }
                    else {
                        this.devis.address = "";
                        this.devis.cp = "";
                        this.devis.ville = "";
                        this.address = true;
                    }
                }
            )
        }
        else {
            this.address = false;
        }
    }

    submit() {
        let devisparams: any = {};
        devisparams.devis = this.devis;
        devisparams.produitDevis = this.produitDevis;
        devisparams.produitDevisOptions = this.produitDevisOptions;

        this.devisService.duplicate(devisparams, this.id).subscribe(() => {
            this.router.navigate(["/listedevis"]);
            this.alertService.success("Le devis a été créé avec succès.");
        });
    }

    customTrackBy(index: number, obj: any): any {
        return index;
    }

    autocompleListFormatterProducts = (data: any): SafeHtml => {
        let html = `<span>${data.id_prc}-${data.libelle} : ${data.prix_vente ? data.prix_vente + "€" : "Prix non défini"}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    autocompleListFormatterContactValue = (data: any): SafeHtml => {
        return `${data.raison_sociale ? data.raison_sociale : data.nom + " " + data.prenom}`;
    };

    autocompleListFormatterContact = (data: any): SafeHtml => {
        let html = `<span>${data.raison_sociale ? data.raison_sociale : data.nom + " " + data.prenom}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };


    autocompleListFormatterchantier = (data: any): SafeHtml => {
        let html = `<span>${data.nom_chantier} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };


    imprimer() {
        this.alertService.clear();

        this.print = true;
        setTimeout(() => {
            window.print();
            this.print = false;
        }, 1000);
    }

    loadAllFooter() {
        this.factureService.getAllFooter().subscribe(data => {
            this.fact = data[0];

        });
    }

    loadCat() {
        this.paramsService.getAllVente().subscribe(cgv => {
            this.cgv = cgv[0];

        });
    }

    countNTVAZ() {
        let total = 0;

        for (let produit of this.produitDevis) {
            if (produit.taux == 0) {
                total += 0;
            }
        }
        return total;

    }

    countNTVA() {
        let total = 0;
        for (let produit of this.produitDevis) {
            if (produit.taux == 2.1) {
                total += produit.qte_devis * produit.prix_devis * (parseFloat(produit.taux) / 100);
            }
        }
        return total;
    }


    countNTVAC() {
        let total = 0;
        for (let produit of this.produitDevis) {
            if (produit.taux == 5.5) {
                total += produit.qte_devis * produit.prix_devis * (parseFloat(produit.taux) / 100);
            }
        }
        return total;
    }

    countNTVAD() {
        let total = 0;
        for (let produit of this.produitDevis) {
            if (produit.taux == 10) {
                total += produit.qte_devis * produit.prix_devis * (parseInt(produit.taux) / 100);
            }
        }
        return total;
    }

    countNTVAs() {
        let total = 0;
        for (let produit of this.produitDevis) {
            if (produit.taux == 20) {
                total += produit.qte_devis * produit.prix_devis * (parseInt(produit.taux) / 100);
            }
        }
        return total;
    }


    countNTVAZO() {
        let total = 0;
        for (let produit of this.produitDevisOptions) {

            if (produit.taux == 0) {
                total += 0;
            }
        }
        return total;
    }

    countNTVAO() {
        let total = 0;
        for (let produit of this.produitDevisOptions) {
            if (produit.taux == 2.1) {
                total += (parseFloat(produit.taux) / 100) * produit.prix_devis * produit.qte_devis;
            }
        }
        return total;
    }

    countNTVACO() {
        let total = 0;
        for (let produit of this.produitDevisOptions) {
            if (produit.taux == 5.5) {
                total += (parseFloat(produit.taux) / 100) * produit.prix_devis * produit.qte_devis;
            }
        }
        return total;
    }

    countNTVADO() {
        let total = 0;
        for (let produit of this.produitDevisOptions) {

            if (produit.taux == 10) {
                total += (parseInt(produit.taux) / 100) * produit.prix_devis * produit.qte_devis;
            }
        }
        return total;
    }

    countNTVAsO() {
        let total = 0;
        for (let produit of this.produitDevisOptions) {
            if (produit.taux == 20) {
                total += (parseInt(produit.taux) / 100) * produit.prix_devis * produit.qte_devis;
            }
        }
        return total;
    }


    countAllTVA() {
        return ((this.countNTVA() ? this.countNTVA() : 0) + (this.countNTVAC() ? this.countNTVAC() : 0) + (this.countNTVAD() ? this.countNTVAD() : 0)) + (this.countNTVAs() ? this.countNTVAs() : 0);
    }

    countAllTVAO() {
        return ((this.countNTVAO() ? this.countNTVAO() : 0) + (this.countNTVACO() ? this.countNTVACO() : 0) + (this.countNTVADO() ? this.countNTVADO() : 0)) + (this.countNTVAsO() ? this.countNTVAsO() : 0);
    }


    loadTva() {
        this.paramsService.getAllTVA().subscribe(tvas => {
            this.tvas = tvas;
            console.log(tvas);
        });
    }

}
