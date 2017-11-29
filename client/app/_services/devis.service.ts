/**
 * Created by Alexandre on 20/06/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AppConfig } from '../app.config';

@Injectable()
export class DevisService {
    constructor(private http: Http, private config: AppConfig) { }

    getAll(month:number, year:number) {
        return this.http.get(this.config.apiUrl + '/devis/'+month+"/"+year, this.jwt()).map((response: Response) => response.json());
    }

    getAllDate() {
        return this.http.get(this.config.apiUrl + '/devis/', this.jwt()).map((response: Response) => response.json());
    }

    getAllProducts(_id: number) {
        return this.http.get(this.config.apiUrl + '/devis/products/' + _id, this.jwt()).map((response: Response) => response.json());
    }

    getById(_id: number, num_version: number) {
        return this.http.get(this.config.apiUrl + '/devis/id/' + _id + "/" + num_version, this.jwt()).map((response: Response) => response.json());
    }

    getByIdLibre(id_devis: number, num_version: number) {
        return this.http.get(this.config.apiUrl + '/devis/fichedevis/' + id_devis + "/" + num_version, this.jwt()).map((response: Response) => response.json());
    }

    getByIdLibreproduit(id_devis: number, num_version: number) {
        return this.http.get(this.config.apiUrl + '/devis/ffdevis/' + id_devis + "/" + num_version, this.jwt()).map((response: Response) => response.json());
    }

    getByIdLibreproduitopt(id_devis: number, num_version: number) {
        return this.http.get(this.config.apiUrl + '/devis/getByIdLibreproduitopt/' + id_devis + "/" + num_version, this.jwt()).map((response: Response) => response.json());
    }

    add(devis: any) {
        console.log(devis);
        return this.http.post(this.config.apiUrl + '/devis/add', devis, this.jwt());
    }

    addLibre(devis: any) {
        console.log(devis);
        return this.http.post(this.config.apiUrl + '/devis/addLibre', devis, this.jwt());
    }

    sendEnvoye(id_devis: any, num_version: any){
        return this.http.put(this.config.apiUrl + '/devis/envoye/'+id_devis+"/"+num_version , this.jwt());
    }

    validate(devis: any){
        return this.http.put(this.config.apiUrl + '/devis/validate', devis, this.jwt());
    }

    duplicate(devis:  any, id: number){
        return this.http.post(this.config.apiUrl + '/devis/duplicate/' + id, devis, this.jwt());
    }

    acceptOffer(devis:  any){
        return this.http.put(this.config.apiUrl + '/devis/acceptoffer' , devis, this.jwt());
    }

    offerlibre(devis:  any){
        console.log(devis);
        return this.http.put(this.config.apiUrl + '/devis/offer' , devis, this.jwt());
    }

    modify(devis:  any, id: number, num_version : number){
        return this.http.put(this.config.apiUrl + '/devis/modify/' + id + '/' + num_version, devis, this.jwt());
    }

    modifylibre(devis:  any, id_devis: number, num_version : number){
        return this.http.put(this.config.apiUrl + '/devis/modifylibre/' + id_devis + '/' + num_version, devis, this.jwt());
    }

    update(devis: {id_bdc: number}) {
        return this.http.put(this.config.apiUrl + '/devis/' + devis.id_bdc, devis, this.jwt());
    }

    delete(_id: string) {
        return this.http.delete(this.config.apiUrl + '/devis/' + _id, this.jwt());
    }

    getAllTVA() {
        return this.http.get(this.config.apiUrl + '/devis/tva', this.jwt()).map((response: Response) => response.json());
    }
    getByIdAnalyse(id_devis:number,num_version:number) {
       // console.log(this.config.apiUrl + '/devis/analyse/' + id_devis+'/'+num_version);
        return this.http.get(this.config.apiUrl + '/devis/analyse/' + id_devis+'/'+num_version, this.jwt()).map((response: Response) => response.json());
    }
    getByIdAnalyseopt(id_devis:number,num_version:number) {
        console.log(this.config.apiUrl + '/devis/option/' + id_devis+'/'+num_version);
        return this.http.get(this.config.apiUrl + '/devis/option/' + id_devis+'/'+num_version, this.jwt()).map((response: Response) => response.json());
    }
    updateDevisdetail(devisparams:any){
        console.log(this.config.apiUrl + '/devis/detail')
        return this.http.put(this.config.apiUrl + '/devis/detail' ,devisparams, this.jwt());
    }
    updateDevisoption(devisparams:any){
        console.log(this.config.apiUrl + '/devis/opdet')
        return this.http.put(this.config.apiUrl + '/devis/opdet' ,devisparams, this.jwt());
    }
    getByIdAnaldevis(id_devis:number,num_version:number) {
        // console.log(this.config.apiUrl + '/devis/analyse/' + id_devis+'/'+num_version);
        return this.http.get(this.config.apiUrl + '/devis/anldevis/' + id_devis+'/'+num_version, this.jwt()).map((response: Response) => response.json());
    }

    getByIddupliquer(id_devis: number, num_version: number) {
        return this.http.get(this.config.apiUrl + '/devis/duplibre/' + id_devis + "/" + num_version, this.jwt()).map((response: Response) => response.json());
    }
    duplicatelibre(devis:  any, id_devis: number){
        return this.http.post(this.config.apiUrl + '/devis/libreduplicate/' + id_devis, devis, this.jwt());
    }


    /***************************************************GED*********************************************************************************/
    getGed(id_devis: number) {
        return this.http.get(this.config.apiUrl + '/ged/dev/'+id_devis, this.jwt()).map((response: Response) => response.json());
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

    getLogo() {
        return this.http.get(this.config.apiUrl + '/log/', this.jwt()).map((response: Response) => response.json());
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

