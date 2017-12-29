/**
 * Created by Alexandre on 20/06/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';

@Injectable()
export class CommandeService {
    constructor(private http: Http, private config: AppConfig) { }

    getAll(month: number, year: number) {
        return this.http.get(this.config.apiUrl + '/commandes/' + month + "/" + year, this.jwt()).map((response: Response) => response.json());
    }
    getAllDate() {
        return this.http.get(this.config.apiUrl + '/commandes', this.jwt()).map((response: Response) => response.json());
    }

    getAllProducts(_id: number) {
        return this.http.get(this.config.apiUrl + '/commandes/products/' + _id, this.jwt()).map((response: Response) => response.json());
    }
    getAllibre(_id: number) {
        return this.http.get(this.config.apiUrl + '/commandes/libre/' + _id, this.jwt()).map((response: Response) => response.json());
    }

    getAllImprevuProducts(_id: number) {
        return this.http.get(this.config.apiUrl + '/commandes/imprevu/' + _id, this.jwt()).map((response: Response) => response.json());
    }

    getById(_id: string) {
        return this.http.get(this.config.apiUrl + '/commandes/' + _id, this.jwt()).map((response: Response) => response.json());
    }

    add(commande: {}) {
        console.log(commande);
        return this.http.post(this.config.apiUrl + '/commandes/add', commande, this.jwt());
    }

    validate(commande: {id: number, list: any}){
        return this.http.put(this.config.apiUrl + '/commandes/validate/' + commande.id, commande, this.jwt());
    }

    changeState(commande: any) {
        return this.http.put(this.config.apiUrl + '/commandes/state/'+ commande.id_bdc, commande, this.jwt());
    }

    update(commande: {id_bdc: number}) {
        return this.http.put(this.config.apiUrl + '/commandes/' + commande.id_bdc, commande, this.jwt());
    }

    delete(_id: string) {
        return this.http.delete(this.config.apiUrl + '/commandes/' + _id, this.jwt());
    }

    demandes(commande: any) {
        return this.http.post(this.config.apiUrl + '/commandes/demande', commande, this.jwt());
    }

    getAllListing() {
        console.log(this.config.apiUrl + '/commandes/listing');
        return this.http.get(this.config.apiUrl + '/commandes/listing', this.jwt()).map((response: Response) => response.json());
    }

    getByIdDetail(id_demande: number) {
        console.log(this.config.apiUrl + '/commandes/details/' + id_demande);
        return this.http.get(this.config.apiUrl + '/commandes/details/' + id_demande, this.jwt()).map((response: Response) => response.json());
    }

    otestock(stockparams:any) {
        return this.http.put(this.config.apiUrl + '/commandes/otestock' , stockparams, this.jwt());
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