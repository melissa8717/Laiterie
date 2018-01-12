
(function (global) {
    System.config({
        paths: {
            // paths serve as alias
            'npm:': 'node_modules/'
        },
        // map tells the System loader where to look for things
        map: {
            // our app is within the app folder
            app: 'app',

            // angular bundles
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/http/testing': 'npm:@angular/http/bundles/http-testing.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',


            '@angular/animations': 'npm:@angular/animations/bundles/animations.umd.js',
            '@angular/animations/browser': 'npm:@angular/animations/bundles/animations-browser.umd.js',
            '@angular/platform-browser/animations': 'npm:@angular/platform-browser/bundles/platform-browser-animations.umd.js',

            'angular-calendar': 'npm:angular-calendar/dist/umd/angular-calendar.js',
            'calendar-utils': 'npm:calendar-utils/dist/umd/calendar-utils.js',
            'angular-resizable-element': 'npm:angular-resizable-element/dist/umd/angular-resizable-element.js',
            'angular-draggable-droppable': 'npm:angular-draggable-droppable/dist/umd/angular-draggable-droppable.js',
            'date-fns': 'npm:date-fns',
            '@ng-bootstrap/ng-bootstrap': 'npm:@ng-bootstrap/ng-bootstrap',
            'ng2-file-upload': 'npm:ng2-file-upload/',
            'dhtmlx-gantt': 'npm:dhtmlx-gantt/',
            'traceur':'npm:traceur/bin',
            'jspdf':'npm:jspdf/dist/jspdf.min.js',

            'ng2-auto-complete': 'npm:ng2-auto-complete/dist/ng2-auto-complete.umd.js',
            'moment' : 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
            'rxjs': 'npm:rxjs'
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            app: {
                main: './main.js',
                defaultExtension: 'js'
            },
            rxjs: {
                defaultExtension: 'js'
            },
            'date-fns': {
                main: 'index.js',
                defaultExtension: 'js'
            },
            'ng2-file-upload': {
                main: 'index.js',
                defaultExtension: 'js'
            },
            '@ng-bootstrap/ng-bootstrap': {
                main: 'index'
            },
            traceur:{
                main: 'traceur'
            }
        }
    });
})(this);
