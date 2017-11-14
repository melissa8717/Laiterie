/**
 * Created by alexandre on 15/05/2017.
*/
import { Injectable } from '@angular/core';

@Injectable()
export class Adresse {
    id_contact: number;
    id_chantier: number;
    adresse: string;
    complement_adr: string;
    code_postal: string;
    ville: string;
    pays: string;
    type_adr: string;
    user:number;
    autres:string;// perso, pro, etc
}
