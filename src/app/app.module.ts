import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule, LOCALE_ID } from '@angular/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { AppComponent } from './app.component';
import { MatCardModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, 
         MatTabsModule, MatIconModule, MatProgressSpinnerModule, MatTableModule, 
         MatPaginatorModule, MatChipsModule, MatCheckboxModule, MatSnackBar, MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS, MatButtonToggleModule, MatBadgeModule, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule} from '@angular/material/select';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import {PaginatorModule} from 'primeng/paginator';
import {ButtonModule} from 'primeng/button';
import { VuiInputDirective } from '@ng-voice-inputs/vui-input.directive';
import { NgVoiceInputsComponent } from '../app/ng-voice-inputs/ng-voice-inputs.component';

@NgModule({
  declarations: [
    AppComponent,
    VuiInputDirective,
    NgVoiceInputsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
    MatTabsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    TableModule,
    PaginatorModule,
    ButtonModule,
    MatButtonToggleModule,
    MatBadgeModule
  ],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['DD/MM/YYYY'],
        },
        display: {
          dateInput: 'DD/MM/YYYY', 
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
