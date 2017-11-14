import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';

import {AppConfig} from '../app.config';
import {Tache} from "../_models/gantt/tache";
import {Observable} from "rxjs/Observable";
import {Lien} from "../_models/gantt/link";


@Injectable()
export class GanttService {
    constructor(private http: Http, private config: AppConfig) {
    }

    // TASKS

    getTasksByIdChantier(id_chantier: number): Observable<Tache[]> {
        return this.http.get(this.config.apiUrl + '/gantt/' + id_chantier, this.jwt()).map((response: Response) => response.json());
    }

    addTask(task: Tache) {
        return this.http.post(this.config.apiUrl + '/gantt', task, this.jwt()).map((response: Response) => response.json());
    }

    removeTask(id: string) {
        return this.http.delete(this.config.apiUrl + '/gantt/' + id, this.jwt());
    }

    updateTask(task: Tache) {
        return this.http.put(this.config.apiUrl + '/gantt/' + task.id, task, this.jwt());
    }

    // LINKS

    getLinksByIdTache(id_tache: number): Observable<Lien[]> {
        return this.http.get(this.config.apiUrl + '/gantt/liens/' + id_tache, this.jwt()).map((response: Response) => response.json());
    }

    addLink(link: Lien) {
        return this.http.post(this.config.apiUrl + '/gantt/liens', link, this.jwt()).map((response: Response) => response.json());
    }

    removeLink(id: string) {
        return this.http.delete(this.config.apiUrl + '/gantt/liens/' + id, this.jwt());
    }

    updateLink(lien: Lien) {
        return this.http.put(this.config.apiUrl + '/gantt/liens' + lien.id, lien, this.jwt());
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