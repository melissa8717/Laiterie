/**
 * Created by cédric on 17/07/2017.
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';
import {FactureService} from "../_services/facture.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";
import {FileUploader} from 'ng2-file-upload';

const URLimg = 'http://'+location.hostname+':4000/image/';

@Component({
    moduleId: module.id,
    templateUrl: 'acompte.component.html'
})

export class AcompteComponent {
    public uploaderImg: FileUploader;

    model: any = {};
    ret: any = {};
    version: any = {};
    fact: any={};
    nfact: any={};
    totalfact:any={};
    id_devis:number;
    num_version:number;
    tva:number;
    remise:number;
    montant_ht:number;
    totalopt:any={};

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};


    print: boolean = false;

    files: any[] = [];
    fileReader = new FileReader();
    base64Files:any;
    loc = location.hostname;
    image: any[];
    id_agence: number;
    img: any = {};




    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private factureService: FactureService,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.loadAllFooter();
        this.loadFacture();
        this.loadRetenu();
        this.loadVersion();
        this.loadAllNfact();
        this.loaddroituser();
        this.loadTotalfact();
        this.loadTotalopt();
        this.loadAllagence();


    }

    loadAllFooter() {
        //console.log(this.recherche.seek)

        this.factureService.getAllFooter().subscribe(data => {
            this.fact = data[0];
            //console.log(this.fact);

        });
    }
    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }
    loadFacture(){
        this.route.params.subscribe(params => {
            this.id_devis=params['id_devis']
            // console.log(this.id_devis);
            this.factureService.getByIdFacture(this.id_devis).subscribe(
                data=>{
                    this.model=data[0];
                    console.log(data)
                }
            )
        });
    }

    loadAllNfact() {

        this.factureService.getAllnfact().subscribe(data => {
            this.nfact = data[0];
            console.log(this.nfact);

        });
    }

    loadRetenu(){
        this.route.params.subscribe(params => {
            this.id_devis=params['id_devis']
            //console.log(this.id_devis);
            this.factureService.getByIdRetenu(this.id_devis).subscribe(
                data=>{
                    this.ret=data[0];
                    //console.log(data)
                }
            )
        });
    }

    loadVersion(){
        this.route.params.subscribe(params => {
            this.id_devis=params['id_devis']
            this.num_version=params['num_version']
            console.log(this.id_devis);
            this.factureService.getByIdVersion(this.id_devis,this.num_version).subscribe(
                data=>{
                    this.version=data[0];
                    console.log(data)
                }//
            )
        });
    }

    loadTotalfact(){
        this.route.params.subscribe(params => {
            this.id_devis=params['id_devis']
            this.num_version=params['num_version']

            this.factureService.getByIdTotalfact(this.id_devis,this.num_version).subscribe(
                data=>{
                    this.totalfact=data[0];
                    console.log(data)

                }
            )
        });
    }

    loadTotalopt(){
        this.route.params.subscribe(params => {
            this.id_devis=params['id_devis']
            this.num_version=params['num_version']
            console.log(this.id_devis,this.num_version);
            this.factureService.getByIdTotalopt(this.id_devis,this.num_version).subscribe(
                data=>{
                    this.totalopt=data[0];
                    console.log(data)

                }
            )
        });
    }


    imprimer(){
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            window.print();
            this.print = false;
        }, 1000);
    }

    addaccompte() {

        let factureparams : any = {};
        console.log(this.model)
        factureparams.model = this.model;
        factureparams.version = this.version;
        factureparams.nfact =this.nfact;

        var test = +confirm ("Etes vous sür de vouloir enregitrer votre facture d'acompte :");
        console.log(factureparams);
        if(test) {
            this.factureService.addacompte(factureparams).subscribe(
                data => {
                    this.router.navigate(["/listefacture"]);
                    this.alertService.success("La facture d'acompte a été créée avec succès.");
                });
        }
    }

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

}