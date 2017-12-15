import {
    ChangeDetectionStrategy,
    Component,
    OnChanges,
    OnInit,
    SimpleChanges,
    TemplateRef,
    ViewChild
} from '@angular/core';
import {addDays, addHours, endOfDay, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays} from 'date-fns';
import {Subject} from 'rxjs/Subject';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent} from 'angular-calendar';
import {ContactService} from "../_services/contact.service";
import {ChantierService} from "../_services/chantier.service";
import {AlertService} from "../_services/alert.service";

import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {PlanningService} from "../_services/planning.service";
import {ParamsService} from "../_services/params.service";
import {User} from "../_models/user";


const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    }
};

@Component({
    moduleId: module.id,
    selector: 'mwl-demo-component',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['styles.css'],
    templateUrl: 'planning.component.html'
})
export class PlanningComponent implements OnInit, OnChanges {

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
    }

    ngOnInit(): void {
        this.loaddroituser();
        this.contactService.getAllEmploye().subscribe(
            data => {
                this.employes = data;
                this.refresh.next();
            }
        );

        this.chantierService.getAll().subscribe(
            data => {
                this.chantiers = data;

            }
        );

        this.selectTT();


    }

    @ViewChild('modalContent') modalContent: TemplateRef<any>;
    @ViewChild('modalAdd') modalAdd: TemplateRef<any>;

    view: string = 'month';

    locale: string = "fr";

    viewDate: Date = new Date();

    employes: any[] = [];
    chantiers: any[] = [];


    modalData: {
        action: string;
        event: CalendarEvent;
    };

    modalDataAdd: any = {};

    employe: any = {};
    print: boolean = false;

    currentUser: User;         //
    droitsuser: any = {};         //
    _id: any;                   //
    data: any = {};


    actions: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({event}: { event: CalendarEvent }): void => {
                this.handleEvent('Edited', event);
            }
        },
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({event}: { event: CalendarEvent }): void => {
                this.events = this.events.filter(iEvent => iEvent !== event);
                this.handleEvent('Deleted', event);
            }
        }
    ];

    refresh: Subject<any> = new Subject();

    events: any[] = [
        /*{
             start: subDays(startOfDay(new Date()), 1),
             end: addDays(new Date(), 1),
             title: 'Première pierre stade',
             employe:{
                 prenom:"Alexandre",
                 nom:"BAR",
             },
             color: colors.red,
             actions: this.actions
         },
         {
             start: subDays(endOfMonth(new Date()), 3),
             end: addDays(endOfMonth(new Date()), 3),
             title: 'Formation n° 36 - Semaine 1',
             employe:{
                 prenom:"Manon",
                 nom:"LE ROY",
             },
             color: colors.blue
         },
         {
             start: addHours(startOfDay(new Date()), 2),
             end: new Date(),
             title: 'RDV stade, fondations à determiner',
             employe:{
                 prenom:"Alexandre",
                 nom:"BAR",
             },
             color: colors.yellow,
             actions: this.actions,
             resizable: {
                 beforeStart: true,
                 afterEnd: true
             },
             draggable: true
         }*/
    ];
    activeDayIsOpen: boolean = true;

    constructor(private modal: NgbModal,
                private contactService: ContactService,
                private planningService: PlanningService,
                private alertService: AlertService,
                private _sanitizer: DomSanitizer,
                private chantierService: ChantierService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    selectTT() {
        this.planningService.getAll().subscribe(
            data => {
                for (let i = 0; i < data.length; i++) {
                    data[i].end = addHours(new Date(data[i].end), 2);
                    data[i].start = addHours(new Date(data[i].start), 2);

                }

                this.events = data;
                this.events.forEach(event => {
                    let date = new Date(event.start);
                    event.title = (date.getHours()>9 ?date.getHours() : "0" +date.getHours()) + ":" + (date.getMinutes()>9? date.getMinutes() : "0"+date.getMinutes() ) + " " + event.title;
                });

                if (this.employe.name && this.employe.name.id_contact) {
                    console.log(this.events);
                    this.events = this.events.filter(obj => obj.employe.id_contact == this.employe.name.id_contact);
                    //console.log(this.events);
                    this.refresh.next();
                }
                this.refresh.next();


            }
        );

    }

    loaddroituser() {                                 //
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {

            this.droitsuser = data[0];


        });
    }

    dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
    }

    delete(event: any) {

        this.planningService.delete(event.id_event).subscribe(
            data => {
                console.log("removed")
                this.events = this.events.filter(obj => obj.id_event != event.id_event);
                this.refresh.next();
            },
            err => {
                console.log("erreur remove event")
            }
        )
    }


    update(event: any) {

        this.planningService.update(event).subscribe(
            data => {
                console.log("updated")
                this.events = this.events.filter(obj => obj.id_event != event.id_event);
                this.events.push(event);
                //retirer puis remettre l'event qui a l'id concernée

                this.refresh.next()
            },
            err => {
                console.log("error during update")
            }
        )
    }


    eventTimesChanged({
                          event,
                          newStart,
                          newEnd
                      }: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        this.handleEvent('Dropped or resized', event);
        this.refresh.next();
    }

    handleEvent(action: string, test: CalendarEvent): void {

        let event = Object.assign({}, test);

        this.modalData = {action, event};
        console.log(this.modalData);
        this.modal.open(this.modalContent, {size: 'lg'});
    }


    addEvent(): void {
        this.modalDataAdd = {
            start: startOfDay(new Date()),
            end: endOfDay(new Date()),
            color: colors.red,
        };
        this.modal.open(this.modalAdd, {size: 'lg'});
    }

    dbcall(): void {
        this.planningService.add(this.modalDataAdd).subscribe(data => {
            console.log(data);

            this.events.push({
                id_event: data,
                title: this.modalDataAdd.title,
                start: this.modalDataAdd.start,
                end: this.modalDataAdd.end,
                type: this.modalDataAdd.type,
                chantier: this.modalDataAdd.chantier,
                color: this.modalDataAdd.color,
                employe: this.modalDataAdd.employe,
                draggable: true,
                resizable: {
                    beforeStart: true,
                    afterEnd: true
                }
            });
            this.modalDataAdd = {};
            this.refresh.next();
        });


    }


    autocompleListFormatterContact = (data: any): SafeHtml => {
        let html = `<span>${data.raison_sociale ? data.raison_sociale : data.nom + " " + data.prenom}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    autocompleListFormatterContactValue = (data: any): SafeHtml => {
        let html = `${(data.nom || data.prenom) ? ((data.nom ? (data.nom + " ") : "") + (data.prenom ? data.prenom : "")) : ""}`;
        return html;
    };


    autocompleListFormatterchantier = (data: any): SafeHtml => {
        let html = `<span>${data.nom_chantier} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    imprimer() {
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            window.print();
            this.print = false;
        }, 1000);

    }
}

