/**
 * Created by cédric on 29/06/2017.
 */
import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AlertService} from '../_services/index';
import {ParamsService} from '../_services/params.service';
import {User} from '../_models/user';

@Component({
    moduleId: module.id,
    templateUrl: 'licence.component.html'
})

export class LicenceComponent {
    model: any = {};
    currentUser: User;
    com: any[] = [];


    constructor(private router: Router,
                private alertService: AlertService,
                private paramsService: ParamsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        //this.authenticationService.logout();
        let body = document.getElementsByTagName('body')[0];
        body.className = '';
        body.className += 'flatclair';

        this.loadCom();

    }

    modify(ag_params: any) {
        let test = +confirm('Acceptez vous les conditions de vente :');
        if (test) {
            this.paramsService.updateTest(ag_params).subscribe(() => {
                this.router.navigate(['/login']);
                this.alertService.success('La licence a bien été mise à jour.');
            });
        }
    }

    loadCom() {
        this.paramsService.getComlic().subscribe(com => {
            this.com = com;
            console.log(this.com);
        });
    }

}
