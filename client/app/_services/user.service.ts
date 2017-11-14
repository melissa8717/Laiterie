import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { User } from '../_models/index';

@Injectable()
export class UserService {
    constructor(private http: Http, private config: AppConfig) { }

    getAll() {
        return this.http.get(this.config.apiUrl + '/users', this.jwt()).map((response: Response) => response.json());
    }

    getById(_id: string) {
        return this.http.get(this.config.apiUrl + '/users/' + _id, this.jwt()).map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post(this.config.apiUrl + '/users/register', user, this.jwt());
    }

    update(user: User) {
        return this.http.put(this.config.apiUrl + '/users/' + user._id, user, this.jwt());
    }

    delete(_id: string) {
        return this.http.delete(this.config.apiUrl + '/users/' + _id, this.jwt());
    }

    getAllUser() {
        return this.http.get(this.config.apiUrl + '/users/utilisation', this.jwt()).map((response: Response) => response.json());
    }

    updateUser(id:number,userparams:any) {

        //console.log(this.config.apiUrl + '/users/test/'+id )
        return this.http.put(this.config.apiUrl + '/users/test/'+id , userparams, this.jwt());
    }
    getCount() {
        return this.http.get(this.config.apiUrl + '/users/compte', this.jwt()).map((response: Response) => response.json());
    }
    getCurrentnb(id:number) {
        return this.http.get(this.config.apiUrl + '/users/test/'+id, this.jwt()).map((response: Response) => response.json());
    }

    createdroit(id:any,userParam:any) {
        //console.log(this.config.apiUrl + '/users/droit/'+id)
        return this.http.post(this.config.apiUrl + '/users/droit/'+id,userParam, this.jwt());
    }
    modifdroit(userparams: any) {
        return this.http.put(this.config.apiUrl + '/users/upuser', userparams, this.jwt());
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
