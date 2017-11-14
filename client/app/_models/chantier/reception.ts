import { Injectable } from '@angular/core';

@Injectable()
export class reception {
    reception_chantier: string;

    constructor(reception_chantier:string = ''){
        this.reception_chantier = reception_chantier;

    }



}
