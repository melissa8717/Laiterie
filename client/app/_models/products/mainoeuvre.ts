import { Injectable } from '@angular/core';

@Injectable()
export class Mainoeuvre {
    id_produit: string;
    libelle: string;
    taux_horaire: number;
    heure_brute: number;
}