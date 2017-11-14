/**
 * Created by Alex on 04/07/2017.
 */
import {Component, Input} from '@angular/core';
import {ListeDevisComponent} from "./listedevis.component";
import {ContactService} from "../_services/contact.service";
import {ChantierService} from "../_services/chantier.service";
import {FormBuilder} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    selector: 'recherchedevis',
    moduleId: module.id,
    templateUrl: 'recherchedevis.component.html'
})

export class RechercheDevisComponent  {
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};
    seek: any = {};

    @Input('devis')
    devis: ListeDevisComponent;

    clients: any[] = [];
    chantiers: any[] = [];

    constructor(
       private contactService:ContactService,
       private chantierService:ChantierService,
       private builder: FormBuilder,
       private _sanitizer: DomSanitizer,
       private paramsService:ParamsService
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loadAllChantier();
        this.loadAllClient();
    }

    ngOnInit() {
        this.loaddroituser();                         //
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    fireLoad() {
        console.log(this.seek);
        this.devis.loadAllDevis();
    }

    loadAllChantier(){
        this.chantierService.getAllChantier().subscribe(
            data=>{
                this.chantiers = data;
            }
        );
    }

    loadAllClient(){
        this.contactService.getAllClients().subscribe(
            data=>{
                this.clients = data;
            }
        );
    }


    autocompleListFormatterContactValue = (data: any): SafeHtml => {
        let html = `${data.raison_sociale ? data.raison_sociale : data.nom +" " +data.prenom}`;
        return html;
    };

    autocompleListFormatterContact = (data: any): SafeHtml => {
        let html = `<span>${data.raison_sociale ? data.raison_sociale : data.nom +" " +data.prenom}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };



    autocompleListFormatterchantier = (data: any): SafeHtml => {
        let html = `<span>${data.nom_chantier} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };



}