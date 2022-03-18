import './../../assets/scss/style.scss';
import { Board } from './../../model/board';
import {
  HttpClient
} from 'aurelia-http-client';
import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@inject(HttpClient, Router)
export class Dashboard {
  boardList = [];
  constructor(httpClient, router) {
    this.httpClient = httpClient
      .configure(x => {
        x.withHeader('Authorization', `Bearer ${window.localStorage.getItem('token')}`);
      });
    this.router = router;
  }
  changeView(boardid) {
    this.router.navigate(`/todos?boardId=${boardid}`);
  }
  attached() {
    this.getBoards();
  }
  getBoards() {
    console.log('get boards in dashboard');
    this.httpClient.get('boards')
      .then(data => {
        for (let i = 0; i < JSON.parse(data.response).length; i++) {
          this.temp = new Board(JSON.parse(data.response)[i].nameboard, JSON.parse(data.response)[i].username);
          this.temp.boardid = JSON.parse(data.response)[i].boardid;
          this.boardList.push(this.temp);
        }
      });
  }
}
