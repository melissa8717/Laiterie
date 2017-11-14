import { Injectable } from '@angular/core';

@Injectable()
export class Qualification {
    id_qualification: number;
    designation: string;
    taux_horaire: number;
    heure_brute: number;
}
