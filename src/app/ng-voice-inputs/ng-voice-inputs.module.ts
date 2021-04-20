import { NgModule } from '@angular/core';
import { NgVoiceInputsComponent } from './ng-voice-inputs.component';
import { VuiInputDirective } from './vui-input.directive';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [
    NgVoiceInputsComponent,
    VuiInputDirective
  ],
  imports: [
    CommonModule,
    BrowserModule
  ],
  exports: [
    NgVoiceInputsComponent,
    VuiInputDirective
  ]
})
export class NgVoiceInputsModule { }
