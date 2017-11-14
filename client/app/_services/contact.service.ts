import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { Contact } from '../_models/index';

@Injectable()
export class ContactService {
    constructor(private http: Http, private config: AppConfig) { }

    getAll() {
        return this.http.get(this.config.apiUrl + '/contacts', this.jwt()).map((response: Response) => response.json());
    }

    getList() {
        return this.http.get(this.config.apiUrl + '/contacts/liste', this.jwt()).map((response: Response) => response.json());
    }

    getGed(id_contact: number) {
        return this.http.get(this.config.apiUrl + '/ged/contact/'+id_contact, this.jwt()).map((response: Response) => response.json());
    }

    getAllFournisseurs() {
        return this.http.get(this.config.apiUrl + '/contacts/fournisseurs', this.jwt()).map((response: Response) => response.json());
    }

    getAllOuvriers() {
        return this.http.get(this.config.apiUrl + '/contacts/ouvriers', this.jwt()).map((response: Response) => response.json());
    }

    getAllEquipes() {
        return this.http.get(this.config.apiUrl + '/contacts/equipes', this.jwt()).map((response: Response) => response.json());
    }

    getAllEmploye() {
        return this.http.get(this.config.apiUrl + '/contacts/employe', this.jwt()).map((response: Response) => response.json());
    }

    getAllClients() {
        return this.http.get(this.config.apiUrl + '/contacts/clients', this.jwt()).map((response: Response) => response.json());
    }

    getCACES() {
        return this.http.get(this.config.apiUrl + '/caces/', this.jwt()).map((response: Response) => response.json());
    }

    getAddress(id: number) {
        return this.http.get(this.config.apiUrl + '/contacts/address/'+ id, this.jwt()).map((response: Response) => response.json());
    }

    getQualifications() {
        return this.http.get(this.config.apiUrl + '/contacts/qualifications', this.jwt()).map((response: Response) => response.json());
    }

    getById(_id: string) {
        return this.http.get(this.config.apiUrl + '/contacts/' + _id, this.jwt()).map((response: Response) => response.json());
    }

    getByIdAllInfos(_id: string) {
        return this.http.get(this.config.apiUrl + '/contacts/allinfos/' + _id, this.jwt()).map((response: Response) => response.json());
    }

    create(contactInfos: {}) {
        return this.http.post(this.config.apiUrl + '/contacts/new', contactInfos, this.jwt()).map((response: Response) => response.json());
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

    download(id: number){
        return this.config.apiUrl + '/contacts/fiche/' + id + '/download';
    }

    update(contactInfos: {}, id_contact: number) {
        return this.http.put(this.config.apiUrl + '/contacts/' + id_contact, contactInfos, this.jwt());
    }

    delete(_id: string) {
        return this.http.delete(this.config.apiUrl + '/contacts/' + _id, this.jwt());
    }

    getByIdencours(id_contact:number) {
        return this.http.get(this.config.apiUrl + '/contacts/encours/' + id_contact, this.jwt()).map((response: Response) => response.json());
    }

    getByIdchantier(id_contact:number) {
        return this.http.get(this.config.apiUrl + '/contacts/chantier/' + id_contact, this.jwt()).map((response: Response) => response.json());
    }

    getByIdContrat(id_contact:number) {
        return this.http.get(this.config.apiUrl + '/contacts/contrat/' + id_contact, this.jwt()).map((response: Response) => response.json());
    }
    getByIdLastContrat(id_contact:number) {
        return this.http.get(this.config.apiUrl + '/contacts/lastcontrat/' + id_contact, this.jwt()).map((response: Response) => response.json());
    }
    addcontrat(contrat: any) {
        //console.log(contrat);
        return this.http.post(this.config.apiUrl + '/contacts/addcontrat', contrat, this.jwt());
    }
    newcontrat(id_contact:number,contrat: any) {
        console.log(contrat);
        return this.http.post(this.config.apiUrl + '/contacts/newcontrat/'+id_contact, contrat, this.jwt());
    }

    getByIdDevisclient(id_contact:number) {
        return this.http.get(this.config.apiUrl + '/contacts/devis/' + id_contact, this.jwt()).map((response: Response) => response.json());
    }
    addForm(eparams:any) {
        console.log(this.config.apiUrl + '/contacts/formation')
        return this.http.post(this.config.apiUrl + '/contacts/formation',eparams, this.jwt());
    }

    getByIdNom(id_contact:number) {
        return this.http.get(this.config.apiUrl + '/contacts/nom/' + id_contact, this.jwt()).map((response: Response) => response.json());
    }

    getAllform() {
        return this.http.get(this.config.apiUrl + '/contacts/test', this.jwt()).map((response: Response) => response.json());
    }


    getAllCaces() {
        console.log(this.config.apiUrl + '/contacts')
        return this.http.get(this.config.apiUrl + '/contacts/listcaces', this.jwt()).map((response: Response) => response.json());
    }

    getByIdFormation(id_contact:number) {
        return this.http.get(this.config.apiUrl + '/contacts/idform/' + id_contact, this.jwt()).map((response: Response) => response.json());
    }

    addCaces(eparams:any) {
        console.log(this.config.apiUrl + '/contacts/formation')
        return this.http.post(this.config.apiUrl + '/contacts/ajoutcaces',eparams, this.jwt());
    }

    getByIdCaces(id_contact:number) {
        return this.http.get(this.config.apiUrl + '/contacts/selcaces/' + id_contact, this.jwt()).map((response: Response) => response.json());
    }
    upCaces(eParams:any){
        console.log('test')
        return this.http.put(this.config.apiUrl + '/contacts/upcaces' ,eParams, this.jwt());
    }

    upFormation(eParams:any){
        console.log('test')
        return this.http.put(this.config.apiUrl + '/contacts/modiform' ,eParams, this.jwt());
    }
    equipement(id_contact:number,equipement: any) {
        return this.http.post(this.config.apiUrl + '/contacts/eequipements/'+id_contact, equipement, this.jwt());
    }

    getByIdequipement(id_contact:number) {
        return this.http.get(this.config.apiUrl + '/contacts/allequipe/' + id_contact, this.jwt()).map((response: Response) => response.json());
    }
    deleteEquipement(id_equipement:number) {
        return this.http.delete(this.config.apiUrl + '/contacts/entre/' + id_equipement, this.jwt());
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
