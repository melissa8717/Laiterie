/**
 * Created by Alex on 04/07/2017.
 */
import {Component, Input} from '@angular/core';
import {SuivicommandeComponent} from "./suivicommande.component";
import {ContactService} from "../_services/contact.service";
import {FormBuilder} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";

@Component({
    selector: 'recherchebdc',
    moduleId: module.id,
    templateUrl: 'rechercheBdc.component.html'
})

export class RechercheBdcComponent  {
    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};               //
    seek: any = {};

    fournisseurs: any[] = [];

    @Input('bdc')
    bdc: SuivicommandeComponent;

    constructor(
        private contactService: ContactService,
        private builder: FormBuilder,
        private _sanitizer: DomSanitizer,
        private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.contactService.getAllFournisseurs().subscribe(
            data=>{
                this.fournisseurs = data;
                console.log(this.fournisseurs);
            }
        )
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

        this.bdc.loadAllBons();
    }

    autocompleListFormatterContact = (data: any): SafeHtml => {
        let html = `<span>${data.raison_sociale ? data.raison_sociale : data.nom }</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };





}