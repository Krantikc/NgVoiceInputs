# AngularStarterProject

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Deployment
Use any webserver to deploy build artificacts.  
* Apache Server  
* Apache Tomcat Server  
* nginx  
* http-server (node module)  

### Installation of http-server module
Run `npm install -g http-server`.  
Copy the build artifacts generated during build process to any path you wish.  
Goto the path in command prompt and run `http-server -p80`. Or any other port you wish - `http-server -pPORT_NUMBER`  
  
### Installation & deployment in apache tomcat9 server
* [Download Tomcat 9](https://downloads.apache.org/tomcat/tomcat-9/v9.0.34/bin/apache-tomcat-9.0.34.zip) and extract.  
* Copy & replace contents of build artifacts i.e. `dist/` folder contents to `apache-tomcat-9.0.34/webapps/ROOT`  
* Edit & Modify tomcat server config file i.e `apache-tomcat-9.0.34/conf/server.xml` to change server port number as below  
```<Connector port="80" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" />
```     
* Goto `apache-tomcat-9.0.34/bin` folder and execute - `startup.bat` file  

#### For Windows 10 users -  
If it fails to start server as port 80 is already in use, follow below steps  
1) OPEN YOUR WINDOW COMMAND WITH ADMINISTRATOR PREVILEGE THEN:  
2) Run `net stop http /y`  
3) Run `sc config http start= disabled` to disable http server start on startup  

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
