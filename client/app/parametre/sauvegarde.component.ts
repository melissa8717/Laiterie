/**
 * Created by Wbat on 13/07/2017.
 */
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

import {Observable} from "rxjs/Observable";
import {isUndefined} from "util";

@Component({
    moduleId: module.id,
    templateUrl: 'sauvegarde.component.html'
})

export class SauvegardeComponent implements OnInit {
    devis: any = {};

    produit: any = {};

    produits: {}[] = [];
    chantiers: {}[] = [];
    clients: {}[] = [];
    fact: any={};
    model: any = {};
    address = false;

    id:number;
    num_version:number;

    produitDevis: any[] = [];
    produitDevisOptions: any[] = [];

    private sub: any;
    print: boolean = false;




    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private contactService:ContactService,
                private chantierService:ChantierService,
                private devisService: DevisService,
                private venteService: VentesService,
                private factureService: FactureService,
                private builder: FormBuilder, private _sanitizer: DomSanitizer) {

    }


    ngOnInit() {
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));




    }



    imprimer() {
        this.alertService.clear();
        var css = '@page',
            head = document.head || document.getElementsByTagName('head')[0],

            style = document.createElement('style');

        style.type = 'text/css';
        style.media = 'print';

        if (style.sheet) {
        } else {
            style.appendChild(document.createTextNode(css));
        }




        this.print = true;
        setTimeout(() => {

            window.print();
            this.print = false;
        }, 1000);
    }



}
