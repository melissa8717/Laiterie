import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';

import {AppConfig} from '../app.config';
import {Product} from '../_models/index';
import {Histo} from "../_models/histo";
import {Mainoeuvre} from "../_models/products/mainoeuvre";

@Injectable()
export class AchatsService {
    constructor(private http: Http, private config: AppConfig) {
    }

    getAll() {
        return this.http.get(this.config.apiUrl + '/products', this.jwt()).map((response: Response) => response.json());
    }

    getAllProduitsAchat() {
        return this.http.get(this.config.apiUrl + '/products/achat/all', this.jwt()).map((response: Response) => response.json());
    }

    getById(_id: number, num_version: string) {
        return this.http.get(this.config.apiUrl + '/products/' + _id + '/' + num_version, this.jwt()).map((response: Response) => response.json());
    }

    add(product: Product) {
        return this.http.post(this.config.apiUrl + '/products/new', product, this.jwt()).map((response: Response) => response.json());
    }

    update(product: Product) {
        return this.http.put(this.config.apiUrl + '/products/' + product.id_produit, product, this.jwt());
    }

    updateModif(histo: Histo) {
        return this.http.post(this.config.apiUrl + '/products/modifs', histo, this.jwt());
    }

    delete(_id: string) {
        return this.http.delete(this.config.apiUrl + '/products/' + _id, this.jwt());
    }

    getAllMainOeuvre() {
        return this.http.get(this.config.apiUrl + '/products/mainoeuvre/all', this.jwt()).map((response: Response) => response.json());
    }

    createMainOeuvre(mo: Mainoeuvre) {
        return this.http.post(this.config.apiUrl + '/products/mainoeuvre/new', mo, this.jwt()).map((response: Response) => response.json());
    }

    updateMainOeuvre(mo: Mainoeuvre) {
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
        return this.http.get(this.config.apiUrl + '/products/fournisseurs/all', this.jwt()).map((response: Response) => response.json());
    }

    getAllHisto(_id: number) {
        return this.http.get(this.config.apiUrl + '/products/histo/' + _id, this.jwt()).map((response: Response) => response.json());
    }

    getAllProdComp() {
        return this.http.get(this.config.apiUrl + '/products/composes/prdc', this.jwt()).map((response: Response) => response.json());
    }

    getAllStock() {
        return this.http.get(this.config.apiUrl + '/products/stock', this.jwt()).map((response: Response) => response.json());
    }

    getStockclick(id_produit: number, stock: number) {
        return this.http.put(this.config.apiUrl + '/products/stock/' + id_produit + "/" + stock, this.jwt());
    }

    addMat(matParam: any) {
        return this.http.post(this.config.apiUrl + '/products/mat', matParam, this.jwt());
    }

    getAllVehimat() {
        return this.http.get(this.config.apiUrl + '/products/vehi', this.jwt()).map((response: Response) => response.json());
    }

    getByIdIdvehmat(id_vehmat: number) {
        return this.http.get(this.config.apiUrl + '/products/suivimateriel/' + id_vehmat, this.jwt()).map((response: Response) => response.json());
    }

    getByIdmat(id_vehmat: number) {
        return this.http.get(this.config.apiUrl + '/products/suivivehicule/' + id_vehmat, this.jwt()).map((response: Response) => response.json());
    }

    updatevehmat(vehmat: any) {
        return this.http.put(this.config.apiUrl + '/products/suivivehicule/' + vehmat.id_vehmat, vehmat, this.jwt());
    }

    deletemat(id_vehmat: number) {
        return this.http.delete(this.config.apiUrl + '/products/vehimat/' + id_vehmat, this.jwt());
    }

    getByIdEntretien(id_vehmat: number) {
        return this.http.get(this.config.apiUrl + '/products/suivimateriel/entretien/' + id_vehmat, this.jwt()).map((response: Response) => response.json());
    }

    getByIdEntretien1(id_vehmat: number) {
        return this.http.get(this.config.apiUrl + '/products/suivivehicule/entre/' + id_vehmat, this.jwt()).map((response: Response) => response.json());
    }

    getAllRef(reference: string) {
        return this.http.get(this.config.apiUrl + '/products/reference/' + reference, this.jwt()).map((response: Response) => response.json());
    }

    addEntretien(id_vehmat: any, EParam: any) {
        return this.http.post(this.config.apiUrl + '/products/entretien/' + id_vehmat, EParam, this.jwt());
    }

    deleteEntre(id_entretien: number) {
        return this.http.delete(this.config.apiUrl + '/products/entre/' + id_entretien, this.jwt());
    }


    /***************************************************GED*********************************************************************************/
    getGed(id: number) {
        return this.http.get(this.config.apiUrl + '/ged/produits/' + id, this.jwt()).map((response: Response) => response.json());
    }


    upload(url: string, file: File) {
        return new Promise((resolve, reject) => {
            if (file === undefined)
                resolve();
            var xhr = new XMLHttpRequest();
            var fd = new FormData();

            fd.append("file", file);

            /* event listeners */
            xhr.addEventListener("error", uploadFailed, false);
            xhr.addEventListener("load", uploadComplete, false);
            xhr.addEventListener("abort", uploadFailed, false);

            function uploadComplete() {
                resolve();
            }

            function uploadFailed() {
                reject();
            }

            xhr.open("POST", this.config.apiUrl + url);
            xhr.send(fd);
        });
    }

    getAllImg() {
        return this.http.get(this.config.apiUrl + '/products/img/', this.jwt()).map((response: Response) => response.json());
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


