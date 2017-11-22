/**
 * Created by cédric on 10/07/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';

@Injectable()
export class FactureService {
    constructor(private http: Http, private config: AppConfig) { }


    getAllFacture() {
        console.log(this.config.apiUrl + '/facture')
        return this.http.get(this.config.apiUrl + '/facture/listefacture', this.jwt()).map((response: Response) => response.json());
    }
    getAllFooter() {
        //console.log(this.config.apiUrl + '/facture')
        return this.http.get(this.config.apiUrl + '/facture/modifierfacture', this.jwt()).map((response: Response) => response.json());
    }

    getAllnfact() {
        //console.log(this.config.apiUrl + '/facture')
        return this.http.get(this.config.apiUrl + '/facture/nfact', this.jwt()).map((response: Response) => response.json());
    }

    getByIdFacture(id_devis:number) {
        //console.log(this.config.apiUrl + '/facture')
        return this.http.get(this.config.apiUrl + '/facture/editer_facture/' + id_devis, this.jwt()).map((response: Response) => response.json());
    }
    getByIdRetenu(id_devis:number) {
        //console.log(this.config.apiUrl + '/facture')
        return this.http.get(this.config.apiUrl + '/facture/retenu/' + id_devis, this.jwt()).map((response: Response) => response.json());
    }

    getByIdVersion(id_devis:number,num_version:number) {
        console.log(this.config.apiUrl + '/facture')
        return this.http.get(this.config.apiUrl + '/facture/version/' + id_devis + "/"+ num_version, this.jwt()).map((response: Response) => response.json());
    }
    getByIdDetail(id_devis:number,num_version:number) {
        console.log(this.config.apiUrl + '/facture')
        return this.http.get(this.config.apiUrl + '/facture/detail/' + id_devis + "/"+ num_version, this.jwt()).map((response: Response) => response.json());
    }
    getByIdOption(id_devis:number,num_version:number) {
        console.log(this.config.apiUrl + '/facture')
        return this.http.get(this.config.apiUrl + '/facture/option/' + id_devis + "/"+ num_version, this.jwt()).map((response: Response) => response.json());
    }
    getByIdTotalfact(id_devis:number,num_version:number) {
        console.log(this.config.apiUrl + '/facture')
        return this.http.get(this.config.apiUrl + '/facture/totalfacture/' + id_devis + "/"+ num_version, this.jwt()).map((response: Response) => response.json());
    }
    getByIdTotalopt(id_devis:number,num_version:number) {
        console.log(this.config.apiUrl + '/facture')
        return this.http.get(this.config.apiUrl + '/facture/totaloption/' + id_devis + "/"+ num_version, this.jwt()).map((response: Response) => response.json());
    }

    add(facture: any) {
        console.log(facture);
        return this.http.post(this.config.apiUrl + '/facture/add', facture, this.jwt());
    }

    /*-----------------modifier facture--------------------------*/

    getByIdModif(id_facture:number,n_situation:number) {
        //console.log(this.config.apiUrl + '/facture')
        return this.http.get(this.config.apiUrl + '/facture/modif/' + id_facture+"/"+ n_situation, this.jwt()).map((response: Response) => response.json());
    }

    getByIdSituation(id_facture:number,n_situation:number) {
        //console.log(this.config.apiUrl + '/facture/situation')
        return this.http.get(this.config.apiUrl + '/facture/situation/' + id_facture + "/"+ n_situation, this.jwt()).map((response: Response) => response.json());
    }

    getByIdTotalSit(id_facture:number,n_situation:number) {
        //console.log(this.config.apiUrl + '/facture/situation')
        return this.http.get(this.config.apiUrl + '/facture/totalsit/' + id_facture + "/"+ n_situation, this.jwt()).map((response: Response) => response.json());
    }

    getByIdValeur(id_facture:number) {
        //console.log(this.config.apiUrl + '/facture')
        return this.http.get(this.config.apiUrl + '/facture/valeur/' + id_facture, this.jwt()).map((response: Response) => response.json());
    }

    getByIdSitoption(id_facture:number,n_situation:number) {
        //console.log(this.config.apiUrl + '/facture/situation')
        return this.http.get(this.config.apiUrl + '/facture/sitopt/' + id_facture + "/"+ n_situation, this.jwt()).map((response: Response) => response.json());
    }

    createSituation(facture:  any, id_facture:number){
        return this.http.post(this.config.apiUrl + '/facture/new/' + id_facture, facture, this.jwt());
    }

    getByIdOptSit(id_facture:number,n_situation:number) {
        //console.log(this.config.apiUrl + '/facture')
        return this.http.get(this.config.apiUrl + '/facture/siteuption/' + id_facture + "/"+ n_situation, this.jwt()).map((response: Response) => response.json());
    }

    getByIdListeFacture(id_chantier:number) {
        //console.log(this.config.apiUrl + '/facture')
        return this.http.get(this.config.apiUrl + '/facture/listechantierfact/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }
    getByIdNom(id_chantier:number) {
        //console.log(this.config.apiUrl + '/chantier/nom/')
        return this.http.get(this.config.apiUrl + '/facture/nom/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }
    getAllFournisseur() {
    //console.log(this.config.apiUrl + '/facture')
    return this.http.get(this.config.apiUrl + '/facture/fournisseur', this.jwt()).map((response: Response) => response.json());
    }
    getAllBdcdetail() {
        //console.log(this.config.apiUrl + '/facture')
        return this.http.get(this.config.apiUrl + '/facture/bdcdetail', this.jwt()).map((response: Response) => response.json());
    }
    createfacturefournisseur(facture: any) {
        return this.http.post(this.config.apiUrl + '/facture/addbdc/', facture, this.jwt());
    }

    getAllMois(month:number, year:number) {
        //console.log(this.config.apiUrl + '/chantier/');
        return this.http.get(this.config.apiUrl + '/facture/mois/'+month+"/"+year, this.jwt()).map((response: Response) => response.json());
    }
    getByIdFournisseur(id_factfour:number) {
        //console.log(this.config.apiUrl + '/chantier/lfournisseur/')
        return this.http.get(this.config.apiUrl + '/facture/lfournisseur/' + id_factfour, this.jwt()).map((response: Response) => response.json());
    }
    getByIdBDC(id_factfour:number) {
        //console.log(this.config.apiUrl + '/chantier/bdc/')
        return this.http.get(this.config.apiUrl + '/facture/bdc/' + id_factfour, this.jwt()).map((response: Response) => response.json());
    }

    updateBDC(facture:any){
        console.log('test')
        return this.http.put(this.config.apiUrl + '/facture/modifbdc' ,facture, this.jwt());
    }
    getALLFraiscategorie() {
        //console.log(this.config.apiUrl + '/facture')
        return this.http.get(this.config.apiUrl + '/facture/categoriefrais', this.jwt()).map((response: Response) => response.json());
    }
    addfrais(facture: any) {
        console.log(facture);
        return this.http.post(this.config.apiUrl + '/facture/addfrais', facture, this.jwt());
    }
    getAllFraismois(month:number, year:number) {
        //console.log(this.config.apiUrl + '/chantier/');
        return this.http.get(this.config.apiUrl + '/facture/fraismois/'+month+"/"+year, this.jwt()).map((response: Response) => response.json());
    }
    updateFraismois(facture:any){
        //console.log('test')
        return this.http.put(this.config.apiUrl + '/facture/ajoutfrais' ,facture, this.jwt());
    }

    getAllAnnee(year:number) {
        //console.log(this.config.apiUrl + '/facture/annee/'+year);
        return this.http.get(this.config.apiUrl + '/facture/annee/'+year, this.jwt()).map((response: Response) => response.json());
    }

    getAllPrev(month:number, year:number) {
        //console.log(this.config.apiUrl + '/facture/prev/'+month+"/"+year);
        return this.http.get(this.config.apiUrl + '/facture/prev/'+month+"/"+year, this.jwt()).map((response: Response) => response.json());
    }

    addprev(facture: any) {
        //console.log(facture);
        return this.http.post(this.config.apiUrl + '/facture/addprev', facture, this.jwt());
    }
    getAllYprev(year:number) {
        //console.log(this.config.apiUrl + '/facture/prev/'+year);
        return this.http.get(this.config.apiUrl + '/facture/yprev/'+year, this.jwt()).map((response: Response) => response.json());
    }

    deleteFrais(id_frais:number) {
        // console.log(this.config.apiUrl + '/chantier/' + id_phase);
        return this.http.delete(this.config.apiUrl + '/facture/delfrais/' + id_frais, this.jwt());
    }
//balance generale
    getAlltotalfact(year:number) {
        //console.log(this.config.apiUrl + '/facture/prev/'+year);
        return this.http.get(this.config.apiUrl + '/facture/totalfact/'+year, this.jwt()).map((response: Response) => response.json());
    }

    getAlltotaldevis(year:number) {
        //console.log(this.config.apiUrl + '/facture/totaldevis/'+year);
        return this.http.get(this.config.apiUrl + '/facture/totaldevis/'+year, this.jwt()).map((response: Response) => response.json());
    }
    getAlldevisachat(year:number) {
        //console.log(this.config.apiUrl + '/facture/totaldevis/'+year);
    return this.http.get(this.config.apiUrl + '/facture/devisachat/'+year, this.jwt()).map((response: Response) => response.json());
    }

    getAllOptionachat(year:number) {
       //console.log(this.config.apiUrl + '/facture/totaldevis/'+year);
        return this.http.get(this.config.apiUrl + '/facture/optionachat/'+year, this.jwt()).map((response: Response) => response.json());
    }
    getAllFraisan(year:number) {
       // console.log(this.config.apiUrl + '/facture/totaldevis/'+year);
        return this.http.get(this.config.apiUrl + '/facture/frainan/'+year, this.jwt()).map((response: Response) => response.json());
    }

    getAllMoan(year:number) {
       // console.log(this.config.apiUrl + '/facture/totaldevis/'+year);
        return this.http.get(this.config.apiUrl + '/facture/moan/'+year, this.jwt()).map((response: Response) => response.json());
    }
    getAllBdcreel(year:number) {
        //console.log(this.config.apiUrl + '/facture/totaldevis/'+year);
        return this.http.get(this.config.apiUrl + '/facture/bdcreel/'+year, this.jwt()).map((response: Response) => response.json());
    }
    getAllAnnefrais(year:number) {
        //console.log(this.config.apiUrl + '/facture/totaldevis/'+year);
        return this.http.get(this.config.apiUrl + '/facture/annnefrais/'+year, this.jwt()).map((response: Response) => response.json());
    }
    getAllFraispour() {
        console.log(this.config.apiUrl + '/facture')
        return this.http.get(this.config.apiUrl + '/facture/fraispour', this.jwt()).map((response: Response) => response.json());
    }
    getByIdPrimSit(id_facture:number,n_situation:number) {
        //console.log(this.config.apiUrl + '/facture/primsit')
        return this.http.get(this.config.apiUrl + '/facture/primsit/' + id_facture + "/"+ n_situation, this.jwt()).map((response: Response) => response.json());
    }
    getByIdPrimOpt(id_facture:number,n_situation:number) {
        //console.log(this.config.apiUrl + '/facture/primsit')
        return this.http.get(this.config.apiUrl + '/facture/primopt/' + id_facture + "/"+ n_situation, this.jwt()).map((response: Response) => response.json());
    }

    getByIdAccpt(id_facture:number,n_situation:number) {
        //console.log(this.config.apiUrl + '/facture/primsit')
        return this.http.get(this.config.apiUrl + '/facture/accompte/' + id_facture + "/"+ n_situation, this.jwt()).map((response: Response) => response.json());
    }

    getAllNavoir() {
        return this.http.get(this.config.apiUrl + '/facture/avoir', this.jwt()).map((response: Response) => response.json());
    }

    addavoir(avoirparams: any) {
        return this.http.post(this.config.apiUrl + '/facture/addavoir', avoirparams, this.jwt());
    }

    getAllListavoir() {
        return this.http.get(this.config.apiUrl + '/facture/listavoir', this.jwt()).map((response: Response) => response.json());
    }

    getByIdAvoir(id_avoir:number) {
        return this.http.get(this.config.apiUrl + '/facture/impravoir/' + id_avoir, this.jwt()).map((response: Response) => response.json());
    }

    getByIdPeodavoir(id_avoir:number) {
        return this.http.get(this.config.apiUrl + '/facture/avoiprim/' + id_avoir, this.jwt()).map((response: Response) => response.json());
    }

    getByIdPeodavlibre(id_avoir:number) {
        return this.http.get(this.config.apiUrl + '/facture/avlibreiprim/' + id_avoir, this.jwt()).map((response: Response) => response.json());
    }

    addacompte(facture: any) {
        return this.http.post(this.config.apiUrl + '/facture/acote', facture, this.jwt());
    }

    getByIdAcopmte(id_facture:number,n_situation:number) {
        return this.http.get(this.config.apiUrl + '/facture/acolist/' + id_facture+"/"+ n_situation, this.jwt()).map((response: Response) => response.json());
    }

    Flibre(factureparams: any) {
        return this.http.post(this.config.apiUrl + '/facture/libreadd', factureparams, this.jwt());
    }

    getByIdLibreModif(id_facture:number,n_situation:number) {
        return this.http.get(this.config.apiUrl + '/facture/libmodif/' + id_facture + "/"+ n_situation, this.jwt()).map((response: Response) => response.json());
    }

    getByIdLibrebase(id_facture:number,n_situation:number) {
        return this.http.get(this.config.apiUrl + '/facture/Librebase/' + id_facture + "/"+ n_situation, this.jwt()).map((response: Response) => response.json());
    }

    getByIdLibredetail(id_facture:number,n_situation:number) {
        return this.http.get(this.config.apiUrl + '/facture/Libredetail/' + id_facture + "/"+ n_situation, this.jwt()).map((response: Response) => response.json());
    }

    getByIdLibresum(id_facture:number) {
        return this.http.get(this.config.apiUrl + '/facture/sumlibre/' + id_facture , this.jwt()).map((response: Response) => response.json());
    }

    createSituationlibre(facture:  any, id_facture:number){
        return this.http.post(this.config.apiUrl + '/facture/createlibre/' + id_facture, facture, this.jwt());
    }

    getByIdLibresumimprim(id_facture:number,n_situation:number) {
        return this.http.get(this.config.apiUrl + '/facture/imprimsitlibre/' + id_facture + "/"+ n_situation, this.jwt()).map((response: Response) => response.json());
    }

    getByIdLibrebaseimprim(id_facture:number,n_situation:number) {
        return this.http.get(this.config.apiUrl + '/facture/Libreimpribase/' + id_facture + "/"+ n_situation, this.jwt()).map((response: Response) => response.json());
    }

    getByIdLibredetailimprim(id_facture:number,n_situation:number) {
        return this.http.get(this.config.apiUrl + '/facture/Libredetimprim/' + id_facture + "/"+ n_situation, this.jwt()).map((response: Response) => response.json());
    }

    getByIdAvoirlibre(id_facture:number,n_situation:number) {
        return this.http.get(this.config.apiUrl + '/facture/Libreavoir/' + id_facture + "/"+ n_situation, this.jwt()).map((response: Response) => response.json());
    }
    addavoirlibre(facture: any) {
        return this.http.post(this.config.apiUrl + '/facture/adavoirlibre', facture, this.jwt());
    }




    /***************************************************GED*********************************************************************************/
    getGed(id_gedfac:number) {
        return this.http.get(this.config.apiUrl + '/ged/fac/+id_gedfac', this.jwt()).map((response: Response) => response.json());
    }

    upload( url : string, file: File) {
        return new Promise((resolve, reject) => {
            if (file === undefined)
                resolve();
            var xhr = new XMLHttpRequest();
            var fd = new FormData();

            //fd.append("url", filename);
            console.log(file);
            fd.append("file", file);

            /* event listeners */
            xhr.addEventListener("error", uploadFailed, false);
            xhr.addEventListener("load", uploadComplete, false);
            xhr.addEventListener("abort", uploadFailed, false);

            function uploadComplete(){
                resolve();
            }

            function uploadFailed(){
                console.log("Upload failed or canceled");
                reject();
            }

            xhr.open("POST", this.config.apiUrl + url);
            xhr.send(fd);
        });
    }



    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }

}