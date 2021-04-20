
# NgVoiceInputs

  
This library use speech recognition feature to fill the input fields for Angular application. It supports HTML5 inputs and angular material inputs as well.
It supports date, text, number fields.

 ##  To install:

`npm install --save ng-voice-inputs`

## Requisites
This plugin requires `moment` library to run flawlessly
\
[Moment Js V2.24.0](https://www.npmjs.com/package/moment)
\
`npm install --save moment@2.24.0`
\
NOTE: Please install momentjs v2.24.0 before using the module

## Usage
Import the module `NgVoiceInputsModule` into `AppModule`
  
````
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  ...
  imports: [NgVoiceInputsModule,...]
  ...
})
export  class  AppModule { }
````

Then use the component `<ng-voice-input></ng-voice-input>` to trigger / start voice recognition
\
And also add the directive `vuiInput` to all the input fields for which speech recognition service is required.
#
app.component.html

Example 1: With Angular Material Input Fields
````
<form  class="section left-section"  #form="ngForm"  (ngSubmit)="submitForm(form)">

	<ng-voice-input (onValueChange)="onResponse($event)"  [style]="styleOpts"></ng-voice-input>

	<div  class="row">

		<mat-form-field  class="col-6">
			<mat-label>Choose from date</mat-label>
			<input  matInput  [matDatepicker]="picker"  [vuiInput]="optionsDate"  name="fromDate"  ngModel>
			<mat-datepicker-toggle  matSuffix  [for]="picker"></mat-datepicker-toggle>
			<mat-datepicker  #picker  ></mat-datepicker>
		</mat-form-field>

	</div>

	<div  class="row">

		<mat-form-field  class="col-6">
			<mat-label>First Name</mat-label>
			<input  matInput  type="text"  [vuiInput]="optionsText"  name="firstName"  ngModel>
		</mat-form-field>
		

		<mat-form-field  class="col-6">
			<mat-label>Age</mat-label>
			<input  matInput  type="text"  [vuiInput]="optionsNumber"  name="age"  ngModel>
		</mat-form-field>
		
	</div>

	<input  type="date"  [vuiInput]="optionsDate"  name="dob"  ngModel>
	<button  mat-raised-button  [vuiInput]="">Submit</button>

</form>
````

Example 2: Pure HTML5 Inputs with ngModel
````
<form  class="section left-section"  #form="ngForm"  (ngSubmit)="submitForm(form)">

	<input  matInput  type="text"  [vuiInput]="optionsText"  name="firstName"  ngModel>
	<input  matInput  type="number"  [vuiInput]="optionsNumber"  name="age"  ngModel>
	<input  type="date"  [vuiInput]="optionsDate"  name="dob"  ngModel>
	<button [vuiInput]="">Submit</button>

</form>
````
\
app.component.ts
````
@Component({
	selector:  'app-root',
	templateUrl:  './app.component.html',
	styleUrls: ['./app.component.scss']
})

export  class  AppComponent  implements  OnInit {
	
	optionsText = {
		type:  'text'
	}

	optionsDate = {
		type:  'date'
	}

	optionsNumber = {
		type:  'number'
	}

	optionsAddress = {
		type:  'address'
	}

	optionsSelect = {
		type:  'select'
	}

	styleOpts = {
		iconParse:  'icon icon-mic-green',
		animationParse:  'parse-green'
	}

	constructor() {}

	ngOnInit(): void {}
	
	onResponse(evt) {
		console.log(evt)
	}
	submitForm(form) {
		console.table(form.value);
	}
}
````

## Documentation

### Properties
1) `VuiInputDirective (vuiInput)` directive expects object `InputOption`. 

````
InputOption: {
    type: string,
    format: string
}

InputOption.type: Possible values are: 'text', 'address', 'date', 'number'. Default: 'text'
InputOption.format: MomentJs date format. Default: 'DD/MM/YYYY'
  ````

2) `NgVoiceInputsComponent (<ng-voice-input></ng-voice-input>)` component expects `StyleOptions`. Optional
````
StyleOptions: {
	containerClass:  string,
	iconStart: string,
	iconParse:  string,
}

StyleOptions.containerClass: Class name for the component. Default: 'centered'
StyleOptions.iconStart: Class name for mic icon when it is idle or before start of voice recognition. Default: 'icon icon-mic'
StyleOptions.iconParse: Class name for mic icon when it is listening to speech and parsing. Default: 'icon icon-mic'

````

## Demo Example
[Angular Speech Recognition Forms](https://krantikc.github.io/angular-vui-form/)
