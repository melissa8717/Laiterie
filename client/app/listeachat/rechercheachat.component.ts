/**
 * Created by Alexandre on 20/07/2017.
 */
import {Component, Input} from '@angular/core';
import {ListeachatComponent} from "./listeachat.component";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {FormBuilder} from "@angular/forms";
import {ContactService} from "../_services/contact.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    selector: 'rechercheachat',
    moduleId: module.id,
    templateUrl: 'rechercheachat.component.html'
})

export class RechercheAchatComponent  {
    seek: any = {};
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};

    @Input('achat')
    achat: ListeachatComponent;

    fournisseurs: any[] = [];

    constructor(
        private contactService: ContactService,
        private builder: FormBuilder,
        private _sanitizer: DomSanitizer,
        private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.contactService.getAllFournisseurs().subscribe(
            data=>{
                this.fournisseurs = data;
            }
        )
    }


    autocompleListFormatterContact = (data: any): SafeHtml => {
        let html = `<span>${data.raison_sociale ? data.raison_sociale : data.nom }</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

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
        this.achat.filterProducts(this.seek);
    }



}