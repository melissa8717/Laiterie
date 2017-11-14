import { Injectable } from '@angular/core';

@Injectable()
export class adresse {

    adresse: string;

    constructor(  adresse:string = ''){
        this.adresse = adresse;
    }
}
