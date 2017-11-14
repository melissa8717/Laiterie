import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { Product } from '../_models/index';

@Injectable()
export class VentesService {
    constructor(private http: Http, private config: AppConfig) { }

    getAll() {
        //console.log("get all ventes service");
        return this.http.get(this.config.apiUrl + '/produits_vente', this.jwt()).map((response: Response) => response.json());
    }

    getAllById(_id: string) {
        return this.http.get(this.config.apiUrl + '/produits_vente/id/' + _id, this.jwt()).map((response: Response) => response.json());
    }

    getById(_id: string, number_version: string) {
        return this.http.get(this.config.apiUrl + '/produits_vente/id/' + _id+'/'+ number_version, this.jwt()).map((response: Response) => response.json());
    }

    getAllProdComp(_id: string, num_version : string) {
        return this.http.get(this.config.apiUrl + '/produits_vente/composes/' + _id +'/'+ num_version, this.jwt()).map((response: Response) => response.json());
    }

    update(product: Product) {
        return this.http.put(this.config.apiUrl + '/produits_vente/' + product.id_prc, product, this.jwt());
    }

    add(product: Product) {
        return this.http.post(this.config.apiUrl + '/produits_vente/new', product, this.jwt());
    }

    newVersion(product: Product) {
        return this.http.post(this.config.apiUrl + '/produits_vente/newVersion', product, this.jwt());
    }

    addInProdComp(product: any) {
        console.log("prod service: " + JSON.stringify(product));
        return this.http.post(this.config.apiUrl + '/produits_vente/newprodcomp', product, this.jwt()).map((response: Response) => response.json());
    }

    delete(_id: string) {
        return this.http.delete(this.config.apiUrl + '/produits_vente/' + _id, this.jwt());
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
