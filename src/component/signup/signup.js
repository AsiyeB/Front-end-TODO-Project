import './../../assets/scss/style.scss';
import { bindable } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import AuthService from '../../AuthService';
import { validationMessages } from 'aurelia-validation';
import { BootstrapFormRenderer } from './../../bootstrap-form-renderer';
import {
  HttpClient
} from 'aurelia-http-client';
import {
  ValidationControllerFactory,
  ValidationRules
} from 'aurelia-validation';
import { Router } from 'aurelia-router';
// import { threadId } from 'worker_threads';
@inject(ValidationControllerFactory, HttpClient, Router)
export class Signup {
  @bindable flag;
  userName = '';
  firstname = '';
  lastname = '';
  password = '';
  confirmPass = '';
  url = '';
  errorequal = false;
  error = false;
  constructor(controllerFactory, httpClient, router) {
    validationMessages.customMessage1 = '\${$displayName} should be more than 3 characteres';
    this.controller = controllerFactory.createForCurrentScope();
    this.controller.addRenderer(new BootstrapFormRenderer());
    this.httpClient = httpClient;
    this.router = router;
  }
  submit2() {
    if (/^\s*$/.test(this.userName) || /^\s*$/.test(this.passWord) || /^\s*$/.test(this.firstname) || /^\s*$/.test(this.lastname) || /^\s*$/.test(this.url)) {
      this.controller.validate();
    } else {
      if (this.passWord === this.confirmPass) {
        this.error = false;
        console.log('mmmmm');

        this.errorequal = false;
        console.log(this.errorequal);
        this.router.navigate('#/dashboard');
      } else {
        this.controller.validate();
        this.errorequal = true;
        console.log(this.errorequal);
      }
    }
  }
  signup() {
    AuthService.signup(this.firstname, this.lastname, this.url, this.userName, this.password);
  }
}
ValidationRules
  .ensure(b => b.userName).required()
  .ensure(a => a.password).required()
  .ensure(a => a.firstname).required()
  .ensure(a => a.lastname).required()
  .ensure(h => h.url).required()
  .on(Signup);
