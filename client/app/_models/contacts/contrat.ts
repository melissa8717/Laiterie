import { Injectable } from '@angular/core';

@Injectable()
export class Contrat {
    id_contrat: number;
    id_contact: number;
    date_debut: Date;
    date_fin: Date;
    type_contrat: string;
}
