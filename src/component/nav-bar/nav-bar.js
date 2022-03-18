import { bindable } from 'aurelia-framework';
import './../../assets/scss/style.scss';
import AuthService from '../../AuthService';
import { inject } from 'aurelia-framework';
@inject(AuthService)
export class NavBar {
  constructor(authService) {
    this.authService = authService;
  }
  @bindable router;
  myFunction(hrefFromView) {
    console.log('Navigating to: ', hrefFromView);
    window.location.href = hrefFromView;
  }
  logout() {
    this.authService.logout();
  }
}
