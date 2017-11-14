import { Injectable } from '@angular/core';

@Injectable()
export class ville {
    id_adresse: string;
    ville: string;

    constructor(id_adresse:string  = '', ville:string = ''){
        this.id_adresse = id_adresse;
        this.ville = ville;

    }



}
