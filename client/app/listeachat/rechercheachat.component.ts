/**
 * Created by Alexandre on 20/07/2017.
 */
import {Component, Input} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ListeachatComponent} from "./listeachat.component";
import {ContactService, UtilsService} from "../_services/index";

@Component({
    selector: 'rechercheachat',
    moduleId: module.id,
    templateUrl: 'rechercheachat.component.html'
})

export class RechercheAchatComponent {

    @Input('achat')
    achat: ListeachatComponent;

    private seek: any = {};
    private fournisseurs: any[] = [];

    constructor(private contactService: ContactService,
                private _sanitizer: DomSanitizer) {
    }


    ngOnInit() {
        this.contactService.getAllFournisseurs().subscribe(fournisseurs => {
            this.fournisseurs = fournisseurs;
        })
    }

    autocompleListFormatterContact = (data: any): SafeHtml => {
        let html = `<span>${data.raison_sociale ? data.raison_sociale : data.nom }</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    fireLoad() {
        this.achat.filterProducts(this.seek);
    }
}