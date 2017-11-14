import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {AlertService, AuthenticationService} from '../_services/index';
import {PlanningService} from "../_services/planning.service";
import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    isSameDay,
    isSameMonth,
    addHours,
    addMonths,
    subMonths,
    startOfMonth,
    getDay,
    endOfMonth,
    getMonth,
    getYear,
    getDaysInMonth,
} from 'date-fns';
import {ContactService} from "../_services/contact.service";
import {ChantierService} from "../_services/chantier.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";


@Component({
    moduleId: module.id,
    templateUrl: 'planning_simple.component.html'
})

export class Planning_simpleComponent implements OnInit {

    month: Date = new Date();
    view:string = "Chantier";
    ouvriers: any[] = [];
    ouvriersfiltered: any[] = [];
    equipes: any[] = [];
    equipe: number;
    chantiers : any[] = [];
    travaux: any[];
    travaux_equipe: any[];
    weekdays = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    print: boolean = false;

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};

    monthArray: string[] = [
        "Janvier",
        "Fevrier",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Aout",
        "Septembre",
        "Octobre",
        "Novembre",
        "Decembre",
    ];


    modalData: any;
    modalDataAdd: any;

    @ViewChild('modalContent') modalContent: TemplateRef<any>;
    @ViewChild('add') modalAdd: TemplateRef<any>;


    constructor(private route: ActivatedRoute,
                private router: Router,
                private planningService: PlanningService,
                private contactService: ContactService,
                private chantierService: ChantierService,
                private _sanitizer: DomSanitizer,
                private modal: NgbModal,
                private alertService: AlertService,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    inittable(size: number) {
        let table = [];
        for (let i = 0; i < size; i++) {
            table.push(i);
        }
        //console.log(table);

        return table;
    }

    getMonthDays(date: Date) {
        return getDaysInMonth(date);
    }

    start(date: Date) {
        return getDay(startOfMonth(date));
    }

    up() {
        this.month = addMonths(this.month, 1);
    }

    back() {
        this.month = subMonths(this.month, 1);
    }

    loadAllEquipes() {
        this.contactService.getAllEquipes().subscribe(
            data => {
                this.equipes = data;
                console.log(data)
            }
        );
    }


    loadAllOuvriers() {
        this.contactService.getAllOuvriers().subscribe(
            data => {
                this.ouvriers = data;
                this.ouvriersfiltered = data;
                console.log(data)
            }
        );
    }

    swapView(){
        if(this.view == 'Heures')
            this.view = "Chantier"
        else if(this.view == "Chantier")
            this.view = 'Heures'
    }


    loadAllTravail() {
        this.planningService.getAllTravail().subscribe(
            data =>  {
                this.travaux = data[0].solo;
                this.travaux_equipe = data[0].equipe;
                //console.log("check");
                console.log(data);
            }
        );
    }


    /**
     * Retourne le nombre d'heures d'un ouvrier pour une date donnée
     * @param date
     * @param n
     * @param id_ouvrier
     * @returns {any}
     */
    isTravail(date: Date, n: number, id_ouvrier: number, id_equipe: number) {

        date = addDays(startOfMonth(date), n);

        var test: any[] = this.travaux.filter(obj => ((obj.id_employé == id_ouvrier) && (isSameDay(date, new Date(obj.date)))));
        var testequipe: any[] = this.travaux_equipe.filter(obj => ((obj.id_equipe == id_equipe) && (isSameDay(date, new Date(obj.date)))));


        let total: number = 0;

        //Calcul des heures selon les types
        for (let travail  in test) {
            if(test[travail].type == 'Travail')
                total += this.getMinutesFromTime(test[travail].nb_heure);
            if(test[travail].type == 'Retard' || test[travail].type == 'Absence')
                total -= this.getMinutesFromTime(test[travail].nb_heure);
            if(test[travail].type == 'CP')
                return 'CP';
            if(test[travail].type == 'RTT')
                return 'RTT';

        }

        for (let travailequipe  in testequipe) {
            if(testequipe[travailequipe].type == 'Travail')
                total += this.getMinutesFromTime(testequipe[travailequipe].nb_heure);
            if(testequipe[travailequipe].type == 'Retard' || testequipe[travailequipe].type == 'Absence')
                total -= this.getMinutesFromTime(testequipe[travailequipe].nb_heure);
        }

        if (total == 0 && (test.length > 0 || test.length >0))
            return "00:00";
        else if (total == 0)
            return "";
        return this.getTimeFromMinutes(total);
    }


    /**
     * Retourne le code chantier d'un ouvrier pour une date donnée
     * @param date
     * @param n
     * @param id_ouvrier
     * @returns {any}
     */
    getChantier(date: Date, n: number, id_ouvrier: number, id_equipe: number) {
        date = addDays(startOfMonth(date), n);

        var test: any[] = this.travaux.filter(obj => ((obj.id_employé == id_ouvrier) && (isSameDay(date, new Date(obj.date)))));

        var testequipe: any[] = this.travaux_equipe.filter(obj => ((obj.id_equipe == id_equipe) && (isSameDay(date, new Date(obj.date)))));

        let id_chantier: number;

        for (let travail  in test) {
            if(test[travail].type == 'CP')
                return 'CP';
            if(test[travail].type == 'RTT')
                return 'RTT';
            if(!id_chantier){
                id_chantier = test[travail].id_chantier
            }
            else{
                if(id_chantier != test[travail].id_chantier)
                    return "Divers"
            }
        }

        for (let travailequipe  in testequipe) {
            if(!id_chantier){
                id_chantier = testequipe[travailequipe].id_chantier
            }
            else{
                if(id_chantier != testequipe[travailequipe].id_chantier)
                    return "Divers"
            }
        }

        return id_chantier
    }

    loadTeam(){
        if(this.equipe.toString() == "all"){
            this.ouvriersfiltered = this.ouvriers;
        }
        else{
            this.ouvriersfiltered = this.ouvriers.filter(obj => (obj.id_equipe == this.equipe) );
            console.log(this.ouvriersfiltered)
        }
    }


    ngOnInit() {
        this.loaddroituser();
        this.loadAllOuvriers();
        this.loadAllTravail();
        this.loadAllEquipes();
        this.chantierService.getAll().subscribe(
            data=>{
                this.chantiers = data;
            }
        );
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";


    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }

    getMinutesFromTime(timer: string): number {
        if (timer) {
            var t = timer.split(':');
            return parseInt(t[0]) * 60 + parseInt(t[1]);
        }
        return 0;
    }

    getTimeFromMinutes(min: number): string {
        if (min) {
            var h = Math.floor(min / 60);
            var m = min % 60;
            var h1 : string = h < 10 ? '0' + h.toString() : h.toString();
            var m1 : string = m < 10 ? '0' + m.toString() : m.toString();
            return h1 + ':' + m1;
        }
        return "00:00";
    }



    checkValid(date: Date, n: number, ouvrier: any){
        date = addDays(startOfMonth(date), n);

        var test: any[] = this.travaux.filter(obj => ((obj.id_employé == ouvrier.id_contact) && (isSameDay(date, new Date(obj.date)))));

        var testequipe: any[] = this.travaux_equipe.filter(obj => ((obj.id_equipe == ouvrier.id_equipe) && (isSameDay(date, new Date(obj.date)))));



        for (let travail  in test) {
            if(!test[travail].valid)
                return false;
        }

        for (let travailequipe  in testequipe) {
            if(!testequipe[travailequipe].valid)
                return false;
        }
        return true;
    }

    supprimer(travail : any){
        console.log(travail);
        this.planningService.deleteTravail(travail.id_travail).subscribe(
            data=>{
                this.travaux= this.travaux.filter(obj => (obj.id_travail != travail.id_travail));
            }
        )
    }

    supprimerTeam(travail : any){
        console.log(travail);
        this.planningService.deleteTravailEquipe(travail.id_travail).subscribe(
            data=>{
                this.travaux_equipe = this.travaux_equipe.filter(obj => (obj.id_travail != travail.id_travail));
            }
        )
    }

    valider(travail : any){
        console.log(travail);
        this.planningService.validate(travail).subscribe(
            data=>{
                travail.valid = true;
            }
        )
    }

    validerTeam(travail : any){
        console.log(travail);
        this.planningService.validateTeam(travail).subscribe(
            data=>{
                travail.valid = true;
            }
        )
    }

    openAdd(){
        this.modalDataAdd = {emp: {nb_heure:"08:00"}, eq:{nb_heure:"08:00"}};
        this.modal.open(this.modalAdd, { size: 'lg' });
    }

    test(date: Date, n: number, ouvrier: any){

        date = addDays(startOfMonth(date), n);
        this.modalData = {};

        var test: any[] = this.travaux.filter(obj => ((obj.id_employé == ouvrier.id_contact) && (isSameDay(date, new Date(obj.date)))));

        var testequipe: any[] = this.travaux_equipe.filter(obj => ((obj.id_equipe == ouvrier.id_equipe) && (isSameDay(date, new Date(obj.date)))));


        this.modalData.solo = test;
        this.modalData.team = testequipe;
        this.modalData.date = date;
        this.modalData.nom = (ouvrier.nom || ouvrier.prenom) ? ((ouvrier.nom ? (ouvrier.nom + " "): "" )  + (ouvrier.prenom ? ouvrier.prenom : "")) : "";

        this.modal.open(this.modalContent, { size: 'lg' });
    }


    autocompleListFormatterContact = (data: any): SafeHtml => {
        let html = `<span>${data.raison_sociale ? data.raison_sociale : data.nom +" " +data.prenom}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    autocompleListFormatterContactValue = (data: any): SafeHtml => {
        let html = `${(data.nom || data.prenom) ? ((data.nom ? (data.nom + " "): "" )  + (data.prenom ? data.prenom : "")) : ""}`;
        return html;
    };


    autocompleListFormatterEquipe = (data: any): SafeHtml => {
        let html = `<span>Equipe n°${data.n_equipe}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    autocompleListFormatterEquipeValue = (data: any): SafeHtml => {
        let html = `Equipe n°${data.n_equipe}`;
        return html;
    };

    addEquipe(){
        console.log(this.modalDataAdd.eq)


        this.planningService.addTeamEvents(this.modalDataAdd.eq).subscribe(
            data=>{
                console.log("ok");
                this.loadAllTravail();
                this.alertService.success("Les heures ont été ajoutées avec succès");
            },
            err=>{
                this.alertService.error("Les heures n'ont pas pu être ajoutées, réessayez plus tard ou contactez un admin")
            }
        )
    }

    addEmploye(){
        console.log(this.modalDataAdd.emp)
        this.planningService.addEmployeEvents(this.modalDataAdd.emp).subscribe(
            data=>{
                console.log("ok");
                this.loadAllTravail();
                this.alertService.success("Les heures ont été ajoutées avec succès");
            },
            err=>{
                this.alertService.error("Les heures n'ont pas pu être ajoutées, réessayez plus tard ou contactez un admin")
            }
        )

    }

    autocompleListFormatterchantier = (data: any): SafeHtml => {
        let html = `<span ngStyle="'color':data.couleur">${data.nom_chantier} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    private modify() {
        console.log("new id_event: " + JSON.stringify(this.modal));
        this.planningService.updateplanning_simple(this.modal).subscribe(
            (data:any) => {
                this.alertService.success('Votre demande a été modifiée avec succès', true);
                console.log("added successful: " + data);
                console.log(this.modal);
            }
        );
    }
    imprimer() {
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            window.print();
            this.print = false;
        }, 1000);

    }
}
