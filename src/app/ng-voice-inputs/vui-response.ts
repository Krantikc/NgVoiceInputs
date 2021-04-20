/**
 * @param type Type of response
 * Possible values for type are:
 * 'date-range', 'date', 'text', 'number'
 * @param value Response value which can be text, number, date
 * 
 */
export default class VuiResponse {
    type: string; 
    value: any;

    constructor(type?: string, value?: any) {
        this.type = type || 'text';
        this.value = value;
    }
}