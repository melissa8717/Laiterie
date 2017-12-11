import { Injectable } from '@angular/core';

@Injectable()
export class Product {
    id_produit: string;
    image: string;
    libelle: string;
    reference: string;
    unite: string; // dans html - type (m, m2, kilo, tonne ...)
    prix_achat: number;
    marge: number;
    id_tva: string; // id_tva dans la base; peux etre 5, 10 ou 20
    prix_vente: number; // prix vente hors taxe
    description: string;
    note: string;
    stock: string;
    stockmini: string;
    stockmaxi: string;
    tarif_du: string;
    id_contact: number; // fournisseur id contact

    categorie: string;  // id de categorie
    cat_libelle: string; // libelle de categorie, pour la recherche
    nom: string; // nom de fournisseur

    tva: number; // valeur de tva, pour simplifier les choses; n'est pas envoye au serveur

    quantite: number; // pour les produits composes
    id_prc: string;  // dans produit_vente
    id_unite:number;
    id_user: number;
}