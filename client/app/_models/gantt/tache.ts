import {Injectable} from '@angular/core';

@Injectable()
export class Tache {
    id: number;
    start_date: string;
    text: string;
    progress: number;
    duration: number;
    parent: number;
    id_chantier: number;
}