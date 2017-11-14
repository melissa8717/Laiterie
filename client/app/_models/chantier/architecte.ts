import { Injectable } from '@angular/core';

@Injectable()
export class architecte {
    architecte: string;

    constructor(architecte:string = ''){
        this.architecte = architecte;

    }

}
