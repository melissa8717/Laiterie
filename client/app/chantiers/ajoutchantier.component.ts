import {Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService} from '../_services/index';
import {ChantierService} from "../_services/chantier.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";


@Component({
    moduleId: module.id,
    templateUrl: 'ajoutchantier.component.html'
})

export class AjoutchantierComponent{

    model: any = {};
    id_devis:number;
    num_version:number;
    List: any = {};

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};               //


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private chantierService: ChantierService,
        private alertService: AlertService,
        private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    }

    ngOnInit() {

        this.loaddroituser();


        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.loadChantierdevis();

    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    loadChantierdevis(){
        this.route.params.subscribe(params => {
            this.id_devis=params['id_devis']
            this.num_version=params['num_version']
            console.log(this.id_devis);
            this.chantierService.getByIdCdevis(this.id_devis,this.num_version).subscribe(
                data=>{
                    this.model=data[0];
                    console.log(data)
                }
            )
        });
    }

    createChantier() {

        let chantierparams : any = {};
        chantierparams.model = this.model;


        //console.log(chantierparams);
        this.chantierService.createChantier(chantierparams).subscribe(
            data=>{
                this.router.navigate(["/listechantier"]);
                this.alertService.success("Le chantier a été créé avec succès.");
            });
    }





}