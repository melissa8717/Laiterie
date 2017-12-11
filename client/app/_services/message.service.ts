/**
 * Created by Wbat on 04/06/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { Message } from '../_models/index';

@Injectable()
export class MessageService {
    constructor(private http: Http, private config: AppConfig) { }

    getAll(_id: string) {
        console.log(this.config.apiUrl + '/messages/'+ _id);
        return this.http.get(this.config.apiUrl + '/messages/'+ _id, this.jwt()).map((response: Response) => response.json());
    }

    getAllHome(_id: string) {
        console.log(this.config.apiUrl + '/messages/home/'+ _id);
        return this.http.get(this.config.apiUrl + '/messages/home/'+ _id, this.jwt()).map((response: Response) => response.json());
    }

    unreadMsg(_id: number) {
        return this.http.get(this.config.apiUrl + '/messages/unread/'+ _id, this.jwt()).map((response: Response) => response.json());
    }


    getById(_id: string) {
        return this.http.get(this.config.apiUrl + '/messages/id/' + _id, this.jwt()).map((response: Response) => response.json());
    }

    getConversation(_id: number) {
        return this.http.get(this.config.apiUrl + '/messages/conversation/' + _id, this.jwt()).map((response: Response) => response.json());
    }

    answer(answerInfos: {}){
        return this.http.post(this.config.apiUrl + '/messages/answer', answerInfos, this.jwt());
    }

    create(messageInfos: {}) {
        return this.http.post(this.config.apiUrl + '/messages/new', messageInfos, this.jwt());

    }

    update(message: Message) {
        return this.http.put(this.config.apiUrl + '/messages/' + message.id_message, message, this.jwt());
    }

    delete(_id: string) {
        return this.http.delete(this.config.apiUrl + '/messages/' + _id, this.jwt());
    }

    getGed(id_vehmat: number) {
        return this.http.get(this.config.apiUrl + '/ged/matvehi/'+id_vehmat, this.jwt()).map((response: Response) => response.json());
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