import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './home/index';
import {LoginComponent} from './login/index';
import {RegisterComponent} from './register/index';
import {AuthGuard} from './_guards/index';
import {DiscussionComponent, MessageComponent, NewMessageComponent} from "./message/index";
import {ListeventeComponent, ProduitventeComponent} from "./listevente/index";
import {ListeachatComponent, MainoeuvreComponent, ProduitachatComponent} from "./listeachat/index";
import {AddcontactComponent, ContactComponent, FicheclientComponent, FichecontactComponent} from "./contact/index";
import {AjoutProduitVenteComponent} from "./ajouterProduit/ajoutProduitVente.component";
import {AjoutProduitAchatComponent} from "./ajouterProduit/ajoutProduitAchat.component";
import {SuivicommandeComponent} from "./bdc/suivicommande.component";
import {BdcComponent} from "./bdc/bdc.component";
import {RepondreComponent} from "./message/repondre.component";
import {ModifierBDCComponent} from './bdc/modifiercommande.component';
import {EtatstockComponent} from "./etatstock/etatstock.component";
import {Ajout_vehimatComponent} from "./vehiculemateriel/ajout_vehimat.component";
import {ValidationCommandeComponent} from "./bdc/validationcommande.component";
import {DemandePrixComponent} from "./bdc/demandeprix.component";


import {ListeDevisComponent} from "./devis/listedevis.component";
import {ListechantierComponent} from "./chantiers/listechantier.component";
import {ListevehimatComponent} from "./vehiculemateriel/listevehimat.component";
import {SuivivehiculeComponent} from "./vehiculemateriel/suivivehicule.component";
import {SuivimaterielComponent} from "./vehiculemateriel/suivimateriel.component";
import {NewDevisComponent} from "./devis/newDevis.component";
import {AjoutchantierComponent} from "./chantiers/ajoutchantier.component";
import {ListefactureComponent} from "./facture/listefacture.component";
import {Balance_generaleComponent} from "./facture/balance_generale.component";
import {RechercheChantierComponent} from "./chantiers/recherchechantier.component";
import {DevisComponent} from "./devis/devis.component";
import {DupliquerDevisComponent} from "./devis/dupliquerdevis.component";
import {Editer_factureComponent} from "./facture/editer_facture.component";
import {ModifierfactureComponent} from "./facture/modifierfacture.component";
import {FichechantierComponent} from "./chantiers/fichechantier.component";
import {ListefacturechantierComponent} from "./facture/listefacturechantier.component";
import {RecherchechantierfactureComponent} from "./facture/recherchechantierfacture.component";
import {ProduitdevisComponent} from "./chantiers/produitdevis.component";
import {ChantiermoisComponent} from "./chantiers/chantiermois.component";
import {PlanningComponent} from "./planning/planning.component";
import {DevischantierComponent} from "./chantiers/devischantier.component";
import {DepensereelComponent} from "./chantiers/depensereel.component";
import {DepenseprevComponent} from "./chantiers/depenseprev.component";
import {AnalysetempsComponent} from "./chantiers/analysetemps.component";
import {BalancechantierComponent} from "./chantiers/balancechantier.component";
import {PhotochantierComponent} from "./chantiers/photochantier.component";
import {ModifierDevisComponent} from "./devis/modifierdevis.component";
import {Planning_simpleComponent} from "./planning/planning_simple.component"
import {DevislibreComponent} from "./devis/devislibre.component";
import {Facture_fournisseurComponent} from "./facture/facture_fournisseur.componnet";
import {ListefacturefournisseurComponent} from "./facture/listefacturefournisseur.component";
import {Param_genComponent} from "./parametre/param_gen.component";
import {TvaComponent} from "./parametre/tva.component";
import {Cat_prodComponent} from "./parametre/cat_prod.component";
import {Deverouillage_prodComponent} from "./parametre/deverouillage_prod.component";
import {Utilisateur_connectComponent} from "./parametre/utilisateur_connect.component";
import {RecherchefournisseurComponent} from "./facture/rechercherfournisseur.component";
import {FournisseurComponent} from "./facture/fournisseur.component";
import {FraisgenerauxanComponent} from "./facture/fraisgenerauxan.component";
import {FraismoisComponent} from "./facture/fraismois.component";
import {CgvComponent} from "./parametre/cgv.component";
import {Gestion_hComponent} from "./planning/gestion_h.component";
import {AbsComponent} from "./planning/abs.component";
import {Ajout_absComponent} from "./planning/ajout_abs.component";
import {Form_empComponent} from "./planning/form_emp.component";
import {Int_chantierComponent} from "./planning/int_chantier.component";
import {New_intComponent} from "./planning/new_int_.component";
import {FraisprevisionelComponent} from "./parametre/fraisprevisionel.component";
import {BalancechantierpdfComponent} from "./chantiers/balancechantierpdf.component";
import {Fraisgenan_janvComponent} from "./facture/fraisgenan_janv.component";
import {FichecontactpdfComponent} from "./contact/fichecontactpdf.component";
import {Fraisgenan_fevComponent} from "./facture/fraisgenan_fev.component";
import {Fraisgenan_marsComponent} from "./facture/fraisgenan_mars.component";
import {Fraisgenan_avrilComponent} from "./facture/fraisgenan_avril.component";
import {Fraisgenan_maiComponent} from "./facture/fraisgenan_mai.component";
import {Fraisgenan_juinComponent} from "./facture/fraisgenan_juin.component";
import {Fraisgenan_juilComponent} from "./facture/fraisgenan_juil.component";
import {Fraisgenan_aoutComponent} from "./facture/fraisgenan_aout.component";
import {Fraisgenan_septComponent} from "./facture/fraisgenan_sept.component";
import {Fraisgenan_octComponent} from "./facture/fraisgenan_oct.component";
import {Fraisgenan_novComponent} from "./facture/fraisgenan_nov.component";
import {Fraisgenan_decComponent} from "./facture/fraisgenan_dec.component";
import {Fraisgenan_pdfComponent} from "./facture/fraisgenan_pdf.component";
import {LicenceComponent} from "./parametre/licence.component";
import {DevisclientComponent} from "./contact/devisclient.component";
import {RechercheContactComponent} from "./contact/rechercheContact.component";
import {UtilisationComponent} from "./parametre/utilisation.component";

import {Histo_devisComponent} from "./devis/histo_devis.component";
import {Histo_facComponent} from "./facture/histo_fac.component";
import {DroituserComponent} from "./register/droituser.component";
import {EquipeComponent} from "./planning/equipe.component";
import {Facture_finiComponent} from "./facture/facture_fini.component";
import {AnalysedevisComponent} from "./devis/analysedevis.component";
import {FormationComponent} from "./parametre/formation.component";
import {FormationcontactComponent} from "./contact/formationcontact.component";
import {RecapitulatifmoisComponent} from "./planning/recapitulatifmois.component";
import {AvoirComponent} from "./facture/avoir.component";
import {ListeavoirComponent} from "./facture/listeavoir.component";
import {AvoirimprimComponent} from "./facture/avoirimprim.component";
import {RechercheavoirComponent} from "./facture/rechercheavoir.component";
import {FicheDevisLibreComponent} from "./devis/ficheDevisLibre.component";
import {ModifierlibreComponent} from "./devis/modifierlibre.component";
import {DupliquerlibreComponent} from "./devis/dupliquerlibre.component";
import {EquipementComponent} from "./contact/equipement.component";
import {ListdemandeComponent} from "./bdc/listdemande.component";
import {PrixComponent} from "./bdc/prix.component";
import {AcompteComponent} from "./facture/acompte.component";
import {AccompteimprimComponent} from "./facture/accompteimprim.component";

import {GestionprojComponent} from "./chantiers/gestionproj.component";
import {NewfactlibreComponent} from "./facture/newfactlibre.component";
import {FactlibreComponent} from "./facture/factlibre.component";
import {FactlibreimprimComponent} from "./facture/factlibreimprim.component";
import {AvoirlibreComponent} from "./facture/avoirlibre.component";
import {FiligraneComponent} from "./parametre/filigrane.component";
import {FactclientComponent} from "./contact/factclient.component";
import {RapproComponent} from "./facture/rappro.component";
import {Diff_fournisseurComponent} from "./facture/diff_fournisseur.component";
import {OtestockComponent} from "./bdc/otestock.component";
import {RetraitstockComponent} from "./bdc/retraitstock.component";
import {StockretireComponent} from "./bdc/stockretire.component";



const appRoutes: Routes = [
    {path: '', component: HomeComponent, canActivate: [AuthGuard]},
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: 'listevente', component: ListeventeComponent, canActivate: [AuthGuard]},
    {path: 'contact', component: ContactComponent, canActivate: [AuthGuard]},
    {path: 'ajout_produit_achat', component: AjoutProduitAchatComponent, canActivate: [AuthGuard]},
    {path: 'ajout_produit_vente', component: AjoutProduitVenteComponent, canActivate: [AuthGuard]},
    {path: 'mainoeuvre', component: MainoeuvreComponent, canActivate: [AuthGuard]},
    {path: 'listevente', component: ListeventeComponent, canActivate: [AuthGuard]},
    {path: 'listeachat', component: ListeachatComponent, canActivate: [AuthGuard]},
    {path: 'produitvente/:id/:num_version', component: ProduitventeComponent, canActivate: [AuthGuard]},
    {path: 'produitachat/:id/:num_version', component: ProduitachatComponent, canActivate: [AuthGuard]},
    {path: 'message', component: MessageComponent, canActivate: [AuthGuard]},
    {path: 'ajout_contact', component: AddcontactComponent, canActivate: [AuthGuard]},
    {path: 'fichecontact/:id_contact', component: FichecontactComponent, canActivate: [AuthGuard]},
    {path: 'ficheclient/:id_contact', component: FicheclientComponent, canActivate: [AuthGuard]},
    {path: 'suivi_commande', component: SuivicommandeComponent, canActivate: [AuthGuard]},
    {path: 'new_bdc', component: BdcComponent, canActivate: [AuthGuard]},
    {path: 'new_message', component: NewMessageComponent, canActivate: [AuthGuard]},
    {path: 'discussion/:id', component: DiscussionComponent, canActivate: [AuthGuard]},
    {path: 'repondre', component: RepondreComponent, canActivate: [AuthGuard]},
    {path: 'etatstock', component: EtatstockComponent, canActivate: [AuthGuard]},
    {path: 'modify_bdc/:id', component: ModifierBDCComponent, canActivate: [AuthGuard]},
    {path: 'ajout_vehimat', component: Ajout_vehimatComponent, canActivate: [AuthGuard]},
    {path: 'valider/:id', component: ValidationCommandeComponent, canActivate: [AuthGuard]},
    {path: 'demandeprix', component: DemandePrixComponent, canActivate: [AuthGuard]},
    {path: 'listechantier', component: ListechantierComponent, canActivate: [AuthGuard]},
    {path: 'listevehimat', component: ListevehimatComponent, canActivate: [AuthGuard]},
    {path: 'suivivehicule/:id', component: SuivivehiculeComponent, canActivate: [AuthGuard]},
    {path: 'listedevis', component: ListeDevisComponent, canActivate: [AuthGuard]},
    {path: 'suivimateriel/:id', component: SuivimaterielComponent, canActivate: [AuthGuard]},
    {path: 'newdevis', component: NewDevisComponent, canActivate: [AuthGuard]},
    {path: 'ajoutchantier/:id_devis/:num_version', component: AjoutchantierComponent, canActivate: [AuthGuard]},
    {path: 'listefacture', component: ListefactureComponent, canActivate: [AuthGuard]},
    {path: 'balance_generale', component: Balance_generaleComponent, canActivate: [AuthGuard]},
    {path: 'recherchechantier', component: RechercheChantierComponent, canActivate: [AuthGuard]},
    {path: 'devis/:id/:num_version', component: DevisComponent, canActivate: [AuthGuard]},
    {path: 'dupliquerdevis/:id/:num_version', component: DupliquerDevisComponent, canActivate: [AuthGuard]},
    {path: 'editer_facture/:id/:num_version', component: Editer_factureComponent, canActivate: [AuthGuard]},
    {path: 'modifierfacture/:id_facture/:n_situation', component: ModifierfactureComponent, canActivate: [AuthGuard]},
    {path: 'fichechantier/:id_chantier', component: FichechantierComponent, canActivate: [AuthGuard]},
    {path: 'listefacturechantier/:id_chantier', component: ListefacturechantierComponent, canActivate: [AuthGuard]},
    {path: 'recherchechantierfacture', component: RecherchechantierfactureComponent, canActivate: [AuthGuard]},
    {path: 'produitdevis/:id_chantier', component: ProduitdevisComponent, canActivate: [AuthGuard]},
    {path: 'planning', component: PlanningComponent, canActivate: [AuthGuard]},
    {path: 'chantiermois', component: ChantiermoisComponent, canActivate: [AuthGuard]},
    {path: 'devischantier/:id_chantier', component: DevischantierComponent, canActivate: [AuthGuard]},
    {path: 'depensereel/:id_chantier', component: DepensereelComponent, canActivate: [AuthGuard]},
    {path: 'depenseprev/:id_chantier', component: DepenseprevComponent, canActivate: [AuthGuard]},
    {path: 'analysetemps/:id_chantier', component: AnalysetempsComponent, canActivate: [AuthGuard]},
    {path: 'balancechantier/:id_chantier', component: BalancechantierComponent, canActivate: [AuthGuard]},
    {path: 'photochantier/:id_chantier', component: PhotochantierComponent, canActivate: [AuthGuard]},
    {path: 'modifierdevis/:id/:num_version', component: ModifierDevisComponent, canActivate: [AuthGuard]},
    {path: 'modifierlibre/:id_devis/:num_version', component: ModifierlibreComponent, canActivate: [AuthGuard]},
    {path: 'planning_simple', component: Planning_simpleComponent, canActivate: [AuthGuard]},
    {path: 'devislibre', component: DevislibreComponent, canActivate: [AuthGuard]},
    {path: 'facture_fournisseur', component: Facture_fournisseurComponent, canActivate: [AuthGuard]},
    {path: 'listefacturefournisseur', component: ListefacturefournisseurComponent, canActivate: [AuthGuard]},
    {path: 'param_gen', component: Param_genComponent, canActivate: [AuthGuard]},
    {path: 'tva', component: TvaComponent, canActivate: [AuthGuard]},
    {path: 'cat_prod', component: Cat_prodComponent, canActivate: [AuthGuard]},
    {path: 'deverouillage_prod', component: Deverouillage_prodComponent, canActivate: [AuthGuard]},
    {path: 'utilisateur_connect', component: Utilisateur_connectComponent, canActivate: [AuthGuard]},
    {path: 'recherchefournisseur', component: RecherchefournisseurComponent, canActivate: [AuthGuard]},
    {path: 'fournisseur/:id_factfour', component: FournisseurComponent, canActivate: [AuthGuard]},
    {path: 'fraisgenerauxan', component: FraisgenerauxanComponent, canActivate: [AuthGuard]},
    {path: 'fraismois', component: FraismoisComponent, canActivate: [AuthGuard]},
    {path: 'cgv', component: CgvComponent, canActivate: [AuthGuard]},
    {path: 'gestion_h', component: Gestion_hComponent, canActivate: [AuthGuard]},
    {path: 'abs', component: AbsComponent, canActivate: [AuthGuard]},
    {path: 'ajout_abs', component: Ajout_absComponent, canActivate: [AuthGuard]},
    {path: 'form_emp', component: Form_empComponent, canActivate: [AuthGuard]},
    {path: 'int_chantier', component: Int_chantierComponent, canActivate: [AuthGuard]},
    {path: 'new_int', component: New_intComponent, canActivate: [AuthGuard]},
    {path: 'fraisprevisionel', component: FraisprevisionelComponent, canActivate: [AuthGuard]},
    {path: 'balancechantierpdf/:id_chantier', component: BalancechantierpdfComponent, canActivate: [AuthGuard]},
    {path: 'fraisgenan_janv', component: Fraisgenan_janvComponent, canActivate: [AuthGuard]},
    {path: 'fichecontactpdf/:id_contact', component: FichecontactpdfComponent, canActivate: [AuthGuard]},
    {path: 'fraisgenan_fev', component: Fraisgenan_fevComponent, canActivate: [AuthGuard]},
    {path: 'fraisgenan_mars', component: Fraisgenan_marsComponent, canActivate: [AuthGuard]},
    {path: 'fraisgenan_avril', component: Fraisgenan_avrilComponent, canActivate: [AuthGuard]},
    {path: 'fraisgenan_mai', component: Fraisgenan_maiComponent, canActivate: [AuthGuard]},
    {path: 'fraisgenan_juin', component: Fraisgenan_juinComponent, canActivate: [AuthGuard]},
    {path: 'fraisgenan_juil', component: Fraisgenan_juilComponent, canActivate: [AuthGuard]},
    {path: 'fraisgenan_aout', component: Fraisgenan_aoutComponent, canActivate: [AuthGuard]},
    {path: 'fraisgenan_sept', component: Fraisgenan_septComponent, canActivate: [AuthGuard]},
    {path: 'fraisgenan_oct', component: Fraisgenan_octComponent, canActivate: [AuthGuard]},
    {path: 'fraisgenan_nov', component: Fraisgenan_novComponent, canActivate: [AuthGuard]},
    {path: 'fraisgenan_dec', component: Fraisgenan_decComponent, canActivate: [AuthGuard]},
    {path: 'fraisgenan_pdf', component: Fraisgenan_pdfComponent, canActivate: [AuthGuard]},
    {path: 'licence', component: LicenceComponent, canActivate: [AuthGuard]},
    {path: 'devisclient/:id_contact', component: DevisclientComponent, canActivate: [AuthGuard]},
    {path: 'rechercheContact', component: RechercheContactComponent, canActivate: [AuthGuard]},
    {path: 'histo_devis', component: Histo_devisComponent, canActivate: [AuthGuard]},
    {path: 'histo_fac', component: Histo_facComponent, canActivate: [AuthGuard]},
    {path: 'droituser/:id', component: DroituserComponent, canActivate: [AuthGuard]},

    {path: 'equipe', component: EquipeComponent, canActivate: [AuthGuard]},
    {path: 'facture_fini/:id_facture/:n_situation', component: Facture_finiComponent, canActivate: [AuthGuard]},
    {path: 'analysedevis/:id_devis/:num_version', component: AnalysedevisComponent, canActivate: [AuthGuard]},
    {path: 'formation', component: FormationComponent, canActivate: [AuthGuard]},
    {path: 'formationcontact/:id_contact', component: FormationcontactComponent, canActivate: [AuthGuard]},
    {path: 'recapitulatifmois', component: RecapitulatifmoisComponent, canActivate: [AuthGuard]},
    {path: 'ficheDevisLibre/:id_devis/:num_version', component: FicheDevisLibreComponent, canActivate: [AuthGuard]},

    {path: 'avoir/:id_facture/:n_situation', component: AvoirComponent, canActivate: [AuthGuard]},
    {path: 'listeavoir', component: ListeavoirComponent, canActivate: [AuthGuard]},
    {path: 'avoirimprim/:id_avoir', component: AvoirimprimComponent, canActivate: [AuthGuard]},
    {path: 'rechercheavoir', component: RechercheavoirComponent, canActivate: [AuthGuard]},
    {path: 'dupliquerlibre/:id_devis/:num_version', component: DupliquerlibreComponent, canActivate: [AuthGuard]},
    {path: 'equipement/:id_contact', component: EquipementComponent, canActivate: [AuthGuard]},
    {path: 'listdemande', component: ListdemandeComponent, canActivate: [AuthGuard]},
    {path: 'prix/:id_demande', component: PrixComponent, canActivate: [AuthGuard]},
    {path: 'acompte/:id_devis/:num_version', component: AcompteComponent, canActivate: [AuthGuard]},
    {path: 'accompteimprim/:id_facture/:n_situation', component: AccompteimprimComponent, canActivate: [AuthGuard]},

    {path: 'gestionproj/:id_chantier', component: GestionprojComponent, canActivate: [AuthGuard]}, ///////////////////////////////////


    {path: 'utilisation', component: UtilisationComponent, canActivate: [AuthGuard]},

    {path: 'newfactlibre', component: NewfactlibreComponent, canActivate: [AuthGuard]} ,
    {path: 'factlibre/:id_facture/:n_situation', component: FactlibreComponent, canActivate: [AuthGuard]} ,
    {path: 'factlibreimprim/:id_facture/:n_situation', component: FactlibreimprimComponent, canActivate: [AuthGuard]} ,
    {path: 'avoirlibre/:id_facture/:n_situation', component: AvoirlibreComponent, canActivate: [AuthGuard]},
    {path: 'filigrane/:id_agence', component: FiligraneComponent, canActivate: [AuthGuard]},
    {path: 'factclient/:id_contact', component: FactclientComponent, canActivate: [AuthGuard]},
    {path: 'rappro', component: RapproComponent, canActivate: [AuthGuard]},
    {path: 'diff_fournisseur/:id_contact', component: Diff_fournisseurComponent, canActivate: [AuthGuard]},
    {path: 'otestock', component: OtestockComponent,canActivate:[AuthGuard]},
    {path: 'retraitstock', component: RetraitstockComponent,canActivate:[AuthGuard]},
    {path: 'stockretire/:id_bdc', component: StockretireComponent,canActivate:[AuthGuard]},


    // otherwise redirect to home
    {path: '**', redirectTo: ''}
];

export const routing = RouterModule.forRoot(appRoutes);
