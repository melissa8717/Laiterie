import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { Product } from '../_models/index';
import {Histo} from "../_models/histo";
import {Mainoeuvre} from "../_models/products/mainoeuvre";

@Injectable()
export class AchatsService {
    constructor(private http: Http, private config: AppConfig) { }

    getAll() {
        return this.http.get(this.config.apiUrl + '/products', this.jwt()).map((response: Response) => response.json());
    }

    getAllProduitsAchat() {
        return this.http.get(this.config.apiUrl + '/products/achat/all', this.jwt()).map((response: Response) => response.json());
    }

    getById(_id: string, num_version: string) {
        return this.http.get(this.config.apiUrl + '/products/' + _id + '/' + num_version, this.jwt()).map((response: Response) => response.json());
    }

    add(product: Product) {
        return this.http.post(this.config.apiUrl + '/products/new', product, this.jwt()).map((response: Response) => response.json());
    }

    update(product: Product) {
        //console.log("update service client");
        return this.http.put(this.config.apiUrl + '/products/' + product.id_produit, product, this.jwt());
    }

    updateModif(histo: Histo) {
        //console.log("update modif service client");
        return this.http.post(this.config.apiUrl + '/products/modifs', histo, this.jwt());
    }

    delete(_id: string) {
        return this.http.delete(this.config.apiUrl + '/products/' + _id, this.jwt());
    }

    getAllMainOeuvre() {
        console.log("achat service main oeuvre");
        return this.http.get(this.config.apiUrl + '/products/mainoeuvre/all', this.jwt()).map((response: Response) => response.json());
    }

    createMainOeuvre(mo: Mainoeuvre) {
        return this.http.post(this.config.apiUrl + '/products/mainoeuvre/new', mo, this.jwt()).map((response: Response) => response.json());
    }

    updateMainOeuvre(mo: Mainoeuvre){
        console.log("/products/mainoeuvre/" + mo.id_produit);
        return this.http.put(this.config.apiUrl + '/products/mainoeuvre/' + mo.id_produit, mo, this.jwt());
    }

    getAllTva() {
        return this.http.get(this.config.apiUrl + '/products/tvas/alltvas', this.jwt()).map((response: Response) => response.json());
    }

    getAllCategories() {
        return this.http.get(this.config.apiUrl + '/products/cat/all', this.jwt()).map((response: Response) => response.json());
    }

    getAllUnite() {
        return this.http.get(this.config.apiUrl + '/products/unite', this.jwt()).map((response: Response) => response.json());
    }

    getAllFournisseur() {
        console.log("get four client service");
        return this.http.get(this.config.apiUrl + '/products/fournisseurs/all', this.jwt()).map((response: Response) => response.json());
    }

    getAllHisto(_id: string) {
        console.log("getting histo");
        return this.http.get(this.config.apiUrl + '/products/histo/' + _id, this.jwt()).map((response: Response) => response.json());
    }

    getAllProdComp() {
        return this.http.get(this.config.apiUrl + '/products/composes/prdc', this.jwt()).map((response: Response) => response.json());
    }
    getAllStock() {
        console.log(this.config.apiUrl + '/products/stock')
        return this.http.get(this.config.apiUrl + '/products/stock', this.jwt()).map((response: Response) => response.json());
    }
    getStockclick(id_produit:number,stock:number) {
        //console.log(this.config.apiUrl + '/products/stock/'+id_produit+"/"+stock)
        return this.http.put(this.config.apiUrl + '/products/stock/'+id_produit+"/"+stock, this.jwt());
    }

    addMat(matParam:any) {
        console.log(this.config.apiUrl + '/products/mat')
        return this.http.post(this.config.apiUrl + '/products/mat',matParam, this.jwt());
    }

    getAllVehimat() {
        //console.log(this.config.apiUrl + '/products/vehi')
        return this.http.get(this.config.apiUrl + '/products/vehi', this.jwt()).map((response: Response) => response.json());
    }

    getByIdIdvehmat(id_vehmat:number) {
        return this.http.get(this.config.apiUrl + '/products/suivimateriel/' + id_vehmat, this.jwt()).map((response: Response) => response.json());
    }
    getByIdmat(id_vehmat:number) {
        return this.http.get(this.config.apiUrl + '/products/suivivehicule/' + id_vehmat, this.jwt()).map((response: Response) => response.json());
    }
    updatevehmat(vehmat:any){
        //console.log("/products/suivivehicule/" + vehmat.id_vehmat);
        return this.http.put(this.config.apiUrl + '/products/suivivehicule/' +vehmat.id_vehmat,vehmat, this.jwt());
    }
    deletemat(id_vehmat:number) {
        //console.log(this.config.apiUrl + '/products/' + id_vehmat);
        return this.http.delete(this.config.apiUrl + '/products/vehimat/' + id_vehmat, this.jwt());
    }
    getByIdEntretien(id_vehmat:number) {
    return this.http.get(this.config.apiUrl + '/products/suivimateriel/entretien/' + id_vehmat, this.jwt()).map((response: Response) => response.json());
    }
    getByIdEntretien1(id_vehmat:number) {
        //console.log("/products/suivivehicule/entre/" + id_vehmat)
        return this.http.get(this.config.apiUrl + '/products/suivivehicule/entre/' + id_vehmat, this.jwt()).map((response: Response) => response.json());
    }

    getAllRef(reference:string) {
        //console.log(this.config.apiUrl + '/products/reference/'+ reference)
        return this.http.get(this.config.apiUrl + '/products/reference/'+ reference, this.jwt()).map((response: Response) => response.json());
    }

    addEntretien(id_vehmat:any,EParam:any) {
        //console.log(this.config.apiUrl + '/products/entretien/'+id_vehmat)
        return this.http.post(this.config.apiUrl + '/products/entretien/'+id_vehmat,EParam, this.jwt());
    }
    deleteEntre(id_entretien:number) {
        console.log(this.config.apiUrl + '/products/' + id_entretien);
        return this.http.delete(this.config.apiUrl + '/products/entre/' + id_entretien, this.jwt());
    }



    /***************************************************GED*********************************************************************************/
    getGed(id: number) {
        console.log('GEDservice1'+this.config.apiUrl + '/ged/produits/'+id)
        return this.http.get(this.config.apiUrl + '/ged/produits/'+id, this.jwt()).map((response: Response) => response.json());
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

    getAllImg() {
        console.log("get"+this.config.apiUrl + '/products/img')
        return this.http.get(this.config.apiUrl + '/products/img/', this.jwt()).map((response: Response) => response.json());
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


