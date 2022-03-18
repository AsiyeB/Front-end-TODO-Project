import { PLATFORM } from 'aurelia-pal';
import AuthService from './AuthService';
import { Aurelia, inject } from 'aurelia-framework';
import {
  HttpClient
} from 'aurelia-http-client';
// import config from 'config';

@inject(HttpClient, AuthService, Aurelia)
export class App {
  authService;
  constructor(httpClient, authService, aurelia) {
    this.authService = authService;
    this.app = aurelia;
    console.log(this.authService);
    console.log(authService);
    httpClient.configure(x => {
      x.withInterceptor({
        request(message) {
          console.log('this.auth0000000000000000000000Service');
          return authService.requst(message);
        },
        requestError(error) {
          return authService.requstError(error);
        },
        response(message) {
          //return this.authService.response(message);
          return (message);
        },
        responseError(error) {
          if (error.statusCode === 400) {
            toastr.error('error');
          }
          if (error.statusCode === 401) {
            authService.logout();
            // console.log('this.app ', this.app);
            // localStorage[config.tokenName] = null;
            // // this.app.setRoot('component/login/login');
            // // PLATFORM.moduleName('component/login/login');
          }
          if (error.statusCode === 404) {
            toastr.error('not found');
          }
          console.log(error);
          // return this.authService.responseError(error);
          return (error);
        }
      });
    });
    this.httpClient = httpClient;
  }

  attached() {
    console.log('test');
    console.log(this.authService);
    this.httpClient.configure(x => {
      x.withBaseUrl('http://localhost:5000/api/');
      //   //x.withBaseUrl('http://maz.todo.partdp.ir/api/');
      //     .withInterceptor({
      //       request(message) {
      //         console.log('this.auth0000000000000000000000Service');
      //         // return this.authService.requst(message);
      //         return message;
      //       },
      //       requestError(error) {
      //         // return this.authService.requstError(error);
      //       },
      //       response(message) {
      //       //return this.authService.response(message);
      //         return (message);
      //       },
      //       responseError(error) {
      //         if (error.statusCode === 400) {
      //           toastr.error('error');
      //         }
      //         if (error.statusCode === 401) {
      //           console.log(authService);
      //           this.authService.logout();
      //         // console.log('this.app ', this.app);
      //         // localStorage[config.tokenName] = null;
      //         // // this.app.setRoot('component/login/login');
      //         // // PLATFORM.moduleName('component/login/login');
      //         }
      //         if (error.statusCode === 404) {
      //           toastr.error('not found');
      //         }
      //         console.log(error);
      //         // return this.authService.responseError(error);
      //         return (error);
      //       }
      // });
    });
  }
  // logout() {
  //   // Clear from localStorage
  //   localStorage[config.tokenName] = null;
  //   setRoot('component/login/login');
  // }

  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.map([
      {
        route: ['', 'dashboard'],
        name: 'dashboard',
        moduleId: PLATFORM.moduleName('./component/dashboard/dashboard'),
        nav: true,
        title: 'Dashboard'
      },
      {
        route: 'board',
        name: 'board',
        moduleId: PLATFORM.moduleName('./component/board/total-board'),
        nav: true,
        title: 'Board'
      },
      {
        route: 'todos',
        name: 'todos',
        moduleId: PLATFORM.moduleName('./component/todos/todos'),
        nav: true,
        title: 'Todos'
      },
      {
        route: 'not-found',
        name: 'not-found',
        moduleId: PLATFORM.moduleName('./component/not-found/not-found'),
        nav: false,
        title: 'Not-found'
      }
    ]);
    config.mapUnknownRoutes('not-found');
    config.fallbackRoute('todos');
    this.router = router;
  }
}

