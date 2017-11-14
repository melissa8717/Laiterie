import { Injectable } from '@angular/core';

@Injectable()
export class codePostal {
    codePostal: number;

    constructor( codePostal:number = null){
        this.codePostal = codePostal;

    }


}
