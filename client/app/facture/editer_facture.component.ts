/**
 * Created by cédric on 17/07/2017.
 */
import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {FactureService} from '../_services/facture.service';
import {ParamsService} from '../_services/params.service'; //
import {User} from '../_models/user';
import {FileUploader} from 'ng2-file-upload';
import {AppConfig} from '../app.config';

const URLimg = 'http://' + location.hostname + ':4000/image/';

@Component({
    moduleId: module.id,
    templateUrl: 'editer_facture.component.html'
})

export class Editer_factureComponent {
    public uploaderImg: FileUploader;
    public uploaderFili: FileUploader;


    model: any = {};
    ret: any = {};
    version: any = {};
    fact: any = {};
    nfact: any = {};
    detail: any[] = [];
    totalfact: any[] = [];
    id_devis: number;
    num_version: number;
    qte_devis: number;
    prix_devis: number;
    pourcentage: number;
    tva: number;
    remise: number;
    montant_ht: number;

    currentUser: User;         //
    droitsuser: any = {};         //
    _id: any;                   //
    data: any = {};


    option: any[] = [];
    totalopt: any[] = [];

    print: boolean = false;

    files: any[] = [];
    fileReader = new FileReader();
    base64Files: any;
    loc = location.hostname;
    image: any[];
    id_agence: number;
    img: any = {};

    libre: any[] = [];
    libreoption: any[] = [];
    fili: any = {};




    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private factureService: FactureService,
                private paramsService: ParamsService,
                private config: AppConfig) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        let body = document.getElementsByTagName('body')[0];
        body.className = '';
        body.className += 'flatclair';
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
        this.loadLibre();
        this.loadLibreoption();

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

            //console.log(this.data);
            //console.log(this.currentUser._id);

        });
    }

    loadFacture() {
        this.route.params.subscribe(params => {
            this.id_devis = params['id']
            // console.log(this.id_devis);
            this.factureService.getByIdFacture(this.id_devis).subscribe(
                data => {
                    this.model = data[0];
                   // console.log(data)
                }
            )
        });
    }

    loadAllNfact() {

        this.factureService.getAllnfact().subscribe(data => {
            this.nfact = data[0];
            //console.log(this.nfact);

        });
    }

    loadRetenu() {
        this.route.params.subscribe(params => {
            this.id_devis = params['id']
            //console.log(this.id_devis);
            this.factureService.getByIdRetenu(this.id_devis).subscribe(
                data => {
                    this.ret = data[0];
                    //console.log(data)
                }
            )
        });
    }

    loadVersion() {
        this.route.params.subscribe(params => {
            this.id_devis = params['id']
            this.num_version = params['num_version']
            console.log(this.id_devis);
            this.factureService.getByIdVersion(this.id_devis, this.num_version).subscribe(
                data => {
                    this.version = data[0];
                    //console.log(data)
                }
            )
        });
    }

    loadDetail() {
        this.route.params.subscribe(params => {
            this.id_devis = params['id']
            this.num_version = params['num_version']
            console.log(this.id_devis, this.num_version);
            this.factureService.getByIdDetail(this.id_devis, this.num_version).subscribe(
                data => {
                    this.detail = data;
                    //console.log(data)


                }
            )
        });
    }

    loadOption() {
        this.route.params.subscribe(params => {
            this.id_devis = params['id']
            this.num_version = params['num_version']
            console.log(this.id_devis, this.num_version);
            this.factureService.getByIdOption(this.id_devis, this.num_version).subscribe(
                data => {
                    this.option = data;
                    console.log(data)
                }
            )
        });
    }

    loadLibre() {
        this.route.params.subscribe(params => {
            this.id_devis = params['id']
            this.num_version = params['num_version']
            console.log(this.id_devis, this.num_version);
            this.factureService.getByIdDevislibre(this.id_devis, this.num_version).subscribe(
                data => {
                    this.libre = data;
                   // console.log(data)


                }
            )
        });
    }

    loadLibreoption() {
        this.route.params.subscribe(params => {
            this.id_devis = params['id']
            this.num_version = params['num_version']
            console.log(this.id_devis, this.num_version);
            this.factureService.getByIdDevislibreoption(this.id_devis, this.num_version).subscribe(
                data => {
                    this.libreoption = data;
                    //console.log(data);


                }
            )
        });
    }

    loadTotalfact() {
        this.route.params.subscribe(params => {
            this.id_devis = params['id']
            this.num_version = params['num_version']
            console.log(this.id_devis, this.num_version);
            this.factureService.getByIdTotalfact(this.id_devis, this.num_version).subscribe(
                data => {
                    this.totalfact = data[0];

                }
            )
        });
    }

    loadTotalopt() {
        this.route.params.subscribe(params => {
            this.id_devis = params['id']
            this.num_version = params['num_version']
            console.log(this.id_devis, this.num_version);
            this.factureService.getByIdTotalopt(this.id_devis, this.num_version).subscribe(
                data => {
                    this.totalopt = data[0];
                    //console.log(data)

                }
            )
        });
    }

    totaligne(details: any) {
        if (details.pourcentage)
            return (details.qte_devis / 100) * details.prix_devis * details.pourcentage;
        else return 0;
    }

    totaligneopt(options: any) {
        if (options.pourcentage)
            return (options.qte_devis / 100) * options.prix_devis * options.pourcentage;
        else return 0;
    }

    totalignelibre(libres: any) {
        if (libres.pourcentage)
            return (libres.qte_devis / 100) * libres.prix_devis * libres.pourcentage;
        else return 0;
    }

    totalignelibreoption(libreoptions: any) {
        if (libreoptions.pourcentage)
            return (libreoptions.qte_devis / 100) * libreoptions.prix_devis * libreoptions.pourcentage;
        else return 0;
    }

    countTotaldet(details: any) {

        let totaldet = 0;

        for (let details of this.detail) {
            if (details.pourcentage)
                totaldet += (details.qte_devis / 100) * details.prix_devis * details.pourcentage;
            else totaldet += 0;
        }
        return totaldet;
    }

    countTotalopt(options: any) {
        let totalopt = 0;

        for (let options of this.option) {
            if (options.pourcentage)
                totalopt += (options.qte_devis / 100) * options.prix_devis * options.pourcentage;
            else totalopt += 0;
        }
        return totalopt;
    }

    countTotallibre(libres: any) {

        let totaldet = 0;

        for (let libres of this.libre) {
            if (libres.pourcentage)
                totaldet += (libres.qte_devis / 100) * libres.prix_devis * libres.pourcentage;
            else totaldet += 0;
        }
        return totaldet;
    }

    countTotallibreoption(libreoptions: any) {

        let totaldet = 0;

        for (let libreoptions of this.libreoption) {
            if (libreoptions.pourcentage)
                totaldet += (libreoptions.qte_devis / 100) * libreoptions.prix_devis * libreoptions.pourcentage;
            else totaldet += 0;
        }
        return totaldet;
    }

    countTotallib(libres: any) {

        let totaldet = 0;

        for (let libres of this.libre) {
                totaldet += (libres.qte_devis ) * libres.prix_devis;
        }
        return totaldet;
    }

    countTotalliboption(libreoptions: any) {

        let totaldet = 0;

        for (let libreoptions of this.libreoption) {
                totaldet += (libreoptions.qte_devis ) * libreoptions.prix_devis ;
        }
        return totaldet;
    }

    countTotal(details: any, options: any, version: any,libres:any,libreoptions: any) {//travaux réalisés

        return this.countTotaldet(details) + this.countTotalopt(options) + this.countTotallibre(libres) + this.countTotallibreoption(libreoptions);
    }

    countRemise(details: any, options: any, version: any,libres:any,libreoptions: any) {
        return this.countTotal(details, options, version,libres,libreoptions) * (this.version.remise ? this.version.remise/100 : 0) ;
    }

    countTotalRemise(details: any, options: any, version: any,libres:any,libreoptions: any) {
        return this.countTotal(details, options, version,libres,libreoptions) * (1 - ((this.version.remise ? this.version.remise /100: 0) ));
    }

    countTotalNet(details: any, options: any, version: any,libres:any,libreoptions: any) {// en attendant plus value moins value
        return this.countTotalRemise(details, options, version,libres,libreoptions)
    }

    countTotalsituation(details: any, options: any, version: any,libres:any,libreoptions: any) {
        this.model.montant_ht = this.countTotalNet(details, options, version,libres,libreoptions) - (this.version.accompte_value ? this.version.accompte_value : 0);
        return this.model.montant_ht;
    }

    countTVA(version: any, details: any, options: any,libres:any,libreoptions: any) {
        return this.countTotalsituation(details, options, version,libres,libreoptions) * (this.version.tva ? this.version.tva/ 100 : 0) + this.SumTvaV() +this.SumTvaD()+this.SumTvaC()+this.SumTvaDX()+this.SumTvaZ();
    }

    countSTotal(version: any, details: any, options: any,libres:any,libreoptions: any) {
        return this.countTotalsituation(details, options, version,libres,libreoptions) + this.countTVA(version, details, options,libres,libreoptions);
    }

    countRetenu(version: any, details: any, options: any,libres:any,libreoptions: any) {

        return this.countSTotal(version, details, options,libres,libreoptions) * (this.ret.pourcentage ? this.ret.pourcentage : 0) / 100;
    }

    countTTC(version: any, details: any, options: any,libres:any,libreoptions: any) {
        return this.countSTotal(version, details, options,libres,libreoptions) - this.countRetenu(version, details, options,libres,libreoptions);

    }

    add() {

        let factureparams: any = {};
        console.log(this.model)
        factureparams.model = this.model;
        factureparams.version = this.version;
        factureparams.detail = this.detail;
        factureparams.option = this.option;
        factureparams.nfact = this.nfact;
        factureparams.libre = this.libre;
        factureparams.libreoption = this.libreoption;

        var test = +confirm('Etes vous sûr de vouloir enregistrer votre facture :');
        console.log(factureparams);
        if (test) {
            console.log(factureparams);
            this.factureService.add(factureparams).subscribe(
                data => {
                    this.router.navigate(['/listefacture']);
                    this.alertService.success('La facture a été créée avec succès.');
                });
        }
    }

    imprimer() {
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

            this.uploaderImg = new FileUploader({url: URLimg + 'agence/' + this.img.id_agence});
            this.uploaderImg.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };

            this.paramsService.getAllAgence().subscribe(fili => {

                this.fili = fili[0];
                console.log(this.img);
                //console.log(this.currentUser);

                this.uploaderFili = new FileUploader({url: URLimg + "agence/" + this.fili.id_agence});
                this.uploaderFili.onAfterAddingFile = (file) => {
                    file.withCredentials = false;
                };

                /*this.uploader = new FileUploader({url: URL + "param/" + this.model.id_agence});
                this.uploader.onAfterAddingFile = (file) => {
                    file.withCredentials = false;
                };*/
            });

    });

    }



    TVAVO() {
        let total = 0;

        for (let libres of this.libre) {

            if (libres.taux == 20) {
                total += ( libres.prix_devis * libres.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (libres.pourcentage / 100) * (libres.taux / 100);

            }
        }
        return total;
    }

     TVAV() {
         let total = 0;

         for (let details of this.detail) {

             if (details.taux == 20) {
                 total += (details.prix_devis * details.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (details.pourcentage / 100) * (details.taux / 100);
             }

         }
         return total;
     }

     TVATVt() {
         let total = 0;

         for (let options of this.option) {

             if (options.taux == 20) {
                 total += (options.prix_devis * options.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (options.pourcentage / 100) * (options.taux / 100);
             }

         }
         return total;
     }

     TVATVOt() {
         let total = 0;

         for (let libreoptions of this.libreoption) {

             if (libreoptions.taux == 20) {
                 total += (libreoptions.prix_devis * libreoptions.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (libreoptions.pourcentage / 100) * (libreoptions.taux / 100);
             }

         }
         return total;
     }

    SumTvaV() {
        return this.TVAV() + this.TVAVO() + this.TVATVOt() + this.TVATVt();
    }

    TVADO() {
        let total = 0;

        for (let libres of this.libre) {

            if (libres.taux == 10) {
                total += ( libres.prix_devis * libres.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (libres.pourcentage / 100) * (libres.taux / 100);

            }
        }
        return total;
    }

    TVAD() {
        let total = 0;

        for (let details of this.detail) {

            if (details.taux == 10) {
                total += (details.prix_devis * details.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (details.pourcentage / 100) * (details.taux / 100);
            }

        }
        return total;
    }

    TVATDt() {
        let total = 0;

        for (let options of this.option) {

            if (options.taux == 10) {
                total += (options.prix_devis * options.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (options.pourcentage / 100) * (options.taux / 100);
            }

        }
        return total;
    }

    TVATDOt() {
        let total = 0;

        for (let libreoptions of this.libreoption) {

            if (libreoptions.taux == 10) {
                total += (libreoptions.prix_devis * libreoptions.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (libreoptions.pourcentage / 100) * (libreoptions.taux / 100);
            }

        }
        return total;
    }

    SumTvaD() {
        return this.TVAD() + this.TVADO() + this.TVATDOt() + this.TVATDt();
    }

    TVACO() {
        let total = 0;

        for (let libres of this.libre) {

            if (libres.taux == 5.5) {
                total += ( libres.prix_devis * libres.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (libres.pourcentage / 100) * (libres.taux / 100);

            }
        }
        return total;
    }

    TVAC() {
        let total = 0;

        for (let details of this.detail) {

            if (details.taux == 5.5) {
                total += (details.prix_devis * details.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (details.pourcentage / 100) * (details.taux / 100);
            }

        }
        return total;
    }

    TVATCt() {
        let total = 0;

        for (let options of this.option) {

            if (options.taux == 5.5) {
                total += (options.prix_devis * options.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (options.pourcentage / 100) * (options.taux / 100);
            }

        }
        return total;
    }

    TVATCOt() {
        let total = 0;

        for (let libreoptions of this.libreoption) {

            if (libreoptions.taux == 5.5) {
                total += (libreoptions.prix_devis * libreoptions.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (libreoptions.pourcentage / 100) * (libreoptions.taux / 100);
            }

        }
        return total;
    }

    SumTvaC() {
        return this.TVAC() + this.TVACO() + this.TVATCOt() + this.TVATCt();
    }

    TVADXO() {
        let total = 0;

        for (let libres of this.libre) {

            if (libres.taux == 2.1) {
                total += ( libres.prix_devis * libres.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (libres.pourcentage / 100) * (libres.taux / 100);

            }
        }
        return total;
    }

    TVADX() {
        let total = 0;

        for (let details of this.detail) {

            if (details.taux == 2.1) {
                total += (details.prix_devis * details.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (details.pourcentage / 100) * (details.taux / 100);
            }

        }
        return total;
    }

    TVATDXt() {
        let total = 0;

        for (let options of this.option) {

            if (options.taux == 2.1) {
                total += (options.prix_devis * options.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (options.pourcentage / 100) * (options.taux / 100);
            }

        }
        return total;
    }

    TVATDXOt() {
        let total = 0;

        for (let libreoptions of this.libreoption) {

            if (libreoptions.taux == 2.1) {
                total += (libreoptions.prix_devis * libreoptions.qte_devis * (this.version.remise ? (1 - (this.version.remise / 100)) : 1) ) * (libreoptions.pourcentage / 100) * (libreoptions.taux / 100);
            }

        }
        return total;
    }

    SumTvaDX() {
        return this.TVADX() + this.TVADXO() + this.TVATDXOt() + this.TVATDXt();
    }

    TVAZO() {
        let total = 0;

        for (let libres of this.libre) {

            if (libres.taux == 0) {
                total +=0;

            }
        }
        return total;
    }

    TVAZ() {
        let total = 0;

        for (let details of this.detail) {

            if (details.taux == 0) {
                total += 0;
            }

        }
        return total;
    }

    TVATZt() {
        let total = 0;

        for (let options of this.option) {

            if (options.taux == 0) {
                total += 0;
            }

        }
        return total;
    }

    TVATZOt() {
        let total = 0;

        for (let libreoptions of this.libreoption) {

            if (libreoptions.taux == 0) {
                total += 0;
            }

        }
        return total;
    }

    SumTvaZ() {
        return this.TVAZ() + this.TVAZO() - this.TVATZOt() - this.TVATZt();
    }

}
