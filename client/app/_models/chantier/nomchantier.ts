import { Injectable } from '@angular/core';

@Injectable()
export class nomchantier {
    nomchantier: string;

    constructor(nomchantier:string = ''){
        this.nomchantier = nomchantier;

    }
}
