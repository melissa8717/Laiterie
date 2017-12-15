import {Injectable} from '@angular/core';

@Injectable()
export class Product {
    id_produit: number;
    image_url: string;
    libelle: string;
    reference: string;
    prix_achat: number;
    marge: number;
    prix_vente: number; // prix vente hors taxe
    description: string;
    note: string;
    stock: string;
    stockmini: string;
    stockmaxi: string;
    tarif_du: string;

    id_tva: number; // id_tva dans la base; peux etre 5, 10 ou 20
    tva_value: number;

    id_contact: number; // fournisseur id contact
    contact_name: string; // nom de fournisseur
    raison_sociale: string; //fournisseur

    id_cat: string;  // id de categorie
    cat_libelle: string; // libelle de categorie, pour la recherche

    id_unite: number;
    unite: string;

    quantite: number; // pour les produits composes
    id_prc: number;  // dans produit_vente
    id_user: number;
}