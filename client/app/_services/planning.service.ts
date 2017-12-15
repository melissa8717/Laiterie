/**
 * Created by Wbat on 07/08/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';

@Injectable()
export class PlanningService {
    constructor(private http: Http, private config: AppConfig) {

    }

    getAll() {
        return this.http.get(this.config.apiUrl + '/planning', this.jwt()).map((response: Response) => response.json());
    }

    add(event: any) {
        return this.http.post(this.config.apiUrl + '/planning/new', event, this.jwt()).map((response: Response) => response.json());
    }

    update(event: any) {
        return this.http.put(this.config.apiUrl + '/planning/' +event.id_event, event, this.jwt());
    }




    getAllTravail() {
        return this.http.get(this.config.apiUrl + '/planning/travail', this.jwt()).map((response: Response) => response.json());
    }

    validate(travail: any) {
        return this.http.put(this.config.apiUrl + '/planning/validate/'+ travail.id_travail , travail, this.jwt());
    }

    validateTeam(travail: any) {
        return this.http.put(this.config.apiUrl + '/planning/validateTeam/'+ travail.id_travail , travail, this.jwt());
    }

    addTeamEvents(data : any){
        return this.http.post(this.config.apiUrl + '/planning/addTeamEvents' , data, this.jwt());
    }

    addEmployeEvents(data : any){
        return this.http.post(this.config.apiUrl + '/planning/addEmployeEvents' , data, this.jwt());
    }






    loadAlarms(id: number) {
        return this.http.get(this.config.apiUrl + '/planning/alarms/' +id, this.jwt()).map((response: Response) => response.json());
    }

    deleteTravail(id: number) {
        console.log(this.config.apiUrl + '/planning/travail/'+id);
        return this.http.delete(this.config.apiUrl + '/planning/travail/'+id, this.jwt());
    }

    deleteTravailEquipe(id: number) {
        console.log(this.config.apiUrl + '/planning/travailEquipe/'+id);
        return this.http.delete(this.config.apiUrl + '/planning/travailEquipe/'+id, this.jwt());
    }

    delete(id: number) {
        return this.http.delete(this.config.apiUrl + '/planning/'+id, this.jwt());
    }

    updateplanning_simple(event: any) {
        return this.http.put(this.config.apiUrl + '/planning/' +event.id_event, event, this.jwt());
    }

    addEquipe(data:any) {
        console.log('service ts'+this.config.apiUrl + '/planning/equipe/')
        return this.http.post(this.config.apiUrl + '/planning/addEquipe/',data, this.jwt());
    }

    deleteEquipe(id_equipe:number) {
        console.log(this.config.apiUrl + '/equipe/' + id_equipe);
        return this.http.delete(this.config.apiUrl + '/equipe/model/' + id_equipe, this.jwt());
    }

    getAllEquipe() {
        console.log('test TS'+this.config.apiUrl + '/planning/equipe')
        return this.http.get(this.config.apiUrl + '/planning/equipe', this.jwt()).map((response: Response) => response.json());
    }

    getAllRecap(month:number, year:number) {

        return this.http.get(this.config.apiUrl + '/planning/recap/'+month+"/"+year, this.jwt()).map((response: Response) => response.json());
    }

    getAllHeuresem(month:number, year:number) {
        //console.log(this.config.apiUrl + '/facture/prev/'+month+"/"+year);
        return this.http.get(this.config.apiUrl + '/planning/semaine/'+month+"/"+year, this.jwt()).map((response: Response) => response.json());
    }

    getAllEquipeouvrier() {
        //console.log('test TS'+this.config.apiUrl + '/planning/worker')
        return this.http.get(this.config.apiUrl + '/planning/worker', this.jwt()).map((response: Response) => response.json());
    }

    upouvrier(eParams: any) {
        return this.http.put(this.config.apiUrl + '/planning/ouvrier' ,eParams, this.jwt());
    }

    getAllouvrier() {
        //console.log('test TS'+this.config.apiUrl + '/planning/worker')
        return this.http.get(this.config.apiUrl + '/planning/allouvrier', this.jwt()).map((response: Response) => response.json());
    }

    addWorker(params:any) {
        //console.log('service ts'+this.config.apiUrl + '/planning/equipe/')
        return this.http.post(this.config.apiUrl + '/planning/adoubvrir',params, this.jwt());
    }

    getAllNamechantier(month:number, year:number) {
        //console.log(this.config.apiUrl + '/facture/prev/'+month+"/"+year);
        return this.http.get(this.config.apiUrl + '/planning/getAllNamechantier/'+month+"/"+year, this.jwt()).map((response: Response) => response.json());
    }

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }

}