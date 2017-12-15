/**
 * Created by Wbat on 17/07/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';


@Injectable()
export class ParamsService {
    constructor(private http: Http, private config: AppConfig) {
    }

    getfooter() {
        return this.http.get(this.config.apiUrl + '/params/footer', this.jwt()).map((response: Response) => response.json());
    }

    /*-------------------------------------------------agence---------------------------------------------------------------*/
    getGed(id_param_ged: number) {
        return this.http.get(this.config.apiUrl + '/ged/param/+id_param_ged', this.jwt()).map((response: Response) => response.json());
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


    addagence(params: any) {
        return this.http.post(this.config.apiUrl + '/params/dagen', params, this.jwt()).map((response: Response) => response.json());
    }

    getAllAgence() {
        //console.log(this.config.apiUrl + '/products/agence')
        return this.http.get(this.config.apiUrl + '/params/agence', this.jwt()).map((response: Response) => response.json());
    }



    getAllFili() {
        //console.log(this.config.apiUrl + '/products/agence')
        return this.http.get(this.config.apiUrl + '/params/agence', this.jwt()).map((response: Response) => response.json());
    }

    updateAgence(a_params: any) {
        //console.log (  this.config.apiUrl + '/params/agence')
        return this.http.put(this.config.apiUrl + '/params/modifyagence', a_params, this.jwt());
    }

    getAllTVA() {
        //console.log(this.config.apiUrl + '/products/agence')
        return this.http.get(this.config.apiUrl + '/params/tva', this.jwt()).map((response: Response) => response.json());
    }

    updateTva(a_params: any) {
        //console.log (  this.config.apiUrl + '/params/agence')
        return this.http.put(this.config.apiUrl + '/params/modtva', a_params, this.jwt());
    }

    getAllCat() {
        //console.log(this.config.apiUrl + '/products/cat')
        return this.http.get(this.config.apiUrl + '/params/cat', this.jwt()).map((response: Response) => response.json());
    }

    updateCat(a_params: any) {
        //console.log (  this.config.apiUrl + '/params/up')
        return this.http.put(this.config.apiUrl + '/params/up', a_params, this.jwt());
    }

    addCat(params: any) {
        //console.log (  this.config.apiUrl + '/params/agen')
        return this.http.post(this.config.apiUrl + '/params/addcat', params, this.jwt()).map((response: Response) => response.json());
    }

    getAllUnite() {
        //console.log(this.config.apiUrl + '/products/cat')
        return this.http.get(this.config.apiUrl + '/params/unite', this.jwt()).map((response: Response) => response.json());
    }

    updateUnite(a_params: any) {
        //console.log (  this.config.apiUrl + '/params/up')
        return this.http.put(this.config.apiUrl + '/params/upunite', a_params, this.jwt());
    }

    addUnite(params: any) {
        //console.log (  this.config.apiUrl + '/params/agen')
        return this.http.post(this.config.apiUrl + '/params/addunite', params, this.jwt()).map((response: Response) => response.json());
    }

    getAllVente() {
        //console.log(this.config.apiUrl + '/products/cat')
        return this.http.get(this.config.apiUrl + '/params/condition', this.jwt()).map((response: Response) => response.json());
    }

    updateVente(a_params: any) {
        //console.log (  this.config.apiUrl + '/params/up')
        return this.http.put(this.config.apiUrl + '/params/addcondition', a_params, this.jwt());
    }

    addVente(params: any) {
        return this.http.post(this.config.apiUrl + '/params/addVente', params, this.jwt()).map((response: Response) => response.json());
    }

    addfraisprev(params: any) {
        console.log(this.config.apiUrl + '/params/addfrais')
        return this.http.post(this.config.apiUrl + '/params/addfrais', params, this.jwt()).map((response: Response) => response.json());
    }

    getAllFrais() {
        //console.log(this.config.apiUrl + '/products/cat')
        return this.http.get(this.config.apiUrl + '/params/frais', this.jwt()).map((response: Response) => response.json());
    }

    addLicence( licenceParam: any) {
        //console.log(this.config.apiUrl + '/params/licence/'+id_licence)
        return this.http.post(this.config.apiUrl + '/params/licence/', licenceParam, this.jwt());
    }

    getAllHome() {
        //console.log(this.config.apiUrl + '/products/cat')
        return this.http.get(this.config.apiUrl + '/params/home', this.jwt()).map((response: Response) => response.json());
    }

    getByIduser(id: number) {
        console.log(this.config.apiUrl + '/params/util/'+id);
        return this.http.get(this.config.apiUrl + '/params/util/'+id, this.jwt()).map((response: Response) => response.json());
    }

    getByIdDroit(_id: number) {
    return this.http.get(this.config.apiUrl + '/params/droit/'+ _id, this.jwt()).map((response: Response) => response.json());
    }

    deleteuser(id:number) {
        console.log(this.config.apiUrl + '/params/supp/' + id);
        return this.http.delete(this.config.apiUrl + '/params/supp/' + id, this.jwt());
    }
    updateuser(user_params: any) {
        //console.log (  this.config.apiUrl + '/params/agence')
        return this.http.put(this.config.apiUrl + '/params/upuser', user_params, this.jwt());
    }

    addFormation(params: any) {
        //console.log (  this.config.apiUrl + '/params/agen')
        return this.http.post(this.config.apiUrl + '/params/formation', params, this.jwt()).map((response: Response) => response.json());
    }
    getAllFormation() {
        //console.log(this.config.apiUrl + '/products/cat')
        return this.http.get(this.config.apiUrl + '/params/retfor', this.jwt()).map((response: Response) => response.json());
    }

    getAlarmeformation() {

        return this.http.get(this.config.apiUrl + '/params/alarmform', this.jwt()).map((response: Response) => response.json());
    }

    getAlarmecaces() {
        //console.log(this.config.apiUrl + '/products/cat')
        return this.http.get(this.config.apiUrl + '/params/alarcaces', this.jwt()).map((response: Response) => response.json());
    }

    getCompte() {
        return this.http.get(this.config.apiUrl + '/params/compte', this.jwt()).map((response: Response) => response.json());
    }

    getComlic() {
        return this.http.get(this.config.apiUrl + '/params/comlic', this.jwt()).map((response: Response) => response.json());
    }

    updateTest(ag_params: any) {
        return this.http.put(this.config.apiUrl + '/params/test', ag_params, this.jwt());
    }

    getVisitemedicale() {
        return this.http.get(this.config.apiUrl + '/params/visitemedicale', this.jwt()).map((response: Response) => response.json());
    }


    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({'Authorization': 'Bearer ' + currentUser.token});
            return new RequestOptions({headers: headers});
        }
    }
}