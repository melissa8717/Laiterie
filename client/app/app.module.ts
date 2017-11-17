import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {routing} from './app.routing';
import {AppConfig} from './app.config';

import {AlertComponent} from './_directives/index';
import {AuthGuard} from './_guards/index';
import {
    AchatsService,
    AlertService,
    AuthenticationService,
    ContactService,
    MessageService,
    UserService,
    VentesService
} from './_services/index';
import {HomeComponent} from './home/index';
import {LoginComponent} from './login/index';
import {RegisterComponent} from './register/index';
import {
    ConversationService,
    DiscussionComponent,
    MessageComponent,
    NewMessageComponent,
    RechercheComponent
} from "./message/index";
import {AddcontactComponent, ContactComponent, FicheclientComponent, FichecontactComponent} from "./contact/index";
import {ListeventeComponent, ProduitventeComponent} from "./listevente/index";
import {ListeachatComponent, MainoeuvreComponent, ProduitachatComponent} from "./listeachat/index";
import {AjoutProduitVenteComponent} from "./ajouterProduit/ajoutProduitVente.component";
import {AjoutProduitAchatComponent} from "./ajouterProduit/ajoutProduitAchat.component";
import {SuivicommandeComponent} from "./bdc/suivicommande.component";
import {BdcComponent} from "./bdc/bdc.component";
import {EtatstockComponent} from "./etatstock/etatstock.component";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {FileDropDirective, FileSelectDirective} from 'ng2-file-upload';
// noinspection TypeScriptCheckImport
import {Ng2AutoCompleteModule} from 'ng2-auto-complete';
import {ChantierService} from "./_services/chantier.service";
import {RepondreComponent} from "./message/repondre.component";
import {CommandeService} from "./_services/commandes.service";
import {ModifierBDCComponent} from "./bdc/modifiercommande.component";
import {Ajout_vehimatComponent} from "./vehiculemateriel/ajout_vehimat.component";
import {ValidationCommandeComponent} from "./bdc/validationcommande.component";
import {DemandePrixComponent} from "./bdc/demandeprix.component";

import {ListeDevisComponent} from "./devis/listedevis.component";
import {DevisService} from "./_services/devis.service";
import {ListechantierComponent} from "./chantiers/listechantier.component";
import {ListevehimatComponent} from "./vehiculemateriel/listevehimat.component";
import {RechercheBdcComponent} from "./bdc/rechercheBdc.component";
import {SuivivehiculeComponent} from "./vehiculemateriel/suivivehicule.component";
import {SuivimaterielComponent} from "./vehiculemateriel/suivimateriel.component";
import {RechercheVehimatComponent} from "./vehiculemateriel/recherchevehimat.component";
import {RechercheDevisComponent} from "./devis/recherchedevis.component";
import {NewDevisComponent} from "./devis/newDevis.commponent";
import {AjoutchantierComponent} from "./chantiers/ajoutchantier.component";
import {ListefactureComponent} from "./facture/listefacture.component";
import {Balance_generaleComponent} from "./facture/balance_generale.component";
import {FactureService} from "./_services/facture.service";
import {RecherchefacturationComponent} from "./facture/recherchefact.component";
import {RechercheChantierComponent} from "./chantiers/recherchechantier.component";
import {Editer_factureComponent} from "./facture/editer_facture.component";
import {ModifierfactureComponent} from "./facture/modifierfacture.component";
import {DevisComponent} from "./devis/devis.component";
import {ParamsService} from "./_services/params.service";
import {DupliquerDevisComponent} from "./devis/dupliquerdevis.component";
import {FichechantierComponent} from "./chantiers/fichechantier.component";
import {RechercheAchatComponent} from "./listeachat/rechercheachat.component";
import {RechercheVenteComponent} from "./listevente/recherchevente.component";
import {ListefacturechantierComponent} from "./facture/listefacturechantier.component";
import {RecherchechantierfactureComponent} from "./facture/recherchechantierfacture.component";
import {ProduitdevisComponent} from "./chantiers/produitdevis.component";
import {CalendarModule} from "angular-calendar";
import {PlanningComponent} from "./planning/planning.component";
import {DemoUtilsModule} from "./planning/planning-utils/module";
import {CommonModule} from "@angular/common";
import {WeekPipe} from "./_pipes/week.pipe";
import {ChantiermoisComponent} from "./chantiers/chantiermois.component";
import {DevischantierComponent} from "./chantiers/devischantier.component";
import {DepensereelComponent} from "./chantiers/depensereel.component";
import {DepenseprevComponent} from "./chantiers/depenseprev.component";
import {PlanningService} from "./_services/planning.service";
import {AnalysetempsComponent} from "./chantiers/analysetemps.component";
import {BalancechantierComponent} from "./chantiers/balancechantier.component";
import {PhotochantierComponent} from "./chantiers/photochantier.component";
import {ModifierDevisComponent} from "./devis/modifierdevis.component";
import {Planning_simpleComponent} from "./planning/planning_simple.component"
import {DevislibreComponent} from "./devis/devislibre.component";
import {Facture_fournisseurComponent} from "./facture/facture_fournisseur.componnet";
import {ListefacturefournisseurComponent} from "./facture/listefacturefournisseur.component";
import {RecherchefournisseurComponent} from "./facture/rechercherfournisseur.component";
import {Param_genComponent} from "./parametre/param_gen.component";
import {SauvegardeComponent} from "./parametre/sauvegarde.component";
import {TvaComponent} from "./parametre/tva.component";
import {Droit_utilisateurComponent} from "./parametre/droit_utilisateur.component";
import {Cat_prodComponent} from "./parametre/cat_prod.component";
import {Deverouillage_prodComponent} from "./parametre/deverouillage_prod.component";
import {Utilisateur_connectComponent} from "./parametre/utilisateur_connect.component";
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
import {FichecontactpdfComponent} from "./contact/fichecontactpdf.component";
import {Fraisgenan_janvComponent} from "./facture/fraisgenan_janv.component";
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
import {EquipeComponent} from "./planning/equipe.component";
import {Facture_finiComponent} from "./facture/facture_fini.component";
import {DroituserComponent} from "./register/droituser.component";
import {AnalysedevisComponent} from "./devis/analysedevis.component";
import {FormationComponent} from "./parametre/formation.component";
import {FormationcontactComponent} from "./contact/formationcontact.component";
import {RecapitulatifmoisComponent} from "./planning/recapitulatifmois.component";
import {AvoirComponent} from "./facture/avoir.component";
import {ListeavoirComponent} from "./facture/listeavoir.component";
import {AvoirimprimComponent} from "./facture/avoirimprim.component";
import {RechercheavoirComponent} from "./facture/rechercheavoir.component";
import {FicheDevisLibreComponent} from "./devis/ficheDevisLibre.component";
import {DupliquerlibreComponent} from "./devis/dupliquerlibre.component";
import {ModifierlibreComponent} from "./devis/modifierlibre.component";
import {EquipementComponent} from "./contact/equipement.component";
import {ListdemandeComponent} from "./bdc/listdemande.component";
import {PrixComponent} from "./bdc/prix.component";
import {AcompteComponent} from "./facture/acompte.component";
import {AccompteimprimComponent} from "./facture/accompteimprim.component";

import {GestionprojComponent} from "./chantiers/gestionproj.component"; ////////////////////////////////////////////////////
import {GanttComponent} from "./chantiers/gantt.component"; /////////////////////////////////////////////////////////////
import {MenuchantierComponent} from "./chantiers/menuchantier.component";
import {NewfactlibreComponent} from "./facture/newfactlibre.component";
import {FactlibreComponent} from "./facture/factlibre.component";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        ReactiveFormsModule,
        Ng2AutoCompleteModule,
        BrowserAnimationsModule,
        CommonModule,
        NgbModalModule.forRoot(),
        CalendarModule.forRoot(),
        DemoUtilsModule

    ],
    declarations: [

        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        MessageComponent,
        MainoeuvreComponent,
        ListeventeComponent,
        ListeachatComponent,
        ProduitventeComponent,
        ProduitachatComponent,
        ContactComponent,
        AddcontactComponent,
        FichecontactComponent,
        FicheclientComponent,
        SuivicommandeComponent,
        BdcComponent,
        NewMessageComponent,
        RechercheComponent,
        DiscussionComponent,
        RepondreComponent,
        AjoutProduitVenteComponent,
        AjoutProduitAchatComponent,
        EtatstockComponent,
        ModifierBDCComponent,
        ValidationCommandeComponent,
        DemandePrixComponent,
        Ajout_vehimatComponent,
        ListeDevisComponent,
        ListechantierComponent,
        ListevehimatComponent,
        RechercheBdcComponent,
        SuivivehiculeComponent,
        SuivimaterielComponent,
        RechercheVehimatComponent,
        RechercheDevisComponent,
        NewDevisComponent,
        AjoutchantierComponent,
        ListefactureComponent,
        Balance_generaleComponent,
        RecherchefacturationComponent,
        RechercheAchatComponent,
        RechercheVenteComponent,
        RechercheChantierComponent,
        DevisComponent,
        DupliquerDevisComponent,
        Editer_factureComponent,
        ModifierfactureComponent,
        FichechantierComponent,
        ListefacturechantierComponent,
        RecherchechantierfactureComponent,
        ProduitdevisComponent,
        PlanningComponent,
        WeekPipe,
        ChantiermoisComponent,
        DevischantierComponent,
        DepensereelComponent,
        DepenseprevComponent,
        AnalysetempsComponent,
        BalancechantierComponent,
        PhotochantierComponent,
        ModifierDevisComponent,
        ModifierlibreComponent,
        Planning_simpleComponent,
        DevislibreComponent,
        Facture_fournisseurComponent,
        ListefacturefournisseurComponent,
        Param_genComponent,
        SauvegardeComponent,
        TvaComponent,
        Droit_utilisateurComponent,
        Cat_prodComponent,
        Deverouillage_prodComponent,
        Utilisateur_connectComponent,
        RecherchefournisseurComponent,
        FournisseurComponent,
        FraisgenerauxanComponent,
        FraismoisComponent,
        CgvComponent,
        Gestion_hComponent,
        AbsComponent,
        Ajout_absComponent,
        Form_empComponent,
        Int_chantierComponent,
        New_intComponent,
        FileSelectDirective,
        FileDropDirective,
        FraisprevisionelComponent,
        BalancechantierpdfComponent,
        FichecontactpdfComponent,
        Fraisgenan_janvComponent,
        Fraisgenan_fevComponent,
        Fraisgenan_marsComponent,
        Fraisgenan_avrilComponent,
        Fraisgenan_maiComponent,
        Fraisgenan_juinComponent,
        Fraisgenan_juilComponent,
        Fraisgenan_aoutComponent,
        Fraisgenan_septComponent,
        Fraisgenan_octComponent,
        Fraisgenan_novComponent,
        Fraisgenan_decComponent,
        Fraisgenan_pdfComponent,
        LicenceComponent,
        DevisclientComponent,
        RechercheContactComponent,
        Histo_devisComponent,
        Histo_facComponent,
        UtilisationComponent,
        DroituserComponent,
        UtilisationComponent,
        EquipeComponent,
        Facture_finiComponent,
        AnalysedevisComponent,
        FormationComponent,
        FormationcontactComponent,
        RecapitulatifmoisComponent,
        AvoirComponent,
        ListeavoirComponent,
        AvoirimprimComponent,
        RechercheavoirComponent,
        RecapitulatifmoisComponent,
        FicheDevisLibreComponent,
        DupliquerlibreComponent,
        EquipementComponent,
        ListdemandeComponent,
        PrixComponent,
        AcompteComponent,
        AccompteimprimComponent,
        GestionprojComponent,
        GanttComponent,
        MenuchantierComponent,
        NewfactlibreComponent,
        FactlibreComponent

    ],
    providers: [
        AppConfig,
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        ContactService,
        AchatsService,
        VentesService,
        MessageService,
        ChantierService,
        ConversationService,
        CommandeService,
        DevisService,
        FactureService,
        ParamsService,
        PlanningService,
    ],
    exports: [PlanningComponent],
    bootstrap: [AppComponent]
})

export class AppModule {
}
