import { ElementRef, Injectable } from '@angular/core';
import * as moment_ from 'moment/moment';
const moment = moment_;
import { Subject } from 'rxjs';
import VuiResponse from './vui-response';

const UNIT = {
  zero: 0,
  first: 1,
  one: 1,
  second: 2,
  two: 2,
  third: 3,
  thirteenth: 13,
  thirteen: 13,
  three: 3,
  fourth: 4,
  fourteenth: 14,
  fourteen: 14,
  four: 4,
  fifteenth: 15,
  fifteen: 15,
  fifth: 5,
  five: 5,
  sixth: 6,
  sixteenth: 16,
  sixteen: 16,
  six: 6,
  seventeenth: 17,
  seventeen: 17,
  seventh: 7,
  seven: 7,
  eighteenth: 18,
  eighteen: 18,
  eighth: 8,
  eight: 8,
  nineteenth: 19,
  nineteen: 19,
  ninth: 9,
  nine: 9,
  tenth: 10,
  ten: 10,
  eleventh: 11,
  eleven: 11,
  twelfth: 12,
  twelve: 12,
  a: 1,
};

const TWOS = {
  ten: 10,
  eleven: 11, 
  twelve: 12, 
  thirteen: 13, 
  fourteen: 14, 
  fifteen: 15, 
  sixteen: 16, 
  seventeen: 17,
  eighteen: 18,
  nineteen: 19
}

const TEN = {
  twenty: 20,
  twentieth: 20,
  thirty: 30,
  thirtieth: 30,
  forty: 40,
  fortieth: 40,
  fifty: 50,
  fiftieth: 50,
  sixty: 60,
  sixtieth: 60,
  seventy: 70,
  seventieth: 70,
  eighty: 80,
  eightieth: 80,
  ninety: 90,
  ninetieth: 90,
};

const MAGNITUDE = {
  hundred: 100,
  hundredth: 100,
  thousand: 1000,
  million: 1000000,
  billion: 1000000000,
  trillion: 1000000000000,
  quadrillion: 1000000000000000,
  quintillion: 1000000000000000000,
  sextillion: 1000000000000000000000,
  septillion: 1000000000000000000000000,
  octillion: 1000000000000000000000000000,
  nonillion: 1000000000000000000000000000000,
  decillion: 1000000000000000000000000000000000,
};

const NUMBER = { ...UNIT, ...TEN, ...MAGNITUDE };
const SUFFIXES = ['st', 'nd', 'rd', 'th'];

const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

const KEY_WORDS_FWD_NAV = ['forward', 'next'];
const KEY_WORDS_BCK_NAV = ['back', 'backward', 'previous'];
const KEY_WORDS_CLEAR = ['clear', 'clean', 'delete', 'remove'];
const KEY_WORDS_CLICK = ['click', 'submit', 'expand', 'open', 'show'];
const KEY_WORDS_STOP = ['stop', 'end', 'done'];

const KEY_WORDS_INST = ['goto', 'switch', 'go', ...KEY_WORDS_CLEAR, ...KEY_WORDS_CLICK]; // Instruction types
const KEY_WORDS_NAV = [
                        ...KEY_WORDS_FWD_NAV, 
                        ...KEY_WORDS_BCK_NAV,
                        ...KEY_WORDS_STOP,
                        , 'first', 'last',
                      ]; // Navigation types

const KEY_WORDS = [...KEY_WORDS_INST, ...KEY_WORDS_NAV];

const INST_MAPPINGS = {
  next: KEY_WORDS_FWD_NAV,
  previous: KEY_WORDS_BCK_NAV,
  first: ['first'],
  last: ['last'],
  clear: KEY_WORDS_CLEAR,
  click: KEY_WORDS_CLICK,
  stop: KEY_WORDS_STOP 
}
@Injectable({
  providedIn: 'root'
})
export class VuiVoiceRecognitionService {
  response: Subject<VuiResponse> = new Subject<VuiResponse>();

  inputRefs: Array<ElementRef> = [];
  currentRef: number = 0;

  isInputSwitch(speechKeys: any[], inputType: string) {
    if (inputType == 'address' && !speechKeys.some(key => KEY_WORDS_INST.includes(key))) {
      return false;
    }
    if (speechKeys.some(key => KEY_WORDS.includes(key))) {
      return true;
    }
    return false;
  }

  findInstructionType(speechText: string, inputType: string) {
    let type = '';
    speechText = speechText.trim().toLocaleLowerCase();
    let speechKeys = speechText.trim().toLocaleLowerCase().split(' ');
    if (this.isInputSwitch(speechKeys, inputType)) {
      const foundKey = Object.keys(INST_MAPPINGS).find((instType: string) => speechKeys.some(key => INST_MAPPINGS[instType].includes(key)));
      type = foundKey ? `COMMAND_${foundKey.toUpperCase()}` : '';
    } else {
      type = 'INPUT';
    }
    return type;
  }

  interpretSpeech(speechText: string, inputType: string) {
    let instType = this.findInstructionType(speechText, inputType);
    if (instType != 'INPUT') {
      return instType;
    }

    if (inputType == 'text' || inputType == 'address') {
      return speechText;
    }

    if (inputType == 'number') {
      return this.wordsToNumber(speechText);
    }

    if (inputType == 'date') {
      speechText = speechText.replace('from', '');
      let dates =  speechText.trim().split('to ');
      let parsedDates: Array<any> = [];
      dates.forEach((dateStr: string) => {
        parsedDates.push(this.dateParser(dateStr));
      });
  
      if (parsedDates[0].isValid()) {
        return parsedDates;
      }
    }
    return null;
  }

  dateParser(dateStr: string): Date {
    let parsedDate: Date;
    let cleanDateStr = dateStr;
    let dateParts = dateStr.trim().split(' ');
    let datePartObj: any = {};
    let isPureNumber = false;
    let cleanDateParts = [];

    if (dateParts.length == 3) {
      cleanDateParts = dateParts.map((dateStr) => this.eliminateString(dateStr));
      isPureNumber = cleanDateParts.every((dateStr) => Number.isInteger(dateStr));
    }

    if (isPureNumber) {
      cleanDateStr = cleanDateParts.join('-');
    } else {
      const currentDate = moment();
      dateParts.forEach((dateStr) => {
        datePartObj = this.parseDatePart(dateStr, datePartObj);
      });

      const availableKeys = Object.keys(datePartObj).join('-');
     
      switch (availableKeys) {
        case 'date': 
          datePartObj.month = currentDate.format('MM');
        case 'date-month':
          datePartObj.year = currentDate.format('YYYY');
          break;
        case 'year':
          datePartObj.month = '01';
        case 'month-year':
          datePartObj.date = '01';
          break;
        case 'month':
          datePartObj.year = currentDate.format('YYYY');
          datePartObj.date = '01';
      }
      cleanDateStr = this.dateBuilder(datePartObj);
    }
    parsedDate = moment(cleanDateStr).toDate();
    return parsedDate;
  }

  dateBuilder(datePartObj: any): string {
    let dateStr = '';
    dateStr = `${datePartObj.year}-${datePartObj.month}-${datePartObj.date}`;
    return dateStr;
  }

  /**
   * 
   * @param datePart Incomplete date part eg, '21st' is the date part for the date '21st July 2020'
   * @param datePartObj // Inherited from caller & updated with parsed object. Can be year, month or date
   */
  parseDatePart(datePart: string, datePartObj: any): any {
    if (this.isYearType(datePart)) {
      const year = this.wordsToNumber(datePart);
      datePartObj.year = year;
    } else if (this.isDateType(datePart)) {
      const date = this.wordsToNumber(datePart);
      datePartObj.date = date;
    } else if (this.isMonthType(datePart)) {
      const month = MONTHS.indexOf(datePart.toUpperCase()) + 1;
      datePartObj.month = month < 10 ? '0' + month : month;
    }
    return datePartObj;
  }

  isDateType(datePart: string): boolean {
    let isDatePart = false;
    isDatePart = (/\d/.test(datePart) && SUFFIXES.includes(datePart.substr( datePart.length - 2)));

    if (!isDatePart) {
      const number = this.wordsToNumber(datePart);
      if (number > 0 && number <= 31) {
        isDatePart = true;
      }
    }
    return isDatePart;
  }

  parseDateVal(datePart, datePartObj) {
    let isDatePart = false;
    let convertedNum = 0;
    isDatePart = SUFFIXES.some((key) => {
      return datePart.includes(key);
    });

    if (!isDatePart) {
      convertedNum = this.wordsToNumber(datePart);
      if (convertedNum > 0 && convertedNum <= 31) {
        isDatePart = true;
      }
    }

    if (isDatePart) {
      datePartObj.date = convertedNum;
    }
  }

  isMonthType(datePart) {
    const month = MONTHS.indexOf(datePart.toUpperCase());
    return month > -1;
  }

  parseMonthVal(datePart, datePartObj) {
    const month = MONTHS.indexOf(datePart.toUpperCase());
    if (month > -1) {
      datePartObj.month = month < 10 ? '0' + month : month;
    }
  }

  isYearType(datePart) {
    let year = this.wordsToNumber(datePart);
    return year > 1000;
  }

  parseYearVal(datePart, datePartObj) {
    const year = this.wordsToNumber(datePart);
    if (year > 1000) {
      datePartObj.year = year;
    }
  }

  wordsToNumber(word) {
    
    // Returning integer if it is not actual word
    if (!Number.isNaN(parseInt(word))) {
      return parseInt(word);
    }

    word = word.replace(/and/g, ''); // Replace joiners
    let words = word.toLowerCase().trim().split(' ');
    let num = 0;
    let numStr = '';
    let tens = 0;
    
    words = this.parseColloquialWords(words);
     
    words.forEach(wordStr => {
      wordStr = this.eliminateString(wordStr);
      if (typeof wordStr == 'number') {
        num = wordStr;
      } else {
        if (UNIT[wordStr]) {
          num = num +  NUMBER[wordStr];
        } else if (TEN[wordStr]) {
          num = num + TEN[wordStr];
        } else if (MAGNITUDE[wordStr]) { 
          num = num * MAGNITUDE[wordStr];
        }
      }

    });
    return num;
  }

  parseColloquialWords(wordsArr) {
    if (wordsArr.length == 2) {
      if (TEN[wordsArr[0]] && (TEN[wordsArr[1]] || TWOS[wordsArr[1]])) {
        wordsArr.splice(1, 0, 'hundred');
      }
    }
    if (MAGNITUDE[wordsArr[0]]) {
      wordsArr.splice(0, 0, 'one');
    }
    
    return wordsArr;
  }

  eliminateString(word) {
    if (/\d/.test(word) && SUFFIXES.includes(word.substr( word.length - 2))) {
      word = word.substr(0, word.length - 2); // Remove last suffixes such as 'st', 'th' from 1st, 10th
      word = parseInt(word);
    }
    return word;
  }
}
