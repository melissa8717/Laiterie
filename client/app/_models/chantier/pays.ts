import { Injectable } from '@angular/core';

@Injectable()
export class pays {

    pays: string;

    constructor( pays:string = ''){
        this.pays = pays;

    }


}
