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
    templateUrl: 'editer_facture.component.html'
})

export class Editer_factureComponent {
    public uploaderImg: FileUploader;

    model: any = {};
    ret: any = {};
    version: any = {};
    fact: any={};
    nfact: any={};
    detail: any[] = [];
    totalfact: any[] = [];
    id_devis:number;
    num_version:number;
    qte_devis :number;
    prix_devis :number;
    pourcentage : number;
    tva:number;
    remise:number;
    montant_ht:number;

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};



    option: any[] = [];
    totalopt: any[] = [];

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
        this.loadDetail();
        this.loadOption();
        this.loadTotalfact();
        this.loadTotalopt();
        this.loadAllNfact();
        this.loaddroituser();
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
            this.id_devis=params['id']
           // console.log(this.id_devis);
            this.factureService.getByIdFacture(this.id_devis).subscribe(
                data=>{
                    this.model=data[0];
                    //console.log(data)
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
            this.id_devis=params['id']
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
            this.id_devis=params['id']
            this.num_version=params['num_version']
            console.log(this.id_devis);
            this.factureService.getByIdVersion(this.id_devis,this.num_version).subscribe(
                data=>{
                    this.version=data[0];
                    console.log(data)
                }
            )
        });
    }

    loadDetail(){
        this.route.params.subscribe(params => {
            this.id_devis=params['id']
            this.num_version=params['num_version']
            console.log(this.id_devis,this.num_version);
            this.factureService.getByIdDetail(this.id_devis,this.num_version).subscribe(
                data=>{
                    this.detail=data;
                    //console.log(data)

                   /* let totalligne = 0;
                    for (let details of this.detail) {
                        totalligne += (details.qte_devis / 100) * details.prix_devis*details.pourcentage;
                    }*/

                }
            )
        });
    }

    loadOption(){
        this.route.params.subscribe(params => {
            this.id_devis=params['id']
            this.num_version=params['num_version']
            console.log(this.id_devis,this.num_version);
            this.factureService.getByIdOption(this.id_devis,this.num_version).subscribe(
                data=>{
                    this.option=data;
                    //console.log(data)
                }
            )
        });
    }

    loadTotalfact(){
        this.route.params.subscribe(params => {
            this.id_devis=params['id']
            this.num_version=params['num_version']
            console.log(this.id_devis,this.num_version);
            this.factureService.getByIdTotalfact(this.id_devis,this.num_version).subscribe(
                data=>{
                    this.totalfact=data[0];
                    //console.log(data)

                }
            )
        });
    }

    loadTotalopt(){
        this.route.params.subscribe(params => {
            this.id_devis=params['id']
            this.num_version=params['num_version']
            console.log(this.id_devis,this.num_version);
            this.factureService.getByIdTotalopt(this.id_devis,this.num_version).subscribe(
                data=>{
                    this.totalopt=data[0];
                    //console.log(data)

                }
            )
        });
    }

    totaligne(details:any){
        if (details.pourcentage)
            return (details.qte_devis / 100) * details.prix_devis * details.pourcentage;
        else return 0;
    }
    totaligneopt(options:any){
        if (options.pourcentage)
            return (options.qte_devis / 100) * options.prix_devis * options.pourcentage;
        else return 0;
    }

    countTotaldet(details:any) {

        let totaldet = 0;

            for (let details of this.detail) {
                if (details.pourcentage )
                totaldet += (details.qte_devis / 100) * details.prix_devis * details.pourcentage;
                else totaldet += 0;
            }
        return totaldet;
    }

    countTotalopt(options:any) {
        let totalopt = 0;

        for (let options of this.option) {
            if (options.pourcentage)
            totalopt += (options.qte_devis / 100) * options.prix_devis * options.pourcentage;
            else totalopt += 0;
        }
            return totalopt;
    }

    countTotal(details:any,options:any,version:any){//travaux réalisés

        return this.countTotaldet(details) + this.countTotalopt(options) ;
    }
    countRemise(details:any,options:any,version:any){
        return this.countTotal(details,options,version)* (this.version.remise ? this.version.remise : 0)/100;
    }
    countTotalRemise(details:any,options:any,version:any){
        return this.countTotal(details,options,version)* (1-((this.version.remise ? this.version.remise : 0)/100));
    }
    countTotalNet(details:any,options:any,version:any){// en attendant plus value moins value
        return this.countTotalRemise(details,options,version)
    }
    countTotalsituation(details:any,options:any,version:any){
        this.model.montant_ht = this.countTotalNet(details,options,version)- (this.version.accompte_value ? this.version.accompte_value :0);
        return this.model.montant_ht;
    }
    countTVA(version:any,details:any,options:any) {
        return this.countTotalsituation(details,options,version) * (this.version.tva ? this.version.tva : 0)/100;
    }

    countSTotal(version:any,details:any,options:any){
        return this.countTotalsituation(details,options,version) + this.countTVA(version,details,options);
    }

    countRetenu(version:any,details:any,options:any) {

        return this.countSTotal(version,details,options) * (this.ret.pourcentage ? this.ret.pourcentage : 0)/100;
    }

    countTTC(version:any,details:any,options:any){
        return this.countSTotal(version,details,options) - this.countRetenu(version,details,options);

    }

    add() {

        let factureparams : any = {};
        console.log(this.model)
        factureparams.model = this.model;
        factureparams.version = this.version;
        factureparams.detail = this.detail;
        factureparams.option = this.option;
        factureparams.nfact =this.nfact;

        var test = +confirm ("Etes vous sür de vouloir enregitrer votre facture :");
        console.log(factureparams);
        if(test) {
            console.log(factureparams);
            this.factureService.add(factureparams).subscribe(
                data => {
                    this.router.navigate(["/listefacture"]);
                    this.alertService.success("La facture a été créée avec succès.");
                });
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
