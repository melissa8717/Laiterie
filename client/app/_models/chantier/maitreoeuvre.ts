import { Injectable } from '@angular/core';

@Injectable()
export class maitreoeuvre {
    maitreoeuvre: string;

    constructor( maitreoeuvre:string = ''){
        this.maitreoeuvre = maitreoeuvre;

    }
}
