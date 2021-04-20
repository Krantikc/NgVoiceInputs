import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import * as moment_ from 'moment/moment';
const moment = moment_;
import { VuiVoiceRecognitionService } from './ng-voice-inputs.service';

const DEFAULT_OPTS = {
  type: 'text',
  format: 'DD/MM/YYYY'
}

/**
 * Options for VuiInput directive
 * @param type Data type for input. Possible values are: 'text', 'address', 'date', 'number'. Default: 'text'
 * @param format (Optional) Date format for datepicker input. eg, 'MM/DD/YYYY'. Default: 'DD/MM/YYYY'.
 */
class Options {
  type: string;
  format?: string;
}

@Directive({
  selector: '[vuiInput]'
})
export class VuiInputDirective implements OnInit {

  /**
   * Options for vui input field
   * type: 'text', 'address', 'date', 'number'
   * format: 'DD/MM/YYYY'
   */
  @Input('vuiInput')
  options: Options; 

  constructor(private vuiService: VuiVoiceRecognitionService, 
              private el: ElementRef) { 
    this.el.nativeElement.setAttribute('vui-ref', this.vuiService.inputRefs.length);
    
    this.vuiService.inputRefs.push(this.el);

    this.el.nativeElement.addEventListener('focus', (evt) => {
      this.vuiService.currentRef = parseInt(evt.target.getAttribute('vui-ref'));
    });
  }

  ngOnInit(): void {
    this.options = { ...DEFAULT_OPTS, ...this.options };
    this.el['options'] = this.options;
  }

  formatDate(date: Date) {
    return moment(date).format(this.options.format);
  }

}
