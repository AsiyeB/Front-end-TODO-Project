import './../../assets/scss/style.scss';
import AuthService from '../../AuthService';
import {
  HttpClient
} from 'aurelia-http-client';
import { inject } from 'aurelia-framework';
import { validationMessages } from 'aurelia-validation';
import { BootstrapFormRenderer } from './../../bootstrap-form-renderer';
import {
  ValidationControllerFactory,
  ValidationRules
} from 'aurelia-validation';
import { Router } from 'aurelia-router';
@inject(ValidationControllerFactory, HttpClient, Router, AuthService)
export class Login {
  user = '';
  firstname = '';
  errorNotFound = true;
  successlogin = false;
  lastname = '';
  pass = '';
  confirmPass = '';
  url = '';
  errorequal = false;
  error2 = false;
  // @bindable flag;
  flag = false;
  userName = '';
  passWord = '';
  error = false;
  constructor(controllerFactory, httpClient, router, authService) {
    // toastr.success('Are you the 6 fingered man?');
    validationMessages.customMessage1 = '\${$displayName} should be more than 3 characteres';
    this.controller = controllerFactory.createForCurrentScope();
    this.httpClient = httpClient;
    this.controller.addRenderer(new BootstrapFormRenderer());
    this.router = router;
    this.authService = authService;
  }
  attached() {
    this.errorNotFound = true;
  }
  submit() {
    if (this.userName === '' || this.passWord === '') {
      this.controller.validate();
      this.error = true;
    } else if (/^\s*$/.test(this.userName) || /^\s*$/.test(this.passWord)) {
      this.error = true;
      this.controller.validate();
    } else {
      this.error = false;
      this.login();
    }
  }
  async login() {
    this.errorNotFound = await (this.authService.login(this.userName, this.passWord));
    console.log('error not found ' + this.errorNotFound);
  }
  signUp() {
    console.log('signUppppppppppp');
    // this.router.navigate('#/todos');
    this.flag = 1;
  }
  submit2() {
    if (/^\s*$/.test(this.user) || /^\s*$/.test(this.pass) || /^\s*$/.test(this.firstname) || /^\s*$/.test(this.lastname) || /^\s*$/.test(this.url)) {
      this.controller.validate();
    } else {
      if (this.pass === this.confirmPass) {
        this.error2 = false;
        this.errorequal = false;
        if (this.signup()) {
          this.userName = this.user;
          this.passWord = this.pass;
          toastr.success('Successful Signup! Please Login');
          setTimeout(() => { this.flag = 0; }, 3000);
        }
      } else {
        this.controller.validate();
        this.errorequal = true;
      }
    }
  }
  signup() {
    this.flags = [];
    this.flags[2] = /^([a-z0-9]{5,12})$/.test(this.user);
    this.flags[0] = /^([A-Za-z]{3,})$/.test(this.firstname);
    this.flags[1] = /^([A-Za-z]{3,})$/.test(this.lastname);
    this.flags[3] = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(this.pass);
    if (!this.flags[0]) {
      let popup = document.getElementById('myPopup1');
      popup.classList.add('show');
    }
    if (!this.flags[1]) {
      let popup = document.getElementById('myPopup2');
      popup.classList.add('show');
    }
    if (!this.flags[2]) {
      let popup = document.getElementById('myPopup3');
      popup.classList.add('show');
    }
    if (!this.flags[3]) {
      let popup = document.getElementById('myPopup4');
      popup.classList.add('show');
    }
    if (this.flags[0] && this.flags[1] && this.flags[2] && this.flags[3]) {
      document.getElementById('myPopup4').classList.remove('show');
      document.getElementById('myPopup3').classList.remove('show');
      document.getElementById('myPopup2').classList.remove('show');
      document.getElementById('myPopup1').classList.remove('show');
      this.authService.signup(this.firstname, this.lastname, this.url, this.user, this.pass);
      return true;
    }
    return false;
  }
}
ValidationRules
  .ensure(b => b.user).required().withMessage('')
  .ensure(a => a.pass).required().withMessage('')
  .ensure(a => a.firstname).required().withMessage('')
  .ensure(a => a.lastname).required().withMessage('')
  .ensure(h => h.url).required().withMessage('')

  .ensure(b => b.userName).required()
  .ensure(a => a.passWord).required()
  .on(Login);
