import { Aurelia, inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import config from 'config';

@inject(Aurelia, HttpClient)
export default class AuthService {
  userToken = null
  loginSuccess = false;
  repos
  constructor(aurelia, httpClient) {
    httpClient.configure(http => {
      http.withBaseUrl(config.baseUrl);
    });

    this.http = httpClient;
    this.app = aurelia;

    this.userToken = localStorage[config.tokenName];
    //   this.userToken = null;
  }
  requst(message) {
    console.log("request----");
    let token = localStorage.getItem('token') || null;
    message.headers.add('Authorization', `Bearer ${token}`);
    return message;
  }

  requstError(error) {
    throw error;
  }

  response(message) {
    return message;
  }

  responseError(error) {
    throw error;
  }
  async login(username, password) {
    let json = {
      'username': username,
      'password': password
    };
    await (this.http.post('login', JSON.stringify(json)))
      .then((data) => {
        this.loginSuccess = data.isSuccess;
        if (data.isSuccess) {
          console.log(data);
          this.userToken = JSON.parse(data.response).token;
          localStorage.setItem('token', this.userToken);
          this.isAuthenticated();
          toastr.success('Welcome!');
          setTimeout(() => {
            this.app.setRoot('app');
          }, 3000);
          // return data.isSuccess;
        } else {
          console.log('error in then ' + data.isSuccess);
        }
      });
    return this.loginSuccess;
  }
  signup(firstname, lastname, image, username, password) {
    console.log('signup start');
    let json = {
      'firstname': firstname,
      'lastname': lastname,
      'image': image,
      'username': username,
      'password': password
    };
    this.http.post('signup', JSON.stringify(json)
    )
      .then(data => {
        console.log(data);
      });
  }
  logout() {
    // Clear from localStorage
    localStorage[config.tokenName] = null;

    // .. and from the userToken object
    this.userToken = null;

    // .. and set root to login.

    this.app.setRoot('component/login/login');
  }

  isAuthenticated() {
    console.log(this.userToken + 'userToken');
    return this.userToken !== null;
  }

  can(permission) {
    return true; // why not?
  }
}
