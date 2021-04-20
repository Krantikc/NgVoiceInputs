import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, Input, ViewEncapsulation } from '@angular/core';
import { VuiVoiceRecognitionService } from './ng-voice-inputs.service';
import * as moment_ from 'moment/moment';
const moment = moment_;
import VuiResponse from './vui-response';

const DEFAULT_STYLE = {
  containerClass: 'centered',
  iconStart: 'icon icon-mic',
  iconParse: 'icon icon-mic',
  iconStop: 'icon icon-mic',
  animationParse: 'parsing',
  animationListen: 'listening'
}

@Component({
  selector: 'ng-voice-input',
  template: `
              <div [class]="style.containerClass">
                <i [class]="style.iconStart" mat-raised-button (click)="startRecognition()" *ngIf="!process"></i>
                <i [ngClass]="process == 'parsing' ? style.iconParse + ' ' + style.animationParse : style.iconStop + ' ' + style.animationListen" (click)="stopRecognition()" *ngIf="process"></i>
              </div>
            `,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./ng-voice-inputs.component.scss']
})
export class NgVoiceInputsComponent implements OnInit {

  recognition: any;
  transcript: string;
  selectedDate: Date;
  process: any;

  @Input()
  style;

  @Output()
  onValueChange: EventEmitter<any> = new EventEmitter();
  
  constructor(private vuiService: VuiVoiceRecognitionService, private ref: ChangeDetectorRef) { }

  ngOnInit() {

    this.style = { ...DEFAULT_STYLE, ...this.style };

    try {
      this.initVoiceRecognition();
    } catch (e) {
      console.error('Failed to initialize or parse');
      this.stopRecognition();
    }

    this.vuiService.response.subscribe(this.vuiResponseSubscription.bind(this));
  }

  vuiResponseSubscription(data) {
    
    this.transcript = '';

    let currentRef = this.vuiService.currentRef;
    if (data.type == 'COMMAND_NEXT') {
      currentRef = ++this.vuiService.currentRef;
    } else if (data.type == 'COMMAND_PREVIOUS') {
      currentRef = --this.vuiService.currentRef;
    } else if (data.type == 'COMMAND_FIRST') {
      currentRef = 0;
    } else if (data.type == 'COMMAND_LAST') {
      currentRef = this.vuiService.inputRefs.length - 1;
    } else if (data.type == 'COMMAND_CLEAR') {
      this.vuiService.inputRefs[currentRef].nativeElement.value = '';
    } else if (data.type == 'COMMAND_CLICK') {
      this.vuiService.inputRefs[currentRef].nativeElement.click();
    } else if (data.type == 'COMMAND_STOP') {
      this.stopRecognition();
    } else {
      const currentInputObj = this.vuiService.inputRefs[currentRef];
      const currentEl = currentInputObj.nativeElement;
      const opts = currentInputObj['options'];

      if (data.value && data.value[0] instanceof Date) {
        if (currentEl.type == 'date' || currentEl.type == 'datetime') {
          currentEl.value = this.formatDate(data.value[0], 'YYYY-MM-DD');
        } else {
          currentEl.value = this.formatDate(data.value[0], opts && opts.format);
        }
      } else {
        currentEl.value = data.value;
      }
      
      currentEl.dispatchEvent(new Event('input'));
      this.onValueChange.emit(data);
    }

    this.vuiService.inputRefs[currentRef].nativeElement.focus();

    this.setProcess('listening');
  }

  setProcess(processType) {
    this.process = processType;
    this.ref.detectChanges();
  }

  formatDate(date: Date, format?: string) {
    return moment(date).format(format || 'DD/MM/YYYY');
  }

  initVoiceRecognition() {

      this.recognition = new window['webkitSpeechRecognition']();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognition.onstart = (event) => {
        this.setProcess('listening');
      }
      this.recognition.onresult = (event) => {

      const currentInputObj = this.vuiService.inputRefs[this.vuiService.currentRef];
      const opts = currentInputObj['options'];

        this.setProcess('parsing');

        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            this.transcript += event.results[i][0].transcript;
            let data: any = this.vuiService.interpretSpeech(this.transcript, opts && opts.type);
            let resp = new VuiResponse('invalid', data);
            if (data) {
              resp = new VuiResponse('date-range', data);
              if (typeof data == 'string') {
                resp = new VuiResponse(data, data.includes('_') ? '' : data);
              }
            }
           
            this.vuiService.response.next(resp);
          }
        }
      }
      this.recognition.onerror = () => { 
        this.setProcess(null);
      }
      this.recognition.onend = () => {
        this.setProcess(null);
      }
  }

  startRecognition() {
    this.transcript = '';
    this.recognition.start();
  }

  stopRecognition() {
    this.transcript = '';
    this.recognition.stop();
    this.setProcess(null);
  }
}


Date.prototype['isValid'] = function () { 
               
  // If the date object is invalid it 
  // will return 'NaN' on getTime()   
  // and NaN is never equal to itself.   
  return this.getTime() === this.getTime(); 
}; 