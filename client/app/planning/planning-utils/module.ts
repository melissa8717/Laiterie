import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    NgbDateParserFormatter,
    NgbDatepickerModule,
    NgbTimepickerModule
} from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule } from 'angular-calendar';
import { CalendarHeaderComponent } from './calendar-header.component';
import { DateTimePickerComponent } from './date-time-picker.component';
import {NgbDateMomentParserFormatter} from "./NgbDateParserFormatter";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),
        CalendarModule
    ],
    declarations: [CalendarHeaderComponent, DateTimePickerComponent],
    exports: [CalendarHeaderComponent, DateTimePickerComponent],
    providers: [
        {
            provide: NgbDateParserFormatter,
            useFactory: () => { return new NgbDateMomentParserFormatter("DD-MM-YYYY") }
        }
    ]
})
export class DemoUtilsModule {}

/**
 * Created by Wbat on 01/08/2017.
 */
