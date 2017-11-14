import { Injectable } from '@angular/core';

@Injectable()
export class rapport {
    date_rapport: string;
    note: string;

    constructor( date_rapport:string = '', note: string = ''){
        this.date_rapport = date_rapport;
        this.note = note;

    }


}
