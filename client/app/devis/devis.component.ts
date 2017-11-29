
import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {FormBuilder, FormGroup} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {DevisService} from "../_services/devis.service";
import {VentesService} from "../_services/ventes.service";
import {ContactService} from "../_services/contact.service";
import {ChantierService} from "../_services/chantier.service";
import {FactureService} from "../_services/facture.service";
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";
import {FileUploader} from 'ng2-file-upload';


const URL = 'http://localhost:4000/ged/';
const URLimg = 'http://'+location.hostname+':4000/image/';
const URLFili = 'http://'+location.hostname+':4000/filigrane/';




import {Observable} from "rxjs/Observable";
import {isUndefined} from "util";

@Component({
    moduleId: module.id,
    templateUrl: 'devis.component.html'
})

export class DevisComponent implements OnInit {

    public uploaderImg: FileUploader;
    public uploaderFili: FileUploader;
    public hasBaseDropZoneOver: boolean = false;

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }



    devis: any = {};

    produit: any = {};

    produits: {}[] = [];
    chantiers: {}[] = [];
    clients: {}[] = [];
    fact: any = {};
    model: any = {};
    address = false;
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};

    loc = location.hostname;
    image: any[];
    id_agence: number;
    img: any = {};

    fili: any = {};




    num_version: number;

    produitDevis: any[] = [];
    produitDevisOptions: any[] = [];

    private sub: any;
    print: boolean = false;
    section: any;
    content: any;
    options: any;
    cgv: any = {};
    id: number;
    ged: any[];
    logo: any ={};
    Var:any;
    files: any[] = [];
    fileReader = new FileReader();
    base64Files:any;


    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private contactService: ContactService,
                private chantierService: ChantierService,
                private devisService: DevisService,
                private venteService: VentesService,
                private factureService: FactureService,
                private paramsService: ParamsService,
                private builder: FormBuilder,
                private _sanitizer: DomSanitizer,
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit(): void {
        //let timer = Observable.timer(2000,5000);
        this.loadAllChantiers();
        this.loadAllClients();
        this.loadAllProduits();
        this.loadAllFooter();
        this.loadCat();
        this.loaddroituser();
        this.loadAllagence();
        this.loadAllFili();




        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.num_version = params['num_version'];
            //console.log(this.num_version)
            this.devisService.getById(this.id, this.num_version).subscribe(
                (data: any) => {
                    this.devis = data.devis[0];
                    this.produitDevis = data.detaille;
                    this.produitDevisOptions = data.options;
                    //console.log(this.devis);
                    //console.log(this.produitDevis);

                }
            )
        });

        this.route.params.subscribe(params => {
            this.id = params['id'];

        });
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            //console.log(this.data);
            //onsole.log(this.currentUser._id);

        });
    }


    //getdevis
    //getalldevisprod
    //getalldevisoptions


    ajouter() {
        let tmp: any = {};
        tmp.obj = this.produit.obj;
        tmp.qte = this.produit.qte;
        tmp.prix = this.produit.prix;
        tmp.unite = this.produit.unite;
        tmp.option = this.produit.option;
        tmp.ref = this.produit.ref;

        var check = this.produitDevis.filter(obj => obj.ref == this.produit.obj.id_prc);

        if (check.length < 1) {
            if (tmp.obj.id_prc) {
                if (tmp.option) {
                    this.produitDevisOptions.push(tmp);
                }
                else {
                    this.produitDevis.push(tmp);
                    for (var i = 0; i < this.produitDevis.length; i++) {
                        console.log(this.produitDevis[i]);
                        let qte = this.produitDevis[i].qte;
                        let prix = this.produitDevis[i].prix;
                        this.produitDevis[i].qte = qte;
                        this.produitDevis[i].prix = prix;
                    }
                }

            }
            else {
                this.alertService.error("Veuillez ajouter un produit existant.");
            }
        }
        else {
            this.alertService.error("Le produit " + tmp.obj.libelle + " n'a pas pu être ajouté.");
        }


        this.produit.qte = null;
        this.produit.prix = null;
        this.produit = {};
        this.accomptepercent();
        //console.log(this.produitDevis);
    }

    supprimer(produit: any) {
        this.produitDevis = this.produitDevis.filter(obj => obj !== produit);
    }

    supprimeroption(produit: any) {
        this.produitDevisOptions = this.produitDevisOptions.filter(obj => obj !== produit);
    }

    accompteeuro() {
        this.devis.accomptepercentage = (this.devis.accompteeuros / this.totalTVA() * 100).toFixed(2);
    }

    accomptepercent() {
        this.devis.accompteeuros = (this.devis.accomptepercentage * this.totalTVA() / 100).toFixed(2);
    }

    test() {
        console.log(this.devis)
        console.log(this.produit)
        this.produit.qte = 1;
        this.produit.prix = this.produit.obj.prix_vente;
        this.produit.unite = this.produit.obj.unite;
        this.produit.ref = this.produit.obj.id_prc;
    }

    private loadAllChantiers() {
        this.chantierService.getAll().subscribe(chantiers => {
            this.chantiers = chantiers;
            console.log(this.chantiers)
        });
    }

    private loadAllClients() {
        // console.log("on envoie la requette");
        this.contactService.getAllClients().subscribe(clients => {
            this.clients = clients;
            console.log(this.clients);
        });
    }

    loadAllProduits() {
        this.venteService.getAll().subscribe(
            data => {
                this.produits = data;
                //  console.log(this.produits);
            }
        )
    }

    countTotal() {
        let total = 0;
        for (let produit of this.produitDevis) {
            total += produit.prix_devis * produit.qte_devis;
        }
        return total;
    }

    countTotalVI() {
        let total = 0;
        for (let produit of this.produitDevis) {
            if(produit.taux == 20){
                total += produit.prix_devis * produit.qte_devis *(produit.taux/100);
            }

        }
        return total;
    }


    totalRemiseprod() {
        return this.countTotal() - (this.countTotal() * ((this.devis.remise ? this.devis.remise : 0) / 100));
    }

    countTVAprod() {
        return this.totalRemiseprod() > 0 ? this.totalRemiseprod() * ((this.devis.tva ? this.devis.tva : 0) / 100) : this.countTotal() * ((this.devis.tva ? this.devis.tva : 0) / 100);
    }

    countTotalTVA() {
        return this.totalRemiseprod() > 0 ? this.totalRemiseprod() + this.countAllTVA() : 0 ;
    }


    countTotalOptions() {
        let total = 0;
        for (let produit of this.produitDevisOptions) {
            total += produit.prix_devis * produit.qte_devis;
        }
        return total;
    }

    countTotalOptionRemise() {
        return this.countTotalOptions() - (this.countTotalOptions() * (this.devis.remise ? this.devis.remise : 0) / 100);
    }

    countTotalOptionsTVA() {
        return this.countTotalOptionRemise() > 0 ? this.countTotalOptionRemise() * ((this.devis.tva ? this.devis.tva : 0) / 100) : this.countTotalOptions() * ((this.devis.tva ? this.devis.tva : 0) / 100);
    }


    Totaloption() {
        return this.countTotalOptionRemise() > 0 ? this.countTotalOptionRemise() * (1 + ((this.devis.tva ? this.devis.tva : 0) / 100)) : this.countTotalOptions() * (1 + ((this.devis.tva ? this.devis.tva : 0) / 100));
    }


    total() {
        return this.countTotal() + this.countTotalOptions();
    }

    totalTVA() {
        return this.Totaloption() + this.countAllTVAO();
    }

    countTotalRemise() {
        return this.countTotalOptionRemise() + this.totalRemiseprod();
    }

    TVAtotal() {
        return this.countTotalOptionsTVA() + this.countTVAprod();
    }


    totalRemiseTVA() {
        return this.totalTVA() - (this.totalTVA() * this.devis.remise / 100);
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

        console.log(devisparams);
        this.devisService.add(devisparams).subscribe(
            data => {
                this.router.navigate(["/listedevis"]);
                this.alertService.success("Le devis a été créé avec succès.");
            });
    }

    autocompleListFormatterProducts = (data: any): SafeHtml => {
        let html = `<span>${data.libelle} : ${data.prix_vente ? data.prix_vente + "€" : "Prix non défini"}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    autocompleListFormatterContactValue = (data: any): SafeHtml => {
        let html = `${data.raison_sociale ? data.raison_sociale : data.nom + " " + data.prenom}`;
        return html;
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


        var css = '@page ',
            pageFooter = document.getElementById('pageFooter');


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

    loadCat() {
        console.log(this.cgv)

        this.paramsService.getAllVente().subscribe(cgv => {

            this.cgv = cgv[0];
            console.log(this.cgv);

        });
    }

    acceptOffer(option: any) {
        console.log(option);
        this.devisService.acceptOffer(option).subscribe(
            data => {

            }
        );
    }






    public onChange(event: Event) {
        let files = event.target['files'];
        if (event.target['files']) {
            console.log(event.target['files']);
            this.readFiles(event.target['files'], 0);
        }
    };

    private readFiles(files: any[], index: number) {
        let file = files[index];
        this.fileReader.onload = () => {
            this.base64Files.push(this.fileReader.result);
            if (files[index + 1]) {
                this.readFiles(files, index + 1);
            } else {
                console.log('loaded all files');
            }
        };
        this.fileReader.readAsDataURL(file);
    }


    loadAllagence() {

        this.paramsService.getAllAgence().subscribe(img => {

            this.img = img[0];
            console.log(this.img);
            //console.log(this.currentUser);

            this.uploaderImg = new FileUploader({url: URLimg + "agence/" + this.img.id_agence});
            this.uploaderImg.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };

            /*this.uploader = new FileUploader({url: URL + "param/" + this.model.id_agence});
            this.uploader.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };*/

        });



    }

    loadAllFili(){

        this.paramsService.getAllFili().subscribe(fili => {

            this.fili = fili[0];
            console.log(this.fili);
            //console.log(this.currentUser);

            this.uploaderFili = new FileUploader({url: URLFili + "agence/" + this.fili.id_agence});
            this.uploaderFili.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };

            /*this.uploader = new FileUploader({url: URL + "param/" + this.model.id_agence});
            this.uploader.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };*/

        });
    }
    countNTVAZ() {
        let total = 0;

        for (let produit of this.produitDevis) {

            if (produit.taux == 0) {
                total +=  0;


            }
        }
        return total;

    }
    countNTVA() {
        let total = 0;

        for (let produit of this.produitDevis) {

            if (produit.taux == 2.1) {
                total += produit.qte_devis * produit.prix_devis * (parseInt(produit.taux)/100);


            }
        }
        return total;

    }




    countNTVAC() {
        let total = 0;

        for (let produit of this.produitDevis) {

            if (produit.taux == 5.5) {
                total += produit.qte_devis * produit.prix_devis * (parseInt(produit.taux)/100);


            }
        }
        return total;

    }

    countNTVAD() {
        let total = 0;

        for (let produit of this.produitDevis) {


            if (produit.taux == 10) {
                total += produit.qte_devis * produit.prix_devis * (parseInt(produit.taux)/100);


            }
        }
        return total;

    }

    countNTVAs() {
        let total = 0;

        for (let produit of this.produitDevis) {


            if (produit.taux == 20) {
                total += produit.qte_devis * produit.prix_devis * (parseInt(produit.taux)/100);
            }
        }
        return total;

    }


    countNTVAZO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {

            if (produit.taux == 0) {
                total +=  0;


            }
        }
        return total;

    }
    countNTVAO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {
            if (produit.taux == 2.1) {
                total += (parseInt(produit.taux)/100) * produit.prix_devis * produit.qte_devis;


            }
        }
        return total;

    }

    countNTVACO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {
            if (produit.taux == 5.5) {
                total += (parseInt(produit.taux)/100) * produit.prix_devis * produit.qte_devis;


            }
        }
        return total;

    }

    countNTVADO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {

            if (produit.taux == 10) {
                total += (parseInt(produit.taux)/100) * produit.prix_devis * produit.qte_devis;


            }
        }
        return total;

    }

    countNTVAsO() {
        let total = 0;

        for (let produit of this.produitDevisOptions) {
            console.log(produit.prix);
            console.log(parseInt(produit.taux));
            if (produit.taux == 20) {
                total += (parseInt(produit.taux)/100) * produit.prix_devis * produit.qte_devis;

            }
        }
        return total;

    }


    countAllTVA(){
        return ((this.countNTVA() ? this.countNTVA() : 0 ) + (this.countNTVAC() ? this.countNTVAC() : 0 )  + (this.countNTVAD() ? this.countNTVAD() : 0 )) + (this.countNTVAs() ? this.countNTVAs() : 0 );


    }

    countAllTVAO(){
        return ((this.countNTVAO() ? this.countNTVAO() : 0 ) + (this.countNTVACO() ? this.countNTVACO() : 0 ) + (this.countNTVADO() ? this.countNTVADO() : 0 )) + (this.countNTVAsO() ? this.countNTVAsO() : 0 );


    }




}



