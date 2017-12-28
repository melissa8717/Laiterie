/**
 * Created by Alexandre on 08/06/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { Chantier } from '../_models/index';

@Injectable()
export class ChantierService {
    constructor(private http: Http, private config: AppConfig) { }

    getAll() {
        return this.http.get(this.config.apiUrl + '/chantier', this.jwt()).map((response: Response) => response.json());
    }

    getChantier() {
        return this.http.get(this.config.apiUrl + '/chantier/', this.jwt()).map((response: Response) => response.json());
    }

    add(chantier: Chantier) {
        return this.http.post(this.config.apiUrl + '/chantier/add', Chantier, this.jwt ());
    }

    addChantier(id_devis:number,num_version:number,chantierParam: any) {
        return this.http.post(this.config.apiUrl + '/chantier/ajout/'+id_devis+'/'+num_version, chantierParam, this.jwt());
    }

    getAllChantier() {
        console.log(this.config.apiUrl + '/chantier/');
        return this.http.get(this.config.apiUrl + '/chantier/', this.jwt()).map((response: Response) => response.json());
    }

    getByIdAllInfos(_id: number) {
        return this.http.get(this.config.apiUrl + '/chantier/allinfos/' + _id, this.jwt()).map((response: Response) => response.json());
    }

    update(chantierInfos: {} , id_chantier: number) {
        return this.http.put(this.config.apiUrl + '/chantier/' + id_chantier, chantierInfos, this.jwt());
    }

    delete(_id: number) {
        return this.http.delete(this.config.apiUrl + '/chantier/' + _id, this.jwt());
    }

    deletechantier(_id: number) {
        return this.http.delete(this.config.apiUrl + '/chantier/' + _id, this.jwt());
    }

    download(id: number){
        return this.config.apiUrl + '/chantier/fiche/'+id+'/download';
    }

    getByIdNom(id_chantier:number) {
        //console.log(this.config.apiUrl + '/chantier/nom/')
        return this.http.get(this.config.apiUrl + '/chantier/nom/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }

    getByIdTout(id_chantier:number) {
        //console.log(this.config.apiUrl + '/chantier/fichechantier/')
        return this.http.get(this.config.apiUrl + '/chantier/fichechantier/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }
    updateFiche(chantier:any){
        return this.http.put(this.config.apiUrl + '/chantier/up' ,chantier, this.jwt());
    }

    getByIdPhase(id_chantier:number) {
        return this.http.get(this.config.apiUrl + '/chantier/phase/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }
    deletePhase(id_phase:number) {
       // console.log(this.config.apiUrl + '/chantier/' + id_phase);
        return this.http.delete(this.config.apiUrl + '/chantier/dphase/' + id_phase, this.jwt());
    }
    addPhase(id_chantier:any,EParam:any) {
        //console.log(this.config.apiUrl + '/chantier/addphase/'+id_chantier)
        return this.http.post(this.config.apiUrl + '/chantier/adphase/'+id_chantier,EParam, this.jwt());
    }

    getByIdRapport(id_chantier:number) {
        return this.http.get(this.config.apiUrl + '/chantier/rapport/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }
    addRapport(id_chantier:any,EParam:any) {
        //console.log(this.config.apiUrl + '/chantier/adrap/'+id_chantier)
        return this.http.post(this.config.apiUrl + '/chantier/adrap/'+id_chantier,EParam, this.jwt());
    }
    deleteRapport(id_rapport:number) {
        //console.log(this.config.apiUrl + '/chantier/drapport/' + id_rapport);
        return this.http.delete(this.config.apiUrl + '/chantier/drapport/' + id_rapport, this.jwt());
    }


    getByIdCdevis(id_devis:number,num_version:number) {
        return this.http.get(this.config.apiUrl + '/chantier/ajout/' + id_devis+'/'+num_version, this.jwt()).map((response: Response) => response.json());
    }

    createChantier(chantier: any) {
        //console.log(chantier);
        return this.http.post(this.config.apiUrl + '/chantier/new', chantier, this.jwt());
    }

    getByIdDevis(id_chantier:number) {
        return this.http.get(this.config.apiUrl + '/chantier/devisproduit/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }

    getByIdDevisoption(id_chantier:number) {
        return this.http.get(this.config.apiUrl + '/chantier/devisoption/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }

    getAllMois(month:number, year:number) {
        //console.log(this.config.apiUrl + '/chantier/');
        return this.http.get(this.config.apiUrl + '/chantier/mois/'+month+"/"+year, this.jwt()).map((response: Response) => response.json());
    }

    getAllCmois() {
        return this.http.get(this.config.apiUrl + '/chantier/cmois', this.jwt()).map((response: Response) => response.json());
    }

    getByIdDevischantier(id_chantier:number) {
        return this.http.get(this.config.apiUrl + '/chantier/devischantier/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }

    updateDevischantier(chantier:any){
        console.log('test')
        return this.http.put(this.config.apiUrl + '/chantier/chantierdevis' ,chantier, this.jwt());
    }
    getByIdPrev(id_chantier:number) {
        return this.http.get(this.config.apiUrl + '/chantier/prevision/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }
    getByIdPrevopt(id_chantier:number) {
        return this.http.get(this.config.apiUrl + '/chantier/prevopt/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }

    getByIdAnalyse(id_chantier:number) {
        return this.http.get(this.config.apiUrl + '/chantier/analyse/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }

    getByIdAnalyseoption(id_chantier:number) {
        return this.http.get(this.config.apiUrl + '/chantier/optanalyse/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }
    getByIdReel(id_chantier:number) {
        return this.http.get(this.config.apiUrl + '/chantier/reel/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }

    getByIdReelibre(id_chantier:number) {
        return this.http.get(this.config.apiUrl + '/chantier/getByIdReelibre/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }

    getByIdDevislibre(id_chantier:number) {
        return this.http.get(this.config.apiUrl + '/chantier/libre/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }
    getByIdFacturechantier(id_chantier:number) {
        console.log(this.config.apiUrl + '/chantier/');
        return this.http.get(this.config.apiUrl + '/chantier/factures/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }

    getByIdfraispre(id_chantier:number) {
        return this.http.get(this.config.apiUrl + '/chantier/prevois/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }
    getByIdfraisreel(id_chantier:number) {
        return this.http.get(this.config.apiUrl + '/chantier/reelgeneraux/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }
    getByIdpourcentdevis(id_chantier:number) {
        return this.http.get(this.config.apiUrl + '/chantier/pourcentdevis/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }

    getByIdmainreel(id_chantier:number) {
        return this.http.get(this.config.apiUrl + '/chantier/mainreel/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }
    getByIdBalance(id_chantier:number) {
        return this.http.get(this.config.apiUrl + '/chantier/balance/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }

    getByIdAcco(id_chantier:number) {
        return this.http.get(this.config.apiUrl + '/chantier/accompte/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }
    getByIdTotalDevis(id_chantier:number) {
        return this.http.get(this.config.apiUrl + '/chantier/totaldevis/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }
/***************************************************GED*********************************************************************************/
    getGed(id_chantier: number) {
        return this.http.get(this.config.apiUrl + '/ged/chant/'+id_chantier, this.jwt()).map((response: Response) => response.json());
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

