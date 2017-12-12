import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, ChantierService, ParamsService} from '../_services/index';
import {User} from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'fichechantier.component.html'
})

export class FichechantierComponent implements OnInit {


    private loc = location.hostname;
    private currentUser: User;
    private droitsuser: any = {};
    private model: any = {};
    private id_chantier: number;
    private phases: any[] = [];
    private id_phase: number;
    private aphases: any = {};
    private mat: any;
    private rapports: any[] = [];
    private id_rapport: number;
    private araps: any = {};
    private print: boolean = false;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private chantierService: ChantierService,
                private alertService: AlertService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loaddroituser();

        this.route.params.subscribe(params => {
            this.id_chantier = params['id_chantier'];

            this.loadTout();
            this.loadRapport();
            this.loadphase();
        });
    }

    loaddroituser() {
        this.paramsService.getByIdDroit(this.currentUser._id).subscribe(data => {
            this.droitsuser = data[0];
        });
    }

    loadTout() {
        this.chantierService.getByIdTout(this.id_chantier).subscribe(data => {
            this.model = data[0];
        })
    }

    modify() {
        let chantierparams: any = {};
        chantierparams.model = this.model;

        this.chantierService.updateFiche(chantierparams).subscribe(() => {
            this.router.navigate(["/listechantier"]);
            this.alertService.success("Le chantier a été modifié.");
        });
    }


    /*-------------------------------------Phase-----------------------------------*/
    private loadphase() {
        this.chantierService.getByIdPhase(this.id_chantier).subscribe(data => {
            this.phases = data;
        })
    }

    private deletePhase(id_phase: any) {
        this.chantierService.deletePhase(id_phase).subscribe(() => {
            this.phases = this.phases.filter(x => x.id_phase != id_phase);
        }, error => {
            this.alertService.error(error._body);
        });
    }

    addPhase() {
        this.chantierService.addPhase(this.id_chantier, this.aphases).subscribe(mat => {
            this.mat = mat;
            this.phases.push(this.aphases);
            this.aphases = {};
        });
    }

    /*------------------------Rapport-----------------------------------------*/
    private loadRapport() {
        this.chantierService.getByIdRapport(this.id_chantier).subscribe(data => {
            this.rapports = data;
        })
    }

    private deleteRapport(id_rapport: any) {
        this.chantierService.deletePhase(id_rapport).subscribe(() => {
            this.rapports = this.rapports.filter(x => x.id_rapport != id_rapport);
        }, error => {
            this.alertService.error(error._body);
        });
    }

    addRapport() {
        this.chantierService.addRapport(this.id_chantier, this.araps).subscribe(rap => {
            this.mat = rap;
            this.rapports.push(this.araps);
            this.araps = {};
        });
    }

    imprimer() {
        this.alertService.clear();
        this.print = true;
        setTimeout(() => {
            let css = '@page { size: landscape; }',
                head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');

            style.type = 'text/css';
            style.media = 'print';

            if (style.sheet) {
            } else {
                style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            window.print();
            this.print = false;
        }, 1000);
    }

}












