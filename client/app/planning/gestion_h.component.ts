import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';
import {PlanningService} from "../_services/planning.service";
import {ParamsService} from "../_services/params.service"; //
import {User} from "../_models/user";


@Component({
    moduleId: module.id,
    templateUrl: 'gestion_h.component.html'
})

export class Gestion_hComponent {

    print: boolean = false;


    date: boolean = false;
    loading = false;
    my: Date = new Date();

    currentUser: User;         //
    droitsuser:any={};         //
    _id:any;                   //
    data:any={};
    semaine:any= []=[];
    temps:any;

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


    r:number;



    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private planningService: PlanningService,
                private paramsService:ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.className += "flatclair";
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.loaddroituser();
        this.loadMois()
    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];

            console.log(this.data);
            console.log(this.currentUser._id);

        });
    }
    //setWeekNumber(Date: number, date?: number): number;


    back(){
        this.my.setMonth(this.my.getMonth()-1);
        this.loadMois()
    }

    up(){
        this.my.setMonth(this.my.getMonth()+1);
        //console.log(this.my);
        this.loadMois();
    }


    loadMois() {

        this.date = false;
        this.planningService.getAllHeuresem(this.my.getMonth()+1, this.my.getFullYear()).subscribe(
            data => {
                this.semaine = data;
                this.loading= false;
                console.log(this.semaine)
            },
            err =>{
                this.alertService.error("Impossible de charger les semaines du mois, veuillez réessayer ultérieurement");
                this.loading= false;
            }
        );
    }

    customTrackBy(index: number, obj: any): any {
        return index;
    }

    getHourFromTime(timer: string): number {
        if (timer) {
            var t = timer.split(':');
            //console.log(parseInt(t[0]) * 60 + parseInt(t[1]));
            return parseInt(t[0]) * 3600 + parseInt(t[1]) *60 +parseInt(t[2]);
        }
        return 0;
    }

    /*countTRentre(semaines:any){

        return (parseInt(semaines.sumse,10)/3600) >35 ? 35 : parseInt(semaines.sumse,10);

    }*/

    countTrentre(semaines:any): number {
        //console.log(this.getHourFromTime(semaines.temps));
        return (this.getHourFromTime(semaines.temps))>=126000 ? 35 : (this.getHourFromTime(semaines.temps))/3600;
    }

    countNeuf(semaines:any): any {
        //console.log(this.getHourFromTime(semaines.temps));
        return (this.getHourFromTime(semaines.temps))>=140400 ? 4 : (this.getHourFromTime(semaines.temps))<=126000 ? 0 : (((this.getHourFromTime(semaines.temps))-126000)/3600);
    }

    countQuart(semaines:any): any {
        //console.log(this.getHourFromTime(semaines.temps));
        return (this.getHourFromTime(semaines.temps))>=154800 ? 4 : (this.getHourFromTime(semaines.temps))<=140400 ? 0 : (((this.getHourFromTime(semaines.temps))-140400)/3600);
    }

    countQTroi(semaines:any): any {
        //console.log(this.getHourFromTime(semaines.temps));
        return (this.getHourFromTime(semaines.temps))>=154800 ? (((this.getHourFromTime(semaines.temps))-154800)/3600) : 0;
    }

    countTotalligne(semaines:any){
        return this.countTrentre(semaines) * semaines.tauxsurcharge + this.countNeuf(semaines)*semaines.tauxsurcharge * 1.25 + this.countQuart(semaines)*semaines.tauxsurcharge * 1.25 + this.countQTroi(semaines)*semaines.tauxsurcharge * 1.5 +semaines.somme*semaines.panier;
    }

    counttotalHeure(semaines:any) {
        let totalopt = 0;

        for (let semaines of this.semaine) {


            totalopt +=  semaines.sumse/3600 ;
        }
        return totalopt;
    }

    counttotalHeuretre(semaines:any) {
        let totalopt = 0;

        for (let semaines of this.semaine) {


            totalopt += (this.getHourFromTime(semaines.temps))>=126000 ? 35 : (this.getHourFromTime(semaines.temps))/3600 ;
        }
        return totalopt;
    }

    counttotalHeureneuf(semaines:any) {
        let totalopt = 0;

        for (let semaines of this.semaine) {


            totalopt += (this.getHourFromTime(semaines.temps))>=140400 ? 4 : (this.getHourFromTime(semaines.temps))<=126000 ? 0 : (((this.getHourFromTime(semaines.temps))-126000)/3600) ;
        }
        return totalopt;
    }

    counttotalHeuretrois(semaines:any) {
        let totalopt = 0;

        for (let semaines of this.semaine) {


            totalopt += (this.getHourFromTime(semaines.temps)) >= 154800 ? 4 : (this.getHourFromTime(semaines.temps)) <= 140400 ? 0 : (((this.getHourFromTime(semaines.temps)) - 140400) / 3600);
        }
        return totalopt;
    }

    counttotalHeuresup(semaines:any) {
        let totalopt = 0;

        for (let semaines of this.semaine) {


            totalopt +=  (this.getHourFromTime(semaines.temps))>=154800 ? (((this.getHourFromTime(semaines.temps))-154800)/3600) : 0;
        }
        return totalopt;
    }

    counttotalpanier(semaines:any) {
        let totalopt = 0;

        for (let semaines of this.semaine) {


            totalopt +=   (semaines.panier>=0) ? semaines.somme * semaines.panier : 0;
        }
        return totalopt;
    }

    counttotalCout(semaines:any) {
        let totalopt = 0;

        for (let semaines of this.semaine) {


            totalopt +=   this.countTrentre(semaines) * semaines.tauxsurcharge + this.countNeuf(semaines)*semaines.tauxsurcharge * 1.25 + this.countQuart(semaines)*semaines.tauxsurcharge * 1.25 + this.countQTroi(semaines)*semaines.tauxsurcharge * 1.5 +semaines.somme*semaines.panier;

        }
        return totalopt;
    }



    /*getWeekOfYear(date) {
        var target = new Date(date.valueOf()),
            dayNumber = (date.getUTCDay() + 6) % 7,
            firstThursday;

        target.setUTCDate(target.getUTCDate() - dayNumber + 3);
        firstThursday = target.valueOf();
        target.setUTCMonth(0, 1);

        if (target.getUTCDay() !== 4) {
            target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7);
        }

        return Math.ceil((firstThursday - target) /  (7 * 24 * 3600 * 1000)) + 1;
    }*/

    // TEST GetWeek() - VOIR POUR CONVERTIR EN TS !!!
    /*Date.prototype.getWeek = function (dowOffset) {
        dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
        var newYear = new Date(this.getFullYear(),0,1);
        var day = newYear.getDay() - dowOffset; //the day of week the year begins on
        day = (day >= 0 ? day : day + 7);
        var daynum = Math.floor((this.getTime() - newYear.getTime() -
            (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
        var weeknum;
        //if the year starts before the middle of a week
        if(day < 4) {
            weeknum = Math.floor((daynum+day-1)/7) + 1;
            if(weeknum > 52) {
                nYear = new Date(this.getFullYear() + 1,0,1);
                nday = nYear.getDay() - dowOffset;
                nday = nday >= 0 ? nday : nday + 7;
                //if the next year starts before the middle of the week, it is week #1 of that year
                weeknum = nday < 4 ? 1 : 53;
            }
        }
        else {
            weeknum = Math.floor((daynum+day-1)/7);
        }
        return weeknum;
    };*/
    // /FIN TEST getWeek()


    /*getWeekNumber() {
    var d = new Date();
    var DoW = d.getDay();
    d.setDate(d.getDate() - (DoW + 6) % 7 + 3); // Nearest Thu
    var ms = d.valueOf(); // GMT
    d.setMonth(0);
    d.setDate(4); // Thu in Week 1
    return  Math.round((ms - d.valueOf()) / (7 * 864e5)) + 1;
}*/


}