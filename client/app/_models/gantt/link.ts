import {Injectable} from '@angular/core';

@Injectable()
export class Lien {
    id: number;
    source: number;
    target: number;
    type: string;
}