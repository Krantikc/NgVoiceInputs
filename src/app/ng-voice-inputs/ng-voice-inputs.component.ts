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

const DEFAULT_SCROLL_OFFSET = 200;
const DEFAULT_SCROLL_DURATION = 300;
const DEFAULT_SCROLL_DIRECTION = 'vertical';


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

  @Input()
  scrollOffset;

  @Input()
  scrollDuration;

  @Output()
  onValueChange: EventEmitter<any> = new EventEmitter();

  /**
   * Decides direction of scroll movement ( Up or Down ) or ( Left or Right) 
   * +ve value indicates Down/Right and -ve value idicates Up/Left
   */
  activeDirection: number = +1;

  /**
   * Decides direction of Scroll ( Vertical or Horizontal )
   */
  scrollDirection: string = DEFAULT_SCROLL_DIRECTION;
  
  constructor(private vuiService: VuiVoiceRecognitionService, private ref: ChangeDetectorRef) { }

  ngOnInit() {

    this.style = { ...DEFAULT_STYLE, ...this.style };
    this.scrollOffset = this.scrollOffset || DEFAULT_SCROLL_OFFSET;
    this.scrollDuration = this.scrollDuration || DEFAULT_SCROLL_DURATION;

    try {
      this.initVoiceRecognition();
    } catch (e) {
      console.error('Failed to initialize or parse');
      this.stopRecognition();
    }

    this.vuiService.response.subscribe(this.vuiResponseSubscription.bind(this));
  }

  

  scrollToTop = (duration) => {
    let interval = setInterval(() => {
        var pos = Math.abs(Math.round((window.pageYOffset / (duration / 100))));
        if ( pos > 0 ) {
            window.scrollTo( 0, pos - 20 ); // how far to scroll on each step
        } else {
            clearInterval(interval);
        }
    }, 100);
  } 
  
  scrollBy = (offset, duration, direction?) => {
    this.activeDirection = (offset / offset);
    this.scrollDirection = direction || DEFAULT_SCROLL_DIRECTION;
    if (offset == 1) {
      offset = window.outerHeight;
    }
    let val = Math.abs(Math.round((offset / (duration / 100)))); 
    let totalOffset = 0;

    let interval = setInterval(() => {
      if (totalOffset >= Math.abs(offset)) {
        clearInterval(interval);
      } else {
        let opt = { 
          top: offset < 0 ? -1 * val : val, 
          left: 0 
        };
        if (direction == 'horizontal') {
          opt = { 
            top: 0, 
            left: offset < 0 ? -1 * val : val
          };
        }
        window.scrollBy({
          ...opt, 
          behavior: 'smooth'
        });
        totalOffset = totalOffset + val;
      }
      
    }, 100);
  }

  scroll = {
    SCROLLDOWN: () => {
      this.scrollBy(this.scrollOffset, this.scrollDuration);
    },
    SCROLLUP: () => {
      this.scrollBy(-1 * this.scrollOffset, this.scrollDuration);
    },
    SCROLLRIGHT: () => {
      this.scrollBy(this.scrollOffset, this.scrollDuration, 'horizontal');
    },
    SCROLLLEFT: () => {
      this.scrollBy(-1 * this.scrollOffset, this.scrollDuration, 'horizontal');
    },
    SCROLLBOTTOM: () => {
      this.scrollBy(1, this.scrollDuration);
    },
    SCROLLTOP: () => {
      this.scrollToTop(this.scrollDuration);
    },
    SCROLLCONTINUE: () => {
      const factor = Math.ceil(window.outerHeight / this.scrollDuration);

      console.log(factor * this.scrollDuration, factor)
      this.scrollBy(window.outerHeight, factor * 1000);
    }
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
    } else if (data.type.includes('COMMAND_SCROLL')) {
      this.scroll[data.type.replace('COMMAND_','')].call();
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